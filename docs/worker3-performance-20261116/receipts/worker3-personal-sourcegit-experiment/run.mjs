import {runSourceNode} from '/workspace/calcumint-worker3-recovery/tests/ci-rpc-recovery-20261113/source-node.mjs';
import {writeFileSync} from 'node:fs';
import {performance} from 'node:perf_hooks';
const tag=process.argv[2],root='/workspace/calcumint-worker3-recovery',base='/tmp/worker3-personal-sourcegit-experiment/';
const env={...process.env,WORKER3_PROFILE_OUTPUT:base+tag+'-calls.jsonl'};delete env.NODE_TEST_CONTEXT;
const target='tests/completion-first-20261112/personal-stage.test.mjs';
const loader=tag==='original'?[]:['--experimental-loader',base+'sourcegit-loader.mjs'];
const start=performance.now();let result;
try{const stdout=await runSourceNode([...loader,'--import',base+'profile.mjs','--test',target],{cwd:root,env,timeout:60000,maxBuffer:4000000});result={tag,pass:true,ms:performance.now()-start,stdout};}
catch(error){result={tag,pass:false,ms:performance.now()-start,code:error.code,signal:error.signal,stdout:error.stdout,stderr:error.stderr,message:error.message};}
writeFileSync(base+tag+'-result.json',JSON.stringify(result,null,2));writeFileSync(base+tag+'.log',(result.stdout??'')+'\n'+(result.stderr??''));console.log(JSON.stringify({...result,stdout:'see external log',stderr:'see external log'}));
