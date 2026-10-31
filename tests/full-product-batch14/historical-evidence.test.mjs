import {test} from 'node:test';
import {execFileSync} from 'node:child_process';
import assert from 'node:assert/strict';
import {cpSync,mkdtempSync,readFileSync,rmSync,unlinkSync,writeFileSync} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {BATCH13_SOURCE_REF,checkHistoricalBatch13} from '../../scripts/check-batch13-evidence.mjs';
const repositoryRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const artifacts=path.join(repositoryRoot,'docs/full-product-batch13');
function isolated(run){const temp=mkdtempSync(path.join(os.tmpdir(),'batch13-negative-'));try{const artifactRoot=path.join(temp,'artifacts');cpSync(artifacts,artifactRoot,{recursive:true});run(artifactRoot);}finally{rmSync(temp,{recursive:true,force:true});}}
test('runs full original Batch13 generator against exact captured sources',{timeout:120000},()=>{
 const result=checkHistoricalBatch13({repositoryRoot});
 assert.equal(result.sourceRef,BATCH13_SOURCE_REF);assert.equal(result.artifactsChecked,14);
 const summary=JSON.parse(result.originalGeneratorOutput);assert.equal(summary.catalogIdentities,540);assert.equal(summary.newCanonicalAcceptances,0);assert.equal(summary.reusedWitnessChecks,1106);
});
test('rejects changed current historical artifact instead of checking only the archived copy',()=>isolated(artifactRoot=>{
 const file=path.join(artifactRoot,'requirements-540.json');writeFileSync(file,readFileSync(file,'utf8').replace('Loan Payment Calculator','Tampered current title'));
 assert.throws(()=>checkHistoricalBatch13({repositoryRoot,artifactRoot}),/Current Batch13 artifact bytes differ: requirements-540.json/);
}));
test('rejects extra current artifact membership',()=>isolated(artifactRoot=>{writeFileSync(path.join(artifactRoot,'invented.json'),'{}');assert.throws(()=>checkHistoricalBatch13({repositoryRoot,artifactRoot}),/membership differs/);}));
test('rejects missing current artifact membership',()=>isolated(artifactRoot=>{unlinkSync(path.join(artifactRoot,'validation.json'));assert.throws(()=>checkHistoricalBatch13({repositoryRoot,artifactRoot}),/membership differs/);}));

test('fails closed when exact historical Git capture is unavailable',()=>{
 const temp=mkdtempSync(path.join(os.tmpdir(),'batch13-missing-source-'));
 try{execFileSync('git',['init','--quiet',temp]);assert.throws(()=>checkHistoricalBatch13({repositoryRoot:temp}),/rev-parse|unknown revision|single revision/);}
 finally{rmSync(temp,{recursive:true,force:true});}
});
