import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {verifyFixedRuntimeReader} from './runtime-current-anchor.mjs';
test('populated current runtime reader and inherited bridge are independently fixed to reviewed code objects',()=>assert.equal(verifyFixedRuntimeReader(),true));
for(const path of ['tests/next-cohort-20261110/source/retained-runtime.mjs','tests/next-cohort-20261110/source/retained-runtime.d.mts','src/lib/five-full-contract-evidence.test.ts','tests/publication-workflows-20261109/business-caller-successor.mjs','tests/publication-workflows-20261109/business-source-successor.test.mjs','tests/next-cohort-20261110/source/retained-runtime.test.mjs'])test('no-op runtime validator or bridge cannot nominate its own authority '+path,()=>assert.throws(()=>verifyFixedRuntimeReader(name=>name===path?Buffer.from('plausible no-op validator'):readFileSync(name)),/Fixed runtime verifier target differs/));
test('missing actual source provenance cannot be supplied by a runtime receipt',()=>assert.throws(()=>verifyFixedRuntimeReader(readFileSync,()=>{throw Error('Missing fixed runtime source provenance');}),/Missing fixed runtime source provenance/));
test('plausible old HEAD objects cannot replace fixed populated verifier code',()=>assert.throws(()=>verifyFixedRuntimeReader(readFileSync,()=>Buffer.from('0'.repeat(40))),/Fixed runtime verifier HEAD object differs/));
