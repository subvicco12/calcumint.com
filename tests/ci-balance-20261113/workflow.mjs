/** Exact existing-campaign relocation; no omitted checks, job or budget changes. */
import assert from 'node:assert/strict';
import {readFileSync,lstatSync,realpathSync} from 'node:fs';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {completionGitReader} from '../parallel-source-20261110/git-reader.mjs';
import {withSourceObjectLock} from '../parallel-source-20261110/source-object-lock.mjs';
import {workflowJobs,requiredVerificationJobs,aggregateVerificationContract} from '../ci-gate-recovery/verification-jobs-contract.mjs';
import {balancePolicy,balanceCapturePath} from './policy.mjs';
const repository=fileURLToPath(new URL('../../',import.meta.url));
const owned=args=>execFileSync('git',['-c','protocol.file.allow=never','-c','protocol.ext.allow=never',...args],{cwd:repository,env:{...process.env,GIT_TERMINAL_PROMPT:'0'},stdio:['ignore','pipe','pipe'],timeout:60000,maxBuffer:8000000});
const gitDefault=completionGitReader(owned),sha=b=>createHash('sha256').update(b).digest('hex');let available=false;
function capture(read){const bytes=read(balanceCapturePath);assert.equal(sha(bytes),balancePolicy.captureSHA256,'Independent workflow relocation capture differs');const c=JSON.parse(bytes);assert.equal(c.kind,'EXACT_FIVE_JOB_CAMPAIGN_RELOCATION');assert.equal(c.predecessor.ref,balancePolicy.predecessorRef);assert.equal(c.current.ref,balancePolicy.codeRef);assert.equal(c.oldNS.ref,balancePolicy.oldNSRef);assert.equal(c.predecessor.path,'.github/workflows/ci.yml');assert.equal(c.current.path,c.predecessor.path);assert.equal(c.oldNS.path,c.predecessor.path);assert.equal(c.productionWrites,false);assert.equal(c.timeoutsChanged,false);assert.equal(c.sourceCommandsRemoved,false);return c;}
export const balancedWorkflowRecord=read=>capture(read).current;
export const retainedWorkflowRecord=read=>capture(read).oldNS;
function ensureObjects(){
 if(available)return;
 const refs=[balancePolicy.predecessorRef,balancePolicy.codeRef,balancePolicy.oldNSRef];for(const ref of refs)assert.match(ref,/^[0-9a-f]{40}$/);
 const common=resolve(repository,owned(['rev-parse','--git-common-dir']).toString().trim());
 withSourceObjectLock(common,()=>{const origins=owned(['remote','get-url','--all','origin']).toString().trim().split('\n');assert(origins.length===1&&['https://github.com/subvicco12/calcumint.com','https://github.com/subvicco12/calcumint.com.git'].includes(origins[0]),'Exact canonical source origin required');for(const ref of refs){const present=()=>{let value;try{value=owned(['rev-parse','--verify',ref+'^{commit}']).toString().trim();}catch{return false;}assert.equal(value,ref,'Workflow source commit substitution');return true;};if(!present())owned(['fetch','--no-tags','--depth=1','origin',ref]);assert(present(),'Workflow source unavailable after one bounded fetch');}});available=true;
}
/** Pure legacy normalization only: remove exactly the captured relocation, preserving other edits. */
export function restoreBalancedLayout(source,read=readFileSync){
 const c=capture(read),begin=source.indexOf('\n  build:\n'),end=source.indexOf('\n  full-product:\n',begin);assert(begin>0&&end>begin);
 const prefix=source.slice(0,begin),build=source.slice(begin,end),suffix=source.slice(end),addition='\n'+c.copiedPDFSetup+c.movedTail;
 if(!build.includes('      - name: Synthetic Reference Six browser acceptance\n'))return source;
 assert.equal(build.split(addition).length,2,'Exactly one unchanged PDF setup and campaign tail required in build');assert(!prefix.includes(c.movedTail),'Moved campaigns cannot also remain in source job');
 return prefix+c.movedTail+build.replace(addition,'')+suffix;
}
export function historicalWorkflowBeforeBalance(source,read=readFileSync){
 const c=capture(read);assert.equal(sha(Buffer.from(source)),c.current.sha256,'Exact relocated workflow bytes required');
 const restored=restoreBalancedLayout(source,read);
 assert.equal(sha(Buffer.from(restored)),c.predecessor.sha256,'Only the exact reviewed workflow relocation is admitted');assert.equal(c.predecessor.sha256,c.oldNS.sha256,'Retained NS workflow bytes must remain identical');
 const jobs=workflowJobs(source),prior=workflowJobs(restored);assert.deepEqual(requiredVerificationJobs(source).sort(),['build','checks','full-product','publication-factory','source-acceptance']);assert.deepEqual(aggregateVerificationContract(source),aggregateVerificationContract(restored));
 for(const name of Object.keys(prior))assert.equal(jobs[name].match(/^    timeout-minutes: (\d+)$/m)?.[1],prior[name].match(/^    timeout-minutes: (\d+)$/m)?.[1],'Existing job deadlines stay unchanged');
 assert(jobs.build.includes(c.movedTail));assert(!jobs['source-acceptance'].includes(c.movedTail));return restored;
}
export function verifyBalancedWorkflow({read=readFileSync,git=gitDefault,root=repository}={}){
 const c=capture(read);ensureObjects();
 function record(r){assert.match(r.ref,/^[a-f0-9]{40}$/);assert.equal(git(['rev-parse','--verify',r.ref+'^{commit}']).toString().trim(),r.ref);assert.equal(git(['rev-parse',r.ref+':'+r.path]).toString().trim(),r.blob);const bytes=git(['cat-file','blob',r.blob]);assert.equal(bytes.length,r.bytes);assert.equal(sha(bytes),r.sha256);return bytes;}
 const before=record(c.predecessor),after=record(c.current);assert(record(c.oldNS).equals(before));
 const raw=git(['cat-file','commit',c.current.ref]);assert.equal(createHash('sha1').update(Buffer.from(`commit ${raw.length}\0`)).update(raw).digest('hex'),c.current.ref);assert(raw.toString().split('\n\n',1)[0].split('\n').includes('parent '+c.predecessor.ref),'Only the exact one-file workflow successor is admitted');assert.deepEqual(git(['diff','--name-only','-z',c.predecessor.ref,c.current.ref]).toString().split('\0').filter(Boolean),[c.current.path]);
 // Higher SRC stages intentionally project symbolic HEAD. Resolve actual HEAD
 // through the owned repository, then retain the supplied reader for explicit proofs.
 const actualHead=owned(['rev-parse','--verify','HEAD^{commit}']).toString().trim();assert.match(actualHead,/^[a-f0-9]{40}$/);assert.equal(git(['rev-parse',actualHead+':'+c.current.path]).toString().trim(),c.current.blob,'Actual workflow HEAD differs');
 const target=resolve(root,c.current.path),stat=lstatSync(target);assert(stat.isFile()&&!stat.isSymbolicLink());assert.equal(realpathSync(target),target);assert(read(c.current.path).equals(after),'Current NS source bytes differ: .github/workflows/ci.yml (current workflow bytes differ)');
 assert(Buffer.from(historicalWorkflowBeforeBalance(after.toString(),read)).equals(before));return {current:c.current,retained:c.oldNS,actualHead};
}
