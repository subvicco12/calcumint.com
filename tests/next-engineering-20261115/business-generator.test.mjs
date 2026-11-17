import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFile} from 'node:fs/promises';
import {assertPredecessor,additionsFor,forwardSQL,reverseSQL,signatures,digest} from '../../scripts/next-engineering-20261115/business-sql-generate.mjs';
import {newIdentities,shapeFields} from '../../scripts/next-engineering-20261115/business-identities.mjs';
import {loadCases} from '../../scripts/next-engineering-20261115/business-cases.mjs';
const dir='docs/next-engineering-20261115/business/',read=async f=>JSON.parse(await readFile(dir+f,'utf8'));
const pre=await read('preimage.json'),post=await read('postimage.json'),tuples=await read('tuples89.json'),restore=Object.fromEntries(pre.constraints.map(c=>[c.name,`ALTER TABLE public.${c.table.replace(/^public\./,'')} ADD CONSTRAINT ${c.name} ${c.definition}`]));
const forward=forwardSQL(pre,tuples,post),reverse=reverseSQL(pre,post,tuples,restore);
test('exact source-bound held successor and reverse reproduce checked-in bytes',async()=>{assert.equal(forward,await readFile(dir+'held-successor.sql','utf8'));assert.equal(reverse,await readFile(dir+'held-reverse.sql','utf8'));for(const sql of [forward,reverse]){assert.match(sql,/RAISE EXCEPTION 'UNAPPLIED_NEXT_ENGINEERING_BUSINESS_/);assert.equal((sql.match(/DO \$pre\$/g)||[]).length,2);assert.doesNotMatch(sql,/\b(?:DELETE FROM|TRUNCATE|GRANT |REVOKE |DISABLE ROW LEVEL SECURITY)\b/i);}});
test('exact20 immutable identities extend69 to89 with no synthetic publication authority',()=>{assert.equal(tuples.length,89);assert.deepEqual(additionsFor(pre,tuples),newIdentities);assert.doesNotMatch(forward,/CREATE (?:OR REPLACE )?FUNCTION[^\n]*(?:approval|authorize_publication)/i);});
for(const [label,mutate]of [
 ['wrong new engine',t=>{t.find(x=>x.catalogId===284).engineId='statistics.fake';}],
 ['wrong new slug',t=>{t.find(x=>x.catalogId===291).slug='normal-fake';}],
 ['wrong version',t=>{t.find(x=>x.catalogId===333).version=2;}],
 ['missing retained tuple',t=>{t[0]={...t[0],catalogId:999};}],
 ['duplicate retained tuple',t=>{t[0]=t[1];}],
 ['missing new tuple',t=>{t.pop();}],
 ['out of scope identity',t=>{t.find(x=>x.catalogId===342).catalogId=330;}],
])test('generator rejects '+label,()=>{const bad=structuredClone(tuples);mutate(bad);assert.throws(()=>forwardSQL(pre,bad,post));});
for(const [label,mutate]of [
 ['function body',p=>{p.rows[0].definition+=' altered';}],
 ['function hash',p=>{p.rows[0].sha256='0'.repeat(64);}],
 ['function ACL',p=>{p.rows[0].acl=null;}],
 ['function owner',p=>{p.rows[0].owner='authenticated';}],
 ['constraint',p=>{p.constraints[0].definition='CHECK (true)';}],
 ['constraint validation',p=>{p.constraints[0].validated=false;}],
 ['table ACL',p=>{p.tables[0].acl=null;}],
 ['table RLS',p=>{p.tables[0].rls=false;}],
])test('source binding rejects '+label+' drift',()=>{const bad=structuredClone(pre);mutate(bad);assert.throws(()=>assertPredecessor(bad,pre));assert.throws(()=>forwardSQL(bad,tuples,post));});
test('reverse refuses missing restore evidence and guards all four durable tables',()=>{assert.throws(()=>reverseSQL(pre,post,tuples,{}));assert.match(reverse,/durable evidence prevents reverse; no audit deletion authorized/);for(const name of ['native_embed_grants','native_embed_usage','technology_five_jobs','technology_next_shared_snapshots'])assert(reverse.includes('EXISTS(SELECT FROM public.'+name));});
test('old structured sharing clauses and auth body survive byte-for-byte outside exact mapping/shape additions',()=>{
 const before=pre.rows.find(r=>r.signature===signatures[3]).definition,after=post.rows.find(r=>r.signature===signatures[3]).definition;
 const oldShapes=before.slice(before.indexOf("WHEN item->>'calculatorSlug'='root-finder-calculator'"),before.indexOf(" OR char_length(request_payload"));assert(after.includes(oldShapes));
 assert.equal(after.slice(0,after.indexOf(" OR item->>'calculatorSlug' NOT IN(")),before.slice(0,before.indexOf(" OR item->>'calculatorSlug' NOT IN(")));
 assert.equal(after.slice(after.indexOf(" OR char_length(request_payload")),before.slice(before.indexOf(" OR char_length(request_payload")));
 for(const slug of Object.keys(shapeFields))assert(after.includes(`WHEN item->>'calculatorSlug'='${slug}' THEN`));
});
test('all20 complete engine output cases and source hashes reproduce from immutable engines',async()=>{const actual=await loadCases(),saved=await read('immutable-engine-cases.json');assert.deepEqual(actual,saved);assert.equal(actual.cases.length,20);const normal=actual.cases.find(r=>r.catalogId===291);assert.deepEqual(Object.keys(normal.output),['zScore','pdf','cdf','upperTail','steps']);for(const row of actual.cases)assert.deepEqual(Object.keys(row.output).sort(),[...shapeFields[row.slug]].sort());});
test('metadata captures bind actual four function definitions to their SHA256',()=>{for(const metadata of [pre,post]){assert.equal(metadata.rows.length,4);for(const row of metadata.rows)assert.equal(digest(row.definition),row.sha256);}});
