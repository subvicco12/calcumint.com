import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
export async function initializeHostedInvitations(sql) {
 const raw=await readFile(new URL('scoped-descriptor.json',import.meta.url),'utf8'),capture=JSON.parse(raw),s=capture.sections;
 const manifest=JSON.parse(await readFile(new URL('fixture-manifest.json',import.meta.url),'utf8'));
 assert.equal(createHash('sha256').update(raw).digest('hex'),manifest.scopedDescriptorSha256,'Scoped fixture hash mismatch');
 if(process.env.HOSTED_DESCRIPTOR){
  const privateRaw=await readFile(process.env.HOSTED_DESCRIPTOR,'utf8'),full=JSON.parse(privateRaw).sections;
  assert.equal(createHash('sha256').update(privateRaw).digest('hex'),manifest.sourceDescriptorSha256,'Private source hash mismatch');
  for(const [section,value] of Object.entries(s)){
   const ids=new Set(value.rows.map(r=>r.id));
   assert.deepEqual(full[section].rows.filter(r=>ids.has(r.id)),value.rows,'Captured scoped selection mismatch: '+section);
  }
 }

 const tables=['profiles','user_preferences','organizations','organization_members','organization_invitations','organization_audit_log'].map(n=>'public.'+n);
 const functions=['handle_new_user','org_role','has_org_role','is_org_member','create_business_organization','accept_business_invitation'];
 const ident=n=>'"'+n.replaceAll('"','""')+'"';
 await sql('GRANT USAGE ON SCHEMA public,auth TO anon,authenticated,service_role;');
 for(const table of tables){const cols=s.columns.rows.filter(r=>r.relation===table).sort((a,b)=>a.position-b.position);assert(cols.length);await sql(`CREATE TABLE ${table} (${cols.map(c=>`${ident(c.name)} ${c.type}${c.identity?' GENERATED '+(c.identity==='a'?'ALWAYS':'BY DEFAULT')+' AS IDENTITY':c.default?' DEFAULT '+c.default:''}${c.notNull?' NOT NULL':''}`).join(',')});`);}
 for(const table of tables)for(const r of s.constraints.rows.filter(r=>r.relation===table))await sql(`ALTER TABLE ${table} ADD CONSTRAINT ${ident(r.name)} ${r.definition};`);
 for(const idx of s.indexes.rows){if(!s.constraints.rows.some(c=>c.relation===idx.relation&&c.name===idx.id.split(':')[1]))await sql(idx.definition);}
 for(const f of s.functions.rows.filter(f=>functions.some(n=>f.id.startsWith('public.'+n+'('))).sort((a,b)=>functions.indexOf(a.id.split('.')[1].split('(')[0])-functions.indexOf(b.id.split('.')[1].split('(')[0]))){await sql(f.definition);await sql(`REVOKE ALL ON FUNCTION ${f.id} FROM PUBLIC,anon,authenticated,service_role;`);for(const g of s.effectiveFunctionGrants.rows.filter(g=>g.signature===f.id&&g.allowed))await sql(`GRANT EXECUTE ON FUNCTION ${f.id} TO ${ident(g.role)};`);}
 for(const table of tables){const rel=s.relations.rows.find(r=>r.id===table);if(rel.rls)await sql(`ALTER TABLE ${table} ENABLE ROW LEVEL SECURITY;`);for(const p of s.policies.rows.filter(r=>r.relation===table)){const cmd={r:'SELECT',a:'INSERT',w:'UPDATE',d:'DELETE','*':'ALL'}[p.command];await sql(`CREATE POLICY ${ident(p.name)} ON ${table} AS ${p.permissive?'PERMISSIVE':'RESTRICTIVE'} FOR ${cmd} TO ${p.roles.map(ident).join(',')}${p.using?' USING ('+p.using+')':''}${p.check?' WITH CHECK ('+p.check+')':''};`);}for(const g of s.effectiveTableGrants.rows.filter(g=>g.relation===table&&g.allowed))await sql(`GRANT ${g.privilege} ON ${table} TO ${ident(g.role)};`);}
 for(const t of s.triggers.rows.filter(t=>!t.internal&&(tables.includes(t.relation)||t.name==='on_auth_user_created'))){try{await sql(t.definition);}catch(e){throw Error('Scoped trigger dependency unsupported: '+t.id,{cause:e});}}
 return {scope:'Captured invitation-related tables, constraints, RLS, effective table/function grants and captured functions; hosted auth replaced by pinned local GoTrue. Not whole-hosted equivalence.',descriptorSha256:manifest.sourceDescriptorSha256,scopedDescriptorSha256:manifest.scopedDescriptorSha256,privateSourceVerified:Boolean(process.env.HOSTED_DESCRIPTOR)};
}
