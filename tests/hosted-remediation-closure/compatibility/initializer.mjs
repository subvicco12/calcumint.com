import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import {initializeHostedInvitations} from '../../hosted-schema-remediation/invitations/initializer.mjs';
export async function initializeCompatibility(sql){
 const raw=await readFile(new URL('scoped-descriptor.json',import.meta.url),'utf8'),scoped=JSON.parse(raw);
 const manifest=JSON.parse(await readFile(new URL('fixture-manifest.json',import.meta.url),'utf8'));
 assert.equal(createHash('sha256').update(raw).digest('hex'),manifest.scopedDescriptorSha256,'Compatibility scoped hash mismatch');
 if(process.env.HOSTED_DESCRIPTOR){
  const fullRaw=await readFile(process.env.HOSTED_DESCRIPTOR,'utf8'),full=JSON.parse(fullRaw);
  assert.equal(createHash('sha256').update(fullRaw).digest('hex'),manifest.sourceDescriptorSha256,'Compatibility source hash mismatch');
  for(const [name,section] of Object.entries(scoped.sections)){
   const ids=new Set(section.rows.map(r=>r.id));
   assert.deepEqual(full.sections[name].rows.filter(r=>ids.has(r.id)),section.rows,'Compatibility source rows mismatch: '+name);
  }
 }
 const provenance=await initializeHostedInvitations(sql);
 const s=scoped.sections;
 const ident=n=>'"'+n.replaceAll('"','""')+'"';
 for(const table of ['public.subscriptions','public.billing_customers']){
  for(const section of ['columns','constraints','relations','policies','effectiveTableGrants','effectiveColumnGrants'])assert.equal(s[section].status,'COMPLETE');
  const cols=s.columns.rows.filter(r=>r.relation===table).sort((a,b)=>a.position-b.position);assert(cols.length);
  await sql(`CREATE TABLE ${table} (${cols.map(c=>`${ident(c.name)} ${c.type}${c.default?' DEFAULT '+c.default:''}${c.notNull?' NOT NULL':''}`).join(',')});`);
  for(const c of s.constraints.rows.filter(r=>r.relation===table))await sql(`ALTER TABLE ${table} ADD CONSTRAINT ${ident(c.name)} ${c.definition};`);
  if(s.relations.rows.find(r=>r.id===table).rls)await sql(`ALTER TABLE ${table} ENABLE ROW LEVEL SECURITY;`);
  for(const p of s.policies.rows.filter(r=>r.relation===table))await sql(`CREATE POLICY ${ident(p.name)} ON ${table} AS ${p.permissive?'PERMISSIVE':'RESTRICTIVE'} FOR ${{r:'SELECT',a:'INSERT',w:'UPDATE',d:'DELETE','*':'ALL'}[p.command]} TO ${p.roles.map(ident).join(',')}${p.using?' USING ('+p.using+')':''}${p.check?' WITH CHECK ('+p.check+')':''};`);
 }
 // Reproduce effective captured grants; this is scoped behavior, not the hosted ACL ancestry.
 const acl=[];
 for(const table of ['public.profiles','public.user_preferences','public.subscriptions','public.billing_customers']){
  for(const g of s.effectiveTableGrants.rows.filter(g=>g.relation===table&&g.allowed))acl.push(`GRANT ${g.privilege} ON ${table} TO ${ident(g.role)};`);
  for(const g of s.effectiveColumnGrants.rows.filter(g=>g.column?.startsWith(table+'.')&&g.allowed))acl.push(`GRANT ${g.privilege} (${ident(g.column.slice(table.length+1))}) ON ${table} TO ${ident(g.role)};`);
 }
 await sql(acl.join('\n'));
 return {...provenance,compatibilityDescriptorSha256:manifest.scopedDescriptorSha256,compatibilitySourceDescriptorSha256:manifest.sourceDescriptorSha256,compatibilityPrivateSourceVerified:Boolean(process.env.HOSTED_DESCRIPTOR),compatibilityScope:'Captured four account tables and effective table/column grants; local provider auth; no hosted ACL ancestry equivalence'};
}
