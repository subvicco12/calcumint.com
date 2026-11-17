/** Mandatory live selected-nine workflow successor; original completion/factory stages remain historical. */
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {lstatSync,realpathSync} from 'node:fs';
import {resolve} from 'node:path';
import {verifyExactStage} from '../calculator-factory-source-20261112/exact-stage.mjs';
import {completionPolicy} from './policy.mjs';
import {verifyCompletionAndHistoricalFactory} from './stage.mjs';
import {nonSourcePolicy} from './non-source-policy.mjs';
import {verifyNonSourceStage} from './non-source-stage2.mjs';
import {workflowPolicy,workflowCapturePath} from './workflows-policy.mjs';
const immutableCaptures=new Map();
function deepFreeze(value){if(value&&typeof value==='object'){for(const child of Object.values(value))deepFreeze(child);Object.freeze(value);}return value;}
function captureFor(read){
 const bytes=read(workflowCapturePath);
 assert.equal(createHash('sha256').update(bytes).digest('hex'),workflowPolicy.captureSHA256,'Independent workflow capture digest differs');
 let capture=immutableCaptures.get(workflowPolicy.captureSHA256);
 if(!capture){capture=JSON.parse(bytes);assert.equal(capture.predecessorRef,workflowPolicy.predecessorRef);assert.equal(capture.codeRef,workflowPolicy.codeRef);assert.deepEqual(capture.rows.map(r=>r.path),workflowPolicy.paths);assert.equal(capture.guardRef,workflowPolicy.guardRef);assert.deepEqual(capture.guardRows.map(r=>r.path),workflowPolicy.guardPaths);assert.deepEqual(capture.guardAncestry,workflowPolicy.guardAncestry);immutableCaptures.set(workflowPolicy.captureSHA256,deepFreeze(capture));}
 return capture;
}
export function workflowRecords(read){return new Map(captureFor(read).rows.map(row=>[row.path,row]));}
export function workflowGuardRecords(read){return new Map(captureFor(read).guardRows.map(row=>[row.path,row]));}
function verifyGuards({read,git,root}){
 const capture=captureFor(read),paths=['tests/full-product-batch13/workflow.test.mjs','tests/full-product-batch17/workflow.test.mjs','tests/next-cohort-20261110/source/retained-runtime.mjs'];
 assert.deepEqual(workflowPolicy.guardPaths,paths);assert(capture.guardAncestry.length>=2&&capture.guardAncestry.length<=64);assert.equal(capture.guardAncestry[0],capture.guardRef);assert.equal(capture.guardAncestry.at(-1),capture.codeRef);assert.equal(new Set(capture.guardAncestry).size,capture.guardAncestry.length);
 for(let i=0;i<capture.guardAncestry.length;i++){const ref=capture.guardAncestry[i];assert.match(ref,/^[0-9a-f]{40}$/);assert.equal(git(['rev-parse','--verify',ref+'^{commit}']).toString().trim(),ref);const raw=git(['cat-file','commit',ref]);assert.equal(createHash('sha1').update(Buffer.from(`commit ${raw.length}\0`)).update(raw).digest('hex'),ref,'Guard commit content address differs');if(i<capture.guardAncestry.length-1)assert(raw.toString().split('\n\n',1)[0].split('\n').includes('parent '+capture.guardAncestry[i+1]),'Guard parent chain differs');}
 assert.equal(git(['diff','--name-only','-z',capture.codeRef,capture.guardRef,'--','src']).length,0,'Guard successor cannot alter frozen SRC2');
 const head=git(['rev-parse','--verify','HEAD^{commit}']).toString().trim();assert.match(head,/^[0-9a-f]{40}$/);
 for(const row of capture.guardRows){for(const [key,ref]of [['predecessor',capture.predecessorRef],['current',capture.guardRef]]){const r=row[key];assert.equal(r.path,row.path);assert.equal(r.ref,ref);assert.equal(git(['rev-parse',ref+':'+r.path]).toString().trim(),r.blob);const bytes=git(['cat-file','blob',r.blob]);assert.equal(bytes.length,r.bytes);assert.equal(createHash('sha256').update(bytes).digest('hex'),r.sha256);if(key==='current'){assert.equal(git(['rev-parse',head+':'+r.path]).toString().trim(),r.blob);const file=resolve(root,r.path),stat=lstatSync(file);assert(stat.isFile()&&!stat.isSymbolicLink());assert.equal(realpathSync(file),file);assert(read(r.path).equals(bytes),'Current guard source bytes differ');}}}
 return new Map(capture.guardRows.map(row=>[row.path,row]));
}
export function verifyWorkflowAndHistoricalCompletion({read,git,root}){
 // Actual HEAD, full SRC equality, dirty/untracked SRC, immutable objects and live
 // regular file bytes are all proved before any historical view can be constructed.
 const live=verifyExactStage({policy:workflowPolicy,captureBytes:read(workflowCapturePath),git,read,root});
 const nonSource=verifyNonSourceStage({read,git,root});
 const guards=verifyGuards({read,git,root});
 assert.equal(git(['diff','--name-only','-z',workflowPolicy.predecessorRef,workflowPolicy.codeRef,'--','src/lib/calculator-factory/cohorts/basic-math.ts','src/lib/calculator-factory/cohorts/conversions.ts','src/lib/calculator-factory/cohorts/physics.ts','src/lib/calculator-factory/experimental/physics-scaled.ts']).length,0,'Selected-nine K closure preserves immutable mathematical kernels');
 assert.equal(nonSourcePolicy.predecessorRef,workflowPolicy.predecessorRef);
 assert.equal(workflowPolicy.predecessorRef,'5008aa4cadd77f7a9a5dc1523cace694f3bbdf47');
 assert.equal(git(['diff','--name-only','-z',completionPolicy.codeRef,workflowPolicy.predecessorRef,'--','src']).length,0,'Workflow predecessor must preserve the entire Stage1 source image');
 const historicalGit=args=>{
  if(args[0]==='rev-parse'&&args[1]==='--verify'&&args[2]==='HEAD^{commit}')return Buffer.from(workflowPolicy.predecessorRef+'\n');
  if(args[0]==='status'&&args.at(-1)==='src')return Buffer.alloc(0); // Immutable5008 view; live status was mandatory above.
  return git(args);
 };
 const historicalRead=path=>path.startsWith('src/')||nonSourcePolicy.paths.includes(path)||workflowPolicy.guardPaths.includes(path)?git(['show',workflowPolicy.predecessorRef+':'+path]):read(path);
 const {live:historicalCompletion,historical:historicalFactory}=verifyCompletionAndHistoricalFactory({read:historicalRead,git:historicalGit,root});
 return {live,nonSource,guards,historicalCompletion,historicalFactory};
}
