import {immutableTreeQueryReader} from './source-immutable-queries.mjs';
/** Unarmed additive source proof; immutable policy must be independently admitted. */
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {verifyExactStage} from '../calculator-factory-source-20261112/exact-stage.mjs';
const historicalViews=new WeakMap(),observedHeads=new WeakMap();
export const sourceStage8HistoricalView=git=>historicalViews.get(git);
export const predecessorRef='eac9a6c23ae4d8f1abb607e32f57ce0d422a3cb8';
export function proveSourceStage8AndHistoricalInputs({read,git,root,policy,capturePath}) {
 assert.equal(policy.predecessorRef,predecessorRef,'Stage8 exact predecessor required');
 assert.equal(typeof read,'function');assert.equal(typeof git,'function');
 git=immutableTreeQueryReader(git);
 const bytes=read(capturePath),capture=JSON.parse(bytes);
 assert.deepEqual(capture.ancestry,policy.ancestry,'Stage8 finite reviewed ancestry differs');
 assert.equal(createHash('sha256').update(bytes).digest('hex'),policy.captureSHA256,'Independent Stage8 capture digest differs');
 assert.deepEqual(capture.rows.map(row=>row.path),policy.paths,'Stage8 finite reviewed paths differ');
 if(typeof git.preloadCommits==='function')git.preloadCommits(policy.ancestry);
 const immutableRecords=capture.rows.flatMap(row=>[row.predecessor,row.current].filter(Boolean));
 if(typeof git.preloadPaths==='function')git.preloadPaths(immutableRecords.map(({ref,path,blob})=>({ref,path,blob})));
 if(typeof git.preloadBlobs==='function')git.preloadBlobs([...new Set(immutableRecords.map(row=>row.blob))]);
 // This authenticates the capture, exact source delta, every current byte and symlink state
 // before constructing any historical reader or invoking any retained proof.
 let actualHead;
 const observedGit=(args,options)=>{const result=git(args,options);if(JSON.stringify(args)===JSON.stringify(['rev-parse','--verify','HEAD^{commit}']))actualHead=result.toString().trim();return result;};
 for(const name of ['preloadCommits','preloadBlobs','preloadPaths'])if(typeof git[name]==='function')observedGit[name]=values=>git[name](values);
 const live=verifyExactStage({read,git:observedGit,root,policy,captureBytes:bytes});
 assert.match(actualHead,/^[a-f0-9]{40}$/,'Fresh actual HEAD observation required');
 const historicalRows=new Map([...live].map(([path,row])=>[path,Object.freeze({predecessor:row.predecessor?Object.freeze({...row.predecessor}):null,current:Object.freeze({...row.current})})]));
 const historicalRead=path=>{
  const row=historicalRows.get(path);if(!row)return read(path);
  assert(row.predecessor,'Added Stage8 source has no historical bytes: '+path);
  return git(['cat-file','blob',row.predecessor.blob]);
 };
 const historicalGit=(args,options)=>{
  if(args.length===2&&['rev-parse','show'].includes(args[0])&&args[1].startsWith('HEAD:')&&!args[1].startsWith('HEAD:src/'))return git([args[0],actualHead+args[1].slice(4)],options);
  if(args.length===3&&args[0]==='rev-parse'&&args[1]==='--verify'&&args[2]==='HEAD^{commit}')return Buffer.from(predecessorRef+'\n');
  // ExactStage already required a fully committed, clean SRC tree. No arbitrary dirty
  // state is hidden; old proofs observe the independently proved predecessor view.
  if(JSON.stringify(args)===JSON.stringify(['status','--porcelain','--untracked-files=all','--','src']))return Buffer.alloc(0);
  return git(args.map(arg=>arg==='HEAD'?predecessorRef:arg.startsWith('HEAD:src/')?predecessorRef+arg.slice(4):arg),options);
 };
 for(const name of ['preloadCommits','preloadBlobs','preloadPaths'])if(typeof git[name]==='function')historicalGit[name]=values=>git[name](values);
 const view=Object.freeze({live,actualInput:Object.freeze({read,git,root}),historicalInput:Object.freeze({read:historicalRead,git:historicalGit,root})});
 historicalViews.set(historicalGit,view);observedHeads.set(view,actualHead);
 return view;
}
export function proveCurrentStage8AndHistoricalInputs(input,retainedProver){
 assert.equal(typeof retainedProver,'function','Explicit supplied-transport retained prover required');
 const outer=proveSourceStage8AndHistoricalInputs(input);
 const retained=retainedProver(outer.historicalInput);
 assert(retained.actualCurrent instanceof Map,'Retained current map required');
 const result={...retained,stage8:outer.live,stage8Actual:new Map([...(retained.stage7Actual??retained.actualCurrent),...outer.live])};
 assertSourceStage8HeadStable(outer);return result;
}

/** Verify a fresh public proof did not straddle even a metadata-only HEAD move. */
export function assertSourceStage8HeadStable(view){
 assert(observedHeads.has(view),'Private fresh Stage8 view required');
 const current=view.actualInput.git(['rev-parse','--verify','HEAD^{commit}']).toString().trim();
 assert.equal(current,observedHeads.get(view),'Actual HEAD moved during public source proof');
}
