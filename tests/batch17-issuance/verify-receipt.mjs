import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
const root=new URL('../../',import.meta.url);
const receiptPath=process.argv[2]||(process.env.ISSUANCE_ARTIFACTS?path.join(process.env.ISSUANCE_ARTIFACTS,'receipt.json'):null);
assert(receiptPath,'Pass a fresh receipt path or set ISSUANCE_ARTIFACTS');
const receipt=JSON.parse(await readFile(receiptPath));
const expectedOwnPaths=[
 "tests/batch17-issuance/review-only-issuance.sql",
 "tests/batch17-issuance/artifacts.mjs",
 "tests/batch17-issuance/acceptance.mjs",
 "tests/batch16-auth/review-only-business-integrity.sql",
 "src/app/business/actions.ts",
 "supabase/migrations/003_b5_business.sql",
 "supabase/migrations/014_production_entitlement_rpc_sync.sql",
 "supabase/migrations/032_business_builder_rls_auth_initplan.sql"
];
const expectedChecks=[
 "Unchanged proposal guard rejects execution with no function installed",
 "Foreign owner, cross-tenant target, manager, Free admin and invalid invitation denied",
 "Stored fields preserve normalized email, caller actor, role and exact 604800-second lifetime bounded by database clock",
 "Concurrent distinct genuine JWT requests reserve final seat once; members plus live pending enforce five-seat quota",
 "Participating Batch16 redemption converts pending to member without freeing an occupied seat",
 "Concurrent same request succeeds once and retains existing duplicate rejection rather than inventing idempotency",
 "Expired unaccepted invitation consumes no reservation; live pending rows consume seats",
 "Business admin caller succeeds independently of owner entitlement",
 "Accepted invitations do not count as pending reservations",
 "CHARACTERIZED BLOCKER: existing authenticated direct insert bypasses reservation quota"
];
// Trusted repository evidence supplies the unchanged full-model path inventory.
const trustedModel=JSON.parse(await readFile(new URL('docs/full-product-batch16/integrated-auth-integrity-receipt.json',root))).provenance;
function validateSources(sources,expected,label){
 assert(Array.isArray(sources),'Invalid receipt '+label+': expected source array');
 const paths=[];
 for(const source of sources){
  assert(source&&typeof source.path==='string'&&typeof source.sha256==='string'&&/^[a-f0-9]{64}$/.test(source.sha256),'Invalid receipt '+label+': malformed source binding');
  paths.push(source.path);
 }
 assert.equal(new Set(paths).size,paths.length,'Invalid receipt '+label+': duplicate source path');
 assert.deepEqual([...paths].sort(),[...expected].sort(),'Invalid receipt '+label+': exact source path set required');
}
// Complete both inventories before reading any path obtained from the receipt.
validateSources(receipt.sources,expectedOwnPaths,'own sources');
validateSources(receipt.modelProvenance?.sources,trustedModel.sources.map(source=>source.path),'model sources');
assert.deepEqual(receipt.checks,expectedChecks,'Invalid receipt acceptance check names');
assert.equal(receipt.activation,false);
assert.equal(receipt.productionEquivalence,'UNKNOWN');
assert.equal(receipt.checks.length,10);
assert.equal(receipt.status,'REVIEW_ONLY_PREPARED_GENUINE_LOCAL_TESTED_ADOPTION_BLOCKED');
assert.equal(receipt.modelProvenance.authMigrationCount,75);
assert.equal(receipt.modelProvenance.productionEquivalence,'UNKNOWN');
for(const source of [...receipt.sources,...receipt.modelProvenance.sources]){
 const actual=createHash('sha256').update(await readFile(new URL(source.path,root))).digest('hex');
 assert.equal(actual,source.sha256,'stale source receipt: '+source.path);
}
const sql=await readFile(new URL('tests/batch17-issuance/review-only-issuance.sql',root),'utf8');
assert.match(sql,/RAISE EXCEPTION 'UNAPPLIED_BATCH17_ISSUANCE'/);
assert.equal(receipt.elapsedSeconds,(Date.parse(receipt.endedAt)-Date.parse(receipt.startedAt))/1000);
console.log('PASS issuance receipt: exact source hashes, ten genuine checks, guarded/unactivated status and measured runtime');
