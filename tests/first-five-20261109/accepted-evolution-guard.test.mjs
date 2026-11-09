import {test} from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {createHash} from 'node:crypto';
import {assertAcceptedEvolutionGuard} from './accepted-evolution-guard.mjs';
const prefix='docs/first-five-20261109/ci-recovery/source-evolution/',path='tests/acceptance-closure-20261108/converter-final-source.test.mjs';
const parse=s=>JSON.parse(s.slice(s.indexOf('const bindings=')+'const bindings='.length,s.indexOf('\n];\nexport const completionSourceRefs')+2));
function current(){return {evidence:JSON.parse(readFileSync(prefix+'capture.json','utf8')),rows:parse(readFileSync('scripts/product-completion-lineage.mjs','utf8')),guardBytes:readFileSync(path)};}
const hash=b=>createHash('sha256').update(b).digest('hex');
test('independent fixed guard anchor admits only the reviewed current source with genuine Git provenance',()=>{assertAcceptedEvolutionGuard(current());assert.throws(()=>assertAcceptedEvolutionGuard(current(),()=>{throw Error('Missing fixed guard provenance')}),/Missing fixed guard provenance/);});
test('independent anchor rejects coordinated predecessor capture, metadata and guard-byte redirection',()=>{
 const data=current(),bytes=readFileSync(prefix+'predecessor-guard.fixture');
 data.evidence.capture='cd46039215693bcc3ad451cda970522b73be7e93';data.evidence.guardSHA256=hash(bytes);assert.equal(hash(bytes),'305c7da5331ed003dc23d94ab89fcefcdf42315fd3a3d81a3fd346fbc70e02a0');data.evidence.guardBlob='b54e970e6fa259971c1607d9c03bf6267c677980';
 const dependency=data.rows.find(row=>row.path==='scripts/publication20-caller-lineage.mjs').supplementalSources.find(dep=>dep.path===path);Object.assign(dependency,{ref:data.evidence.capture,blob:data.evidence.guardBlob,sha256:data.evidence.guardSHA256});data.guardBytes=bytes;
 assert.throws(()=>assertAcceptedEvolutionGuard(data,()=>{throw Error('Should reject before any predecessor provenance read')}),/Fixed reviewed guard/);
});
