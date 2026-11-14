/** Current Stage8 admission precedes the unmodified, explicitly historical Stage7 five-case audit. */
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readFileSync,mkdtempSync,rmSync,lstatSync,realpathSync} from 'node:fs';
import {join,resolve} from 'node:path';
import {tmpdir} from 'node:os';
import {fileURLToPath} from 'node:url';
import {sourceGit} from '../parallel-source-20261110/baseline-runtime.mjs';
import {proveSourcePreflightAndHistoricalInputs} from './source-preflight-stage8.mjs';
const root=fileURLToPath(new URL('../../',import.meta.url));
const ref='eac9a6c23ae4d8f1abb607e32f57ce0d422a3cb8',file='tests/completion-wave-20261113/source-preflight-stage.test.mjs';
const git=args=>execFileSync('git',args,{cwd:root,stdio:['ignore','pipe','pipe'],maxBuffer:4*1024*1024});
const paths=['scripts/fetch-source-lineage.mjs','tests/source-lineage-bootstrap.test.mjs'];
const before={head:git(['rev-parse','--verify','HEAD^{commit}']),status:git(['status','--porcelain=v1','--untracked-files=all']),bytes:paths.map(path=>readFileSync(resolve(root,path)))};
const proved=proveSourcePreflightAndHistoricalInputs({read:readFileSync,git:sourceGit,root});
assert.equal(proved.literalAuditRef,ref);assert.equal(proved.retainedAuditIsCurrentExecution,false);assert.deepEqual(proved.livePaths,paths);
assert.equal(git(['rev-parse','--verify',ref+'^{commit}']).toString().trim(),ref);
const temporary=mkdtempSync(join(tmpdir(),'calcumint-stage7-preflight-cases-')),tree=join(temporary,'tree');let added=false;
try{
 git(['worktree','add','--detach',tree,ref]);added=true;
 assert.equal(execFileSync('git',['rev-parse','HEAD'],{cwd:tree,encoding:'utf8'}).trim(),ref);
 assert(readFileSync(join(tree,file)).equals(git(['show',ref+':'+file])),'Literal Stage7 test bytes differ');
 const env={...process.env};delete env.NODE_TEST_CONTEXT;
 const tap=execFileSync(process.execPath,['--test','--test-reporter=tap',file],{cwd:tree,env,encoding:'utf8',timeout:30000,maxBuffer:4*1024*1024});
 for(const [field,count]of [['tests',5],['pass',5],['fail',0],['skipped',0],['cancelled',0]])assert.match(tap,new RegExp('^# '+field+' '+count+'$','m'));
 assert(before.head.equals(git(['rev-parse','--verify','HEAD^{commit}'])),'Current HEAD moved during historical Stage7 audit');
 assert(before.status.equals(git(['status','--porcelain=v1','--untracked-files=all'])),'Current status changed during historical Stage7 audit');
 for(let index=0;index<paths.length;index++){const target=resolve(root,paths[index]),stat=lstatSync(target);assert(stat.isFile()&&!stat.isSymbolicLink());assert.equal(realpathSync(target),target);assert(before.bytes[index].equals(readFileSync(target)),'Current preflight changed during historical Stage7 audit');}
 process.stdout.write(tap);
}finally{try{if(added)git(['worktree','remove','--force',tree]);}finally{rmSync(temporary,{recursive:true,force:true});}}
