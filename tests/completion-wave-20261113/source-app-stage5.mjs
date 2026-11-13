/** Additive exact application successor. No historical view exists until current SRC passes. */
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {verifyExactStage} from '../calculator-factory-source-20261112/exact-stage.mjs';
export const stage4SourceRef='0c74b8135cca8892548a90eb497c46bdf022b228';
const digest=bytes=>createHash('sha256').update(bytes).digest('hex');
function captureFor({read,policy,capturePath}){
 assert.equal(policy.predecessorRef,stage4SourceRef,'Stage5 must project literal Stage4 source');
 assert.match(policy.captureSHA256??'',/^[a-f0-9]{64}$/,'Stage5 independently pinned capture required');
 const bytes=read(capturePath);assert.equal(digest(bytes),policy.captureSHA256,'Stage5 capture digest differs');
 const capture=JSON.parse(bytes);
 assert.deepEqual(capture.ancestry,policy.ancestry,'Stage5 independently pinned finite ancestry differs');
 assert.deepEqual(capture.rows.map(row=>row.path),policy.paths,'Stage5 independently pinned finite paths differ');
 return {capture,bytes};
}
export function appStage5Records(input){return new Map(captureFor(input).capture.rows.map(row=>[row.path,row]));}
export function proveAppStage5AndHistoricalInputs({read,git,root,policy,capturePath}){
 const {capture,bytes}=captureFor({read,policy,capturePath});
 // Preload immutable pinned commit objects only; live HEAD/filesystem proof still runs in full.
 if(typeof git.preloadCommits==='function')git.preloadCommits(policy.ancestry);
 const live=verifyExactStage({policy,captureBytes:bytes,read,git,root});
 assert.equal(git(['diff','--name-only','-z',stage4SourceRef,policy.codeRef,'--','src/calculators']).length,0,'Historical mathematical engines remain immutable');
 const projected=new Map(capture.rows.map(row=>[row.path,row]));
 const historicalRead=path=>{
  const row=projected.get(path);if(!row)return read(path);
  assert(row.predecessor,'Stage5 added source has no Stage4 input: '+path);
  return git(['cat-file','blob',row.predecessor.blob]);
 };
 const historicalGit=(args,options)=>args[0]==='rev-parse'&&args[1]==='--verify'&&args[2]==='HEAD^{commit}'?Buffer.from(stage4SourceRef+'\n'):args[0]==='status'&&args.at(-1)==='src'?Buffer.alloc(0):git(args,options);
 return {live,historicalInput:{read:historicalRead,git:historicalGit,root}};
}
