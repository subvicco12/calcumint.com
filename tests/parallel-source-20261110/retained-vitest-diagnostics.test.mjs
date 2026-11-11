/** NEGATIVEFIXTURE_NOT_ACCEPTANCE: synthetic child failures must always refuse. */
import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,writeFileSync,readFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {verifyRetainedA7Case,retainedCases} from './retained-vitest.mjs';
const entry='src/lib/execution-recovery-evidence.test.ts',title=retainedCases[entry][0];
function negativeHook(body,run){
 const directory=mkdtempSync(join(tmpdir(),'calcumint-negative-retained-')),hook=join(directory,'negative.cjs'),marker=join(directory,'invocations'),previous=process.env.NODE_OPTIONS;
 // NODE_OPTIONS also reaches the real A7 baseline probe. That process must execute
 // unchanged: intercept only the exact Vitest executable selected by the helper.
 writeFileSync(hook,`if(process.argv[1]&&process.argv[1].endsWith('/vitest.mjs')){${body(marker)}}\n`);
 process.env.NODE_OPTIONS=(previous?previous+' ':'')+'--require '+JSON.stringify(hook);
 try{return run(marker);}finally{if(previous===undefined)delete process.env.NODE_OPTIONS;else process.env.NODE_OPTIONS=previous;rmSync(directory,{recursive:true,force:true});}
}
function refused(){let caught;assert.throws(()=>verifyRetainedA7Case(entry,title),error=>{caught=error;return error instanceof Error;});return caught;}
test('NEGATIVEFIXTURE_NOT_ACCEPTANCE preserves exact failed JSON diagnostics and does not cache failed children',{concurrency:false},()=>{
 const sentinel='NEGATIVEFIXTURE_NOT_ACCEPTANCE_DIAGNOSTIC_23';
 negativeHook(marker=>`const fs=require('node:fs');fs.appendFileSync(${JSON.stringify(marker)},'child\\n');const flag=process.argv.find(value=>value.startsWith('--outputFile='));if(!flag)throw Error('Missing exact outputFile');fs.writeFileSync(flag.slice('--outputFile='.length),JSON.stringify({numFailedTests:1,numPassedTests:0,numFailedTestSuites:1,testResults:[{name:'NEGATIVEFIXTURE_NOT_ACCEPTANCE',message:${JSON.stringify(sentinel)},assertionResults:[{title:${JSON.stringify(title)},status:'failed',failureMessages:[${JSON.stringify(sentinel)}]}]}]}));process.exit(23);`,marker=>{
  const diagnostic=JSON.stringify({numFailedTests:1,numFailedTestSuites:1,testResults:[{name:'NEGATIVEFIXTURE_NOT_ACCEPTANCE',message:sentinel,failedAssertions:[{title,failureMessages:[sentinel]}]}]});
  for(let attempt=0;attempt<2;attempt++){const error=refused();assert.equal(error.message,'Original retained A7 Vitest execution failed: '+entry+'\n'+diagnostic);assert.equal(error.cause.status,23);}
  assert.equal(readFileSync(marker,'utf8'),'child\nchild\n','A failed original child must execute and refuse again');
 });
});
test('NEGATIVEFIXTURE_NOT_ACCEPTANCE preserves unavailable-report diagnostic and original exit status',{concurrency:false},()=>{
 negativeHook(marker=>`require('node:fs').appendFileSync(${JSON.stringify(marker)},'child\\n');process.exit(24);`,marker=>{
  const error=refused();assert(error.message.startsWith('Original retained A7 Vitest execution failed: '+entry+'\nOriginal JSON report unavailable: Error: ENOENT:'));
  assert.equal(error.cause.status,24);assert.equal(readFileSync(marker,'utf8'),'child\n');
 });
});
