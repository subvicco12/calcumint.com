import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {mkdtempSync,readFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve,relative,isAbsolute} from 'node:path';
import {fileURLToPath} from 'node:url';

export const RETAINED23_COMMIT='23f2860c16310385f6c37f7a2bc3c86890631c98';
const repository=fileURLToPath(new URL('../../',import.meta.url));
const commands=Object.freeze({
 auth:[process.execPath,['tests/next-cohort-auth-current-20261110/verify.mjs']],
 ui:[process.execPath,['tests/next-cohort-ui-current-20261110/verify.mjs']],
 native:[process.execPath,['tests/remaining-five-native-20261110/verify.mjs']],
 canonicalVerify:['python',['docs/canonical-three-20261110/verify.py']],
 canonicalTests:['python',['docs/canonical-three-20261110/test_packets.py']],
});
// CURRENT proof is deliberately a fixed implementation import, supplied by the
// separately owned R4 source proof. There is no callback/no-op proof parameter.
export async function withRetained23Proof(callback){
 const {verifyCurrentNextFiveSource}=await import('./source/current-proof.mjs');
 assert.equal(await verifyCurrentNextFiveSource(),true);
 const env={...process.env,PYTHONDONTWRITEBYTECODE:'1'};delete env.NODE_TEST_CONTEXT;
 const git=args=>execFileSync('git',args,{cwd:repository,env,encoding:'utf8',timeout:30000,maxBuffer:4000000,stdio:['ignore','pipe','pipe']});
 assert.equal(git(['rev-parse',RETAINED23_COMMIT+'^{commit}']).trim(),RETAINED23_COMMIT);
 const temporary=mkdtempSync(join(tmpdir(),'calcumint-retained23-')),root=join(temporary,'checkout');let added=false;
 try{
  git(['worktree','add','--detach',root,RETAINED23_COMMIT]);added=true;
  assert.equal(execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim(),RETAINED23_COMMIT);
  const read=file=>{assert.equal(typeof file,'string');assert(!isAbsolute(file));const target=resolve(root,file),rel=relative(root,target);assert(rel&&!rel.startsWith('..')&&!isAbsolute(rel));return readFileSync(target);};
  const runVerifier=key=>{assert(Object.hasOwn(commands,key),'Unknown retained verifier');const [program,args]=commands[key];return execFileSync(program,args,{cwd:root,env,encoding:'utf8',timeout:60000,maxBuffer:4000000,stdio:['ignore','pipe','pipe']});};
  return await callback({label:'RETAINED23',commit:RETAINED23_COMMIT,root,read,runVerifier});
 }finally{
  try{if(added)git(['worktree','remove','--force',root]);}finally{rmSync(temporary,{recursive:true,force:true});}
 }
}
