import {loadDeliveryCases} from './delivery-cases.mjs';
import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {build} from 'esbuild';
import {startBusinessPredecessor,unhold} from './business-sql-fixture.mjs';
import {assertPredecessor,forwardSQL,reverseSQL,metadataQuery,digest} from './business-sql-generate.mjs';
const cases=await loadDeliveryCases();const artifacts='/workspace/artifacts/milestone100-20261114/business-sql';await mkdir(artifacts,{recursive:true});
const predecessorPath='/workspace/artifacts/milestone60-20261113/business-sql/postimage.json',bytes=await readFile(predecessorPath);assert.equal(digest(bytes),process.env.BUSINESS_PREDECESSOR_SHA256,'Root-approved actual44 capture bytes required');
await build({entryPoints:['src/lib/native-delivery/factory-delivery-catalog.ts'],outfile:artifacts+'/catalog.mjs',bundle:true,platform:'node',format:'esm'});const {factoryDeliveryCatalog:tuples}=await import(pathToFileURL(artifacts+'/catalog.mjs'));
const source='docs/milestone100-20261114/business-held-successor.sql',reversePath='docs/milestone100-20261114/business-held-reverse.sql';
const producerSources={};for(const file of ['scripts/milestone100-20261114/business-sql-acceptance.mjs','scripts/milestone100-20261114/business-sql-generate.mjs','scripts/milestone100-20261114/business-sql-fixture.mjs','scripts/milestone100-20261114/delivery-cases.mjs','tests/gotrue-runtime/fixture.mjs','tests/gotrue-full-schema/schema.mjs'])producerSources[file]=digest(await readFile(file));
const checks=[],pass=x=>{checks.push(x);console.log('PASS '+x);};let db;
const normalize=x=>JSON.stringify({rows:[...x.rows].sort((a,b)=>a.signature.localeCompare(b.signature)),constraints:[...x.constraints].sort((a,b)=>a.name.localeCompare(b.name)),tables:[...x.tables].sort((a,b)=>a.table.localeCompare(b.table))});
try{
 db=await startBusinessPredecessor();const pre=JSON.parse(await db.sql(metadataQuery));assertPredecessor(pre,JSON.parse(bytes));await writeFile(artifacts+'/preimage.json',JSON.stringify(pre,null,2)+'\n');pass('Exact ACTUAL44 predecessor four function SHA/owner/ACL and four constraints match captured prior receipt');
 assert.equal(tuples.length,44+cases.length);const additions=tuples.filter(t=>!JSON.parse(bytes).rows[0].definition.includes(`(${t.catalogId},`));assert.deepEqual(additions.map(t=>t.catalogId).sort((a,b)=>a-b),cases.map(t=>t.id).sort((a,b)=>a-b));const forward=forwardSQL(pre,tuples);await writeFile(source,forward);await assert.rejects(db.sql(forward),/UNAPPLIED_MILESTONE100/);
 await db.sql('GRANT EXECUTE ON FUNCTION public.factory_native_embed_publication_v1(integer,integer) TO authenticated;');await assert.rejects(db.sql(unhold(forward)),/Exact function preimage differs/);await db.sql('REVOKE EXECUTE ON FUNCTION public.factory_native_embed_publication_v1(integer,integer) FROM authenticated;');
 await db.sql('ALTER TABLE public.native_embed_grants DISABLE ROW LEVEL SECURITY;');await assert.rejects(db.sql(unhold(forward)),/Exact table owner ACL RLS preimage differs/);await db.sql('ALTER TABLE public.native_embed_grants ENABLE ROW LEVEL SECURITY;');
 assert.equal(normalize(JSON.parse(await db.sql(metadataQuery))),normalize(pre));pass('Unchanged hold, function ACL drift and table RLS drift refuse before mutation');
 await db.sql(unhold(forward));await assert.rejects(db.sql(unhold(forward)),/Exact function preimage differs/);const post=JSON.parse(await db.sql(metadataQuery));await writeFile(artifacts+'/postimage.json',JSON.stringify(post,null,2)+'\n');
 const predecessorSource=await readFile('docs/milestone60-20261113/held-business-successor.sql','utf8');
 const restoreStatements=Object.fromEntries(pre.constraints.map(c=>{const start=predecessorSource.indexOf('ALTER TABLE public.'+c.table.replace(/^public\./,'')+' ADD CONSTRAINT '+c.name+' ');assert(start>=0);const end=predecessorSource.indexOf(';',start);assert(end>start);return [c.name,predecessorSource.slice(start,end)];}));
 const reverse=reverseSQL(pre,post,tuples,restoreStatements);await writeFile(reversePath,reverse);await assert.rejects(db.sql(reverse),/UNAPPLIED_MILESTONE100/);
 await db.sql(unhold(reverse).replace(/COMMIT;\n$/,'ROLLBACK;\n'));assert.equal(normalize(JSON.parse(await db.sql(metadataQuery))),normalize(post));
 await db.sql(unhold(reverse));const restored=JSON.parse(await db.sql(metadataQuery));await writeFile(artifacts+'/restored.json',JSON.stringify(restored,null,2));assert.equal(normalize(restored),normalize(pre));await db.sql(unhold(forward));assert.equal(normalize(JSON.parse(await db.sql(metadataQuery))),normalize(post));pass('Exact expanded successor refuses replay; reverse rollback preserves postimage; reverse restores exact definitions owner ACL constraints and table RLS; forward reapplies');
 const selected=tuples.filter(t=>!JSON.parse(bytes).rows[0].definition.includes(`(${t.catalogId},`));assert.equal(selected.length,cases.length);
 for(const t of selected){await assert.rejects(db.sql(`SELECT public.factory_native_embed_publication_v1(${t.catalogId},${t.version});`),/Exact publication unavailable/);await assert.rejects(db.sql(`SELECT public.technology_five_require_publication_v1(${t.catalogId},${t.version});`),/Exact publication unavailable/);}
 pass('All new exact tuples retain genuine publication denial without synthetic approval functions');
 const receipt={passed:true,kind:'MILESTONE100_HELD_BUSINESS_SQL_EXACT_ROUNDTRIP',checks,tuples,producerSources,casesSHA256:digest(await readFile(process.env.BUSINESS_CASES_INPUT)),sourceSHA256:digest(forward),reverseSHA256:digest(reverse),predecessorCaptureSHA256:digest(bytes),catalogSHA256:digest(await readFile('src/lib/native-delivery/factory-delivery-catalog.ts')),producerSHA256:digest(await readFile(new URL(import.meta.url))),fixture:db.provenance,productionWrites:false,sqlActivated:false,releaseHold:true,limitations:['Disposable genuine Postgres/GoTrue/PostgREST fixture only; production equivalence UNKNOWN.','No positive publication substitution: new tuples retain genuine publication denial.','Empty fixture roundtrip; durable row reverse refusal and authenticated concurrency/RLS require separate acceptance.']};await writeFile(artifacts+'/receipt.json',JSON.stringify(receipt,null,2)+'\n');
}finally{if(db)await db.close();}
