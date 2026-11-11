/** Exact original execution-recovery assertions, explicitly retained at A7. */
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {mkdtempSync,readFileSync,rmSync,symlinkSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {verifyParallelSource} from './core.mjs';
import {baselineRef,sourceGit} from './baseline-runtime.mjs';
const root=fileURLToPath(new URL('../../',import.meta.url));
export const retainedCases=Object.freeze({
 'src/lib/execution-recovery-evidence.test.ts':Object.freeze([
  'runs the new exact-source, reviewer and operator guard tests through normal mandatory unit discovery',
  'binds actual authenticated nineteen-identity receipts and independently isolated shared plan gating',
  'binds native UI and actual isolated restore receipts without fabricating human or production acceptance',
 ]),
 'src/lib/remaining-five-evidence.test.ts':Object.freeze(['requires actual five-specific authenticated team artifacts before engineering closure']),
 'src/lib/cohort22-closure-evidence.test.ts':Object.freeze(['binds57 actual source browser journeys,30refusals and distinct A/B without authenticated-browser claims']),
 'src/lib/thirteen-program-evidence.test.ts':Object.freeze(['retains thirteen unsigned exact-version packets, original clause associations and genuine approval gaps']),
});
const completed=new Map();
export function assertRetainedCase(entry,name){
 assert(Object.hasOwn(retainedCases,entry),'Only named historical test entries may execute');
 assert(retainedCases[entry].includes(name),'Only exact original cases may execute');
}
export function assertOriginalReport(entry,report){
 assert(Object.hasOwn(retainedCases,entry),'Only named historical test entries may execute');
 const names=retainedCases[entry];
 assert.equal(report.numFailedTests,0);assert.equal(report.numPassedTests,names.length);assert.equal(report.numFailedTestSuites,0);
 const cases=report.testResults.flatMap(r=>r.assertionResults);
 for(const expected of names){const rows=cases.filter(r=>r.title===expected);assert.equal(rows.length,1);assert.equal(rows[0].status,'passed','Original retained A7 assertion must execute');}
 return true;
}
export function verifyRetainedA7Case(entry,name){
 assertRetainedCase(entry,name);
 const retainedNames=retainedCases[entry];
 assert.equal(verifyParallelSource(),true,'Fresh current R6 proof required before historical execution');
 if(!completed.has(entry)){
  const temporary=mkdtempSync(join(tmpdir(),'calcumint-execution-a7-')),tree=join(temporary,'tree');let added=false;
  try{
   sourceGit(['worktree','add','--detach',tree,baselineRef]);added=true;
   assert.equal(execFileSync('git',['rev-parse','HEAD'],{cwd:tree,encoding:'utf8'}).trim(),baselineRef);
   assert(readFileSync(join(tree,entry)).equals(sourceGit(['show',baselineRef+':'+entry])),'Original assertion source differs');
   symlinkSync(join(root,'node_modules'),join(tree,'node_modules'),'dir');
   const env={...process.env,FORCE_COLOR:'0'};delete env.NODE_TEST_CONTEXT;
   const escaped=retainedNames.map(n=>n.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'));
   const output=join(temporary,'original-vitest.json');
   try{
    execFileSync(process.execPath,[join(root,'node_modules/vitest/vitest.mjs'),'run',entry,'--maxWorkers=1','--reporter=json','--outputFile='+output,'--testNamePattern=^('+escaped.join('|')+')$'],{cwd:tree,env,stdio:'inherit',timeout:120000});
   }catch(cause){
    let diagnostic;
    try{const report=JSON.parse(readFileSync(output,'utf8'));diagnostic=JSON.stringify({numFailedTests:report.numFailedTests,numFailedTestSuites:report.numFailedTestSuites,testResults:report.testResults.map(result=>({name:result.name,message:result.message,failedAssertions:result.assertionResults.filter(assertion=>assertion.status==='failed').map(assertion=>({title:assertion.title,failureMessages:assertion.failureMessages}))}))});}
    catch(reportError){diagnostic='Original JSON report unavailable: '+String(reportError);}
    throw new Error('Original retained A7 Vitest execution failed: '+entry+'\n'+diagnostic,{cause});
   }
   assertOriginalReport(entry,JSON.parse(readFileSync(output,'utf8')));
   completed.set(entry,new Set(retainedNames));
  }finally{try{if(added)sourceGit(['worktree','remove','--force',tree]);}finally{rmSync(temporary,{recursive:true,force:true});}}
 }
 assert(completed.get(entry).has(name));return true;
}
