import {writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const target='file:///workspace/calcumint-worker3-recovery/tests/parallel-source-20261110/baseline-runtime.mjs';
const needle="export const sourceGit=makeGitReader((args,options={})=>execFileSync('git',args,{cwd:root,stdio:['ignore','pipe','pipe'],maxBuffer:16*1024*1024,...options}));";
export async function load(url,context,nextLoad){
 const result=await nextLoad(url,context);
 if(url!==target)return result;
 const original=result.source.toString();
 if(original.split(needle).length!==2)throw Error('Exact baseline native sourceGit initializer required');
 const replacement="export const sourceGit=makeGitReader((args,options={})=>{const start=worker3performance.now();let ok=false;try{const result=privateGitBuffer(args,{cwd:root,stdio:['ignore','pipe','pipe'],maxBuffer:16*1024*1024,...options});ok=true;return result;}finally{worker3appendFileSync(process.env.WORKER3_PROFILE_OUTPUT,JSON.stringify({pid:process.pid,kind:'advisory-sourceGit',args,ms:worker3performance.now()-start,ok})+'\\n');}});";
 const imports="import {privateGitBuffer} from 'file:///workspace/calcumint-worker3-recovery/tests/next-engineering-20261115/source-private-git-transport.mjs';\nimport {appendFileSync as worker3appendFileSync} from 'node:fs';\nimport {performance as worker3performance} from 'node:perf_hooks';\n";
 const transformed=imports+original.replace(needle,replacement);
 const base='/tmp/worker3-personal-sourcegit-experiment/';
 writeFileSync(base+'transformed-baseline-runtime.mjs',transformed);
 writeFileSync(base+'loader-manifest.json',JSON.stringify({diagnosticOnly:true,qualification:false,target,originalSHA256:createHash('sha256').update(original).digest('hex'),transformedSHA256:createHash('sha256').update(transformed).digest('hex'),needle,replacement,imports},null,2));
 return {...result,source:transformed};
}
