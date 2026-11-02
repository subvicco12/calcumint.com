import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {project,paths,selected} from '../../scripts/fast-publication-20261102/queue.mjs';
const fixture=()=>paths.map(p=>JSON.parse(fs.readFileSync(p,'utf8')));
test('retains exact registered tuples, unmet evidence, and no eligibility',()=>{const rows=project(...fixture());assert.equal(rows.length,44);assert.ok(rows.every(x=>![235,251,275,276,282,283,222,277].includes(x.masterId)));assert.deepEqual(rows.map(x=>[x.masterId,x.version]),selected.map(x=>[x.masterId,x.version]));assert.ok(rows.every(x=>x.unmetRequirements.length>0&&!x.publicationEligible&&!x.activationAuthorized));});
for(const [name,mutate] of [
 ['wrong version',d=>d[0].rows.find(x=>x.masterId===208).candidates[0].version=99],
 ['family substitution',d=>d[0].rows.find(x=>x.masterId===208).candidates[0].identityCandidate=false],
 ['wrong ledger mapping',d=>d[1].rows.find(x=>x.masterId===208).observedContracts.registeredCandidates[0].slug='different'],
 ['missing requirement',d=>d[2].rows.find(x=>x.masterId===208).requirements.pop()],
 ['missing identity',d=>d[1].rows=d[1].rows.filter(x=>x.masterId!==208)],
 ['pointer drift',d=>d[0].rows.find(x=>x.masterId===208).requirementEvidencePointer='wrong'],
]) test(`refuses ${name}`,()=>{const d=fixture();mutate(d);assert.throws(()=>project(...d));});
