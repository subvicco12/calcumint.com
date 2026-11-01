import assert from 'node:assert/strict';
import {readFile,realpath} from 'node:fs/promises';
import {resolve,relative,isAbsolute} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {catalogSQL} from './catalog.mjs';
export const sha=value=>createHash('sha256').update(value).digest('hex');
const ident=x=>'"'+x.replaceAll('"','""')+'"';
const clientRoles=['PUBLIC','anon','authenticated'];
const aclTables=['public.profiles','public.user_preferences','public.subscriptions','public.billing_customers'];
const newFunctions=new Set(['public.record_calculator_qa_decision(uuid,text,text,text)','public.is_active_review_capable_admin(uuid)','public.assign_calculator_reviewer(uuid,uuid)','public.transition_calculator_with_audit(uuid,text,text)','public.create_catalog_calculator_with_audit(text,text,text,text,text,jsonb)','public.enforce_calculator_publish_gate_final_row()','public.p0_publication_insert_guard()','public.p0_publication_qa_old_parent()','public.p0_publication_reviewer_delete()','public.p0_publication_reviewer_lock()','public.p0_publication_qa_parent_lock()']);
const newTriggers=new Map([['calculator_publish_gate_final_row','public.calculator_catalog_admin'],['p0_publication_insert_guard','public.calculator_catalog_admin'],['p0_publication_qa_old_parent','public.calculator_qa_checks'],['p0_publication_reviewer_delete','public.platform_admins'],['p0_publication_reviewer_lock','public.calculator_catalog_admin'],['p0_publication_qa_parent_lock','public.calculator_qa_checks']]);
const fingerprintSQL=`encode(sha256(convert_to((${catalogSQL})::text,'UTF8')),'hex')`;
export async function snapshot(sql) {
 const raw=await sql(catalogSQL+';');const data=JSON.parse(raw);assert.equal(data.major,17);
 return {kind:'ISOLATED_FIXTURE',raw,sha256:sha(raw),data};
}
const check=s=>{assert.equal(s.kind,'ISOLATED_FIXTURE','Only explicitly isolated snapshots accepted');assert.equal(sha(s.raw),s.sha256);assert.deepEqual(JSON.parse(s.raw),s.data);assert.equal(s.data.major,17,'PostgreSQL17 snapshot required');};
const assertion=hash=>`DO $metadata$ BEGIN IF ${fingerprintSQL} IS DISTINCT FROM '${hash}' THEN RAISE EXCEPTION 'EXACT_METADATA_PRECONDITION_MISMATCH'; END IF; END $metadata$;`;
const guard=name=>`BEGIN;\nSET LOCAL lock_timeout='3s';\nSET LOCAL statement_timeout='30s';\nDO $hold$ BEGIN RAISE EXCEPTION '${name}: no activation authority'; END $hold$;\nDO $isolation$ BEGIN IF current_setting('transaction_isolation') <> 'read committed' THEN RAISE EXCEPTION 'Correction bundle requires READ COMMITTED'; END IF; END $isolation$;\n`;
// Source hashes authorize deterministic review composition only. The combined
// guard cannot be removed through a CLI switch; tests remove it in memory.
export async function verifySourceBindings(plan,root=fileURLToPath(new URL('../../../',import.meta.url))) {
 const base=await realpath(root),seen=new Set(),verified=[];
 for(const source of [...plan.sourceBindings,...plan.supplementarySourceBindings]){
  assert(typeof source.path==='string'&&!isAbsolute(source.path)&&!source.path.split('/').includes('..'),'Unsafe source path');
  assert(!seen.has(source.path),'Duplicate source: '+source.path);seen.add(source.path);
  const target=await realpath(resolve(base,source.path)),rel=relative(base,target);
  assert(rel&&!rel.startsWith('..')&&!isAbsolute(rel),'Source escapes repository');
  const raw=await readFile(target,'utf8');assert.equal(sha(raw),source.sha256,'Source changed: '+source.path);
  verified.push({...source,raw});
 }
 return verified;
}
export async function prepareApply(before) {
 check(before);
 const plan=JSON.parse(await readFile(new URL('plan.json',import.meta.url),'utf8'));
 assert.equal(plan.activationAuthorized,false);assert.equal(plan.releaseHold,true);
 assert(!before.data.columns.some(c=>c.table==='public.user_preferences'&&c.name==='country_code'),'009 existing column requires separate compatibility decision');
 for(const f of before.data.functions)assert(![...newFunctions].some(id=>id.split('(')[0]===f.id.split('(')[0]),'Reviewed new function name already exists; no overwrite or overload inference');
 const predicate=before.data.functions.find(f=>f.id==='public.validate_calculator_publish_gate(uuid)');assert(predicate);assert.equal(predicate.owner,'postgres','Captured predicate owner mismatch');assert.equal(sha(predicate.definition),'18ed27d139a24b73176838618ac99469418053d85b4020d1a4a1481cd3e6334c');
 const verified=await verifySourceBindings(plan);
 const chunks=[];
 for(const source of plan.sourceBindings){
  assert(!source.path.startsWith('/')&&!source.path.split('/').includes('..'));
  const {raw}=verified.find(entry=>entry.path===source.path);
  const body=raw.replace(/DO (\$\w*\$) BEGIN\s*RAISE EXCEPTION[\s\S]*?END \1;/g,'-- constituent guard retained by outer unconditional hold')
   .replace(/^BEGIN;\s*$/gm,'').replace(/^COMMIT;\s*$/gm,'');
  chunks.push(`-- Exact source ${source.path} SHA256 ${source.sha256}\n${body}`);
 }
 return {sql:guard('UNAPPLIED_OWNER_P0_CORRECTION_BUNDLE')+assertion(before.sha256)+'\n'+chunks.join('\n')+'\nCOMMIT;\n',plan,preimage:before.sha256,activationAuthorized:false};
}
function restoreClientACL(before,after) {
 const out=[];
 for(const table of aclTables){
  out.push(`REVOKE ALL ON TABLE ${table} FROM PUBLIC,anon,authenticated;`);
  const cols=after.data.columns.filter(c=>c.table===table).map(c=>ident(c.name)).join(',');out.push(`REVOKE ALL PRIVILEGES (${cols}) ON TABLE ${table} FROM PUBLIC,anon,authenticated;`);
  for(const a of before.data.relations.find(r=>r.id===table).acl.filter(a=>clientRoles.includes(a.grantee)))out.push(`GRANT ${a.privilege} ON TABLE ${table} TO ${a.grantee==='PUBLIC'?'PUBLIC':ident(a.grantee)}${a.grantable?' WITH GRANT OPTION':''};`);
  for(const c of before.data.columns.filter(c=>c.table===table))for(const a of c.acl.filter(a=>clientRoles.includes(a.grantee)))out.push(`GRANT ${a.privilege} (${ident(c.name)}) ON TABLE ${table} TO ${a.grantee==='PUBLIC'?'PUBLIC':ident(a.grantee)}${a.grantable?' WITH GRANT OPTION':''};`);
 }
 return out;
}
export function prepareRollback(before,after) {
 check(before);check(after);assert.deepEqual(before.data.provider,after.data.provider,'Provider controls drifted');
 const oldFunctions=new Map(before.data.functions.map(f=>[f.id,f]));
 for(const old of before.data.functions){
  const current=after.data.functions.find(f=>f.id===old.id);
  assert(current,'Preexisting function missing from recovery postimage: '+old.id);
  assert.equal(current.owner,old.owner,'Existing function control drift');
  assert.deepEqual(current.acl,old.acl,'Existing function control drift');
 }

 for(const f of after.data.functions){const old=oldFunctions.get(f.id);if(!old)assert(newFunctions.has(f.id.replaceAll(', ',',')),'Unrelated new function outside correction scope');else if(old.definition!==f.definition){assert.equal(f.id,'public.validate_calculator_publish_gate(uuid)','Unrelated function changed');assert.equal(sha(f.definition),'ce53551431824e8560af44a235ebb312372e0c67641c196f3d8db1287c05709a','Unexpected predicate postimage');}}
 const oldTrigger=new Set(before.data.triggers.map(t=>t.table+':'+t.id));
 for(const t of after.data.triggers)if(!oldTrigger.has(t.table+':'+t.id))assert.equal(newTriggers.get(t.id),t.table,'Unrelated new trigger outside correction scope');
 const out=[guard('UNAPPLIED_OWNER_P0_ROLLBACK'),'LOCK TABLE public.user_preferences IN ACCESS EXCLUSIVE MODE;',assertion(after.sha256),"DO $data$ BEGIN IF EXISTS(SELECT FROM public.user_preferences WHERE country_code IS NOT NULL) THEN RAISE EXCEPTION 'ROLLBACK_REFUSES_COUNTRY_DATA_LOSS'; END IF; END $data$;"];
 for(const t of [...after.data.triggers].reverse())if(!oldTrigger.has(t.table+':'+t.id))out.push(`DROP TRIGGER ${ident(t.id)} ON ${t.table};`);
 for(const f of [...after.data.functions].reverse()){
  const old=oldFunctions.get(f.id);
  if(!old)out.push(`DROP FUNCTION ${f.id};`);
  else if(old.definition!==f.definition){out.push(old.definition+';');assert.deepEqual(old.acl,f.acl,'Unexpected existing function ACL drift requires separate rollback');assert.equal(old.owner,f.owner);}
 }
 out.push(...restoreClientACL(before,after),'ALTER TABLE public.user_preferences DROP COLUMN country_code;',assertion(before.sha256),'COMMIT;');
 return {sql:out.join('\n')+'\n',postimage:before.sha256,preimage:after.sha256,activationAuthorized:false,warning:'Restores known-defective predecessor only for isolated reversibility proof; real rollback requires held critical workflows, reviewed recovery and separate approval.'};
}
