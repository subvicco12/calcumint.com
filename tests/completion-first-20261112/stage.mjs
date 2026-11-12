/** Exact completion successor and explicit historical factory proof. No historical bytes fill current claims. */
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {verifyExactStage} from '../calculator-factory-source-20261112/exact-stage.mjs';
import {factoryPolicy,factoryCapturePath} from '../calculator-factory-source-20261112/policy.mjs';
import {completionPolicy,completionCapturePath} from './policy.mjs';
const immutableCaptures=new Map();
function deepFreeze(value){if(value&&typeof value==='object'){for(const child of Object.values(value))deepFreeze(child);Object.freeze(value);}return value;}
export function completionRecords(read){
 const bytes=read(completionCapturePath);
 // Every mapping checks the literal capture digest. Callers additionally require
 // independent authority over this capture and literal policy module.
 assert.equal(createHash('sha256').update(bytes).digest('hex'),completionPolicy.captureSHA256,'Independent completion capture digest differs');
 let capture=immutableCaptures.get(completionPolicy.captureSHA256);
 if(!capture){
  capture=JSON.parse(bytes);
  assert.equal(capture.predecessorRef,completionPolicy.predecessorRef);
  assert.equal(capture.codeRef,completionPolicy.codeRef);
  assert.deepEqual(capture.rows.map(r=>r.path),completionPolicy.paths);
  immutableCaptures.set(completionPolicy.captureSHA256,deepFreeze(capture));
 }
 // Only immutable parsing is reused. Actual capture bytes above are read/hashed
 // every time, and each caller gets its own mutable container of frozen records.
 return new Map(capture.rows.map(r=>[r.path,r]));
}
export function verifyCompletionAndHistoricalFactory({read,git,root}){
 const live=verifyExactStage({policy:completionPolicy,captureBytes:read(completionCapturePath),git,read,root});
 const baseline=completionPolicy.predecessorRef;
 const capture=JSON.parse(read(completionCapturePath));
 assert.deepEqual(capture.auxiliaryRows.map(r=>r.path),['tests/calculator-factory-20261112/account-acceptance.mjs'],'Only exact frozen account acceptance auxiliary successor');
 for(const row of capture.auxiliaryRows){for(const [key,ref] of [['predecessor',baseline],['current',completionPolicy.codeRef]]){const r=row[key];assert.equal(r.path,row.path);assert.equal(r.ref,ref);assert.equal(git(['rev-parse',ref+':'+r.path]).toString().trim(),r.blob);const bytes=git(['cat-file','blob',r.blob]);assert.equal(bytes.length,r.bytes);assert.equal(createHash('sha256').update(bytes).digest('hex'),r.sha256);if(key==='current')assert(read(r.path).equals(bytes),'Current target source differs: '+r.path);}}

 assert.equal(git(['diff','--name-only','-z',factoryPolicy.codeRef,baseline,'--','src']).length,0,'Completion predecessor must preserve all Stage6 source');
 for(const [path,row]of live){assert(row.current,'No deleted completion source');if(row.predecessor)assert.equal(git(['rev-parse',baseline+':'+path]).toString().trim(),row.predecessor.blob);}
 // Explicit historical view limited to SRC and HEAD commit identity. Non-source objects
 // and all immutable record checks remain real Git. This result is historical only.
 const historicalGit=args=>{
  if(args[0]==='rev-parse'&&args[1]==='--verify'&&args[2]==='HEAD^{commit}')return Buffer.from(baseline+'\n');
  if(args[0]==='status'&&args.at(-1)==='src')return Buffer.alloc(0); // Immutable baseline view; actual live status was checked above.
  return git(args);
 };
 const historicalRead=path=>path.startsWith('src/')?git(['show',baseline+':'+path]):read(path);
 const historical=verifyExactStage({policy:factoryPolicy,captureBytes:read(factoryCapturePath),git:historicalGit,read:historicalRead,root});
 return {live,historical};
}
