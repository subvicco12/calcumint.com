/** Exact current source must be authenticated before any older historical projection. */
import assert from 'node:assert/strict';
import {resolve} from 'node:path';
import {readFileSync,lstatSync,realpathSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {verifyExactStage} from '../calculator-factory-source-20261112/exact-stage.mjs';
import {immutableTreeQueryReader} from '../milestone100-20261114/source-immutable-queries.mjs';
import {sourceStage10Policy as policy,sourceStage10CapturePath as capturePath} from './source-stage10-policy.mjs';
const historical=new WeakMap(),proved=new WeakSet();
const headArgs=['rev-parse','--verify','HEAD^{commit}'];
const sha=b=>createHash('sha256').update(b).digest('hex');
export const sourceStage10HistoricalView=git=>historical.get(git);
function exact(input){
 const bytes=input.read(capturePath);assert(Buffer.isBuffer(bytes)&&sha(bytes)===policy.captureSHA256,'Independent Stage10 capture digest differs');
 const capture=JSON.parse(bytes);assert.deepEqual(capture.ancestry,policy.ancestry,'Stage10 exact ancestry differs');
 const target=resolve(input.root,capturePath);assert(lstatSync(target).isFile()&&!lstatSync(target).isSymbolicLink()&&realpathSync(target)===target,'Redirected Stage10 capture');assert(readFileSync(target).equals(bytes),'Physical Stage10 capture differs');
 const rows=verifyExactStage({...input,policy,captureBytes:bytes});
 // A supplied reader must describe the actual physical workspace, not an alternative tree.
 for(const [path,row]of rows){const physical=readFileSync(resolve(input.root,path));assert.equal(sha(physical),row.current.sha256,'Physical current source differs: '+path);}
 return rows;
}
export function proveSourceStage10(input){
 assert.deepEqual(Object.keys(input).sort(),['git','read','root'],'Only explicit Stage10 read/Git/root inputs allowed');
 const old=historical.get(input.git);
 if(old){assert.equal(input.read,old.historicalInput.read,'Stage10 historical reader differs');assert.equal(resolve(input.root),old.actualInput.root,'Stage10 root differs');input=old.actualInput;}
 assert.equal(typeof input.read,'function');assert.equal(typeof input.git,'function');assert.equal(resolve(input.root),realpathSync(process.cwd()),'Redirected current source: Actual workspace root required');
 const actual=Object.freeze({...input,root:resolve(input.root),git:immutableTreeQueryReader(input.git)});
 const nativeHead=actual.git(headArgs).toString().trim();assert.match(nativeHead,/^[a-f0-9]{40}$/);
 const live=exact(actual);assert.equal(actual.git(headArgs).toString().trim(),nativeHead,'Native HEAD moved during Stage10 verification');
 const rows=new Map([...live].map(([p,r])=>[p,Object.freeze({predecessor:r.predecessor?Object.freeze({...r.predecessor}):null,current:Object.freeze({...r.current})})]));
 const read=path=>{const row=rows.get(path);if(!row)return actual.read(path);assert(row.predecessor,'Added Stage10 source has no historical bytes: '+path);return actual.git(['cat-file','blob',row.predecessor.blob]);};
 const git=(args,options)=>{
  if(JSON.stringify(args)===JSON.stringify(headArgs))return Buffer.from(policy.predecessorRef+'\n');
  if(JSON.stringify(args)===JSON.stringify(['status','--porcelain','--untracked-files=all','--','src']))return Buffer.alloc(0);
  return actual.git(args.map(arg=>arg==='HEAD'?policy.predecessorRef:arg.startsWith('HEAD:src/')?policy.predecessorRef+arg.slice(4):arg.startsWith('HEAD:')?nativeHead+arg.slice(4):arg),options);
 };
 for(const name of ['preloadCommits','preloadBlobs','preloadPaths'])if(typeof actual.git[name]==='function')git[name]=values=>actual.git[name](values);
 const view=Object.freeze({actualInput:actual,historicalInput:Object.freeze({read,git,root:actual.root}),nativeHead,get live(){return new Map(rows);}});
 proved.add(view);historical.set(git,view);historical.set(immutableTreeQueryReader(git),view);return view;
}
export function assertSourceStage10Stable(view){assert(proved.has(view),'Private verified Stage10 capability required');assert.equal(view.actualInput.git(headArgs).toString().trim(),view.nativeHead,'Native HEAD moved during Stage10 proof');exact(view.actualInput);assert.equal(view.actualInput.git(headArgs).toString().trim(),view.nativeHead,'Native HEAD moved during final Stage10 proof');}
