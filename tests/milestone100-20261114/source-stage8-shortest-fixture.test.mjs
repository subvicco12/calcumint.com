import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,mkdtempSync,rmSync,lstatSync,symlinkSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {execFileSync} from 'node:child_process';
import {withPrivateCurrentGit,assertPrivateFixtureSnapshotStable,expectedShortestFixtureSuccessor,validatePrivateFixtureOrigin} from './source-stage8-shortest-fixture.mjs';
import {provePinnedSourceStage8} from './source-stage8-activation.mjs';
const root=process.cwd(),git=(args,cwd=root)=>execFileSync('git',args,{cwd,maxBuffer:32*1024*1024});
function temporary(run){const directory=mkdtempSync(join(tmpdir(),'stage8-private-admin-'));try{return run(directory);}finally{rmSync(directory,{recursive:true,force:true});}}
test('partial fixture has private copied index, detached current HEAD and real actual-worktree status',()=>temporary(directory=>withPrivateCurrentGit(directory,root,()=>{
 assert(!lstatSync(join(directory,'.git')).isSymbolicLink());assert.notEqual(lstatSync(join(directory,'.git','index')).ino,lstatSync(git(['rev-parse','--path-format=absolute','--git-path','index']).toString().trim()).ino);
 assert(git(['status','--porcelain=v1','--untracked-files=all','--','src'],directory).equals(git(['status','--porcelain=v1','--untracked-files=all','--','src'])));assert.equal(git(['rev-parse','HEAD'],directory).toString(),git(['rev-parse','HEAD']).toString());
})));
test('real private-index source mutation is observed and current source gate denies without touching actual source',()=>temporary(directory=>{
 const before=git(['status','--porcelain=v1','--untracked-files=all','--','src']);withPrivateCurrentGit(directory,root,()=>{
 const blob=git(['rev-parse','HEAD:src/components/saved-calculation-actions.tsx']).toString().trim();git(['update-index','--cacheinfo','100644,'+blob+',src/components/calculator-interactive.tsx'],directory);
 assert(git(['status','--porcelain=v1','--untracked-files=all','--','src'],directory).length>0);
 assert.throws(()=>provePinnedSourceStage8({root,read:readFileSync,git:args=>git(args,directory)}),/Dirty or unknown current source/);
 assert(git(['status','--porcelain=v1','--untracked-files=all','--','src']).equals(before));});
}));
test('snapshot stability refuses actual-head movement and semantic source-status changes',()=>{
 const before={head:'a'.repeat(40),status:Buffer.alloc(0)};assertPrivateFixtureSnapshotStable(before,{...before,status:Buffer.alloc(0)});
 assert.throws(()=>assertPrivateFixtureSnapshotStable(before,{...before,head:'b'.repeat(40)}),/HEAD moved/);assert.throws(()=>assertPrivateFixtureSnapshotStable(before,{...before,status:Buffer.from(' M src/changed.ts')}),/status changed/);
});
test('fixture successor is exactly the named imports, private constructor and added positive control',()=>{
 const path='tests/shortest-publication-20/caller-lineage.test.mjs',old=git(['show','eac9a6c23ae4d8f1abb607e32f57ce0d422a3cb8:'+path]).toString();assert.equal(readFileSync(path,'utf8'),expectedShortestFixtureSuccessor(old));assert.throws(()=>expectedShortestFixtureSuccessor(old.replace('return fn(dir);','return false;')));
});

test('preexisting Git administration and noncanonical temporary locations are refused before writes',()=>temporary(directory=>{
 const actualIndex=git(['rev-parse','--path-format=absolute','--git-path','index']).toString().trim(),before=readFileSync(actualIndex);symlinkSync(git(['rev-parse','--absolute-git-dir']).toString().trim(),join(directory,'.git'),'dir');assert.throws(()=>withPrivateCurrentGit(directory,root,()=>{}),/must not preexist/);assert(readFileSync(actualIndex).equals(before));assert.throws(()=>withPrivateCurrentGit(root,root,()=>{}));
}));
test('only two public canonical origins and synchronous callbacks are allowed',()=>{
 for(const origin of ['https://github.com/subvicco12/calcumint.com','https://github.com/subvicco12/calcumint.com.git'])assert.equal(validatePrivateFixtureOrigin(origin),origin);
 for(const origin of ['https://user:secret@github.com/subvicco12/calcumint.com.git','https://github.com/subvicco12/calcumint.com.git\nhttps://example.invalid/repo','file:///tmp/repo','https://example.invalid/repo'])assert.throws(()=>validatePrivateFixtureOrigin(origin));
 temporary(directory=>assert.throws(()=>withPrivateCurrentGit(directory,root,()=>Promise.resolve(true)),/must be synchronous/));
});
