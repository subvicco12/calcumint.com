import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {provePinnedSourceStage8} from '../milestone100-20261114/source-stage8-activation.mjs';
import {rejectChangedInteractiveSource} from './source-interactive-negative.mjs';import {verifyCurrentRuntimeContext} from '../next-cohort-20261110/source/retained-runtime.mjs';import {proveNamedCurrentContext} from '../parallel-source-20261110/core.mjs';import {sourceGit} from '../parallel-source-20261110/baseline-runtime.mjs';import {completionGitReader} from '../parallel-source-20261110/git-reader.mjs';
const path='src/components/calculator-interactive.tsx',capturePath='docs/parallel-source-20261110/capture-revision68.json';
test('one independently pinned current tuple refuses original valid F042 bytes with the exact public runtime diagnostic',()=>{
 assert.equal(rejectChangedInteractiveSource(readFileSync),undefined);const old=sourceGit(['show','f042748d08caa4f51c19b7cf6fc675a3a1fb5dd5:'+path]);assert(!old.equals(readFileSync(path)));const read=file=>file===path?old:readFileSync(file);
 assert.throws(()=>rejectChangedInteractiveSource(read),error=>error.message==='Current target source differs: '+path);
 assert.throws(()=>verifyCurrentRuntimeContext(read),error=>error.message==='Retained evidence current context target differs: src/app/api/business/technology-embeds/route.ts'&&error.cause?.message==='Current target source differs: '+path);
});
test('capture authentication precedes parsing and opaque transports retain Git-first proof ordering',()=>{
 assert.throws(()=>rejectChangedInteractiveSource(file=>{assert.equal(file,capturePath);return Buffer.from('malformed');}),/Independent current target bytes differ/);
 let reads=0;assert.throws(()=>proveNamedCurrentContext(()=>{reads++;throw Error('Unexpected opaque read');},()=>{throw Error('Original opaque full proof');}),/Original opaque full proof/);assert.equal(reads,0);
 let queries=0;const git=completionGitReader(()=>{queries++;throw Error('Complete positive source proof');});assert.throws(()=>proveNamedCurrentContext(readFileSync,git),/Complete positive source proof/);assert(queries>0);
});
test('a bound view does not gain an early interactive callback that can conceal a changed HEAD',()=>{
 let changed=false,interactiveReads=0;const git=args=>changed&&JSON.stringify(args)===JSON.stringify(['rev-parse','--verify','HEAD^{commit}'])?Buffer.from('0'.repeat(40)+'\n'):sourceGit(args);
 const read=file=>{if(changed&&file===path){interactiveReads++;changed=false;}return readFileSync(file);},proof=provePinnedSourceStage8({root:process.cwd(),read,git});changed=true;
 assert.throws(()=>proveNamedCurrentContext(proof.historicalInput.read,proof.historicalInput.git),/Native HEAD moved|supplied HEAD differs/);assert.equal(interactiveReads,0);assert.equal(changed,true);
});
