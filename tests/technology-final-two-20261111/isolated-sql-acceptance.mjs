/** Run current committed SQL qualification in a disposable checkout; never overwrite retained evidence. */
import assert from 'node:assert/strict';
import {execFile,execFileSync} from 'node:child_process';
import {promisify} from 'node:util';
import {readFileSync,writeFileSync,mkdirSync,mkdtempSync,realpathSync,lstatSync,symlinkSync,rmSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {tmpdir} from 'node:os';
import {dirname,join,relative,resolve,isAbsolute} from 'node:path';
import {fileURLToPath} from 'node:url';
assert.equal(process.version,'v22.23.4','Use the exact reviewed CI Node22.23.4 runtime');
assert.equal(process.argv.length,2,'No source or execution overrides are accepted');
for(const name of ['DATABASE_URL','SUPABASE_DB_URL','PGHOST','PGDATABASE','PGPORT','PGUSER','PGPASSWORD'])assert(!process.env[name],'External database selector refused: '+name);
const root=realpathSync(fileURLToPath(new URL('../../',import.meta.url))),sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const git=(args,cwd=root)=>execFileSync('git',args,{cwd,stdio:['ignore','pipe','pipe'],maxBuffer:16*1024*1024,timeout:30000});
const head=git(['rev-parse','--verify','HEAD^{commit}']).toString().trim();assert.match(head,/^[a-f0-9]{40}$/);
assert.equal(git(['status','--porcelain=v1','--untracked-files=no']).toString(),'','Exact committed tracked tree required');
const self='tests/technology-final-two-20261111/isolated-sql-acceptance.mjs';assert(readFileSync(join(root,self)).equals(git(['show',head+':'+self])),'Wrapper must itself be committed at the actual HEAD');
const sourcePaths=git(['ls-files','-z','tests/technology-final-two-20261111','docs/technology-final-two-20261111','tests/gotrue-runtime','tests/gotrue-full-schema']).toString().split('\0').filter(Boolean);
const protectedPaths=[...new Set([...sourcePaths,'package.json','package-lock.json'])];
const protectedHashes=Object.fromEntries(protectedPaths.map(path=>{const file=join(root,path);assert(lstatSync(file).isFile()&&!lstatSync(file).isSymbolicLink(),'Regular tracked source required: '+path);const bytes=readFileSync(file);assert(bytes.equals(git(['show',head+':'+path])),'Current bytes differ from committed source: '+path);return[path,sha(bytes)];}));
const dependencyCache=realpathSync(join(root,'node_modules'));assert(lstatSync(dependencyCache).isDirectory(),'Existing canonical dependency cache required');
const artifactRoot=resolve(process.env.FINAL_TWO_SQL_ARTIFACTS_ROOT??tmpdir());
const inside=(base,target)=>{const name=relative(base,target);return name===''||(!name.startsWith('..')&&!isAbsolute(name));};
assert(!inside(root,artifactRoot),'Artifacts must be outside the source checkout');mkdirSync(artifactRoot,{recursive:true});assert(!inside(root,realpathSync(artifactRoot)),'Artifacts cannot resolve inside source checkout');
const artifacts=mkdtempSync(join(artifactRoot,'final-two-sql-')),temporary=mkdtempSync(join(tmpdir(),'calcumint-final-two-worktree-')),tree=join(temporary,'tree');
const exec=promisify(execFile),startedAt=new Date().toISOString(),children=[];let added=false,failure,result;
const outputs=['docs/technology-final-two-20261111/native/receipt.json','docs/technology-final-two-20261111/sharing/pg/receipt.json','docs/technology-final-two-20261111/sharing/pg/raw.log'];
function checkOriginal(){assert.equal(git(['rev-parse','HEAD']).toString().trim(),head,'Source HEAD changed during qualification');assert.equal(git(['status','--porcelain=v1','--untracked-files=no']).toString(),'','Original tracked tree changed');for(const [path,hash]of Object.entries(protectedHashes))assert.equal(sha(readFileSync(join(root,path))),hash,'Original protected source or evidence changed: '+path);}
async function run(script,label){
 const began=Date.now(),env={...process.env,PATH:dirname(process.execPath)+':'+process.env.PATH};delete env.NODE_TEST_CONTEXT;
 let out='',err='',childError;
 try{({stdout:out,stderr:err}=await exec(process.execPath,[script],{cwd:tree,env,encoding:'utf8',timeout:180000,maxBuffer:16*1024*1024,killSignal:'SIGTERM'}));}catch(error){childError=error;out=String(error.stdout??'');err=String(error.stderr??'');}
 writeFileSync(join(artifacts,label+'.log'),out);writeFileSync(join(artifacts,label+'.stderr.log'),err);children.push({script,arguments:[],node:process.version,exitCode:childError?.code??0,killed:childError?.killed??false,elapsedMs:Date.now()-began,timeoutMs:180000});if(childError)throw new Error('Isolated SQL child failed: '+script,{cause:childError});
}
try{
 git(['worktree','add','--detach',tree,head]);added=true;assert.equal(git(['rev-parse','HEAD'],tree).toString().trim(),head);symlinkSync(dependencyCache,join(tree,'node_modules'),'dir');assert.equal(realpathSync(join(tree,'node_modules')),dependencyCache);
 for(const [path,hash]of Object.entries(protectedHashes))assert.equal(sha(readFileSync(join(tree,path))),hash,'Copied committed source differs: '+path);
 // Delete only copied receipt/log outputs. Retained native preimage remains available;
 // the exact producer must create a fresh receipt after reconstructing it.
 for(const path of outputs){rmSync(join(tree,path),{force:true});assert(!existsSync(join(tree,path)));}
 const scripts=['tests/technology-final-two-20261111/native.postgres.mjs','tests/technology-final-two-20261111/sharing.postgres.mjs'];
 await run(scripts[0],'native');await run(scripts[1],'sharing');
 const native=JSON.parse(readFileSync(join(tree,outputs[0]))),sharing=JSON.parse(readFileSync(join(tree,outputs[1]))),retainedNative=JSON.parse(readFileSync(join(root,outputs[0]))),retainedSharing=JSON.parse(readFileSync(join(root,outputs[1])));
 assert.equal(native.passed,true);assert.equal(native.checks.length,11);assert.deepEqual(native.checks,retainedNative.checks);assert.equal(native.producerSHA256,sha(readFileSync(join(tree,scripts[0]))));assert.equal(native.productionWrites,false);assert.equal(native.sqlActivated,false);assert.equal(native.certificationGranted,false);assert.equal(native.syntheticLowerPublication,true);assert.equal(native.fixtureOutputs,true);
 assert.equal(sharing.passed,true);assert.equal(sharing.checks.length,34);assert.deepEqual(sharing.checks,retainedSharing.checks);assert.equal(sharing.kind,'FIFTEEN_SHARING_GENUINE_ISOLATED_POSTGRES_GOTRUE');
 for(const receipt of [native,sharing])for(const [path,hash]of Object.entries(receipt.sources??receipt.sourceHashes))assert.equal(sha(readFileSync(join(tree,path))),hash,'Fresh SQL source binding differs: '+path);
 const proposals=['native/contract-successor.sql','native/contract-reverse.sql','sharing/contract-successor.sql','sharing/contract-reverse.sql'];
 const proposalHashes=Object.fromEntries(proposals.map(path=>{const full='docs/technology-final-two-20261111/'+path;assert.equal(sha(readFileSync(join(tree,full))),protectedHashes[full],'Reconstructed held SQL differs from exact HEAD');return[full,protectedHashes[full]];}));
 assert.equal(native.successorSHA256,proposalHashes['docs/technology-final-two-20261111/native/contract-successor.sql']);assert.equal(native.reverseSHA256,proposalHashes['docs/technology-final-two-20261111/native/contract-reverse.sql']);assert.equal(sharing.successorSHA256,proposalHashes['docs/technology-final-two-20261111/sharing/contract-successor.sql']);assert.equal(sharing.reverseSHA256,proposalHashes['docs/technology-final-two-20261111/sharing/contract-reverse.sql']);
 for(const path of outputs){assert(existsSync(join(tree,path)),'Fresh child output missing: '+path);writeFileSync(join(artifacts,path.includes('/native/')?'native-receipt.json':path.endsWith('raw.log')?'sharing-raw.log':'sharing-receipt.json'),readFileSync(join(tree,path)));}
 writeFileSync(join(artifacts,'native-preimage.json'),readFileSync(join(tree,'docs/technology-final-two-20261111/native/preimage.json')));checkOriginal();
 result={kind:'FRESH_DISPOSABLE_CURRENT_HEAD_SQL_ACCEPTANCE_NOT_PRODUCTION',passed:true,head,startedAt,completedAt:new Date().toISOString(),node:process.version,children,nativeCheckGroups:11,sharingCheckGroups:34,proposalHashes,protectedHashes,originalEvidenceUnchanged:true,normalExecutionOnly:true,productionWrites:false,sqlActivated:false,certificationGranted:false,releaseHold:true,limitations:['Native uses SQL roles and synthetic lower-publication/output; not HTTP native authentication proof','Sharing uses genuine local GoTrue/PostgREST but opaque synthetic snapshot mathematics','No authentic hosted schema, external writer or deployment adoption approval established']};
}catch(error){failure=error;writeFileSync(join(artifacts,'failure.json'),JSON.stringify({head,children,error:error.stack,cause:error.cause?.stack,productionWrites:false},null,2)+'\n');}
finally{
 try{if(added)git(['worktree','remove','--force',tree]);rmSync(temporary,{recursive:true,force:true});checkOriginal();}catch(cleanupError){failure=failure?new AggregateError([failure,cleanupError],'SQL qualification and owned cleanup failed'):cleanupError;}
}
if(failure)throw failure;
writeFileSync(join(artifacts,'receipt.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({passed:true,head,nativeCheckGroups:11,sharingCheckGroups:34,artifacts,originalEvidenceUnchanged:true,productionWrites:false}));
