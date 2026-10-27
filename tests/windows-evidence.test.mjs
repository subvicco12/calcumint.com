import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {verifySourceDrivenEvidence} from '../scripts/verify-source-driven-evidence.mjs';
test('portable verifier preserves all historical archive assertions',()=>{
 const result=verifySourceDrivenEvidence();
 assert.equal(result.cases,50);assert.equal(result.rootManifestEntries,97);assert.equal(result.nestedManifestEntries,76);
 assert.equal(result.sourceObservations,42);assert.equal(result.retainedQualifiedCases,11);assert.equal(result.missingSourceCases,9);
});
test('portable verifier rejects altered archive bytes before trusting entries',()=>{
 const bytes=readFileSync(new URL('../data/catalog/source-driven-2026-10-27/input-package.zip',import.meta.url));bytes[50]^=1;
 assert.throws(()=>verifySourceDrivenEvidence(bytes),/Input archive checksum mismatch/);
});
