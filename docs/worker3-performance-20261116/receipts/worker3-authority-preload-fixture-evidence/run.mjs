import {runSourceNode} from '/workspace/calcumint-worker3-authority-preload-fixture/tests/ci-rpc-recovery-20261113/source-node.mjs';
import {writeFileSync} from 'node:fs';import {performance} from 'node:perf_hooks';
const tag=process.argv[2],base='/tmp/worker3-authority-preload-fixture-evidence/',env={...process.env,WORKER3_PROFILE_OUTPUT:base+tag+'-git.jsonl'};delete env.NODE_TEST_CONTEXT;
let result;const start=performance.now();
try{const stdout=await runSourceNode(['--import',base+'profile.mjs','tests/completion-wave-20261113/source-authority-preload.test.mjs'],{cwd:'/workspace/calcumint-worker3-authority-preload-fixture',env,timeout:30000,maxBuffer:1000000});result={tag,pass:true,ms:performance.now()-start,stdout};}
catch(error){result={tag,pass:false,ms:performance.now()-start,code:error.code,message:error.message,stdout:error.stdout,stderr:error.stderr};}
writeFileSync(base+tag+'-result.json',JSON.stringify(result,null,2));writeFileSync(base+tag+'.log',(result.stdout??'')+'\n'+(result.stderr??''));console.log(JSON.stringify({...result,stdout:'external TAP',stderr:'external log'}));
