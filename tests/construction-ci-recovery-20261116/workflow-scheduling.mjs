/** Exact scheduling successor; all legacy workflow bytes remain independently proved. */
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync,lstatSync,realpathSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {completionGitReader} from '../parallel-source-20261110/git-reader.mjs';
import {execNativeGit} from './native-git.mjs';
import {workflowSchedulePolicy as policy} from './workflow-scheduling-policy.mjs';
const repository=fileURLToPath(new URL('../../',import.meta.url));
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const owned=args=>execNativeGit(['-c','protocol.file.allow=never','-c','protocol.ext.allow=never',...args],{cwd:repository,env:{...process.env,GIT_TERMINAL_PROMPT:'0'},stdio:['ignore','pipe','pipe'],timeout:60000,maxBuffer:8000000});
const gitDefault=completionGitReader(owned);
export const ownerP0Commands=Object.freeze(["tests/owner-p0/calculus/browser.mjs", "tests/owner-p0/membership/acceptance.mjs", "tests/owner-p0/privileges/acceptance.mjs", "tests/owner-p0/adoption/acceptance.mjs"]);
export const serialOwnerP0="          node tests/owner-p0/calculus/browser.mjs\n          node tests/owner-p0/membership/acceptance.mjs\n          node tests/owner-p0/privileges/acceptance.mjs\n          node tests/owner-p0/adoption/acceptance.mjs\n";
export const parallelOwnerP0="          owner_p0_status=0\n          node tests/owner-p0/calculus/browser.mjs &\n          owner_p0_calculus_pid=$!\n          node tests/owner-p0/membership/acceptance.mjs &\n          owner_p0_membership_pid=$!\n          wait \"$owner_p0_calculus_pid\" || owner_p0_status=1\n          wait \"$owner_p0_membership_pid\" || owner_p0_status=1\n          node tests/owner-p0/privileges/acceptance.mjs &\n          owner_p0_privileges_pid=$!\n          node tests/owner-p0/adoption/acceptance.mjs &\n          owner_p0_adoption_pid=$!\n          wait \"$owner_p0_privileges_pid\" || owner_p0_status=1\n          wait \"$owner_p0_adoption_pid\" || owner_p0_status=1\n          test \"$owner_p0_status\" -eq 0\n";
export function expectedScheduledWorkflow(previous){
 assert.equal(sha(Buffer.from(previous)),policy.predecessor.sha256,'Exact scheduling predecessor required');
 assert.equal(previous.split(serialOwnerP0).length,2,'Exactly four unchanged owner P0 commands required');
 const result=previous.replace(serialOwnerP0,parallelOwnerP0);
 assert.equal(sha(Buffer.from(result)),policy.current.sha256,'Exact reviewed two-group workflow required');
 return result;
}
/** Pure normalization grants no current-source verdict and preserves unrelated edits. */
export function restoreOwnerP0Schedule(source){
 if(!source.includes(parallelOwnerP0))return source;
 assert.equal(source.split(parallelOwnerP0).length,2,'Exactly one bounded scheduling block required');
 return source.replace(parallelOwnerP0,serialOwnerP0);
}
export function historicalWorkflowBeforeScheduling(source){
 const digest=sha(Buffer.from(source));
 if(digest===policy.predecessor.sha256)return source;
 assert.equal(digest,policy.current.sha256,'Exact current scheduling workflow bytes required');
 const restored=restoreOwnerP0Schedule(source);
 assert.equal(sha(Buffer.from(restored)),policy.predecessor.sha256,'Only the exact owner P0 scheduling change may differ');
 assert.equal(expectedScheduledWorkflow(restored),source);
 return restored;
}
export function verifyWorkflowScheduling({read=readFileSync,git=gitDefault,root=repository}={}){
 const head=owned(['rev-parse','--verify','HEAD^{commit}']).toString().trim();assert.match(head,/^[a-f0-9]{40}$/);
 function record(row){
  assert.match(row.ref,/^[a-f0-9]{40}$/);assert.equal(row.path,'.github/workflows/ci.yml');
  assert.equal(git(['rev-parse','--verify',row.ref+'^{commit}']).toString().trim(),row.ref);
  assert.equal(git(['rev-parse',row.ref+':'+row.path]).toString().trim(),row.blob);
  const bytes=git(['cat-file','blob',row.blob]);assert(Buffer.isBuffer(bytes));assert.equal(bytes.length,row.bytes);assert.equal(sha(bytes),row.sha256);return bytes;
 }
 const before=record(policy.predecessor),after=record(policy.current);
 assert.equal(expectedScheduledWorkflow(before.toString()),after.toString());
 const raw=git(['cat-file','commit',policy.current.ref]);assert.equal(createHash('sha1').update(Buffer.from('commit '+raw.length+'\0')).update(raw).digest('hex'),policy.current.ref);
 const parents=raw.toString().split('\n\n',1)[0].split('\n').filter(line=>line.startsWith('parent '));assert.deepEqual(parents,['parent '+policy.predecessor.ref]);
 assert.deepEqual(git(['diff','--name-only','-z',policy.predecessor.ref,policy.current.ref]).toString().split('\0').filter(Boolean),[policy.current.path]);
 assert.equal(owned(['rev-parse',head+':'+policy.current.path]).toString().trim(),policy.current.blob,'Actual scheduling HEAD differs');
 assert.equal(git(['rev-parse',head+':'+policy.current.path]).toString().trim(),policy.current.blob,'Supplied scheduling HEAD differs');
 const target=resolve(root,policy.current.path),stat=lstatSync(target);assert(stat.isFile()&&!stat.isSymbolicLink());assert.equal(realpathSync(target),target);
 const fresh=read(policy.current.path);assert(Buffer.isBuffer(fresh)&&fresh.equals(after),'Current scheduling workflow bytes differ');
 assert.equal(owned(['rev-parse','--verify','HEAD^{commit}']).toString().trim(),head,'Actual HEAD moved during scheduling proof');
 return {current:policy.current,predecessor:policy.predecessor,currentBytes:after,predecessorBytes:before,actualHead:head};
}
