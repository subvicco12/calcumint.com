import test from 'node:test';import assert from 'node:assert/strict';import {execFile} from 'node:child_process';import {writeFileSync,appendFileSync,readFileSync} from 'node:fs';
const dir='/tmp/worker3-scope-preload-pair',env={...process.env};delete env.NODE_TEST_CONTEXT;const start=performance.now(),pgid=Number(readFileSync('/proc/self/stat','utf8').split(') ')[1].split(' ')[2]);const jobs=[['tests/milestone100-20261114/source-stage8-authority-scope.test.mjs',10],['tests/completion-wave-20261113/source-authority-preload.test.mjs',6]];const emit=row=>appendFileSync(dir+'/events.jsonl',JSON.stringify(row)+'\n');
test('bounded original authority scope10 and preload6 run together without relaxing either contract',{timeout:30000},async context=>{
 const run=([file,count],id)=>new Promise(resolve=>{
  const began=performance.now(),output=dir+'/'+id+'.stdout',errput=dir+'/'+id+'.stderr';writeFileSync(output,'');writeFileSync(errput,'');
  const child=execFile(process.execPath,[file],{env,encoding:'utf8',timeout:30000,maxBuffer:1000000,signal:context.signal},(error,stdout,stderr)=>{
   const wallMS=performance.now()-began,summary={};for(const key of ['tests','pass','fail','cancelled','skipped','duration_ms']){const match=stdout.match(new RegExp('^# '+key+' ([0-9.]+)$','m'));if(match)summary[key]=Number(match[1]);}
   const row={id,file,count,pid:child.pid,parentPID:process.pid,pgid,wallMS,timeout:30000,maxBuffer:1000000,summary,error:error?{name:error.name,code:error.code,killed:error.killed,signal:error.signal,message:error.message}:null};emit({event:'complete',...row});resolve(row);
  });
  child.stdout.on('data',chunk=>appendFileSync(output,chunk));child.stderr.on('data',chunk=>appendFileSync(errput,chunk));emit({event:'start',id,file,count,pid:child.pid,parentPID:process.pid,pgid,timeMS:performance.now()-start,argv:[file],timeout:30000,maxBuffer:1000000,encoding:'utf8'});
 });
 const results=await Promise.all(jobs.map(run));writeFileSync(dir+'/children.json',JSON.stringify(results,null,2)+'\n');
 for(const row of results){assert.equal(row.error,null,row.file);assert.equal(row.summary.tests,row.count,row.file);assert.equal(row.summary.pass,row.count,row.file);for(const key of ['fail','skipped','cancelled'])assert.equal(row.summary[key],0,row.file);}
});
