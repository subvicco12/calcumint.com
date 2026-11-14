/** Exact observational-only four-file NS successor; no changed acceptance or causality claim. */
import assert from 'node:assert/strict';
import {balancedWorkflowRecord,verifyBalancedWorkflow,historicalWorkflowBeforeBalance} from '../ci-balance-20261113/workflow.mjs';
import {createHash} from 'node:crypto';
import {lstatSync,realpathSync,readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
import {completionGitReader} from '../parallel-source-20261110/git-reader.mjs';
import {aggregateVerificationContract,requiredVerificationJobs} from '../ci-gate-recovery/verification-jobs-contract.mjs';
import {nonSourcePolicy,nonSourceCapturePath} from './non-source-policy.mjs';
import {ensureNonSourceObjects} from '../parallel-source-20261110/bootstrap.mjs';
const expectedPaths=['.github/workflows/ci.yml','tests/gotrue-runtime/acceptance.mjs','tests/gotrue-runtime/login-diagnostics.mjs','tests/gotrue-runtime/login-diagnostics.test.mjs'];
const sha=b=>createHash('sha256').update(b).digest('hex'),cache=new Map();
const gitDefault=completionGitReader(args=>execFileSync('git',args,{stdio:['ignore','pipe','pipe'],maxBuffer:8*1024*1024}));
function deepFreeze(value){if(value&&typeof value==='object'){for(const child of Object.values(value))deepFreeze(child);Object.freeze(value);}return value;}
function captureFor(read){const bytes=read(nonSourceCapturePath);assert.equal(sha(bytes),nonSourcePolicy.captureSHA256,'Independent NS capture digest differs');let capture=cache.get(nonSourcePolicy.captureSHA256);if(!capture){capture=JSON.parse(bytes);assert.equal(capture.kind,'EXACT_NATIVE_LOGIN_OBSERVATION_NS_SUCCESSOR');assert.equal(capture.predecessorRef,nonSourcePolicy.predecessorRef);assert.equal(capture.codeRef,nonSourcePolicy.codeRef);assert.deepEqual(nonSourcePolicy.paths,expectedPaths);assert.deepEqual(capture.rows.map(r=>r.path),expectedPaths);assert.deepEqual(capture.ancestry,nonSourcePolicy.ancestry);cache.set(nonSourcePolicy.captureSHA256,deepFreeze(capture));}return capture;}
export function nonSourceRecords(read){return new Map(captureFor(read).rows.map(row=>[row.path,row.path==='.github/workflows/ci.yml'?{...row,current:balancedWorkflowRecord(read)}:row]));}
export function verifyNonSourceStage({read=readFileSync,git=gitDefault,root=process.cwd()}={}){
 const capture=captureFor(read);assert.equal(capture.predecessorRef,'5008aa4cadd77f7a9a5dc1523cace694f3bbdf47');assert.notEqual(capture.predecessorRef,capture.codeRef);
 // Availability uses the owned timeout/protocol/prompt-protected transport.
 // A supplied proof reader cannot replace or remove network execution bounds.
 ensureNonSourceObjects(git);
 const balanced=verifyBalancedWorkflow({read,git,root});
 assert(capture.ancestry.length>=2&&capture.ancestry.length<=64);assert.equal(capture.ancestry[0],capture.codeRef);assert.equal(capture.ancestry.at(-1),capture.predecessorRef);assert.equal(new Set(capture.ancestry).size,capture.ancestry.length);
 for(let i=0;i<capture.ancestry.length;i++){const ref=capture.ancestry[i];assert.match(ref,/^[0-9a-f]{40}$/);assert.equal(git(['rev-parse','--verify',ref+'^{commit}']).toString().trim(),ref);const raw=git(['cat-file','commit',ref]);assert.equal(createHash('sha1').update(Buffer.from(`commit ${raw.length}\0`)).update(raw).digest('hex'),ref,'NS commit content address differs');if(i<capture.ancestry.length-1)assert(raw.toString().split('\n\n',1)[0].split('\n').includes('parent '+capture.ancestry[i+1]),'NS parent chain differs');}
 assert.deepEqual(git(['diff','--name-only','-z',capture.predecessorRef,capture.codeRef]).toString().split('\0').filter(Boolean),expectedPaths,'Only four exact observational NS files may change');
 const head=git(['rev-parse','--verify','HEAD^{commit}']).toString().trim();assert.match(head,/^[0-9a-f]{40}$/);
 const prior=new Set(git(['ls-tree','-rz','--name-only',capture.predecessorRef]).toString().split('\0').filter(Boolean));
 function record(value,ref,path){assert.equal(value.path,path);assert.equal(value.ref,ref);assert.match(value.blob,/^[0-9a-f]{40}$/);assert.equal(git(['rev-parse',ref+':'+path]).toString().trim(),value.blob);const bytes=git(['cat-file','blob',value.blob]);assert.equal(bytes.length,value.bytes);assert.equal(sha(bytes),value.sha256);return bytes;}
 for(const row of capture.rows){if(prior.has(row.path))record(row.predecessor,capture.predecessorRef,row.path);else assert.equal(row.predecessor,null);const retained=record(row.current,capture.codeRef,row.path),current=row.path==='.github/workflows/ci.yml'?balanced.current:row.current,bytes=current===row.current?retained:record(current,current.ref,row.path),currentHead=row.path==='.github/workflows/ci.yml'?balanced.actualHead:head;assert.equal(git(['rev-parse',currentHead+':'+row.path]).toString().trim(),current.blob,'Current NS HEAD source differs');const target=resolve(root,row.path),stat=lstatSync(target);assert(stat.isFile()&&!stat.isSymbolicLink());assert.equal(realpathSync(target),target);assert(read(row.path).equals(bytes),'Current NS source bytes differ: '+row.path);}
 return nonSourceRecords(read);
}
export const nativeLoginObservationStep="      - name: Preserve sanitized native login observations\n        if: always()\n        uses: actions/upload-artifact@v4\n        with:\n          name: native-login-observation-${{ github.event.pull_request.head.sha || github.sha }}\n          path: |\n            ${{ runner.temp }}/batch13-gotrue/login-observation.json\n            ${{ runner.temp }}/batch13-gotrue/failure-summary.json\n            ${{ runner.temp }}/batch16-full-schema-browser/login-observation.json\n            ${{ runner.temp }}/batch16-full-schema-browser/failure-summary.json\n          if-no-files-found: warn\n";
/** Admit only this exact artifact-only addition, retaining all original workflow source claims. */
export function historicalWorkflowWithoutLoginObservations(source,read=readFileSync,git=gitDefault,root=process.cwd()){
 const records=verifyNonSourceStage({read,git,root}),row=records.get('.github/workflows/ci.yml'),bytes=Buffer.from(source);
 assert.equal(sha(bytes),row.current.sha256,'Exact current diagnostics workflow required');assert(bytes.equals(git(['cat-file','blob',row.current.blob])));
 const retainedSource=historicalWorkflowBeforeBalance(source,read);
 assert.equal(retainedSource.split(nativeLoginObservationStep).length,2,'Exactly one immutable diagnostics artifact step required');
 const historical=retainedSource.replace(nativeLoginObservationStep,'');assert.equal(sha(Buffer.from(historical)),row.predecessor.sha256);assert(Buffer.from(historical).equals(git(['cat-file','blob',row.predecessor.blob])),'Only exact observational artifact addition may differ');
 assert.deepEqual(requiredVerificationJobs(source).sort(),['build','checks','full-product','publication-factory','source-acceptance']);assert.equal(aggregateVerificationContract(source).names.length,5);
 return historical;
}
