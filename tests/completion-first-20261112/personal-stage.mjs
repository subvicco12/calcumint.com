import {proveRuntimeAuxiliarySuccessor} from '../milestone100-20261114/source-stage8-runtime-auxiliary.mjs';
/** Mandatory exact two-path personal successor before the unchanged Stage2/Stage1/Stage6 historical proof. */
import assert from 'node:assert/strict';
import {proveTestStageAndHistoricalInputs} from './test-stage.mjs';
import {createHash} from 'node:crypto';
import {lstatSync,realpathSync} from 'node:fs';
import {resolve} from 'node:path';
import {verifyExactStage} from '../calculator-factory-source-20261112/exact-stage.mjs';
import {verifyWorkflowAndHistoricalCompletion} from './workflows-stage.mjs';
import {workflowPolicy} from './workflows-policy.mjs';
import {personalPolicy,personalCapturePath} from './personal-policy.mjs';
const hash=b=>createHash('sha256').update(b).digest('hex'),parsed=new Map();
function captureFor(read){const bytes=read(personalCapturePath);assert.equal(hash(bytes),personalPolicy.captureSHA256,'Independent personal capture digest differs');let capture=parsed.get(personalPolicy.captureSHA256);if(!capture){capture=JSON.parse(bytes);assert.equal(capture.predecessorRef,personalPolicy.predecessorRef);assert.equal(capture.codeRef,personalPolicy.codeRef);assert.deepEqual(capture.rows.map(row=>row.path),personalPolicy.paths);assert.deepEqual(capture.auxiliaryRows.map(row=>row.path),personalPolicy.auxiliaryPaths);const freeze=value=>{if(value&&typeof value==='object'){Object.values(value).forEach(freeze);Object.freeze(value);}return value;};parsed.set(personalPolicy.captureSHA256,freeze(capture));}return capture;}
export const personalRecords=read=>new Map(captureFor(read).rows.map(row=>[row.path,row]));
export const personalAuxiliaryRecords=read=>new Map(captureFor(read).auxiliaryRows.map(row=>[row.path,row]));
export function provePersonalAndHistoricalInputs(input,witness){
 const {historicalInput:{read,git,root}}=proveTestStageAndHistoricalInputs(input);
 const c=captureFor(read),live=verifyExactStage({policy:personalPolicy,captureBytes:read(personalCapturePath),read,git,root});
 assert.equal(git(['diff','--name-only','-z',workflowPolicy.codeRef,c.predecessorRef,'--','src']).length,0,'Stage3 checkpoint must preserve entire frozen Stage2 SRC');
 assert.equal(git(['diff','--name-only','-z',c.codeRef,c.auxiliaryRef,'--','src']).length,0,'Default transport auxiliary successor cannot change frozen Stage3 SRC');
 assert.equal(c.auxiliaryRef,personalPolicy.auxiliaryRef);assert.deepEqual(c.auxiliaryAncestry,personalPolicy.auxiliaryAncestry);assert.equal(c.auxiliaryAncestry[0],c.auxiliaryRef);assert.equal(c.auxiliaryAncestry.at(-1),c.codeRef);
 for(let i=0;i<c.auxiliaryAncestry.length;i++){const ref=c.auxiliaryAncestry[i];assert.equal(git(['rev-parse','--verify',ref+'^{commit}']).toString().trim(),ref);const bytes=git(['cat-file','commit',ref]);assert.equal(createHash('sha1').update(Buffer.from(`commit ${bytes.length}\0`)).update(bytes).digest('hex'),ref);if(i<c.auxiliaryAncestry.length-1)assert(bytes.toString().split('\n\n',1)[0].split('\n').includes('parent '+c.auxiliaryAncestry[i+1]));}
 const head=git(['rev-parse','--verify','HEAD^{commit}']).toString().trim();assert.match(head,/^[a-f0-9]{40}$/);
 for(const row of c.auxiliaryRows)for(const[key,ref]of [['predecessor',c.predecessorRef],['current',c.auxiliaryRef]]){const r=row[key];assert.equal(r.path,row.path);assert.equal(r.ref,ref);assert.equal(git(['rev-parse',ref+':'+row.path]).toString().trim(),r.blob);const bytes=git(['cat-file','blob',r.blob]);assert.equal(bytes.length,r.bytes);assert.equal(hash(bytes),r.sha256);if(key==='current'){assert.equal(git(['rev-parse',head+':'+row.path]).toString().trim(),r.blob);const target=resolve(root,row.path),stat=lstatSync(target);assert(stat.isFile()&&!stat.isSymbolicLink());assert.equal(realpathSync(target),target);if(row.path==='tests/next-cohort-20261110/source/retained-runtime.mjs'&&!read(row.path).equals(bytes)){assert.equal(proveRuntimeAuxiliarySuccessor({record:r,currentBytes:read(row.path),input,witness}),true);}else assert(read(row.path).equals(bytes),'Current personal auxiliary source bytes differ');}}
 const historicalGit=args=>args[0]==='rev-parse'&&args[1]==='--verify'&&args[2]==='HEAD^{commit}'?Buffer.from(c.predecessorRef+'\n'):args[0]==='status'&&args.at(-1)==='src'?Buffer.alloc(0):git(args);
 const projected=new Set([...personalPolicy.paths,...personalPolicy.auxiliaryPaths]);
 const historicalRead=path=>projected.has(path)?git(['show',c.predecessorRef+':'+path]):read(path);
 return {live,auxiliary:personalAuxiliaryRecords(read),historicalGit,historicalRead};
}
export function verifyPersonalAndHistoricalWorkflow(input,witness){const proved=provePersonalAndHistoricalInputs(input,witness);return {...verifyWorkflowAndHistoricalCompletion({...input,read:proved.historicalRead,git:proved.historicalGit}),personal:proved.live,personalAuxiliary:proved.auxiliary};}
