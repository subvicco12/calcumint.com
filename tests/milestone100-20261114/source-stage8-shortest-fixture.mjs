/** Private Git administration for a partial byte-reader fixture; actual worktree status stays real. */
import assert from 'node:assert/strict';
import {mkdirSync,copyFileSync,writeFileSync,lstatSync,realpathSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {join,resolve,dirname,basename} from 'node:path';
import {tmpdir} from 'node:os';
import {fileURLToPath} from 'node:url';
const actualRoot=realpathSync(fileURLToPath(new URL('../../',import.meta.url)));
const sourceStatus=['status','--porcelain=v1','--untracked-files=all','--','src'];
export function assertPrivateFixtureSnapshotStable(before,after){assert.equal(after.head,before.head,'Actual source HEAD moved during fixture');assert(after.status.equals(before.status),'Actual source status changed during fixture');}
export function validatePrivateFixtureOrigin(origin){assert.match(origin,/^https:\/\/github\.com\/subvicco12\/calcumint\.com(?:\.git)?$/);return origin;}
export function withPrivateCurrentGit(directory,root,run){
 assert.equal(realpathSync(root),actualRoot,'Only the actual source proof root may back a fixture');
 const directoryStat=lstatSync(directory);assert(directoryStat.isDirectory()&&!directoryStat.isSymbolicLink());assert.equal(directoryStat.uid,process.getuid());assert.equal(directoryStat.mode&0o077,0,'Private temporary fixture permissions required');assert.equal(realpathSync(directory),resolve(directory));assert.equal(dirname(resolve(directory)),realpathSync(tmpdir()),'Owned canonical temporary fixture required');assert.match(basename(directory),/^(publication20-lineage-|stage8-private-admin-)[A-Za-z0-9]+$/);
 const admin=join(directory,'.git');assert.throws(()=>lstatSync(admin),{code:'ENOENT'},'Private Git administration must not preexist');
 const actual=args=>execFileSync('git',args,{cwd:actualRoot,maxBuffer:32*1024*1024,stdio:['ignore','pipe','pipe']});
 const head=actual(['rev-parse','HEAD']).toString().trim();assert.match(head,/^[a-f0-9]{40}$/);const status=actual(sourceStatus);
 const origin=validatePrivateFixtureOrigin(actual(['remote','get-url','--all','origin']).toString().trim());
 mkdirSync(join(admin,'objects','info'),{recursive:true});mkdirSync(join(admin,'refs','heads'),{recursive:true});
 const index=actual(['rev-parse','--path-format=absolute','--git-path','index']).toString().trim();assert(lstatSync(index).isFile()&&!lstatSync(index).isSymbolicLink());copyFileSync(index,join(admin,'index'));const copied=lstatSync(join(admin,'index')),original=lstatSync(index);assert(copied.dev!==original.dev||copied.ino!==original.ino,'Private index must be a distinct copy');assert.equal(copied.nlink,1);
 const objects=actual(['rev-parse','--path-format=absolute','--git-path','objects']).toString().trim();assert.equal(realpathSync(objects),objects);
 writeFileSync(join(admin,'HEAD'),head+'\n');writeFileSync(join(admin,'objects','info','alternates'),objects+'\n');
 for(const [name,value]of [['core.repositoryformatversion','0'],['core.bare','false'],['core.worktree',actualRoot],['remote.origin.url',origin]])execFileSync('git',['config','--file',join(admin,'config'),name,value],{stdio:['ignore','pipe','pipe']});
 const privateGit=args=>execFileSync('git',args,{cwd:directory,maxBuffer:32*1024*1024,stdio:['ignore','pipe','pipe']});
 assert(privateGit(sourceStatus).equals(status),'Fixture Git and actual source status must agree');assert.equal(actual(['rev-parse','HEAD']).toString().trim(),head);
 try{const result=run(directory);assert(!result||typeof result.then!=='function','Private Git fixture callbacks must be synchronous');return result;}finally{assertPrivateFixtureSnapshotStable({head,status},{head:actual(['rev-parse','HEAD']).toString().trim(),status:actual(sourceStatus)});}
}
function once(text,before,after){assert.equal(text.split(before).length,2,'Exact shortest fixture predecessor required');return text.replace(before,after);}
export function expectedShortestFixtureSuccessor(previous){
 let text=once(previous,"'../../scripts/product-completion-lineage.mjs'","'../../scripts/product-completion-stage8.mjs'");
 text="import {withPrivateCurrentGit} from '../milestone100-20261114/source-stage8-shortest-fixture.mjs';\n"+text;
 text=once(text,"symlinkSync(execFileSync('git',['rev-parse','--absolute-git-dir'],{encoding:'utf8'}).trim(),path.join(dir,'.git'),'dir');return fn(dir);","return withPrivateCurrentGit(dir,root,()=>fn(dir));");
 return once(text,"test('binds exact original math/parser and append-only UI successor',()=>assert.equal(verifyPublication20CallerLineage(root).sourceBindings,20));","test('binds exact original math/parser and append-only UI successor',()=>{assert.equal(verifyPublication20CallerLineage(root).sourceBindings,20);fixture(dir=>assert.equal(verifyPublication20CallerLineage(dir).sourceBindings,20));});");
}
