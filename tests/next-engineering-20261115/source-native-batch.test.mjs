import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,mkdtempSync,rmSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
const source=readFileSync(new URL('./source-stage10.mjs',import.meta.url),'utf8'),definition=/function nativeStatusHead\(bytes\)\{([\s\S]*?)\n\}/.exec(source);assert(definition);
const parse=new Function('assert','return function(bytes){'+definition[1]+'\n}')(assert),oid='a'.repeat(40),bytes=rows=>Buffer.from(rows.join('\n')+'\n');
test('native status parser accepts exact clean attached and detached commits and rejects incomplete or dirty snapshots',()=>{
 for(const head of ['engineering/source-fixture','(detached)'])assert.equal(parse(bytes(['# branch.oid '+oid,'# branch.head '+head])),oid);
 assert.equal(parse(bytes(['# branch.oid '+oid,'# branch.head fixture','# branch.upstream origin/fixture','# branch.ab +1 -0'])),oid);
 for(const rows of [[],['# branch.head fixture'],['# branch.oid (initial)','# branch.head fixture'],['# branch.oid '+oid,'# branch.oid '+oid,'# branch.head fixture'],['# branch.oid '+oid],['# branch.oid '+oid,'# branch.head fixture','# branch.unknown value'],['# branch.oid '+oid,'# branch.head fixture','? src/extra.ts'],['# branch.oid '+oid,'# branch.head fixture','! src/ignored.ts'],['# branch.oid '+oid,'# branch.head fixture','1 .M N... 100644 100644 100644 a b src/dirty.ts']])assert.throws(()=>parse(bytes(rows)));
 assert.throws(()=>parse('not binary'),/Native status must be bytes/);
});
test('native observations reject ignored/index-hidden source and replacement commits in an isolated clone',()=>{
 const root=process.cwd(),dir=mkdtempSync(join(tmpdir(),'stage10-native-replace-')),tree=join(dir,'clone'),git=args=>execFileSync('git',args,{stdio:['ignore','pipe','pipe'],maxBuffer:64000000});
 try{
  git(['clone','--shared','--quiet','--no-checkout',root,tree]);git(['-C',tree,'checkout','--quiet','--detach','HEAD']);
  const stage10Module=new URL('./source-stage10.mjs',import.meta.url).href;
  const script=`import assert from 'node:assert/strict';import {readFileSync,writeFileSync,rmSync} from 'node:fs';import {execFileSync} from 'node:child_process';import {proveSourceStage10,assertSourceStage10Stable} from ${JSON.stringify(stage10Module)};
   const git=(a,options={})=>execFileSync('git',a,{stdio:['ignore','pipe','pipe'],maxBuffer:64000000,...options}),head=git(['rev-parse','HEAD']).toString().trim(),input={root:process.cwd(),read:readFileSync,git};
   const view=proveSourceStage10(input);assertSourceStage10Stable(view);
   const exclude=readFileSync('.git/info/exclude');writeFileSync('.git/info/exclude',Buffer.concat([exclude,Buffer.from('\\nsrc/.native-ignored-extra.ts\\n')]));writeFileSync('src/.native-ignored-extra.ts','ignored extra source');
   assert.equal(git(['status','--porcelain','--untracked-files=all','--','src']).length,0,'Fixture hides ignored extra source');assert.throws(()=>assertSourceStage10Stable(view),/native dirty or unknown source/);rmSync('src/.native-ignored-extra.ts');writeFileSync('.git/info/exclude',exclude);assertSourceStage10Stable(view);
   const hiddenPath='src/app/account/actions.ts',original=readFileSync(hiddenPath);
   for(const [setFlag,clearFlag]of [['--assume-unchanged','--no-assume-unchanged'],['--skip-worktree','--no-skip-worktree']]){git(['update-index',setFlag,hiddenPath]);writeFileSync(hiddenPath,'changed index-hidden source');assert.equal(git(['status','--porcelain','--untracked-files=all','--','src']).length,0,'Fixture hides changed source through index flags');assert.throws(()=>assertSourceStage10Stable(view),/native source index flag|native dirty or unknown source/);writeFileSync(hiddenPath,original);git(['update-index',clearFlag,hiddenPath]);assertSourceStage10Stable(view);}
   writeFileSync('src/.native-replacement-extra.ts','replacement-only source');git(['add','src/.native-replacement-extra.ts']);const tree=git(['write-tree']).toString().trim();
   const replacement=git(['-c','user.name=Source Fixture','-c','user.email=source-fixture@example.invalid','commit-tree',tree,'-p',head],{input:'Replacement object fixture\\n',stdio:['pipe','pipe','pipe']}).toString().trim();git(['replace',head,replacement]);
   assert.equal(git(['rev-parse','HEAD']).toString().trim(),head);assert.equal(git(['status','--porcelain','--untracked-files=all','--','src']).length,0,'Fixture hides added source through replacement semantics');
   assert.throws(()=>assertSourceStage10Stable(view),/native dirty or unknown source/);`;
  execFileSync(process.execPath,['--input-type=module','-'],{cwd:tree,input:script,stdio:['pipe','pipe','pipe'],timeout:15000,maxBuffer:1000000});
 }finally{rmSync(dir,{recursive:true,force:true});}
});
