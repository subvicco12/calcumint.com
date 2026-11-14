/** Current exact preflight first; the original two-path audit executes literally at eac9. */
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync,mkdtempSync,rmSync,lstatSync,realpathSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {capturePath} from '../parallel-source-20261110/core.mjs';
import {accepted,verifyParallelAuthority} from '../parallel-source-20261110/authority.mjs';
import {provePinnedSourceStage8} from './source-stage8-activation.mjs';
import {assertSourceStage8HeadStable} from './source-stage8.mjs';
import {sourcePreflightPolicy,sourcePreflightCapturePath} from '../completion-wave-20261113/source-preflight-policy.mjs';
const retainedRef='eac9a6c23ae4d8f1abb607e32f57ce0d422a3cb8';
const rootDefault=fileURLToPath(new URL('../../',import.meta.url));
const paths=Object.freeze(['scripts/fetch-source-lineage.mjs','tests/source-lineage-bootstrap.test.mjs']);
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
function once(source,before,after){assert.equal(source.split(before).length,2,'Exact retained preflight insertion required');return source.replace(before,after);}
export function expectedStage8PreflightSource(previous){
 const oldNames='additionalBootstrapRefs,additionalStage7BootstrapRefs';
 const additions=['additionalStage8BootstrapRefs','additionalStage8V3BootstrapRefs','additionalStage8V4BootstrapRefs','additionalStage8V5BootstrapRefs','additionalStage8V6BootstrapRefs','additionalStage8V7BootstrapRefs','additionalStage8V8BootstrapRefs','additionalStage8V9BootstrapRefs','additionalStage8V10BootstrapRefs','additionalStage8V11BootstrapRefs','additionalStage8V12BootstrapRefs','additionalStage8V13BootstrapRefs','additionalStage8V14BootstrapRefs','additionalStage8V15BootstrapRefs','additionalStage8V16BootstrapRefs','additionalStage8V17BootstrapRefs','additionalStage8V18BootstrapRefs','additionalStage8V19BootstrapRefs','additionalStage8V20BootstrapRefs','additionalStage8V21BootstrapRefs','additionalStage8V22BootstrapRefs','additionalStage8V23BootstrapRefs','additionalStage8V24BootstrapRefs','additionalStage8V25BootstrapRefs'];
 let result="import {sourceStage8Policy} from '../tests/milestone100-20261114/source-stage8-policy-v3.mjs';\n"+previous;
 result=once(result,'{'+oldNames+'}', '{'+oldNames+','+additions.join(',')+'}');
 result=once(result,'...sourceStage7Policy.ancestry,...additionalBootstrapRefs,...additionalStage7BootstrapRefs]', '...sourceStage7Policy.ancestry,...sourceStage8Policy.ancestry,...additionalBootstrapRefs,...additionalStage7BootstrapRefs,'+additions.map(name=>'...'+name).join(',')+']');
 return result;
}
function immutable(record,git){
 assert.equal(git(['rev-parse','--verify',record.ref+'^{commit}']).toString().trim(),record.ref);
 assert.equal(git(['rev-parse',record.ref+':'+record.path]).toString().trim(),record.blob);
 const bytes=git(['cat-file','blob',record.blob]);assert(Buffer.isBuffer(bytes));assert.equal(bytes.length,record.bytes);assert.equal(sha(bytes),record.sha256);return bytes;
}
function executeLiteralAudit(root){
 const temporary=mkdtempSync(join(tmpdir(),'calcumint-stage8-preflight-')),tree=join(temporary,'tree');let added=false;
 const git=args=>execFileSync('git',args,{cwd:root,stdio:['ignore','pipe','pipe'],maxBuffer:4*1024*1024});
 try{
  git(['worktree','add','--detach',tree,retainedRef]);added=true;
  assert.equal(execFileSync('git',['rev-parse','HEAD'],{cwd:tree,encoding:'utf8'}).trim(),retainedRef);
  for(const path of paths)assert(readFileSync(join(tree,path)).equals(git(['show',retainedRef+':'+path])));
  const env={...process.env};delete env.NODE_TEST_CONTEXT;
  const output=execFileSync(process.execPath,['--test','--test-reporter=tap','tests/source-lineage-bootstrap.test.mjs'],{cwd:tree,env,encoding:'utf8',timeout:10000,maxBuffer:4*1024*1024});
  for(const [field,value]of [['tests',5],['pass',5],['fail',0],['skipped',0],['cancelled',0]])assert.match(output,new RegExp('^# '+field+' '+value+'$','m'));
 }finally{try{if(added)git(['worktree','remove','--force',tree]);}finally{rmSync(temporary,{recursive:true,force:true});}}
}
export function proveSourcePreflightAndHistoricalInputs({read,git,root=rootDefault}){
 const proof=provePinnedSourceStage8({read,git,root});
 for(const path of paths){const row=accepted.find(row=>row.path===path);assert(row,'Independently admitted current preflight required');const bytes=read(path);assert(Buffer.isBuffer(bytes)&&sha(bytes)===row.sha256,'Exact current bootstrap source bytes differ');assert.equal(git(['rev-parse','HEAD:'+path]).toString().trim(),row.blob,'Exact current HEAD source object differs');}
 verifyParallelAuthority(read,git);
 const capture=JSON.parse(read(capturePath));assert(capture.sourceStage8V25,'Exact reviewed preflight successor required');
 for(const path of paths){
  assert(capture.sourceStage8V25.guardPaths.includes(path),'Preflight path outside reviewed successor');
  const row=capture.currentSources.find(row=>row.path===path);assert(row);assert.equal(row.ref,capture.sourceStage8V25.guardRef);
  const current=immutable(row,git),target=resolve(root,path);assert(lstatSync(target).isFile()&&!lstatSync(target).isSymbolicLink());assert.equal(realpathSync(target),target);
  assert(read(path).equals(current),'Exact current bootstrap source bytes differ');
  const previous=git(['show',retainedRef+':'+path]);
  const expected=path===paths[0]?expectedStage8PreflightSource(previous.toString()):once(previous.toString(),"'./completion-wave-20261113/source-preflight-stage.mjs'","'./milestone100-20261114/source-preflight-stage8.mjs'");
  assert.equal(current.toString(),expected,'Only exact reviewed preflight imports and ancestry union may change');
 }
 executeLiteralAudit(root);
 const bytes=read(sourcePreflightCapturePath);assert.equal(sha(bytes),sourcePreflightPolicy.captureSHA256);
 const retained=JSON.parse(bytes);assert.equal(retained.predecessorRef,sourcePreflightPolicy.predecessorRef);assert.deepEqual(retained.rows.map(row=>row.path),paths);
 const prior=new Map(retained.rows.map(row=>{assert.equal(row.predecessor.ref,sourcePreflightPolicy.predecessorRef);return[row.path,{record:row.predecessor,bytes:immutable(row.predecessor,git)}];}));
 const historicalRead=path=>prior.has(path)?Buffer.from(prior.get(path).bytes):read(path);
 const historicalGit=(args,options)=>args.length===2&&args[0]==='rev-parse'&&args[1].startsWith('HEAD:')&&prior.has(args[1].slice(5))?Buffer.from(prior.get(args[1].slice(5)).record.blob+'\n'):git(args,options);
 assertSourceStage8HeadStable(proof);return{historicalInput:{read:historicalRead,git:historicalGit,root},livePaths:[...paths],literalAuditRef:retainedRef,retainedAuditIsCurrentExecution:false};
}
