import {resolve} from 'node:path';
import {realpathSync} from 'node:fs';
import {sourceStage8Policy as pinnedPolicy,sourceStage8CapturePath as pinnedCapturePath} from './source-stage8-policy-v3.mjs';
import {sourceStage9HistoricalView,proveSourceStage9,assertSourceStage9Stable} from '../four-worker-integration-20261115/source-stage9.mjs';
import {createAuthorityObservationCollector} from './authority-observation-collector.mjs';
import {immutableTreeQueryReader} from './source-immutable-queries.mjs';
/** Unarmed additive source proof; immutable policy must be independently admitted. */
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {verifyExactStage} from '../calculator-factory-source-20261112/exact-stage.mjs';
const historicalViews=new WeakMap(),observedHeads=new WeakMap(),incrementalViews=new WeakMap(),policyBindings=new WeakMap();
export const sourceStage8HistoricalView=git=>historicalViews.get(git);
export const predecessorRef='eac9a6c23ae4d8f1abb607e32f57ce0d422a3cb8';
export function proveSourceStage8AndHistoricalInputs(input){return proveStage8(input);}
/** Fixed synchronous canonical composition: Stage9 closes immediately before this private builder. */
export function provePinnedCurrentStage8(input){
 const current={read:input.read,git:input.git,root:input.root};
 const fresh=proveSourceStage9(current);
 return proveStage8({...fresh.historicalInput,policy:pinnedPolicy,capturePath:pinnedCapturePath},fresh);
}
function proveStage8({read,git,root,policy,capturePath},fresh) {
 assert.equal(policy.predecessorRef,predecessorRef,'Stage8 exact predecessor required');
 assert.equal(typeof read,'function');assert.equal(typeof git,'function');
 const incremental=sourceStage9HistoricalView(git);
 if(incremental){assert.equal(read,incremental.historicalInput.read,'Stage9 reader differs');assert.equal(root,incremental.historicalInput.root,'Stage9 root differs');if(incremental!==fresh)assertSourceStage9Stable(incremental);}
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
 const nativeHead=incremental?.nativeHead??actualHead;
 const historicalRows=new Map([...live].map(([path,row])=>[path,Object.freeze({predecessor:row.predecessor?Object.freeze({...row.predecessor}):null,current:Object.freeze({...row.current})})]));
 const historicalRead=path=>{
  const row=historicalRows.get(path);if(!row)return read(path);
  assert(row.predecessor,'Added Stage8 source has no historical bytes: '+path);
  return git(['cat-file','blob',row.predecessor.blob]);
 };
 const historicalGit=(args,options)=>{
  if(args.length===2&&['rev-parse','show'].includes(args[0])&&args[1].startsWith('HEAD:')&&!args[1].startsWith('HEAD:src/'))return git([args[0],nativeHead+args[1].slice(4)],options);
  if(args.length===3&&args[0]==='rev-parse'&&args[1]==='--verify'&&args[2]==='HEAD^{commit}')return Buffer.from(predecessorRef+'\n');
  // ExactStage already required a fully committed, clean SRC tree. No arbitrary dirty
  // state is hidden; old proofs observe the independently proved predecessor view.
  if(JSON.stringify(args)===JSON.stringify(['status','--porcelain','--untracked-files=all','--','src']))return Buffer.alloc(0);
  return git(args.map(arg=>arg==='HEAD'?predecessorRef:arg.startsWith('HEAD:src/')?predecessorRef+arg.slice(4):arg),options);
 };
 for(const name of ['preloadCommits','preloadBlobs','preloadPaths'])if(typeof git[name]==='function')historicalGit[name]=values=>git[name](values);
 const view=Object.freeze({get live(){return new Map(historicalRows);},actualInput:incremental?.actualInput??Object.freeze({read,git,root}),historicalInput:Object.freeze({read:historicalRead,git:historicalGit,root}),stage9Active:!!incremental,get stage9Live(){return incremental?.live??new Map();},get stage10Live(){return incremental?.stage10Live??new Map();}});
 if(incremental)assertSourceStage9Stable(incremental);
 historicalViews.set(historicalGit,view);observedHeads.set(view,nativeHead);if(incremental)incrementalViews.set(view,incremental);policyBindings.set(view,Object.freeze({policy,capturePath}));
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
 if(view.stage9Active){
  const incremental=incrementalViews.get(view);
  if(incremental){assertSourceStage9Stable(incremental);assert.equal(incremental.nativeHead,current,'Native HEAD moved during Stage9 end proof');}
  else {
   // Observation aliases deliberately have no private predecessor association:
   // their closing proof must record operations through the observed providers.
   const fresh=proveSourceStage9(view.actualInput);assert.equal(fresh.nativeHead,current,'Native HEAD moved during Stage9 end proof');
  }
 }
}

/** Observation aliases only. Every operation still invokes the original supplied provider. */
export function createSourceStage8ObservationInput(input){
 const original=historicalViews.get(input.git);assert(original,'Only a registered Stage8 historical input may be observed');
 assert.equal(input.read,original.historicalInput.read,'Historical Stage8 reader capability differs');assert.equal(input.root,original.historicalInput.root,'Historical Stage8 root differs');
 const collector=createAuthorityObservationCollector();
 const actualInput=Object.freeze({read:collector.wrapRead(original.actualInput.read,'actual'),git:collector.wrapGit(original.actualInput.git,'actual'),root:original.actualInput.root});
 const historicalInput=Object.freeze({read:collector.wrapRead(original.historicalInput.read,'historical'),git:collector.wrapGit(original.historicalInput.git,'historical'),root:original.historicalInput.root});
 collector.bindReceiver(actualInput,original.actualInput);collector.bindReceiver(historicalInput,original.historicalInput);
 const observed=Object.freeze({get live(){return original.live;},actualInput,historicalInput,stage9Active:original.stage9Active,get stage9Live(){return original.stage9Live;},get stage10Live(){return original.stage10Live;}});
 // Reactivation must observe actual source24 reads/queries, never unwrap unrecorded originals.
 historicalViews.set(historicalInput.git,observed);assert(observedHeads.has(original));observedHeads.set(observed,observedHeads.get(original));
 return Object.freeze({input:historicalInput,actualInput,collector});
}

/** Refresh only canonical private projection facts; every mutable source check runs again. */
export function refreshPrivatePinnedStage8(input){
 const view=historicalViews.get(input.git),binding=view&&policyBindings.get(view);
 if(!view||!incrementalViews.has(view)||binding?.policy!==pinnedPolicy||binding.capturePath!==pinnedCapturePath)return undefined;
 assert.equal(input.read,view.historicalInput.read,'Historical Stage8 reader capability differs');assert.equal(resolve(input.root),resolve(view.historicalInput.root),'Historical Stage8 root differs');
 assert.equal(realpathSync(process.cwd()),resolve(view.actualInput.root),'Actual workspace root required');
 const current=view.actualInput.git(['rev-parse','--verify','HEAD^{commit}']).toString().trim();
 // A new metadata HEAD must take the original complete fresh construction path.
 if(current!==observedHeads.get(view))return undefined;
 assertSourceStage8HeadStable(view);
 assert.equal(realpathSync(process.cwd()),resolve(view.actualInput.root),'Actual workspace root required');
 return view;
}
