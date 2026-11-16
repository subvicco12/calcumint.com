import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {apiRuntimeAnchor,assertApiRuntimeAnchorRow,proveApiRuntimeSourceSuccessor,assertApiRuntimeHistoricalObjectJoin} from './source-stage8-api-runtime-anchor.mjs';
import {sourceGit} from '../parallel-source-20261110/baseline-runtime.mjs';
import {accepted} from '../parallel-source-20261110/authority.mjs';
import {provePinnedSourceStage8,sourceStage8CapturePath,sourceStage8Policy} from './source-stage8-activation.mjs';
const objectJoin=patch=>assertApiRuntimeHistoricalObjectJoin({file:apiRuntimeAnchor.fixed.path,recordedSHA256:'1efda4fdcfeb758603e9d2c546a243c3f2684a421d4c071a77624c98677c3313',row:{predecessor:apiRuntimeAnchor.predecessor,current:apiRuntimeAnchor.current},currentBytes:readFileSync(apiRuntimeAnchor.fixed.path),git:sourceGit,...patch});
const root=process.cwd(),input={fixed:apiRuntimeAnchor.fixed,read:readFileSync,git:sourceGit,root},helper='tests/milestone100-20261114/source-stage8-api-runtime-anchor.mjs';
test('one exact API test successor proves before retaining the literal fixed runtime anchor',()=>{
 objectJoin();assert.equal(proveApiRuntimeSourceSuccessor(input),true);
 const proof=provePinnedSourceStage8(input);assert.equal(proveApiRuntimeSourceSuccessor({...proof.historicalInput,fixed:apiRuntimeAnchor.fixed}),true);
});
test('unknown anchors and caller-nominated source rows refuse without accessing Git',()=>{
 const git=()=>{throw Error('Unknown must not access Git');};
 assert.throws(()=>objectJoin({git,file:'src/lib/unknown.test.ts'}),/exact API test historical claim/);assert.throws(()=>objectJoin({git,recordedSHA256:'0'.repeat(64)}),/original API source claim/);
 assert.throws(()=>proveApiRuntimeSourceSuccessor({...input,git,fixed:{...apiRuntimeAnchor.fixed,path:'src/lib/unknown.test.ts'}}),/literal fixed API test anchor/);
 assert.throws(()=>proveApiRuntimeSourceSuccessor({...input,git,row:{predecessor:null,current:apiRuntimeAnchor.current}}),/Caller-nominated/);
});
test('every predecessor and current tuple field remains independently exact',()=>{
 assertApiRuntimeAnchorRow({predecessor:apiRuntimeAnchor.predecessor,current:apiRuntimeAnchor.current});
 for(const side of ['predecessor','current'])for(const [key,value]of [['path','src/unknown.ts'],['ref','0'.repeat(40)],['blob','1'.repeat(40)],['bytes',1],['sha256','0'.repeat(64)]]){
  const row=structuredClone({predecessor:apiRuntimeAnchor.predecessor,current:apiRuntimeAnchor.current});row[side][key]=value;assert.throws(()=>assertApiRuntimeAnchorRow(row));assert.throws(()=>objectJoin({row}));
 }
});
test('changed current API source and retained-valid reversion refuse',()=>{
 for(const bytes of [Buffer.from('tamper'),sourceGit(['cat-file','blob',apiRuntimeAnchor.predecessor.blob])]){assert.throws(()=>proveApiRuntimeSourceSuccessor({...input,read:path=>path===apiRuntimeAnchor.fixed.path?bytes:readFileSync(path)}));assert.throws(()=>objectJoin({currentBytes:bytes}));}
});
test('closed readers cannot omit the independently pinned helper or source proof and Git cannot be fabricated',()=>{
 const names=new Set([...accepted.map(row=>row.path),...sourceStage8Policy.paths,sourceStage8CapturePath]);const target=new Map([...names].map(path=>[path,readFileSync(path)]));
 for(const omitted of [helper,sourceStage8CapturePath])assert.throws(()=>proveApiRuntimeSourceSuccessor({...input,read:path=>{assert(target.has(path)&&path!==omitted,'Missing closed dependency '+path);return target.get(path);}}),/Missing closed dependency/);
 assert.throws(()=>proveApiRuntimeSourceSuccessor({...input,git:()=>{throw Error('Missing source Git');}}),/Missing source Git/);assert.throws(()=>objectJoin({git:()=>{throw Error('Missing immutable API relation');}}),/Missing immutable API relation/);
 assert.throws(()=>objectJoin({git:(args,options)=>args[0]==='rev-parse'&&args[1]==='f042748d08caa4f51c19b7cf6fc675a3a1fb5dd5:'+apiRuntimeAnchor.fixed.path?Buffer.from('0'.repeat(40)):sourceGit(args,options)}));
 assert.throws(()=>proveApiRuntimeSourceSuccessor({...input,git:()=>Buffer.from('0'.repeat(40))}));
});
test('raw actual HEAD movement refuses for direct and historical reader capabilities',()=>{
 const current=sourceGit(['rev-parse','--verify','HEAD^{commit}']).toString().trim();assert.notEqual(current,sourceStage8Policy.codeRef,'A metadata successor is required for the movement fixture');
 for(const historical of [false,true]){
  let head=current,armed=false;
  const git=(args,options)=>JSON.stringify(args)===JSON.stringify(['rev-parse','--verify','HEAD^{commit}'])?Buffer.from(head+'\n'):sourceGit(args,options);
  const read=path=>{if(armed&&path===helper)head=sourceStage8Policy.codeRef;return readFileSync(path);};
  const supplied={read,git,root},boundary=historical?provePinnedSourceStage8(supplied).historicalInput:supplied;armed=true;
  assert.throws(()=>proveApiRuntimeSourceSuccessor({...boundary,fixed:apiRuntimeAnchor.fixed}),/HEAD moved|HEAD changed/);
 }
});

const current32CapturePath='docs/next-engineering-20261115/source/stage10-current32.json';
const {predecessor:current32Predecessor,current:current32Current}=JSON.parse(readFileSync(current32CapturePath)).rows.find(row=>row.path===apiRuntimeAnchor.fixed.path),current32Row={predecessor:current32Predecessor,current:current32Current};
test('the named current32 API object join admits only its exact independently captured tuple',()=>{
 objectJoin({row:current32Row});
 for(const side of ['predecessor','current'])for(const[key,value]of [['path','src/unknown.ts'],['ref','0'.repeat(40)],['blob','1'.repeat(40)],['bytes',1],['sha256','0'.repeat(64)]]){
  const row=structuredClone(current32Row);row[side][key]=value;let called=false;
  assert.throws(()=>objectJoin({row,git:()=>{called=true;throw Error('Unexpected Git before exact tuple validation');}}));assert.equal(called,false);
 }
 assert.throws(()=>objectJoin({currentBytes:sourceGit(['cat-file','blob',apiRuntimeAnchor.current.blob])}),/Current exact API test source bytes differ/);
});
test('the named current32 API capture and immutable successor cannot be substituted',()=>{
 const captureBlob='41dcb7e6d85c84b78a9e0d5086a802c2e96b06bd';
 for(const query of [args=>args[0]==='cat-file'&&args[1]==='blob'&&args[2]===captureBlob,args=>args[0]==='cat-file'&&args[1]==='blob'&&args[2]===current32Row.current.blob,args=>args[0]==='rev-parse'&&args[1]==='baf80e18e0fb7a6a961006ee6fea507539363756:'+current32CapturePath]){
  let observed=false;const git=(args,options)=>{if(query(args)){observed=true;return Buffer.from('substituted independently pinned API bytes');}return sourceGit(args,options);};
  assert.throws(()=>objectJoin({row:current32Row,git}));assert.equal(observed,true,'The exact admitted immutable dependency must be observed');
 }
});
test('the named current32 API object join refuses a HEAD move during immutable capture authentication',()=>{
 const before=sourceGit(['rev-parse','--verify','HEAD^{commit}']).toString().trim();let head=before,observed=false;
 const git=(args,options)=>{if(JSON.stringify(args)===JSON.stringify(['rev-parse','--verify','HEAD^{commit}']))return Buffer.from(head+'\n');if(args[0]==='cat-file'&&args[1]==='blob'&&args[2]==='41dcb7e6d85c84b78a9e0d5086a802c2e96b06bd'){observed=true;head=sourceStage8Policy.codeRef;}return sourceGit(args,options);};
 assert.throws(()=>objectJoin({row:current32Row,git}),/Actual HEAD moved during fixed API historical object join/);assert.equal(observed,true);
});
