/** Synthetic ordering regressions only; not source or acceptance evidence. */
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const source=readFileSync(new URL('../parallel-source-20261110/core.mjs',import.meta.url),'utf8');
const body=source.slice(source.indexOf('function currentStage8Input('),source.indexOf('function completeStage8('));
function fixture(){
 const events=[],view=Object.freeze({live:true}),root='/synthetic-root',read=()=>{},git=()=>{};
 git.preloadCommits=()=>{};git.preloadBlobs=()=>{};
 const state={liveError:null,primeError:null};
 const run=new Function('readFileSync','provePinnedSourceStage8','primeRetainedImmutableAvailability','root',body+';return currentStage8Input;')(read,input=>{events.push(['live',input]);if(state.liveError)throw state.liveError;return view;},(r,g)=>{events.push(['prime',r,g]);if(state.primeError)throw state.primeError;},root);
 return {events,view,root,read,git,state,run};
}
test('live source verification precedes native immutable availability and its original view is returned',()=>{const f=fixture();assert.equal(f.run(f.read,f.git),f.view);assert.deepEqual(f.events.map(x=>x[0]),['live','prime']);assert.deepEqual(f.events[0][1],{read:f.read,git:f.git,root:f.root});assert.equal(f.events[1][1],f.read);assert.equal(f.events[1][2],f.git);});
test('failed live verification never invokes availability',()=>{const f=fixture(),error=Error('actual source refused');f.state.liveError=error;assert.throws(()=>f.run(f.read,f.git),e=>e===error);assert.deepEqual(f.events.map(x=>x[0]),['live']);});
test('a failed immutable transport propagates without a verdict and retries the full live proof',()=>{const f=fixture(),error=Error('immutable transport refused');f.state.primeError=error;assert.throws(()=>f.run(f.read,f.git),e=>e===error);f.state.primeError=null;assert.equal(f.run(f.read,f.git),f.view);assert.deepEqual(f.events.map(x=>x[0]),['live','prime','live','prime']);});
test('opaque supplied transports keep their original path without manufactured hooks',()=>{const f=fixture(),opaque=()=>{};assert.equal(f.run(f.read,opaque),f.view);assert.deepEqual(f.events.map(x=>x[0]),['live']);assert.deepEqual(Object.keys(opaque),[]);});
test('custom read callbacks preserve their original source-first supplied behavior',()=>{const f=fixture(),custom=()=>{};assert.equal(f.run(custom,f.git),f.view);assert.equal(f.events[0][1].read,custom);assert.deepEqual(f.events.map(x=>x[0]),['live']);});
test('warm immutable transport never caches a successful proof or metadata reads',()=>{const f=fixture();f.run(f.read,f.git);f.run(f.read,f.git);assert.deepEqual(f.events.map(x=>x[0]),['live','prime','live','prime']);f.state.liveError=Error('changed current source');assert.throws(()=>f.run(f.read,f.git),/changed current source/);assert.equal(f.events.at(-1)[0],'live');});
test('partial capabilities are neither completed nor substituted and providers remain distinct',()=>{const f=fixture();for(const name of ['preloadCommits','preloadBlobs']){const partial=()=>{};partial[name]=()=>{};f.events.length=0;f.run(f.read,partial);assert.deepEqual(f.events.map(x=>x[0]),['live']);assert.deepEqual(Object.keys(partial),[name]);}const second=()=>{};second.preloadCommits=()=>{};second.preloadBlobs=()=>{};f.events.length=0;f.run(f.read,f.git);f.run(f.read,second);assert.equal(f.events[1][2],f.git);assert.equal(f.events[3][2],second);});
