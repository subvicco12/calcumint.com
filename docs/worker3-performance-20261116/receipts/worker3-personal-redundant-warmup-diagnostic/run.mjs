import {runSourceNode} from '/workspace/calcumint-worker3-recovery/tests/ci-rpc-recovery-20261113/source-node.mjs';
import {writeFileSync} from 'node:fs';import {performance} from 'node:perf_hooks';
const tag=process.argv[2],base='/tmp/worker3-personal-redundant-warmup-diagnostic/',env={...process.env,WORKER3_PROFILE_OUTPUT:base+tag+'-git.jsonl'};delete env.NODE_TEST_CONTEXT;
const args=[...(tag==='original'?[]:['--experimental-loader',base+(tag==='stronger-recovery'?'stronger-loader.mjs':'warmup-loader.mjs')]),'--import',base+'profile.mjs','--test','tests/completion-first-20261112/personal-stage.test.mjs'];
const start=performance.now();let result;
try{const stdout=await runSourceNode(args,{cwd:'/workspace/calcumint-worker3-recovery',env,timeout:60000,maxBuffer:4000000});result={tag,pass:true,ms:performance.now()-start,stdout};}
catch(error){result={tag,pass:false,ms:performance.now()-start,code:error.code,message:error.message,stdout:error.stdout,stderr:error.stderr};}
writeFileSync(base+tag+'-result.json',JSON.stringify({...result,args,timeout:60000,diagnosticOnly:true,qualification:false},null,2));writeFileSync(base+tag+'.log',(result.stdout??'')+'\n'+(result.stderr??''));console.log(JSON.stringify({...result,stdout:'external log',stderr:'external log'}));
