import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {build} from 'esbuild';
import {startBusinessPredecessor,unhold} from './business-sql-fixture.mjs';
import {assertPredecessor,forwardSQL,reverseSQL,metadataQuery,digest} from './business-sql-generate.mjs';
const artifacts='/workspace/artifacts/milestone60-20261113/business-sql';await mkdir(artifacts,{recursive:true});
const predecessorPath='/workspace/artifacts/completion-wave-20261113/business-successor.json',bytes=await readFile(predecessorPath);assert.equal(digest(bytes),'2e95a4d175eeea0bf3c1ea2ab893b24e7e28f709b06699d11ce19390908517cc');
await build({entryPoints:['src/lib/native-delivery/factory-delivery-catalog.ts'],outfile:artifacts+'/catalog.mjs',bundle:true,platform:'node',format:'esm'});const {factoryDeliveryCatalog:tuples}=await import(pathToFileURL(artifacts+'/catalog.mjs'));
const source='docs/milestone60-20261113/held-business-successor.sql',reversePath='docs/milestone60-20261113/held-business-reverse.sql';
const checks=[],pass=x=>{checks.push(x);console.log('PASS '+x);};let db;
const normalize=x=>JSON.stringify({rows:[...x.rows].sort((a,b)=>a.signature.localeCompare(b.signature)),constraints:[...x.constraints].sort((a,b)=>a.name.localeCompare(b.name)),tables:[...x.tables].sort((a,b)=>a.table.localeCompare(b.table))});
try{
 db=await startBusinessPredecessor();const pre=JSON.parse(await db.sql(metadataQuery));assertPredecessor(pre,JSON.parse(bytes));await writeFile(artifacts+'/preimage.json',JSON.stringify(pre,null,2)+'\n');pass('Exact ACTUAL25 predecessor four function SHA/owner/ACL and four constraints match captured prior receipt');
 const forward=forwardSQL(pre,tuples);await writeFile(source,forward);await assert.rejects(db.sql(forward),/UNAPPLIED_MILESTONE60/);
 await db.sql('GRANT EXECUTE ON FUNCTION public.factory_native_embed_publication_v1(integer,integer) TO authenticated;');await assert.rejects(db.sql(unhold(forward)),/Exact function preimage differs/);await db.sql('REVOKE EXECUTE ON FUNCTION public.factory_native_embed_publication_v1(integer,integer) FROM authenticated;');
 await db.sql('ALTER TABLE public.native_embed_grants DISABLE ROW LEVEL SECURITY;');await assert.rejects(db.sql(unhold(forward)),/Exact table owner ACL RLS preimage differs/);await db.sql('ALTER TABLE public.native_embed_grants ENABLE ROW LEVEL SECURITY;');
 assert.equal(normalize(JSON.parse(await db.sql(metadataQuery))),normalize(pre));pass('Unchanged hold, function ACL drift and table RLS drift refuse before mutation');
 await db.sql(unhold(forward));await assert.rejects(db.sql(unhold(forward)),/Exact function preimage differs/);const post=JSON.parse(await db.sql(metadataQuery));await writeFile(artifacts+'/postimage.json',JSON.stringify(post,null,2)+'\n');
 const predecessorSource=await readFile('docs/completion-wave-20261113/held-business-successor.sql','utf8');
 const restoreStatements=Object.fromEntries(pre.constraints.map(c=>{const start=predecessorSource.indexOf('ALTER TABLE public.'+c.table.replace(/^public\./,'')+' ADD CONSTRAINT '+c.name+' ');assert(start>=0);const end=predecessorSource.indexOf(';',start);assert(end>start);return [c.name,predecessorSource.slice(start,end)];}));
 const reverse=reverseSQL(pre,post,tuples,restoreStatements);await writeFile(reversePath,reverse);await assert.rejects(db.sql(reverse),/UNAPPLIED_MILESTONE60/);
 await db.sql(unhold(reverse).replace(/COMMIT;\n$/,'ROLLBACK;\n'));assert.equal(normalize(JSON.parse(await db.sql(metadataQuery))),normalize(post));
 await db.sql(unhold(reverse));const restored=JSON.parse(await db.sql(metadataQuery));await writeFile(artifacts+'/restored.json',JSON.stringify(restored,null,2));assert.equal(normalize(restored),normalize(pre));await db.sql(unhold(forward));assert.equal(normalize(JSON.parse(await db.sql(metadataQuery))),normalize(post));pass('Exact44 successor refuses replay; reverse rollback preserves postimage; reverse restores exact definitions owner ACL constraints and table RLS; forward reapplies');
 const selected=tuples.filter(t=>!JSON.parse(bytes).rows[0].definition.includes(`(${t.catalogId},`));assert.equal(selected.length,19);
 for(const t of selected){await assert.rejects(db.sql(`SELECT public.factory_native_embed_publication_v1(${t.catalogId},${t.version});`),/Exact publication unavailable/);await assert.rejects(db.sql(`SELECT public.technology_five_require_publication_v1(${t.catalogId},${t.version});`),/Exact publication unavailable/);}
 pass('All19 new exact tuples retain genuine publication denial without synthetic approval functions');
 const receipt={passed:true,kind:'MILESTONE60_HELD_BUSINESS_SQL_EXACT_ROUNDTRIP',checks,tuples,sourceSHA256:digest(forward),reverseSHA256:digest(reverse),predecessorCaptureSHA256:digest(bytes),catalogSHA256:digest(await readFile('src/lib/native-delivery/factory-delivery-catalog.ts')),producerSHA256:digest(await readFile(new URL(import.meta.url))),fixture:db.provenance,productionWrites:false,sqlActivated:false,releaseHold:true,limitations:['Disposable genuine Postgres/GoTrue/PostgREST fixture only; production equivalence UNKNOWN.','No positive publication substitution: new tuples retain genuine publication denial.','Empty fixture roundtrip; durable row reverse refusal and authenticated concurrency/RLS require separate acceptance.']};await writeFile(artifacts+'/receipt.json',JSON.stringify(receipt,null,2)+'\n');
}finally{if(db)await db.close();}
