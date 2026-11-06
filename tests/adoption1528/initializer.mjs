// Reconstruct metadata in an isolated fixture only. Never connects to the capture source.
import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const ident=s=>'"'+s.replaceAll('"','""')+'"';
const role=s=>s==='PUBLIC'?'PUBLIC':ident(s);
export async function initializeTargetShape(sql){
 const capture=JSON.parse(await readFile(new URL('../../docs/adoption1528/target-metadata.json',import.meta.url),'utf8')),d=capture.data;
 assert.equal(capture.kind,'AUTHENTICATED_READ_ONLY_METADATA_CAPTURE');
 const q=['CREATE ROLE dashboard_user;','GRANT USAGE ON SCHEMA public,auth TO anon,authenticated,service_role;'];
 for(const t of d.relations){const cols=d.columns.filter(c=>c.table===t.id).sort((a,b)=>a.position-b.position);q.push(`CREATE TABLE ${t.id} (${cols.map(c=>`${ident(c.name)} ${c.type}${c.identity?' GENERATED '+(c.identity==='a'?'ALWAYS':'BY DEFAULT')+' AS IDENTITY':c.default?' DEFAULT '+c.default:''}${c.notNull?' NOT NULL':''}`).join(',')});`);}
 for(const c of d.constraints.filter(c=>!c.definition.startsWith('TRIGGER ')).sort((a,b)=>Number(a.definition.startsWith('FOREIGN KEY'))-Number(b.definition.startsWith('FOREIGN KEY'))))q.push(`ALTER TABLE ${c.table} ADD CONSTRAINT ${ident(c.name)} ${c.definition};`);
 for(const i of d.indexes)if(!d.constraints.some(c=>i.id==='public.'+c.name))q.push(i.definition+';');
 for(const f of [...d.provider,...d.functions]){q.push(f.definition+';',`ALTER FUNCTION ${f.id} OWNER TO ${ident(f.owner)};`,`REVOKE ALL ON FUNCTION ${f.id} FROM PUBLIC,anon,authenticated,service_role,dashboard_user,supabase_auth_admin;`);for(const a of f.acl)q.push(`GRANT ${a.privilege} ON FUNCTION ${f.id} TO ${role(a.grantee)}${a.grantable?' WITH GRANT OPTION':''};`);}
 for(const t of d.relations){if(t.rls)q.push(`ALTER TABLE ${t.id} ENABLE ROW LEVEL SECURITY;`);if(t.forceRls)q.push(`ALTER TABLE ${t.id} FORCE ROW LEVEL SECURITY;`);q.push(`REVOKE ALL ON TABLE ${t.id} FROM PUBLIC,anon,authenticated,service_role;`);for(const a of t.acl)q.push(`GRANT ${a.privilege} ON TABLE ${t.id} TO ${role(a.grantee)}${a.grantable?' WITH GRANT OPTION':''};`);}
 for(const p of d.policies)q.push(`CREATE POLICY ${ident(p.policyname)} ON public.${ident(p.tablename)} AS ${p.permissive} FOR ${p.cmd} TO ${p.roles.map(r=>role(r==='public'?'PUBLIC':r)).join(',')}${p.qual?' USING ('+p.qual+')':''}${p.with_check?' WITH CHECK ('+p.with_check+')':''};`);
 for(const t of d.triggers){q.push(t.definition+';');assert.equal(t.enabled,'O');}
 for(const defaults of d.defaultAcls){const scope=defaults.schema?' IN SCHEMA '+ident(defaults.schema):'';if(!defaults.schema)q.push(`ALTER DEFAULT PRIVILEGES FOR ROLE ${ident(defaults.role)} REVOKE ALL ON FUNCTIONS FROM PUBLIC;`);for(const a of defaults.acl)q.push(`ALTER DEFAULT PRIVILEGES FOR ROLE ${ident(defaults.role)}${scope} GRANT ${a.privilege} ON FUNCTIONS TO ${role(a.grantee)}${a.grantable?' WITH GRANT OPTION':''};`);}await sql(q.join('\n'));return{scope:'Isolated reconstruction of seven-table captured metadata; synthetic rows only; authentic provider internals outside uid/role not represented',sourceObservedAt:capture.observedAt,productionWrites:false};
}
