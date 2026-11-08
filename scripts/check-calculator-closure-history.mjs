/** Frozen packet tests run against their exact predecessor caller. The new caller is separately hash-bound. */
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {existsSync,lstatSync,mkdirSync,mkdtempSync,readFileSync,rmSync,symlinkSync,writeFileSync} from 'node:fs';
import path from 'node:path';
import {batch21BrowserPath,verifyBatch21BrowserLineage} from './batch21-browser-lineage.mjs';
import {verifyPublication20CallerLineage} from './publication20-caller-lineage.mjs';
import os from 'node:os';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const manifest='docs/calculator-first-20261105/execution-manifest.json';
const caller='src/components/calculator-interactive.tsx';
const guard='scripts/check-historical-six-packets.mjs',tests='tests/statistics-workbench/historical-packets.test.mjs';
const fullSixGuard='scripts/full-six/check-evidence.mjs',fullSixManifest='docs/full-six/execution-manifest.json';
const expectedPaths=[caller,'src/components/registered-launch-tool.tsx',guard,tests,fullSixGuard,fullSixManifest].sort();
const originalGuardHashes={
 [fullSixGuard]:'02adf09fbb92cb40efc3d531c7bd6ef18aa9fb538d5bfce43d44383d41f0752a',
 [fullSixManifest]:'13bed3eab4b23b086714a39ca5dbeff613af8aa0f4b63b74474e25f378cb8c3c',
 [guard]:'4f9f23354309e4f36d95ee3a7a5563b6fdabadaa3c18f7cb0f30d9ac7462b089',
 [tests]:'b3656da24b88e63de8f733a6a689096923508e519e608a26f15b4cffc1dfd130',
};
function readSafe(directory,name){
 if(typeof name!=='string'||path.posix.isAbsolute(name)||name.includes('\\')||name.split('/').some(p=>!p||p==='.'||p==='..'))throw Error('Unsafe binding path');
 let full=directory;
 if(lstatSync(full).isSymbolicLink())throw Error('Unsafe root symlink');
 for(const part of name.split('/')){full=path.join(full,part);if(lstatSync(full).isSymbolicLink())throw Error('Unsafe binding symlink: '+name);}
 if(!lstatSync(full).isFile())throw Error('Binding is not a file');return readFileSync(full);
}
export function verifyCallerSuccessor(directory=root){
 const m=JSON.parse(readSafe(directory,manifest));
 if(m.baseline!=='4796b3d7679a06f0751cac8cfec687c88f386ae5'||m.callerPredecessorRef!=='af94b00cee5e8ef53e2b6ecdf1501c6b45cbaee5'||m.frozenSixSourceRef!=='c1c7371ac4f284ff7b6371a90fb3296c632396f9')throw Error('Exact predecessor binding differs');
 const hashes=m.callerSuccessorHashes;
 if(!hashes||JSON.stringify(Object.keys(hashes).sort())!==JSON.stringify(expectedPaths))throw Error('Caller successor binding membership differs');
 for(const name of expectedPaths){
  if(!/^[a-f0-9]{64}$/.test(hashes[name])||originalGuardHashes[name]&&hashes[name]!==originalGuardHashes[name])throw Error('Frozen guard hash differs: '+name);
  const current=readSafe(directory,name);
  if(createHash('sha256').update(current).digest('hex')!==hashes[name]){
   if(name!==caller||!existsSync(path.join(directory,'docs/shortest-publication-20/caller-lineage.json')))throw Error('Caller successor hash differs: '+name);
   const next=verifyPublication20CallerLineage(directory);
   if(createHash('sha256').update(next.predecessorCallerBytes).digest('hex')!==hashes[name])throw Error('Caller predecessor hash differs: '+name);
  }
 }
 return {callerSuccessorVerified:true,bindingsVerified:expectedPaths.length};
}
export function checkCalculatorClosureHistory({fullSixOnly=false}={}){
 const verified=verifyCallerSuccessor();
 const m=JSON.parse(readSafe(root,manifest));
 const git=args=>execFileSync('git',args,{cwd:root,maxBuffer:128*1024*1024,stdio:['pipe','pipe','pipe']});
 for(const ref of [m.baseline,m.callerPredecessorRef,m.frozenSixSourceRef])if(git(['rev-parse','--verify',ref+'^{commit}']).toString().trim()!==ref)throw Error('Exact predecessor unavailable');
 const oldCaller=git(['show',m.callerPredecessorRef+':'+caller]);
 if(!git(['show',m.baseline+':'+caller]).equals(oldCaller))throw Error('Baseline caller does not equal the recorded predecessor');
 const artifact='docs/full-product-six-closure';
 const packet=JSON.parse(readSafe(root,artifact+'/qa-evidence-six.json'));
 const browserBindings=packet.sourceBindings.filter(b=>b.path===batch21BrowserPath);
 if(browserBindings.length!==1)throw Error('Batch21 frozen binding membership differs');
 const browserLineage=verifyBatch21BrowserLineage(root,browserBindings[0].sha256);
 const fullSix=JSON.parse(readSafe(root,fullSixManifest)),integrity=JSON.parse(readSafe(root,'docs/full-six/package-integrity.json'));
 const temp=mkdtempSync(path.join(os.tmpdir(),'calculator-frozen-predecessor-'));
 try{
  symlinkSync(git(['rev-parse','--absolute-git-dir']).toString().trim(),path.join(temp,'.git'),'dir');
  const paths=[...packet.sourceBindings.map(b=>b.path),artifact+'/qa-evidence-six.json',artifact+'/eligibility-six.json',guard,tests,fullSixGuard,fullSixManifest,'docs/full-six/package-integrity.json',...Object.keys(fullSix.sourceHashes),...Object.keys(integrity.retainedFiles).map(name=>'docs/full-six/input/'+name)];
  for(const name of new Set(paths)){const bytes=name===caller?oldCaller:name===batch21BrowserPath?browserLineage.predecessorBrowserBytes:readSafe(root,name);const dest=path.join(temp,name);mkdirSync(path.dirname(dest),{recursive:true});writeFileSync(dest,bytes);}
  const options={cwd:temp,maxBuffer:128*1024*1024,stdio:['pipe','pipe','pipe']};
  const frozenFullSix=JSON.parse(execFileSync(process.execPath,[fullSixGuard],options).toString());
  if(fullSixOnly)return {...verified,browserSuccessorRef:browserLineage.browserSuccessorRef,browserPredecessorRef:browserLineage.browserPredecessorRef,browserBindingsVerified:browserLineage.browserBindingsVerified,frozenFullSix,scope:'Original full-six guard and 24 source bindings, including the exact predecessor caller; current caller and four-file Batch21 browser successor verified separately. No acceptance promotion.'};
  const frozen=JSON.parse(execFileSync(process.execPath,[guard],options).toString());
  const testEnv={...process.env};delete testEnv.NODE_TEST_CONTEXT;
  const negativeTests=execFileSync(process.execPath,['--test','--test-reporter=tap',tests],{...options,env:testEnv}).toString();
  return {...verified,browserSuccessorRef:browserLineage.browserSuccessorRef,browserPredecessorRef:browserLineage.browserPredecessorRef,browserBindingsVerified:browserLineage.browserBindingsVerified,frozenSourceRef:m.frozenSixSourceRef,historicalCallerRef:m.callerPredecessorRef,frozen,frozenFullSix,originalHistoricalNegativeTests:negativeTests,scope:'Original guards and frozen 21-source/two-packet evidence run unchanged in an exact predecessor fixture. The current caller and four-file Batch21 browser harness are separately bound successors, never asserted equal to historical source. No certification or publication authority.'};
 }finally{rmSync(temp,{recursive:true,force:true});}
}
if(process.argv[1]===fileURLToPath(import.meta.url))console.log(JSON.stringify(checkCalculatorClosureHistory({fullSixOnly:process.argv.includes('--full-six-only')})));
