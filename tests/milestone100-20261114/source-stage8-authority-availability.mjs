/** Availability only for an independently pinned caller record; never source admission. */
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {withSourceObjectLock} from '../parallel-source-20261110/source-object-lock.mjs';
const root=fileURLToPath(new URL('../../',import.meta.url));
const authorityPath='tests/parallel-source-20261110/authority.mjs';
const origins=new Set(['https://github.com/subvicco12/calcumint.com','https://github.com/subvicco12/calcumint.com.git']);
const native=(args,options={})=>execFileSync('git',['-c','protocol.file.allow=never','-c','protocol.ext.allow=never',...args],{cwd:root,env:{...process.env,GIT_TERMINAL_PROMPT:'0',LC_ALL:'C'},stdio:['pipe','pipe','pipe'],timeout:60000,maxBuffer:8*1024*1024,...options});
const objectHash=(type,bytes)=>createHash('sha1').update(Buffer.from(`${type} ${bytes.length}\0`)).update(bytes).digest('hex');
export function ensurePinnedAuthorityRecord(record,git=native){
 assert(record&&typeof record==='object'&&!Array.isArray(record),'Exact independently pinned authority record required');
 const fields=Object.getOwnPropertyDescriptors(record);assert.deepEqual(Object.keys(fields).sort(),['blob','ref','sha256']);
 for(const name of ['ref','blob','sha256'])assert(Object.hasOwn(fields[name],'value')&&typeof fields[name].value==='string','Literal authority identity fields required');
 const {ref,blob,sha256}=Object.fromEntries(Object.entries(fields).map(([name,field])=>[name,field.value]));
 assert.match(ref,/^[a-f0-9]{40}$/);assert.match(blob,/^[a-f0-9]{40}$/);assert.match(sha256,/^[a-f0-9]{64}$/);assert.notEqual(ref,'0'.repeat(40));
 const common=resolve(root,native(['rev-parse','--git-common-dir']).toString().trim());
 return withSourceObjectLock(common,()=>{
  const urls=git(['remote','get-url','--all','origin']).toString().trim().split('\n');assert(urls.length===1&&origins.has(urls[0]),'Exact HTTPS CalcuMint repository origin required');
  function present(){
   const spec=ref+'^{commit}',line=git(['cat-file','--batch-check'],{input:Buffer.from(spec+'\n'),stdio:['pipe','pipe','pipe']}).toString();
   if(line===spec+' missing\n')return false;
   const match=/^([a-f0-9]{40}) commit (0|[1-9][0-9]*)\n$/.exec(line);assert(match&&match[1]===ref,'Authority commit identity/type differs');
   const commit=git(['cat-file','commit',ref]);assert(Buffer.isBuffer(commit)&&commit.length===Number(match[2])&&objectHash('commit',commit)===ref,'Authority commit content address differs');
   const entry=git(['ls-tree','-z','--full-tree',ref,'--',authorityPath]).toString();assert.equal(entry,`100644 blob ${blob}\t${authorityPath}\0`,'Authority path or authority blob differs');
   const bytes=git(['cat-file','blob',blob]);assert(Buffer.isBuffer(bytes)&&objectHash('blob',bytes)===blob&&createHash('sha256').update(bytes).digest('hex')===sha256,'Authority bytes differ');
   return true;
  }
  if(!present())git(['fetch','--no-tags','--depth=1','origin',ref]);
  assert(present(),'Exact authority object unavailable after one bounded fetch');
  return Object.freeze({ref,availabilityOnly:true,sourceAdmission:false});
 });
}
