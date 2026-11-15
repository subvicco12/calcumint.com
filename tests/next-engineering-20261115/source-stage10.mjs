import {sourceStage8Policy,sourceStage8CapturePath} from '../milestone100-20261114/source-stage8-policy-v3.mjs';
import {sourceStage9Policy,sourceStage9CapturePath} from '../four-worker-integration-20261115/source-stage9-policy.mjs';
/** Exact current source must be authenticated before any older historical projection. */
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {resolve} from 'node:path';
import {readFileSync,lstatSync,realpathSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {verifyExactStage} from '../calculator-factory-source-20261112/exact-stage.mjs';
import {immutableTreeQueryReader} from '../milestone100-20261114/source-immutable-queries.mjs';
import {sourceStage10Policy as policy,sourceStage10CapturePath as capturePath} from './source-stage10-current-policy.mjs';
const historical=new WeakMap(),proved=new WeakSet();
const headArgs=['rev-parse','--verify','HEAD^{commit}'];
const sha=b=>createHash('sha256').update(b).digest('hex');
const nativeReaders=new Map();
function nativeReader(root){
 let reader=nativeReaders.get(root);if(reader)return reader;
 // Only full immutable tree-query bytes enter this existing query cache.
 reader=immutableTreeQueryReader(args=>execFileSync('git',['-c','core.fsmonitor=false','-c','core.ignorestat=false','-c','core.untrackedCache=false',...args],{cwd:root,env:{...process.env,GIT_NO_REPLACE_OBJECTS:'1'},stdio:['ignore','pipe','pipe'],maxBuffer:64*1024*1024}));
 if(nativeReaders.size>=32)nativeReaders.delete(nativeReaders.keys().next().value);nativeReaders.set(root,reader);return reader;
}
export const sourceStage10HistoricalView=git=>historical.get(git);
function nativeStatusHead(bytes){
 assert(Buffer.isBuffer(bytes),'Native status must be bytes');
 const lines=bytes.toString().split('\n').filter(Boolean),headers=new Map();
 for(const line of lines){
  const match=/^# branch\.(oid|head|upstream|ab) (.+)$/.exec(line);assert(match,'Committed current src required; native dirty or unknown source');
  const [,key,value]=match;assert(!headers.has(key),'Duplicate native branch header');
  assert(key==='oid'?/^[a-f0-9]{40}$/.test(value):key==='ab'?/^\+[0-9]+ -[0-9]+$/.test(value):/^\S+$/.test(value),'Malformed native branch header');headers.set(key,value);
 }
 const head=headers.get('oid');assert.match(head??'',/^[a-f0-9]{40}$/,'Exact native branch commit required');assert(headers.has('head'),'Native branch identity required');
 return head;
}
function native(input){
 const run=nativeReader(input.root);
 const root=run(['rev-parse','--show-toplevel']).toString().trim();assert.equal(resolve(root),input.root,'Native Git workspace root differs');
 // Native porcelain v2 reports current HEAD and source status in one fresh observation; never cached.
 const head=nativeStatusHead(run(['status','--porcelain=v2','--branch','--ignored=matching','--untracked-files=all','--','src']));
 assert.equal(input.git(headArgs).toString().trim(),head,'Native HEAD moved or supplied HEAD differs');
 const statusArgs=['status','--porcelain','--untracked-files=all','--','src'];assert(input.git(statusArgs).equals(Buffer.alloc(0)),'Committed current src required; Dirty or unknown current source; Native source status differs');
 const tracked=run(['ls-files','-v','-z','--','src']).toString().split('\0').filter(Boolean);assert(tracked.length>0,'Native source index required');
 for(const entry of tracked)assert(entry.startsWith('H '),'Unsupported native source index flag: '+entry);
 const deltaArgs=['diff','--name-only','-z',policy.codeRef,head,'--','src'];const delta=run(deltaArgs);assert.equal(delta.length,0,'Unreviewed native current source delta');assert(input.git(deltaArgs).equals(delta),'Native source delta differs');
 return head;
}
function exact(input){
 // Negative-only preflight: these fixed independently hashed captures cannot grant a capability.
 // All immutable/native/physical proofs below still execute for every successful invocation.
 const current=new Map();
 for(const [path,digest]of [[sourceStage8CapturePath,sourceStage8Policy.captureSHA256],[sourceStage9CapturePath,sourceStage9Policy.captureSHA256],[capturePath,policy.captureSHA256]]){
  const bytes=input.read(path);assert(Buffer.isBuffer(bytes)&&sha(bytes)===digest,'Independent Stage10 capture digest differs: '+path);
  for(const row of JSON.parse(bytes).rows)current.set(row.path,row.current);
 }
 for(const [path,row]of current){const bytes=input.read(path);assert(Buffer.isBuffer(bytes)&&bytes.length===row.bytes&&sha(bytes)===row.sha256,'Current factory bytes differ: '+path);}
 const before=native(input);
 const bytes=input.read(capturePath);assert(Buffer.isBuffer(bytes)&&sha(bytes)===policy.captureSHA256,'Independent Stage10 capture digest differs');
 const capture=JSON.parse(bytes);assert.deepEqual(capture.ancestry,policy.ancestry,'Stage10 exact ancestry differs');
 const target=resolve(input.root,capturePath);assert(lstatSync(target).isFile()&&!lstatSync(target).isSymbolicLink()&&realpathSync(target)===target,'Redirected Stage10 capture');assert(readFileSync(target).equals(bytes),'Physical Stage10 capture differs');
 const rows=verifyExactStage({...input,policy,captureBytes:bytes});
 // A supplied reader must describe the actual physical workspace, not an alternative tree.
 for(const [path,row]of rows){const physical=readFileSync(resolve(input.root,path));assert.equal(sha(physical),row.current.sha256,'Physical current source differs: '+path);}
 assert.equal(native(input),before,'Native HEAD moved during exact Stage10 proof');
 return rows;
}
export function proveSourceStage10(input){
 assert.deepEqual(Object.keys(input).sort(),['git','read','root'],'Only explicit Stage10 read/Git/root inputs allowed');
 const old=historical.get(input.git);
 if(old){assert.equal(input.read,old.historicalInput.read,'Stage10 historical reader differs');assert.equal(resolve(input.root),old.actualInput.root,'Stage10 root differs');input=old.actualInput;}
 assert.equal(typeof input.read,'function');assert.equal(typeof input.git,'function');assert.equal(resolve(input.root),realpathSync(process.cwd()),'Redirected current source: Actual workspace root required');
 const actual=Object.freeze({...input,root:resolve(input.root),git:immutableTreeQueryReader(input.git)});
 assert.equal(resolve(actual.git(['rev-parse','--show-toplevel']).toString().trim()),actual.root,'Actual Git workspace root differs');
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
