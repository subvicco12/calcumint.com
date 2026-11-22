import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {lstatSync,realpathSync} from 'node:fs';
import {resolve} from 'node:path';
import {proveSourceStage9,assertSourceStage9Stable} from '../four-worker-integration-20261115/source-stage9.mjs';
import {immutableTreeQueryReader} from '../milestone100-20261114/source-immutable-queries.mjs';
import {proveSourceStage8AndHistoricalInputs,sourceStage8HistoricalView} from '../milestone100-20261114/source-stage8.mjs';
import {sourceStage8Policy,sourceStage8CapturePath} from '../milestone100-20261114/source-stage8-policy-v3.mjs';

export const capturePath='tests/nine-path-source-repair-20261122/proposal.json';
const captureSHA256='c6c991d4ba4829fd8a70d41097695ec2b727e1d3923da290df67ce770c798c82';
let nativeAuthorityScope;
export function nativeNinePathAuthorityInput(read,git){
 if(!nativeAuthorityScope)return undefined;
 const {actual,historicalHead,projectedRead,verifiedTransports}=nativeAuthorityScope;
 const view=sourceStage8HistoricalView(git);
 if(view){
  assert.equal(read,view.historicalInput.read,'Historical authority reader differs');
  assert.equal(view.actualInput.root,actual.root,'Native authority root differs');
  assert.equal(view.actualInput.read,projectedRead,'Native authority projection differs');
  assert.equal(text(view.actualInput.git,headQuery),historicalHead,'Historical context differs from the verified scope');
  verifiedTransports.add(view.actualInput.git);
 }else if(read!==projectedRead||!verifiedTransports.has(git))return undefined;
 return actual;
}
const headQuery=['rev-parse','--verify','HEAD^{commit}'];
const statusQuery=['status','--porcelain','--untracked-files=all','--','src'];
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const sameArgs=(left,right)=>left.length===right.length&&left.every((arg,i)=>arg===right[i]);
const text=(git,args)=>git(args).toString().trim();

function verifyRecord(git,path,{ref,blob,bytes,sha256}){
 assert.equal(text(git,['rev-parse',ref+':'+path]),blob,'Immutable path differs: '+path);
 const data=git(['cat-file','blob',blob]);
 assert(Buffer.isBuffer(data)&&data.length===bytes&&sha(data)===sha256,'Immutable bytes differ: '+path);
 return data;
}

// Review-only successors. Original declaration rows and historical objects remain literal.
const historicalGuardRef='887b70cecdc61de50d780ba58520a568365f9f62';
const guardTransitions=Object.freeze([
 Object.freeze({
  path:'tests/parallel-source-20261110/core.mjs',
  previous:Object.freeze({ref:historicalGuardRef,blob:'4d985c3b727f1a96a72f9ba9e8dc2084de5e9180',bytes:52073,sha256:'c829cf8cddc3aa31206ed117d040992d65714528360ac15f6ef6631c081d7b22'}),
  current:Object.freeze({ref:'149700e6a45fb82e2c0531b4ac16c591da7276bf',blob:'57743a58de8af330542b54b6f0bb345a0d04cebf',bytes:52696,sha256:'106561a5e6d48c9c1be7556be351ac13b6adc4c7b62da0ea7b4fbe29e20185d2'}),
 }),
 Object.freeze({
  path:'tests/milestone100-20261114/source-stage8-guard-selection.mjs',
  previous:Object.freeze({ref:historicalGuardRef,blob:'6210d33b3adf1625795cad887cfb081e9406cec7',bytes:4050,sha256:'ccf3924b1cbb4a0295d394164cbeca4377ad679b5cc925adabf6cdce4cd952d3'}),
  current:Object.freeze({ref:'a9f4ce179f72a45a9c315e404b66b39d35e9b245',blob:'6a2596d0ffe97c97c2b8c66e2380d6134278a69f',bytes:4221,sha256:'0f7803d37dfe19feae9397a97cbffb1af1249e042a82f818d91d99734db2259f'}),
 }),
 Object.freeze({
  path:'tests/parallel-source-20261110/baseline-probe.mjs',
  previous:Object.freeze({ref:'f4fa576cb070a31a3408f46c267c13b1e7b1f4eb',blob:'5aa7324b1bef1c902c3b2c2b878a1da5bac58527',bytes:2562,sha256:'a172e54eb4ded89123ccaff6123e0621d7314429a9b81ddea1863fd337100479'}),
  current:Object.freeze({ref:'89590fffd72ed94000343a6f81380e82b7c0c506',blob:'859347d677bed99d2982a083cdea210df9a24490',bytes:2566,sha256:'33b036c1c4afe418237b78724dc123a7ff8c9abc9d9c68340a32297e7916d47d'}),
 }),
]);
const a7BatchDependency=Object.freeze({
 path:'tests/parallel-source-20261110/a7-batch-input.mjs',
 current:Object.freeze({ref:'89590fffd72ed94000343a6f81380e82b7c0c506',blob:'48c46baf527c28b37b6f2961a7d0c4e66c8ba889',bytes:933,sha256:'ca8667a300dc71c7d07f32b5a838d45fe7043a80eeeaedb70ade66bd86cb6175'}),
});

function verifyReviewedGuards({git,read,head,root}){
 assert.equal(text(git,headQuery),head,'Native HEAD moved before reviewed guard verification');
 for(const {path,previous,current} of [...guardTransitions,a7BatchDependency]){
  if(previous)verifyRecord(git,path,previous);
  const bytes=verifyRecord(git,path,current);
  assert.equal(text(git,['rev-parse',head+':'+path]),current.blob,'Unexpected reviewed guard path: '+path);
  const file=resolve(root,path);
  assert(lstatSync(file).isFile()&&realpathSync(file)===file,'Regular reviewed guard required: '+path);
  assert(bytes.equals(read(path)),'Current reviewed guard bytes differ: '+path);
 }
 assert.equal(text(git,headQuery),head,'Native HEAD moved during reviewed guard verification');
}

export function reviewedNinePathGuardSuccessor(record){
 if(!nativeAuthorityScope?.reviewGuards||!record)return undefined;
 const transition=guardTransitions.find(({path})=>path===record.path);
 if(!transition)return undefined;
 const {path,previous,current}=transition;
 for(const key of ['blob','sha256'])assert.equal(record[key],previous[key],'Historical reviewed guard declaration differs: '+path);
 if(Object.hasOwn(record,'ref')){
  assert.equal(record.ref,previous.ref,'Historical guard ref differs');
  assert.equal(record.bytes,previous.bytes,'Historical guard byte count differs');
 }
 return Object.freeze({path,...current});
}

function verifyLive({git,read,root}){
 const capture=read(capturePath);
 assert(Buffer.isBuffer(capture)&&sha(capture)===captureSHA256,'Approved proposal digest differs');
 const proposal=JSON.parse(capture);
 assert.equal(proposal.state,'PROPOSAL_ONLY_NOT_ADMITTED');
 for(const [ref,tree] of Object.entries(proposal.immutableTrees)){
  const commit=git(['cat-file','commit',ref]);
  assert.equal(createHash('sha1').update(`commit ${commit.length}\0`).update(commit).digest('hex'),ref,'Immutable commit differs');
  assert.equal(commit.toString().split('\n',1)[0],'tree '+tree,'Immutable tree differs');
  assert.equal(text(git,['rev-parse',ref+'^{tree}']),tree,'Immutable tree binding differs');
 }
 const head=text(git,headQuery);
 assert.equal(text(git,['rev-parse',head+':src']),text(git,['rev-parse',proposal.candidate+':src']),'Unreviewed current src tree');
 assert.equal(git(statusQuery).length,0,'Clean current src required');
 const paths=proposal.sourcePaths.map(row=>row.path);
 assert.equal(paths.length,9);
 assert.deepEqual(git(['diff','--name-only','-z',proposal.stage9,proposal.candidate,'--','src']).toString().split('\0').filter(Boolean),paths,'Exact nine-path delta required');
 const original=new Map(),admin=[];
 for(const row of proposal.sourcePaths){
  const {path,before,after,factoryPin}=row;
  const actual=verifyRecord(git,path,after);
  assert.equal(text(git,['rev-parse',head+':'+path]),after.blob,'Current path binding differs');
  const local=resolve(root,path);
  assert(lstatSync(local).isFile()&&realpathSync(local)===local,'Regular current source required: '+path);
  assert(actual.equals(read(path)),'Current bytes differ: '+path);
  if(before){
   const prior=verifyRecord(git,path,before);
   assert(prior.equals(verifyRecord(git,path,factoryPin)),'Historical factory pin differs: '+path);
   admin.push(path); original.set(path,prior);
  }else{
   assert.equal(git(['ls-tree','-z',proposal.stage9,'--',path]).length,0,'Added path exists in Stage9');
   original.set(path,null);
  }
 }
 assert.deepEqual(admin,['src/app/admin/calculator-factory/page.test.tsx','src/app/admin/calculator-factory/page.tsx']);
 for(const record of proposal.protectedRecords){
  const bytes=verifyRecord(git,record.path,record);
  assert.equal(text(git,['rev-parse',head+':'+record.path]),record.blob,'Protected path binding differs');
  assert(bytes.equals(read(record.path)),'Protected live bytes differ: '+record.path);
 }
 assert.equal(text(git,headQuery),head,'Native HEAD moved during nine-path verification');
 return {proposal,head,original};
}

/** Review entry only. Historical projections exist only after verification and stay private. */
function withHistoricalStage9Input(input,verify,{reviewGuards=false}={}){
 const root=realpathSync(input.root);
 const actual={git:input.git,read:input.read,root};
 const {proposal,head,original}=verifyLive(actual);
 if(reviewGuards)verifyReviewedGuards({...actual,head});
 const read=path=>{
  if(!original.has(path))return actual.read(path);
  const bytes=original.get(path);
  assert(bytes,'Added source has no historical bytes: '+path);
  return Buffer.from(bytes);
 };
 const git=(args,options)=>{
  if(sameArgs(args,headQuery))return Buffer.from(proposal.stage9+'\n');
  if(sameArgs(args,statusQuery)){
   assert.equal(actual.git(statusQuery).length,0,'Clean current src required');
   return Buffer.alloc(0);
  }
  return actual.git(args.map(arg=>arg.startsWith('HEAD:src/')?proposal.stage9+arg.slice(4):arg),options);
 };
 const historicalGit=immutableTreeQueryReader(git);
 assert.equal(nativeAuthorityScope,undefined,'Nested nine-path authority scope refused');
 nativeAuthorityScope={actual:Object.freeze({...actual,head}),historicalHead:proposal.stage9,reviewGuards,projectedRead:read,verifiedTransports:new WeakSet([historicalGit])};
 let result;
 try{result=verify({git:historicalGit,read,root});}
 finally{
  nativeAuthorityScope=undefined;
  if(reviewGuards)verifyReviewedGuards({...actual,head});
 }

 assert.equal(verifyLive(actual).head,head,'Native HEAD moved since entry');
 return {result,head,paths:proposal.sourcePaths.map(row=>row.path)};
}

export function proveNinePathSuccessor(input){
 const {head,paths,result}=withHistoricalStage9Input(input,historical=>{
  const stage9=proveSourceStage9(historical);
  const stage8=proveSourceStage8AndHistoricalInputs({...stage9.historicalInput,policy:sourceStage8Policy,capturePath:sourceStage8CapturePath});
  assertSourceStage9Stable(stage9);
  return {historicalCount:stage9.live.size,stage8Verified:!!stage8};
 });
 return Object.freeze({nativeHead:head,approvedPaths:paths,...result});
}

/** Run the original retained core, including its unchanged negative filters and final fence. */
export async function verifyNinePathRetainedCore(input){
 const {verifyParallelSource}=await import('../parallel-source-20261110/core.mjs');
 const {withReviewedNinePathAuthority}=await import('../parallel-source-20261110/authority.mjs');
 return withHistoricalStage9Input(input,({read,git})=>
  withReviewedNinePathAuthority(read,git,()=>verifyParallelSource(read,git)),{reviewGuards:true}).result;
}

export function verifyNinePathLiveHead(input){
 return verifyLive({...input,root:realpathSync(input.root)}).head;
}

/** Verify the finite extra membership against immutable source before projecting it away. */
export function reconcileBatch14Membership(input,currentFiles,rawHistorical){
 const actual={...input,root:realpathSync(input.root)};
 const {proposal,head}=verifyLive(actual);
 const {batch14}=proposal;
 const artifact=proposal.protectedRecords.find(row=>row.ref===batch14.historicalCommit&&row.path===batch14.artifact);
 const bytes=verifyRecord(input.git,batch14.artifact,artifact);
 assert(bytes.equals(rawHistorical)&&bytes.equals(input.read(batch14.artifact)),'Historical Batch14 artifact differs');
 const historical=JSON.parse(bytes).implementationSourceSnapshot.files;
 assert.equal(historical.length,batch14.historicalCount);
 const currentPaths=currentFiles.map(row=>row.path);
 const previous=[...historical.map(row=>row.path),batch14.supplemental].sort();
 assert.equal(previous.length,batch14.pinnedCurrentCount);
 assert.equal(currentPaths.length,batch14.candidateCount);
 assert.deepEqual(currentPaths,[...previous,...batch14.additions].sort(),'Exact Batch14 current membership differs');
 for(const path of batch14.additions){
  const pin=proposal.sourcePaths.find(row=>row.path===path).after;
  assert.equal(currentFiles.find(row=>row.path===path).sha256,pin.sha256,'Batch14 engine digest differs: '+path);
 }
 assert.equal(verifyLive(actual).head,head,'Native HEAD moved since Batch14 entry');
 return currentFiles.filter(row=>!batch14.additions.includes(row.path));
}
