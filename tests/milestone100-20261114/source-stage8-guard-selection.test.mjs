import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {sourceGit} from '../parallel-source-20261110/baseline-runtime.mjs';
import {personalAuxiliaryRecords} from '../completion-first-20261112/personal-stage.mjs';
import {acceptedStage8} from '../parallel-source-20261110/authority.mjs';
import {selectStage8GuardSuccessor} from './source-stage8-guard-selection.mjs';
const capture=JSON.parse(readFileSync('docs/parallel-source-20261110/capture-revision69.json'));
test('inherited retained-runtime row never overrides its original auxiliary successor',()=>{
 const path='tests/next-cohort-20261110/source/retained-runtime.mjs',inherited=capture.currentSources.find(row=>row.path===path);
 assert.equal(inherited.blob,'79e66a296cce5ed3d12edf29e7f51174de663964');
 assert.equal(selectStage8GuardSuccessor(capture,path),undefined);
 const actual=personalAuxiliaryRecords(readFileSync).get(path).current;
 assert.equal(actual.blob,'99666fd1d09a2b7f782b05d4dbd9f9656be08eea');
 assert.equal(sourceGit(['rev-parse','HEAD:'+path]).toString().trim(),actual.blob);
 assert(readFileSync(path).equals(sourceGit(['cat-file','blob',actual.blob])));
});
test('only explicit Stage8 guard paths select their exact captured successor',()=>{
 const path='tests/parallel-source-20261110/core.mjs',row=capture.currentSources.find(row=>row.path===path);
 assert.equal(selectStage8GuardSuccessor(capture,path),row);
 assert.equal(selectStage8GuardSuccessor(capture,'unapproved/path'),undefined);
});
test('committed A2 capture69 and all115 installed authority records remain literal',()=>{
 const ref='b5a07bb4b7023dd9427e2edca36c36aebe665737',path='docs/parallel-source-20261110/capture-revision69.json';
 assert(readFileSync(path).equals(sourceGit(['show',ref+':'+path])));
 const authority=sourceGit(['show',ref+':tests/parallel-source-20261110/authority.mjs']);
 assert(authority.equals(readFileSync('docs/milestone100-20261114/source-qualified-authority69.mjs')));
 const literal=JSON.parse(authority.toString().split('export const acceptedStage8=Object.freeze(')[1].split('\n]);')[0]+'\n]');
 assert.equal(literal.length,115);assert.deepEqual(acceptedStage8,literal);
 for(const record of acceptedStage8.filter(row=>row.path===path)){assert.equal(createHash('sha256').update(readFileSync(path)).digest('hex'),record.sha256);}
});
