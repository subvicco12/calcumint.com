import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync,mkdtempSync,rmSync} from 'node:fs';
import {execFileSync} from 'node:child_process';import {tmpdir} from 'node:os';import {join} from 'node:path';
import {sourceGit} from '../parallel-source-20261110/baseline-runtime.mjs';
import {proveSourceStage9} from '../four-worker-integration-20261115/source-stage9.mjs';
import {provePinnedSourceStage8,sourceStage8Policy,sourceStage8CapturePath} from '../milestone100-20261114/source-stage8-activation.mjs';
import {proveSourceStage8AndHistoricalInputs,refreshPrivatePinnedStage8,createSourceStage8ObservationInput,sourceStage8HistoricalView} from '../milestone100-20261114/source-stage8.mjs';
import {sourceStage10Policy} from './source-stage10-current32-policy.mjs';
const root=process.cwd(),input={root,read:readFileSync,git:sourceGit};
test('canonical bound projection facts cannot be changed through public maps and refresh still checks live sources',()=>{
 let bad;const read=path=>path===bad?Buffer.from('changed actual source'):readFileSync(path),p=provePinnedSourceStage8({...input,read}),first=p.live.entries().next().value;
 p.live.clear();assert.equal(p.live.size,24);assert.throws(()=>{first[1].current.sha256='0'.repeat(64);},TypeError);
 assert.equal(provePinnedSourceStage8(p.historicalInput),p);assert.equal(p.live.size,24);
 for(const path of [sourceStage8CapturePath,...sourceStage10Policy.paths.slice(0,1)]){bad=path;assert.throws(()=>provePinnedSourceStage8(p.historicalInput),/capture digest differs|Current factory bytes differ/);bad=undefined;}
 assert.throws(()=>provePinnedSourceStage8({...p.historicalInput,read:readFileSync}),/reader capability differs/);assert.throws(()=>provePinnedSourceStage8({...p.historicalInput,root:root+'/other'}),/root differs/);
});
test('generic policy identity cannot use the canonical private refresh path',()=>{
 const prior=proveSourceStage9(input),generic=proveSourceStage8AndHistoricalInputs({...prior.historicalInput,policy:{...sourceStage8Policy},capturePath:sourceStage8CapturePath});
 assert.equal(refreshPrivatePinnedStage8(generic.historicalInput),undefined);const current=provePinnedSourceStage8(generic.historicalInput);assert.notEqual(current,generic);assert.equal(current.live.size,24);
});
test('observation aliases always rebuild through observed providers and retain all actual current-source reads',()=>{
 const p=provePinnedSourceStage8(input),observed=createSourceStage8ObservationInput(p.historicalInput),alias=sourceStage8HistoricalView(observed.input.git);
 assert.equal(refreshPrivatePinnedStage8(observed.input),undefined);assert.notEqual(provePinnedSourceStage8(observed.input),alias);
 for(const path of sourceStage10Policy.paths)assert(observed.collector.readPaths().includes(path));observed.collector.seal();observed.collector.replay();observed.collector.assertHealthy();
});
test('bound refresh preserves delegated HEAD and status refusals',()=>{
 let changed;const git=(args,options)=>changed==='head'&&JSON.stringify(args)===JSON.stringify(['rev-parse','--verify','HEAD^{commit}'])?Buffer.from(sourceStage10Policy.codeRef+'\n'):changed==='status'&&args[0]==='status'?Buffer.from('?? src/unknown.ts\n'):sourceGit(args,options),p=provePinnedSourceStage8({...input,git});
 changed='head';assert.throws(()=>provePinnedSourceStage8(p.historicalInput),/Native HEAD moved|supplied HEAD differs/);changed='status';assert.throws(()=>provePinnedSourceStage8(p.historicalInput),/Dirty or unknown current source/);changed=undefined;assert.equal(provePinnedSourceStage8(p.historicalInput),p);
});

test('bound Stage8 refresh rejects ignored and index-suppressed source in an isolated clone',()=>{
 const dir=mkdtempSync(join(tmpdir(),'stage8-hidden-refresh-')),tree=join(dir,'clone'),git=args=>execFileSync('git',args,{stdio:['ignore','pipe','pipe'],maxBuffer:64000000});
 try{
  git(['clone','--shared','--quiet','--no-checkout',root,tree]);git(['-C',tree,'checkout','--quiet','--detach','HEAD']);
  const activation=new URL('../milestone100-20261114/source-stage8-activation.mjs',import.meta.url).href,readerModule=new URL('../parallel-source-20261110/git-reader.mjs',import.meta.url).href;
  const script=`import assert from 'node:assert/strict';import {readFileSync,writeFileSync,rmSync} from 'node:fs';import {execFileSync} from 'node:child_process';import {makeGitReader} from ${JSON.stringify(readerModule)};import {provePinnedSourceStage8} from ${JSON.stringify(activation)};
   const git=makeGitReader((a,options={})=>execFileSync('git',a,{stdio:['ignore','pipe','pipe'],maxBuffer:64000000,...options})),p=provePinnedSourceStage8({root:process.cwd(),read:readFileSync,git}),refresh=()=>provePinnedSourceStage8(p.historicalInput);
   assert.equal(refresh(),p);const exclude=readFileSync('.git/info/exclude');writeFileSync('.git/info/exclude',Buffer.concat([exclude,Buffer.from('\\nsrc/.ignored-refresh.ts\\n')]));writeFileSync('src/.ignored-refresh.ts','hidden source');assert.equal(git(['status','--porcelain','--untracked-files=all','--','src']).length,0);assert.throws(refresh,/native dirty or unknown source/);rmSync('src/.ignored-refresh.ts');writeFileSync('.git/info/exclude',exclude);
   const path='src/app/account/actions.ts',original=readFileSync(path);for(const[setFlag,clearFlag]of[['--assume-unchanged','--no-assume-unchanged'],['--skip-worktree','--no-skip-worktree']]){git(['update-index',setFlag,path]);writeFileSync(path,'changed hidden source');assert.equal(git(['status','--porcelain','--untracked-files=all','--','src']).length,0);assert.throws(refresh,/native source index flag|native dirty or unknown source/);writeFileSync(path,original);git(['update-index',clearFlag,path]);assert.equal(refresh(),p);}`;
  execFileSync(process.execPath,['--input-type=module','-'],{cwd:tree,input:script,stdio:['pipe','pipe','pipe'],timeout:15000,maxBuffer:1000000});
 }finally{rmSync(dir,{recursive:true,force:true});}
});
