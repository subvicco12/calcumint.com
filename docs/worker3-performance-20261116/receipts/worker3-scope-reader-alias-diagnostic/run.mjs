import {runSourceNode} from '/workspace/calcumint-worker3-recovery/tests/ci-rpc-recovery-20261113/source-node.mjs';
import {writeFileSync} from 'node:fs';import {performance} from 'node:perf_hooks';
const tag=process.argv[2],base='/tmp/worker3-scope-reader-alias-diagnostic/',env={...process.env};delete env.NODE_TEST_CONTEXT;
const args=[...(tag==='original'?[]:['--experimental-loader',base+'loader.mjs']),'tests/milestone100-20261114/source-stage8-authority-scope.test.mjs'];const start=performance.now();let result;
try{const stdout=await runSourceNode(args,{cwd:'/workspace/calcumint-worker3-recovery',env,timeout:30000,maxBuffer:1000000});result={tag,pass:true,ms:performance.now()-start,stdout};}catch(error){result={tag,pass:false,ms:performance.now()-start,code:error.code,signal:error.signal,stdout:error.stdout,stderr:error.stderr,message:error.message};}
writeFileSync(base+tag+'-result.json',JSON.stringify({...result,args,timeout:30000,diagnosticOnly:true,qualification:false},null,2));writeFileSync(base+tag+'.log',(result.stdout??'')+'\n'+(result.stderr??''));console.log(JSON.stringify({...result,stdout:'external log',stderr:'external log'}));
