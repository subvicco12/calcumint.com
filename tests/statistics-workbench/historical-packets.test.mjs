import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {copyFileSync,mkdirSync,mkdtempSync,readFileSync,rmSync,symlinkSync,writeFileSync} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import test from 'node:test';
import {checkHistoricalSixPackets,SIX_SOURCE_REF} from '../../scripts/check-historical-six-packets.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const artifactPath='docs/full-product-six-closure';
const caller='src/components/calculator-interactive.tsx';
function fixture(run){
 const directory=mkdtempSync(path.join(os.tmpdir(),'six-packets-test-'));
 try{
  const gitDirectory=execFileSync('git',['rev-parse','--absolute-git-dir'],{cwd:root}).toString().trim();
  symlinkSync(gitDirectory,path.join(directory,'.git'),'dir');
  const packet=JSON.parse(readFileSync(path.join(root,artifactPath,'qa-evidence-six.json')));
  for(const name of [...packet.sourceBindings.map(b=>b.path),artifactPath+'/qa-evidence-six.json',artifactPath+'/eligibility-six.json']){
   mkdirSync(path.dirname(path.join(directory,name)),{recursive:true});copyFileSync(path.join(root,name),path.join(directory,name));
  }
  return run(directory);
 }finally{rmSync(directory,{recursive:true,force:true});}
}
test('reproduces two frozen artifacts from 21 exact source bindings',()=>{
 const result=checkHistoricalSixPackets();
 assert.equal(result.sourceRef,SIX_SOURCE_REF);assert.equal(result.artifactsChecked,2);assert.equal(result.sourceFilesChecked,21);
 assert.equal(JSON.parse(result.originalGeneratorOutput).eligible,0);
});
for(const name of ['qa-evidence-six.json','eligibility-six.json'])test('rejects changed '+name,()=>fixture(directory=>{
 const file=path.join(directory,artifactPath,name);writeFileSync(file,readFileSync(file)+' ');
 assert.throws(()=>checkHistoricalSixPackets({repositoryRoot:directory}),/artifact bytes differ/);
}));
test('rejects missing frozen artifact',()=>fixture(directory=>{
 rmSync(path.join(directory,artifactPath,'eligibility-six.json'));
 assert.throws(()=>checkHistoricalSixPackets({repositoryRoot:directory}),/ENOENT/);
}));
test('rejects arbitrary current caller changes',()=>fixture(directory=>{
 writeFileSync(path.join(directory,caller),'unapproved caller');
 assert.throws(()=>checkHistoricalSixPackets({repositoryRoot:directory}),/Current bound source bytes differ.*calculator-interactive/);
}));
test('rejects stale bound source and generator changes',()=>{
 for(const name of ['src/lib/six-candidate-numeric-safety.ts','scripts/six-publication-closure/packets.mjs'])fixture(directory=>{
  writeFileSync(path.join(directory,name),'stale source');
  assert.throws(()=>checkHistoricalSixPackets({repositoryRoot:directory}),/Current bound source bytes differ/);
 });
});
test('rejects bound source symlinks',()=>fixture(directory=>{
 const file=path.join(directory,caller);rmSync(file);symlinkSync(path.join(root,caller),file);
 assert.throws(()=>checkHistoricalSixPackets({repositoryRoot:directory}),/symlink/);
}));
test('fails closed when exact capture is unavailable',()=>{
 const directory=mkdtempSync(path.join(os.tmpdir(),'six-missing-capture-'));
 try{
  execFileSync('git',['init','--quiet',directory]);
  assert.throws(()=>checkHistoricalSixPackets({repositoryRoot:directory}),/Exact six-packet source capture unavailable/);
 }finally{rmSync(directory,{recursive:true,force:true});}
});
