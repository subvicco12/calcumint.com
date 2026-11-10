import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {startGoTrueFixture} from '../../../tests/gotrue-runtime/fixture.mjs';
import {initializeFullSchema} from '../../../tests/gotrue-full-schema/schema.mjs';
for(const k of ['DATABASE_URL','SUPABASE_DB_URL','PGHOST','PGDATABASE','PGPORT','PGUSER','PGPASSWORD'])assert(!process.env[k]);
const root='docs/parallel-five-20261110/sharing/';let db;
const unhold=s=>s.replace(/DO \$hold\$ BEGIN RAISE EXCEPTION '[^']+'; END \$hold\$;/,'-- disposable local fixture only');
try{
 db=await startGoTrueFixture({initializeSchema:initializeFullSchema});
 const old=await readFile('docs/next-cohort-sharing-20261110/review-only-sharing.sql','utf8');await db.sql(old.replace(/DO \$sharing_guard\$ BEGIN RAISE EXCEPTION '[^']+'; END \$sharing_guard\$;/,'-- disposable local fixture only'));
 const query=(await readFile(root+'metadata-query.sql','utf8')).trim().replace(/;$/,'');
 const capture=async name=>{const raw=await db.sql(query);const sha256=createHash('sha256').update(raw).digest('hex');await writeFile(root+name+'.json',raw+'\n');return sha256};
 const preimage=await capture('metadata-preimage');
 const forward=await readFile(root+'review-before-successor.sql','utf8'),reverse=await readFile(root+'review-before-reverse.sql','utf8');
 await db.sql("GRANT TRUNCATE ON public.technology_next_shared_snapshots TO authenticated;");
 await db.sql(unhold(forward));assert.equal(await db.sql("SELECT has_table_privilege('authenticated','public.technology_next_shared_snapshots','TRUNCATE');"),'t');
 await db.sql(unhold(reverse));await db.sql('REVOKE TRUNCATE ON public.technology_next_shared_snapshots FROM authenticated;');
 assert.equal(await capture('metadata-preimage'),preimage);
 await db.sql(unhold(forward));const postimage=await capture('metadata-postimage');
 const receipt={passed:true,preimage,postimage,metadataQuerySha256:createHash('sha256').update(await readFile(root+'metadata-query.sql')).digest('hex'),redProof:{problem:'Pre-review forward AND reverse accepted authenticated TRUNCATE grant before effects',oldForwardSha256:createHash('sha256').update(forward).digest('hex'),oldReverseSha256:createHash('sha256').update(reverse).digest('hex'),acceptedUnsafeGrant:true},fixture:db.provenance};
 await writeFile(root+'metadata-capture.json',JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify(receipt));
}finally{await db?.close()}
