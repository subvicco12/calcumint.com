import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
const root=new URL('../../',import.meta.url);
const receiptPath=process.argv[2]||(process.env.ISSUANCE_ARTIFACTS?path.join(process.env.ISSUANCE_ARTIFACTS,'receipt.json'):null);
assert(receiptPath,'Pass a fresh receipt path or set ISSUANCE_ARTIFACTS');
const receipt=JSON.parse(await readFile(receiptPath));
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
