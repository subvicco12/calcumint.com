import test from 'node:test';import assert from 'node:assert/strict';import {execFileSync} from 'node:child_process';import {mkdtempSync,mkdirSync,writeFileSync,readFileSync,rmSync} from 'node:fs';import {tmpdir} from 'node:os';import {join} from 'node:path';import {pathToFileURL} from 'node:url';
import {immutableTreeQueryReader} from '../milestone100-20261114/source-immutable-queries.mjs';
test('native immutable view stays canonical across changed cwd, diff config, pathspec flags and replaced objects',async()=>{
 const root=mkdtempSync(join(tmpdir(),'calcumint-native-view-')),before=process.cwd(),oldGlob=process.env.GIT_ICASE_PATHSPECS;
 const git=args=>execFileSync('git',args,{cwd:root,stdio:['ignore','pipe','pipe']});
 try{
  mkdirSync(join(root,'src'));mkdirSync(join(root,'tests/next-engineering-20261115'),{recursive:true});mkdirSync(join(root,'tests/milestone100-20261114'),{recursive:true});
  for(const file of ['tests/next-engineering-20261115/source-runtime-native-git.mjs','tests/milestone100-20261114/source-immutable-queries.mjs'])writeFileSync(join(root,file),readFileSync(file));
  git(['init','-q']);git(['config','user.name','Source fixture']);git(['config','user.email','fixture@example.invalid']);writeFileSync(join(root,'src/a.txt'),'original\n');git(['add','.']);git(['commit','-qm','original']);const a=git(['rev-parse','HEAD']).toString().trim();git(['mv','src/a.txt','src/b.txt']);git(['commit','-qm','rename']);const b=git(['rev-parse','HEAD']).toString().trim();
  const {runtimeNativeGit}=await import(pathToFileURL(join(root,'tests/next-engineering-20261115/source-runtime-native-git.mjs')));const cached=immutableTreeQueryReader(runtimeNativeGit),tree=['ls-tree','-rz','--name-only',a,'--','src'],diff=['diff','--name-only','-z',a,b,'--','src'];
  const oldTree=runtimeNativeGit(tree),oldDiff=runtimeNativeGit(diff);assert.equal(oldTree.toString(),'src/a.txt\0');assert.equal(oldDiff.toString(),'src/a.txt\0src/b.txt\0');cached(tree);cached(diff);
  git(['config','diff.renames','true']);git(['config','diff.relative','true']);writeFileSync(join(root,'order'),'src/b.txt\nsrc/a.txt\n');git(['config','diff.orderFile',join(root,'order')]);process.chdir(join(root,'src'));process.env.GIT_ICASE_PATHSPECS='1';
  assert(runtimeNativeGit(tree).equals(oldTree));assert(runtimeNativeGit(diff).equals(oldDiff));
  writeFileSync(join(root,'src/evil.txt'),'replacement\n');git(['add','src/evil.txt']);git(['commit','-qm','replacement']);const replacement=git(['rev-parse','HEAD']).toString().trim();git(['replace',a,replacement]);delete process.env.GIT_ICASE_PATHSPECS;assert(!git(tree).equals(oldTree),'Replacement must affect an ordinary Git view');process.env.GIT_ICASE_PATHSPECS='1';
  for(const query of [tree,diff]){const expected=query===tree?oldTree:oldDiff;assert(cached(query).equals(expected));assert(runtimeNativeGit(query).equals(expected));const cold=immutableTreeQueryReader(args=>runtimeNativeGit(args));assert(cold(query).equals(expected));}
  assert(runtimeNativeGit(tree,{env:{GIT_NO_REPLACE_OBJECTS:'0',GIT_GLOB_PATHSPECS:'1',GIT_DIR:'/unavailable/git-dir',GIT_WORK_TREE:tmpdir(),GIT_COMMON_DIR:'/unavailable/common',GIT_OBJECT_DIRECTORY:'/unavailable/objects',GIT_ALTERNATE_OBJECT_DIRECTORIES:'/unavailable/alternate'}}).equals(oldTree));
 }finally{process.chdir(before);if(oldGlob===undefined)delete process.env.GIT_ICASE_PATHSPECS;else process.env.GIT_ICASE_PATHSPECS=oldGlob;rmSync(root,{recursive:true,force:true});}
});
