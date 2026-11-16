/** Availability only: advertise fixed immutable objects to unchanged local shallow clones. */
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {isAbsolute} from 'node:path';
import {realpathSync} from 'node:fs';
import {cloneSourceLineageRefs} from '../../scripts/fetch-source-lineage.mjs';
import {withSourceObjectLock} from '../parallel-source-20261110/source-object-lock.mjs';
const prefix='refs/heads/calcumint-source-availability/';
const native=(args,options={})=>execFileSync('git',args,{stdio:['ignore','pipe','pipe'],timeout:60000,maxBuffer:1024*1024,...options});
function authenticateCommits(refs,git){
 const bytes=git(['cat-file','--batch'],{input:Buffer.from(refs.join('\n')+'\n'),stdio:['pipe','pipe','pipe']});assert(Buffer.isBuffer(bytes),'Immutable source commits must be bytes');let offset=0;
 for(const ref of refs){
  const newline=bytes.indexOf(10,offset);assert(newline>=offset,'Missing immutable commit header');
  const header=/^([a-f0-9]{40}) commit (0|[1-9][0-9]*)$/.exec(bytes.subarray(offset,newline).toString('utf8'));assert(header&&header[1]===ref,'Exact immutable source commit missing or substituted');
  const size=Number(header[2]),start=newline+1,end=start+size;assert(Number.isSafeInteger(size)&&end<bytes.length&&bytes[end]===10,'Malformed immutable source commit length');
  const content=bytes.subarray(start,end),actual=createHash('sha1').update(Buffer.from('commit '+size+'\0')).update(content).digest('hex');assert.equal(actual,ref,'Immutable source commit content address differs');offset=end+1;
 }
 assert.equal(offset,bytes.length,'Trailing immutable source commit bytes');
}
function observedRefs(refs,git){
 const allowed=new Set(refs),bytes=git(['for-each-ref','--format=%(refname)%00%(objectname)%00%(symref)',prefix]);assert(Buffer.isBuffer(bytes),'Local source refs must be bytes');
 const result=new Map();if(!bytes.length)return result;assert.equal(bytes.at(-1),10,'Malformed local source ref output');
 for(const line of bytes.toString('utf8').slice(0,-1).split('\n')){
  const fields=line.split('\0');assert.equal(fields.length,3,'Malformed local source ref fields');const[name,object,symbolic]=fields,id=name.slice(prefix.length);
  assert(name===prefix+id&&/^[a-f0-9]{40}$/.test(id)&&allowed.has(id)&&object===id&&symbolic===''&&!result.has(name),'Foreign conflicting or symbolic source availability ref');result.set(name,object);
 }
 return result;
}
export function ensureClonableSourceLineage(git=native,...extra){
 assert.equal(extra.length,0,'Caller-nominated source refs are forbidden');assert.equal(typeof git,'function','Explicit Git transport function required');
 const refs=cloneSourceLineageRefs;assert(Object.isFrozen(refs)&&refs.length>0&&refs.length<=1024&&refs.every(ref=>/^[a-f0-9]{40}$/.test(ref))&&new Set(refs).size===refs.length,'Only the fixed source lineage roster is allowed');
 const common=native(['rev-parse','--path-format=absolute','--git-common-dir']).toString().trim();assert(isAbsolute(common),'Absolute native source Git common directory required');
 return withSourceObjectLock(common,()=>{
  const supplied=git(['rev-parse','--path-format=absolute','--git-common-dir']).toString().trim();assert(isAbsolute(supplied)&&realpathSync(supplied)===realpathSync(common),'Actual source Git common directory differs');
  const urls=git(['remote','get-url','--all','origin']).toString().trim().split('\n');assert(urls.length===1&&['https://github.com/subvicco12/calcumint.com','https://github.com/subvicco12/calcumint.com.git'].includes(urls[0]),'Exact HTTPS source repository origin required');
  authenticateCommits(refs,git);const before=observedRefs(refs,git),missing=refs.filter(ref=>!before.has(prefix+ref));
  if(missing.length){const transaction=['start',...missing.map(ref=>'create '+prefix+ref+' '+ref),'prepare','commit',''].join('\n');git(['-c','core.hooksPath=/dev/null','update-ref','--no-deref','--stdin'],{input:Buffer.from(transaction),stdio:['pipe','pipe','pipe']});}
  const after=observedRefs(refs,git);assert(after.size===refs.length&&refs.every(ref=>after.get(prefix+ref)===ref),'Exact local clone source refs unavailable after one create-only transaction');
  return Object.freeze({sourceRevisions:refs.length,created:missing.length,sourceAdmission:false,releaseHold:true,productionWrites:false});
 });
}
