import {proveSourceStage10,assertSourceStage10Stable} from '../next-engineering-20261115/source-stage10.mjs';
import {resolve} from 'node:path';
import {sourceStage8Policy,sourceStage8CapturePath} from '../milestone100-20261114/source-stage8-policy-v3.mjs';
/** Incremental proof. No historical capability escapes before exact live verification. */
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {verifyExactStage} from '../calculator-factory-source-20261112/exact-stage.mjs';
import {immutableTreeQueryReader} from '../milestone100-20261114/source-immutable-queries.mjs';
import {sourceStage9Policy as policy,sourceStage9CapturePath as capturePath} from './source-stage9-policy.mjs';
const historical=new WeakMap(),proved=new WeakSet(),successors=new WeakMap();
export const sourceStage9HistoricalView=git=>historical.get(git);
const sha=b=>createHash('sha256').update(b).digest('hex');
function currentBytesFirst(input,bytes){const priorBytes=input.read(sourceStage8CapturePath);assert.equal(sha(priorBytes),sourceStage8Policy.captureSHA256,'Independent Stage8 capture digest differs');const prior=JSON.parse(priorBytes);assert.deepEqual(prior.rows.map(row=>row.path),sourceStage8Policy.paths);for(const row of new Map([...prior.rows,...JSON.parse(bytes).rows].map(row=>[row.path,row])).values()){const value=input.read(row.path);assert(Buffer.isBuffer(value)&&value.length===row.current.bytes&&sha(value)===row.current.sha256,'Current factory bytes differ: '+row.path);}}
function exact(input){const bytes=input.read(capturePath);assert.equal(sha(bytes),policy.captureSHA256,'Independent Stage9 capture digest differs');currentBytesFirst(input,bytes);return verifyExactStage({...input,policy,captureBytes:bytes});}
export function proveSourceStage9(input){
 assert.deepEqual(Object.keys(input).sort(),['git','read','root'],'Only explicit Stage9 read/Git/root inputs allowed');
 input={...input,root:resolve(input.root)};
 const prior=historical.get(input.git);
 if(prior){assert.equal(input.read,prior.historicalInput.read,'Stage9 historical reader differs');assert.equal(input.root,prior.historicalInput.root,'Stage9 root differs');input=prior.actualInput;}
 assert.equal(typeof input.read,'function');assert.equal(typeof input.git,'function');assert.equal(typeof input.root,'string');
 const successor=proveSourceStage10(input);
 const actual=Object.freeze({...successor.historicalInput,git:immutableTreeQueryReader(successor.historicalInput.git)});
 const captureBytes=actual.read(capturePath);assert.equal(sha(captureBytes),policy.captureSHA256,'Independent Stage9 capture digest differs');
 const capture=JSON.parse(captureBytes);assert.deepEqual(capture.ancestry,policy.ancestry);assert.equal(policy.paths.length,18);
 currentBytesFirst(actual,captureBytes);
 if(typeof actual.git.preloadCommits==='function')actual.git.preloadCommits(policy.ancestry);
 const records=capture.rows.flatMap(row=>[row.predecessor,row.current].filter(Boolean));
 if(typeof actual.git.preloadPaths==='function')actual.git.preloadPaths(records.map(({ref,path,blob})=>({ref,path,blob})));
 if(typeof actual.git.preloadBlobs==='function')actual.git.preloadBlobs([...new Set(records.map(row=>row.blob))]);
 const head=actual.git(['rev-parse','--verify','HEAD^{commit}']).toString().trim();assert.match(head,/^[a-f0-9]{40}$/);
 const live=exact(actual);
 assert.equal(actual.git(['rev-parse','--verify','HEAD^{commit}']).toString().trim(),head,'Native HEAD moved during Stage9 verification');
 for(const row of live.values()){if(row.predecessor)Object.freeze(row.predecessor);Object.freeze(row.current);Object.freeze(row);}
 const read=path=>{const row=live.get(path);if(!row)return actual.read(path);assert(row.predecessor,'Added Stage9 source has no historical bytes: '+path);return actual.git(['cat-file','blob',row.predecessor.blob]);};
 const git=(args,options)=>{
  if(args.length===3&&args[0]==='rev-parse'&&args[1]==='--verify'&&args[2]==='HEAD^{commit}')return Buffer.from(policy.predecessorRef+'\n');
  if(JSON.stringify(args)===JSON.stringify(['status','--porcelain','--untracked-files=all','--','src']))return Buffer.alloc(0);
  return actual.git(args.map(arg=>arg==='HEAD'?policy.predecessorRef:arg.startsWith('HEAD:src/')?policy.predecessorRef+arg.slice(4):arg.startsWith('HEAD:')?successor.nativeHead+arg.slice(4):arg),options);
 };
 for(const name of ['preloadCommits','preloadBlobs','preloadPaths'])if(typeof actual.git[name]==='function')git[name]=values=>actual.git[name](values);
 const historicalInput=Object.freeze({read,git,root:actual.root});
 assertSourceStage10Stable(successor);
 const view=Object.freeze({actualInput:successor.actualInput,historicalInput,nativeHead:successor.nativeHead,get live(){return new Map(live);},get stage10Live(){return successor.live;}});
 proved.add(view);successors.set(view,successor);historical.set(git,view);historical.set(immutableTreeQueryReader(git),view);return view;
}
export function assertSourceStage9Stable(view){
 assert(proved.has(view),'Private verified Stage9 capability required');
 // The complete successor check freshly observes delegated/native HEAD before reads and after the body.
 const current=assertSourceStage10Stable(successors.get(view));
 assert.equal(current,view.nativeHead,'Native HEAD moved during final Stage9 proof');return current;
}
