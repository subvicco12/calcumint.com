import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const source=readFileSync(new URL('../parallel-source-20261110/core.mjs',import.meta.url),'utf8');
const body=/function withCoreAuthorityWitness\(read,git,run\)\{([\s\S]*?)\n\}\nfunction applicationSuccession/.exec(source);assert(body,'Private Stage5 scope required');
const recordBody=/function sourceRecord\(record,read,git,stage5\)\{([\s\S]*?)\n\}\nfunction currentSourceRecord/.exec(source);assert(recordBody);
const hash=value=>createHash('sha256').update(value).digest('hex');
function fixture(){
 const bytes=Buffer.from('guard'),state={authority:true,head:'a'.repeat(40),status:'',calls:0,failAt:0,stable:true};
 const read=()=>bytes,actual={read,git:args=>Buffer.from(args[0]==='status'?state.status:state.head)},git=()=>{},view={historicalInput:{read},actualInput:actual};
 const paths=['tests/milestone100-20261114/source-stage8.mjs','tests/milestone100-20261114/source-stage8-authority-scope.mjs','tests/milestone100-20261114/authority-observation-collector.mjs'];
 const path='src/example.ts',row={predecessor:null,current:{path:'src/example.ts',ref:'b'.repeat(40),sha256:'c'.repeat(64)}};
 const proof=()=>{state.calls++;if(state.calls===state.failAt)throw Error('fresh proof refused');return new Map([[path,structuredClone(row)]]);};
 const run=new Function('assert','sourceStage8HistoricalView','accepted','hash','verifyParallelAuthority','proveStage5','assertSourceStage8HeadStable','compileStage8GuardScope','finishStage8GuardScope','clearStage8GuardScope','return function(read,git,run){'+body[1]+'\n}')(assert,()=>view,paths.map(path=>({path,sha256:hash(bytes)})),hash,()=>state.authority,proof,()=>assert(state.stable,'fresh actual HEAD moved'),()=>{},()=>{},()=>{});
 return{state,row,path,view,read,git,run:callback=>run(read,git,callback)};
}
test('private invocation proves authority and Stage5 before callback then proves Stage5 afresh',()=>{const f=fixture();let saved;assert.equal(f.run((w,map)=>{assert.equal(w,undefined);assert.equal(f.state.calls,1);saved=map;return 3;}),3);assert.equal(f.state.calls,2);assert.equal(saved.size,0);assert(!source.includes('export function withCoreAuthorityWitness'));});
test('failed authority or beginning proof never runs callback',()=>{for(const authority of [false,true]){const f=fixture();f.state.authority=authority;f.state.failAt=1;let ran=false;assert.throws(()=>f.run(()=>{ran=true;}));assert.equal(ran,false);}});
test('private rows are independent frozen copies',()=>{const f=fixture();f.run((_,map)=>{const row=map.get(f.path);assert(Object.isFrozen(row)&&Object.isFrozen(row.current));assert.throws(()=>{row.current.ref='changed';},TypeError);f.row.current.ref='changed';assert.notEqual(row.current.ref,f.row.current.ref);f.row.current.ref='b'.repeat(40);});});
test('callback errors still execute fresh ending proof and expire map',()=>{const f=fixture();let saved;assert.throws(()=>f.run((_,map)=>{saved=map;throw Error('callback refused');}),/callback refused/);assert.equal(f.state.calls,2);assert.equal(saved.size,0);});
test('thenable callbacks are refused with ending proof and expiry',()=>{const f=fixture();let saved;assert.throws(()=>f.run((_,map)=>{saved=map;return{then(){}};}),/Synchronous/);assert.equal(f.state.calls,2);assert.equal(saved.size,0);const escaped=fixture();assert.throws(()=>escaped.run((_,map)=>map),/cannot escape/);});
test('fresh ending proof failure cannot produce a successful return',()=>{const f=fixture();f.state.failAt=2;let saved;assert.throws(()=>f.run((_,map)=>{saved=map;return true;}),/fresh proof refused/);assert.equal(saved.size,0);});
test('HEAD and source status movement are rejected independently',()=>{for(const field of ['head','status']){const f=fixture();assert.throws(()=>f.run(()=>{f.state[field]='changed';return true;}),/HEAD moved|status changed/);}});
test('registered reader and actual endpoint identity remain mandatory',()=>{for(const field of ['historicalInput','actualInput']){const f=fixture();assert.throws(()=>f.run(()=>{f.view[field]={...f.view[field],read:()=>Buffer.from('substitute')};}),/identity differs/);}});
test('each scoped source selection preserves immutable old and fresh current checks',()=>{const path='src/example.ts',events=[],read=()=>{},git=()=>{},map=new Map([[path,{predecessor:null,current:{path,ref:'new'}}]]);let proofs=0;const run=new Function('stage5Paths','proveStage5','assert','immutableRecord','currentSourceRecord','return function(record,read,git,stage5){'+recordBody[1]+'\n}')(new Set([path]),()=>{proofs++;return map;},assert,row=>events.push(['old',row.ref]),row=>events.push(['fresh',row.ref]));run({path,ref:'old'},read,git,map);run({path,ref:'old'},read,git,map);assert.equal(proofs,0);assert.deepEqual(events,[['old','old'],['fresh','new'],['old','old'],['fresh','new']]);run({path,ref:'old'},read,git);assert.equal(proofs,1);assert.throws(()=>run({path,ref:'old'},read,git,new Map()));});
