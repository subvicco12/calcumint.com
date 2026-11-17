import {runSourceNode} from '/workspace/calcumint-worker3-recovery/tests/ci-rpc-recovery-20261113/source-node.mjs';
import {writeFileSync,readFileSync} from 'node:fs';
import {performance} from 'node:perf_hooks';
const base='/tmp/worker3-source150-reorder-diagnostic/',root='/workspace/calcumint-worker3-recovery',env={...process.env};delete env.NODE_TEST_CONTEXT;
const originalArgs=['--test','--test-concurrency=2','--test-reporter=tap','--test-reporter-destination='+base+'cases.tap','tests/parallel-source-20261110/application-successor.test.mjs','tests/parallel-source-20261110/current.test.mjs','tests/parallel-source-20261110/git-reader.test.mjs','tests/parallel-source-20261110/retained-vitest.test.mjs','tests/parallel-source-20261110/source-object-lock.test.mjs','tests/parallel-source-20261110/retained-vitest-diagnostics.test.mjs','tests/parallel-source-20261110/historical-group.test.mjs'];
const args=['--experimental-loader',base+'reorder-loader.mjs',...originalArgs];
let ticks=0;const heartbeat=setInterval(()=>ticks++,10),start=performance.now();let result;
try{const stdout=await runSourceNode(args,{cwd:root,env,stdio:'inherit',timeout:150000});result={pass:true,ms:performance.now()-start,stdout};}
catch(error){result={pass:false,ms:performance.now()-start,code:error.code,signal:error.signal,stdout:error.stdout,stderr:error.stderr,message:error.message};}
finally{clearInterval(heartbeat);}
let tap='';try{tap=readFileSync(base+'cases.tap','utf8');}catch{}
result={...result,diagnosticOnly:true,qualification:false,originalArgs,args,timeout:150000,heartbeatTicks:ticks,tapSummary:tap.split('\n').filter(line=>/^# (?:tests|pass|fail|cancelled|skipped|duration_ms) /.test(line)),completedCases:(tap.match(/^ok \d+ - /gm)||[]).length,failedCases:(tap.match(/^not ok \d+ - /gm)||[]).length,full115:/# tests 115\b/.test(tap)&&/# pass 115\b/.test(tap)&&/# fail 0\b/.test(tap)&&/# skipped 0\b/.test(tap)};
writeFileSync(base+'result.json',JSON.stringify(result,null,2));writeFileSync(base+'stdout.log',result.stdout??'');writeFileSync(base+'stderr.log',result.stderr??'');console.log(JSON.stringify({...result,stdout:'external log',stderr:'external log'}));
