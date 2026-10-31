/** Reproduce historical evidence from its exact source capture; never rewrite it. */
import {execFileSync} from 'node:child_process';
import {existsSync,lstatSync,mkdtempSync,readdirSync,readFileSync,realpathSync,rmSync,symlinkSync} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';

export const BATCH14_SOURCE_REF='b96b1ac89971cb8418d2389fbd7c9571a57491f1';
const artifactPath='docs/full-product-batch14';
const defaultRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const maxBuffer=128*1024*1024;
/** artifactRoot is the current Batch14 directory, overridable only for negative tests. */
export function checkHistoricalBatch14({repositoryRoot=defaultRoot,artifactRoot=path.join(repositoryRoot,artifactPath)}={}){
 const git=args=>execFileSync('git',args,{cwd:repositoryRoot,maxBuffer});
 // Fail closed if the exact capture is unavailable; never substitute HEAD/current sources.
 const resolved=git(['rev-parse','--verify',`${BATCH14_SOURCE_REF}^{commit}`]).toString().trim();
 if(resolved!==BATCH14_SOURCE_REF)throw Error('Exact Batch14 source capture unavailable');
 const files=git(['ls-tree','-rz','--full-tree',BATCH14_SOURCE_REF,'--',artifactPath]).toString().split('\0').filter(Boolean).map(record=>{
  const match=/^(100644|100755) blob ([a-f0-9]+)\t(.+)$/.exec(record);
  if(!match||!match[3].startsWith(artifactPath+'/'))throw Error('Unsupported historical artifact entry');
  return {oid:match[2],name:match[3].slice(artifactPath.length+1)};
 });
 if(!files.length)throw Error('Missing frozen Batch14 artifacts');
 const current=[];
 const visit=(directory,prefix='')=>{
  if(!existsSync(directory)||!lstatSync(directory).isDirectory()||lstatSync(directory).isSymbolicLink())throw Error('Missing or unsafe current Batch14 artifact directory');
  for(const name of readdirSync(directory)){
   const relative=prefix+name,full=path.join(directory,name),stat=lstatSync(full);
   if(stat.isSymbolicLink())throw Error('Unsafe current Batch14 artifact symlink');
   if(stat.isDirectory())visit(full,relative+'/');
   else if(stat.isFile())current.push(relative);
   else throw Error('Unsupported current Batch14 artifact entry');
  }
 };
 visit(artifactRoot);
 if(JSON.stringify(current.sort())!==JSON.stringify(files.map(f=>f.name).sort()))throw Error('Current Batch14 artifact membership differs from frozen capture');
 for(const file of files)if(!readFileSync(path.join(artifactRoot,file.name)).equals(git(['cat-file','blob',file.oid])))throw Error('Current Batch14 artifact bytes differ: '+file.name);
 if(!readFileSync(path.join(repositoryRoot,'package-lock.json')).equals(git(['show',`${BATCH14_SOURCE_REF}:package-lock.json`])))throw Error('Batch14 reproduction requires the exact captured dependency lock');
 const temporary=mkdtempSync(path.join(os.tmpdir(),'batch14-frozen-check-'));
 try{
  const archive=git(['archive','--format=tar',BATCH14_SOURCE_REF]);
  execFileSync('tar',['-xf','-','-C',temporary],{input:archive,maxBuffer});
  symlinkSync(realpathSync(path.join(repositoryRoot,'node_modules')),path.join(temporary,'node_modules'),'dir');
  const output=execFileSync(process.execPath,['scripts/full-product-batch14-evidence.mjs','--check'],{cwd:temporary,env:{...process.env,TMPDIR:temporary},maxBuffer}).toString();
  return {sourceRef:BATCH14_SOURCE_REF,artifactsChecked:files.length,originalGeneratorOutput:output.trim()};
 }finally{rmSync(temporary,{recursive:true,force:true});}
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href)console.log(JSON.stringify(checkHistoricalBatch14()));
