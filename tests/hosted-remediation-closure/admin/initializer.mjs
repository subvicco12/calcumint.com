import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
export async function initializeAdmin(sql) {
 const raw=await readFile(new URL('scoped-descriptor.json',import.meta.url),'utf8'),manifest=JSON.parse(await readFile(new URL('manifest.json',import.meta.url),'utf8'));
 assert.equal(createHash('sha256').update(raw).digest('hex'),manifest.scopedSha256);
 const s=JSON.parse(raw).sections;
 if(process.env.HOSTED_DESCRIPTOR){const source=await readFile(process.env.HOSTED_DESCRIPTOR,'utf8');assert.equal(createHash('sha256').update(source).digest('hex'),manifest.captureSha256);const full=JSON.parse(source).sections;for(const [section,value]of Object.entries(s)){const ids=new Set(value.rows.map(r=>r.id));assert.deepEqual(full[section].rows.filter(r=>ids.has(r.id)),value.rows,'Private source selection mismatch: '+section);}}
 const statements=[],queue=async statement=>{statements.push(statement+';');},ident=x=>'"'+x.replaceAll('"','""')+'"';
 await queue('GRANT USAGE ON SCHEMA public,auth TO anon,authenticated,service_role;');
 for(const t of s.relations.rows){const cols=s.columns.rows.filter(c=>c.relation===t.id).sort((a,b)=>a.position-b.position);await queue(`CREATE TABLE ${t.id} (${cols.map(c=>`${ident(c.name)} ${c.type}${c.identity?' GENERATED '+(c.identity==='a'?'ALWAYS':'BY DEFAULT')+' AS IDENTITY':c.default?' DEFAULT '+c.default:''}${c.notNull?' NOT NULL':''}`).join(',')});`);}
 // Referenced keys must exist before foreign keys, independent of catalog row order.
 // pg_constraint also describes constraint triggers; CREATE CONSTRAINT TRIGGER
 // below reconstructs those entries, rather than invalid ADD CONSTRAINT TRIGGER.
 for(const c of [...s.constraints.rows].filter(c=>!c.definition.startsWith('TRIGGER ')).sort((a,b)=>Number(a.definition.startsWith('FOREIGN KEY'))-Number(b.definition.startsWith('FOREIGN KEY'))))await queue(`ALTER TABLE ${c.relation} ADD CONSTRAINT ${ident(c.name)} ${c.definition};`);
 for(const idx of s.indexes.rows)if(!s.constraints.rows.some(c=>c.relation===idx.relation&&c.name===idx.id.split(':')[1]))await queue(idx.definition);
 for(const f of s.functions.rows){await queue(f.definition);await queue(`REVOKE ALL ON FUNCTION ${f.id} FROM PUBLIC,anon,authenticated,service_role;`);for(const g of s.effectiveFunctionGrants.rows.filter(g=>g.signature===f.id&&g.allowed))await queue(`GRANT EXECUTE ON FUNCTION ${f.id} TO ${ident(g.role)};`);}
 for(const t of s.relations.rows){if(t.rls)await queue(`ALTER TABLE ${t.id} ENABLE ROW LEVEL SECURITY;`);if(t.forceRls)await queue(`ALTER TABLE ${t.id} FORCE ROW LEVEL SECURITY;`);}
 for(const p of s.policies.rows){const cmd={r:'SELECT',a:'INSERT',w:'UPDATE',d:'DELETE','*':'ALL'}[p.command];await queue(`CREATE POLICY ${ident(p.name)} ON ${p.relation} AS ${p.permissive?'PERMISSIVE':'RESTRICTIVE'} FOR ${cmd} TO ${p.roles.map(ident).join(',')}${p.using?' USING ('+p.using+')':''}${p.check?' WITH CHECK ('+p.check+')':''};`);}
 for(const g of s.effectiveTableGrants.rows.filter(g=>g.allowed))await queue(`GRANT ${g.privilege} ON ${g.relation} TO ${ident(g.role)};`);
 for(const g of s.effectiveColumnGrants.rows.filter(g=>g.allowed)){const i=g.column.lastIndexOf('.');await queue(`GRANT ${g.privilege} (${ident(g.column.slice(i+1))}) ON ${g.column.slice(0,i)} TO ${ident(g.role)};`);}
 for(const t of s.triggers.rows){await queue(t.definition);if(t.enabled!=='O')throw Error('Non-default captured trigger enablement requires explicit reconstruction');}
 await sql(statements.join('\n'));
 return {privateSourceVerified:Boolean(process.env.HOSTED_DESCRIPTOR),scope:'Six captured admin tables, constraints, standalone indexes, policies, table/column grants and all scoped triggers; local pinned auth internals, no production data or provider equivalence',scopedSha256:manifest.scopedSha256,sourceCaptureSha256:manifest.captureSha256};
}
