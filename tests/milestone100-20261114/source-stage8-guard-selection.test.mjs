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
 assert.equal(actual.ref,'054854bceed263ba59e8cd0052f1f3e9b1ea8e30');
 assert.equal(sourceGit(['rev-parse',actual.ref+':'+path]).toString().trim(),actual.blob);
 const original=sourceGit(['show',actual.ref+':'+path]);assert(original.equals(sourceGit(['cat-file','blob',actual.blob])));
 assert.equal(createHash('sha256').update(original).digest('hex'),'a6b0b939f5e5cee3072cc2776bc3dbf6663a7c70731419a3905d7904a2f87f0c');
 const historic=JSON.parse(readFileSync('docs/parallel-source-20261110/capture-revision82.json'));assert.equal(selectStage8GuardSuccessor(historic,path),undefined);assert.deepEqual(historic.personalAuxiliarySources.find(row=>row.path===path),actual);
 const current=JSON.parse(readFileSync('docs/parallel-source-20261110/capture-revision83.json')),next=current.currentSources.find(row=>row.path===path);
 assert.equal(selectStage8GuardSuccessor(current,path),next,'An already-current owned row must select itself');assert.equal(next.ref,current.sourceStage8V16.guardRef);assert.notEqual(next.blob,actual.blob);
 assert.equal(sourceGit(['rev-parse','2a59a85c6e935c43e9a5a71ae15c9954e4fcab42:'+path]).toString().trim(),next.blob);
 const bytes=sourceGit(['cat-file','blob',next.blob]);assert.equal(bytes.length,next.bytes);assert.equal(createHash('sha256').update(bytes).digest('hex'),next.sha256);
 const successor=JSON.parse(readFileSync('docs/parallel-source-20261110/capture-revision87.json')),live=selectStage8GuardSuccessor(successor,path);assert(live);assert.equal(live.ref,successor.sourceStage8V20.guardRef);assert.equal(sourceGit(['rev-parse','88de7068ba2674aab85df5611840c4b029ef68c0:'+path]).toString().trim(),live.blob);assert.equal(sourceGit(['rev-parse','HEAD:'+path]).toString().trim(),live.blob);const currentBytes=sourceGit(['cat-file','blob',live.blob]);assert.equal(currentBytes.length,live.bytes);assert.equal(createHash('sha256').update(currentBytes).digest('hex'),live.sha256);assert(readFileSync(path).equals(currentBytes));assert.notEqual(live.blob,next.blob);
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

test('only the independently captured V6 list adds new owned guard successors',()=>{
 const path='tests/parallel-five-20261110/verify-composition.mjs',next=structuredClone(capture),row=next.currentSources.find(item=>item.path===path);assert(row);assert.equal(selectStage8GuardSuccessor(next,path),undefined);
 next.sourceStage8V6={guardPaths:[path]};assert.equal(selectStage8GuardSuccessor(next,path),row);
 assert.equal(selectStage8GuardSuccessor(next,'tests/next-cohort-20261110/source/retained-runtime.mjs'),undefined);
});
