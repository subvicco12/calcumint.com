import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {verifyCompletionBinding} from '../../scripts/product-completion-lineage.mjs';
const git=args=>execFileSync('git',args,{stdio:['ignore','pipe','pipe']});
const name='src/components/component-engineering-review.tsx';
const original=git(['show','a955cdad7019a645b7ed2950299d0603ba1784a7:'+name]);
const claim=createHash('sha256').update(original).digest('hex');
test('admits only exact captured component text-boundary caller successor',()=>assert.equal(verifyCompletionBinding(name,readFileSync(name),claim,git),true));
test('rejects historical caller reversion',()=>assert.throws(()=>verifyCompletionBinding(name,original,claim,git),/current successor differs/));
test('rejects unauthorized new caller bytes',()=>assert.throws(()=>verifyCompletionBinding(name,Buffer.from('tamper'),claim,git),/current successor differs/));
test('requires exact Git successor provenance',()=>assert.throws(()=>verifyCompletionBinding(name,readFileSync(name),claim,()=>{throw Error('Missing immutable source');}),/Missing immutable source/));
for(const dep of ['src/lib/final-private-snapshot-text.ts','src/lib/publication-factory-contracts-input.ts','src/calculators/component-contracts.ts'])test('requires immutable parsing/math dependency '+dep,()=>assert.throws(()=>verifyCompletionBinding(name,readFileSync(name),claim,git,p=>p===dep?Buffer.from('tamper'):readFileSync(p)),/supplemental source bytes differ/));
const readJSON=p=>JSON.parse(readFileSync(p));
const directory='docs/acceptance-continuation-20261108/';
test('retains all540 individual dispositions and scoped25 delta only',()=>{
 const parentBytes=readFileSync('docs/acceptance-closure-20261108/requirements-540.json'),parent=JSON.parse(parentBytes),ledger=readJSON(directory+'requirements-540.json');
 assert.equal(createHash('sha256').update(parentBytes).digest('hex'),ledger.parentLedgerSHA256);
 assert.equal(ledger.rows.length,540);assert.deepEqual(ledger.counts,parent.counts);
 const ids=[3,4,5,6,7,8,11,12,13,14,15,16,17,22,24,27,28,29,30,31,33,104,105,426,506];
 for(let i=0;i<540;i++){
  const row=ledger.rows[i],old=parent.rows[i];assert.equal(row.masterId,i+1);assert.equal(row.disposition,old.disposition);assert.equal(row.canonicalAccepted,false);assert.equal(row.certificationGranted,false);assert.equal(row.publicationEligibleEstablished,false);
  assert.deepEqual(row.newScopedChecks.slice(0,old.newScopedChecks.length),old.newScopedChecks);
  assert.equal(row.newScopedChecks.length-old.newScopedChecks.length,ids.includes(i+1)?2:0);
 }
 assert.equal(ledger.cumulativePrivateWorkflowProfilesImproved,141);assert.equal(ledger.newPublicationEligible,0);
});
test('native evidence distinguishes individual25 input and6 scoped426 workflows',()=>{
 const d=readJSON(directory+'component-browser-report.json');assert.equal(d.passed,true);assert.equal(d.journeys.length,31);assert.equal(d.journeys.filter(r=>r.validExample).length,25);assert.deepEqual([...new Set(d.journeys.filter(r=>r.actualDownloadReplayed).map(r=>r.masterId))],[426]);
});
test('fresh production core preimage is exact server text not regenerated JSON',()=>{
 const d=readJSON(directory+'hosted-core-observation.json');assert.equal(d.read_only,'on');assert.equal(createHash('sha256').update(d.metadata_json).digest('hex'),'56b55a34c29d2c0dc60863da60df510d5a70d962edbc6582591ba025a756c3f1');assert.equal(d.published_count,209);
});
test('reproducible finite financial witness receipt binds oracle and unchanged actual source',()=>{
 const d=readJSON(directory+'financial-independent-sweep-receipt.json');assert.equal(d.exitCode,0);assert.equal(d.result.actualCasesChecked,1794);assert.equal(d.result.exactHalfCentCases,330);assert.equal(d.result.financialSpecialistApproval,false);assert.equal(d.result.canonicalAdoptionAuthorized,false);
 for(const [p,expected] of [['tests/acceptance-continuation-20261108/financial-fractional-independent.mjs',d.result.scriptSha256],[d.result.source,d.result.sourceSha256]])assert.equal(createHash('sha256').update(readFileSync(p)).digest('hex'),expected);
 const oracle=JSON.parse(execFileSync(process.execPath,['tests/acceptance-continuation-20261108/financial-fractional-independent.mjs','--oracle-only'],{encoding:'utf8'}));assert.equal(oracle.generatedCases,1794);assert.equal(oracle.actualCasesChecked,0);assert.equal(oracle.casesSha256,d.result.casesSha256);
});
