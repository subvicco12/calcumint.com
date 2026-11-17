import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {mkdtempSync,writeFileSync,rmSync} from 'node:fs';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
const helper='tests/parallel-source-20261110/historical-tests.mjs';
const cleanEnv=()=>{const env={...process.env};delete env.NODE_TEST_CONTEXT;return env;};
test('one exact original seven-suite group preserves all21 cases under original45s child budget',()=>{
 const result=execFileSync(process.execPath,[helper,'--first-five-group'],{env:cleanEnv(),encoding:'utf8',timeout:45000,maxBuffer:2*1024*1024});
 assert.match(result,/^# tests 21$/m);assert.match(result,/^# pass 21$/m);assert.match(result,/^# fail 0$/m);assert.match(result,/^# skipped 0$/m);assert.match(result,/^# cancelled 0$/m);assert.match(result,/"currentBefore":true/);assert.match(result,/"currentAfter":true/);
});
test('NEGATIVE_NOT_ACCEPTANCE actual original A7 worker exit17 cannot reuse a passing group result',()=>{
 const directory=mkdtempSync(join(tmpdir(),'calcumint-first-five-negative-')),hook=join(directory,'fail-original-worker.cjs'),previous=process.env.NODE_OPTIONS;
 try{
  writeFileSync(hook,"const {execFileSync}=require('node:child_process');const path=require('node:path');if(process.env.NODE_TEST_CONTEXT&&process.argv[1]&&path.resolve(process.argv[1])===path.join(process.cwd(),'tests/first-five-20261109/source-lineage.test.mjs')&&execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim()==='a7bab5b5534d51cea25ba5ffe4aa9b3630176909'){process.stderr.write('NEGATIVE_NOT_ACCEPTANCE_ORIGINAL_A7_WORKER_EXIT17\\n');process.exit(17);}\n");
  process.env.NODE_OPTIONS=(previous?previous+' ':'')+'--require='+hook;
  assert.throws(()=>execFileSync(process.execPath,[helper,'--first-five-group'],{env:cleanEnv(),encoding:'utf8',timeout:45000,maxBuffer:4*1024*1024}),error=>error.status!==0&&String(error.stdout??'').concat(String(error.stderr??''),error.message).includes('NEGATIVE_NOT_ACCEPTANCE_ORIGINAL_A7_WORKER_EXIT17'));
 }finally{if(previous===undefined)delete process.env.NODE_OPTIONS;else process.env.NODE_OPTIONS=previous;rmSync(directory,{recursive:true,force:true});}
});
