/** Reproduce frozen six-publication packets from their exact source capture. */
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {lstatSync,mkdirSync,mkdtempSync,readFileSync,rmSync,writeFileSync} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';

export const SIX_SOURCE_REF='c1c7371ac4f284ff7b6371a90fb3296c632396f9';
export const SIX_CURRENT_CALLER_REF='af94b00cee5e8ef53e2b6ecdf1501c6b45cbaee5';
const artifactPath='docs/full-product-six-closure';
const outputs=['qa-evidence-six.json','eligibility-six.json'];
const generator='scripts/six-publication-closure/packets.mjs';
const caller='src/components/calculator-interactive.tsx';
const defaultRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const maxBuffer=128*1024*1024;
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const safe=name=>typeof name==='string'&&name.length>0&&!name.includes('\\')&&!name.includes('\0')&&!path.posix.isAbsolute(name)&&name.split('/').every(part=>part!==''&&part!=='.'&&part!=='..');
function currentFile(root,name){
 if(!safe(name))throw Error('Unsafe current file path');
 if(lstatSync(root).isSymbolicLink()||!lstatSync(root).isDirectory())throw Error('Unsafe current file root');
 let full=root;
 for(const part of name.split('/')){
  full=path.join(full,part);
  if(lstatSync(full).isSymbolicLink())throw Error('Unsafe current file symlink: '+name);
 }
 if(!lstatSync(full).isFile())throw Error('Unsupported current file: '+name);
 return readFileSync(full);
}
/** artifactRoot overrides the current packet directory only, for negative tests. */
export function checkHistoricalSixPackets({repositoryRoot=defaultRoot,artifactRoot=path.join(repositoryRoot,artifactPath)}={}){
 const git=args=>execFileSync('git',args,{cwd:repositoryRoot,maxBuffer,stdio:['pipe','pipe','pipe']});
 for(const ref of [SIX_SOURCE_REF,SIX_CURRENT_CALLER_REF]){
  let resolved;
  try{resolved=git(['rev-parse','--verify',ref+'^{commit}']).toString().trim();}catch{throw Error('Exact six-packet source capture unavailable: '+ref);}
  if(resolved!==ref)throw Error('Exact six-packet source capture unavailable: '+ref);
 }
 const blob=(ref,name)=>{
  if(!safe(name))throw Error('Unsafe historical file path');
  const entries=git(['ls-tree','-z',ref,'--',name]).toString().split('\0').filter(Boolean);
  const match=entries.length===1&&/^(100644|100755) blob ([a-f0-9]+)\t(.+)$/.exec(entries[0]);
  if(!match||match[3]!==name)throw Error('Missing or unsafe historical file: '+name);
  return git(['cat-file','blob',match[2]]);
 };
 const captured=new Map(outputs.map(name=>[artifactPath+'/'+name,blob(SIX_SOURCE_REF,artifactPath+'/'+name)]));
 for(const name of outputs)if(!currentFile(artifactRoot,name).equals(captured.get(artifactPath+'/'+name)))throw Error('Current six-packet artifact bytes differ: '+name);
 const bindings=JSON.parse(captured.get(artifactPath+'/'+outputs[0])).sourceBindings;
 if(!Array.isArray(bindings)||bindings.length!==21||new Set(bindings.map(b=>b.path)).size!==21||!bindings.some(b=>b.path===generator)||!bindings.some(b=>b.path===caller))throw Error('Invalid frozen source binding membership');
 for(const binding of bindings){
  if(!safe(binding.path)||!/^([a-f0-9]{64})$/.test(binding.sha256))throw Error('Invalid frozen source binding');
  const bytes=blob(SIX_SOURCE_REF,binding.path);
  if(hash(bytes)!==binding.sha256)throw Error('Frozen source binding SHA differs: '+binding.path);
  captured.set(binding.path,bytes);
  const expected=binding.path===caller?blob(SIX_CURRENT_CALLER_REF,caller):bytes;
  if(!currentFile(repositoryRoot,binding.path).equals(expected))throw Error('Current bound source bytes differ: '+binding.path);
 }
 const temporary=mkdtempSync(path.join(os.tmpdir(),'six-frozen-check-'));
 try{
  for(const [name,bytes] of captured){const destination=path.join(temporary,name);mkdirSync(path.dirname(destination),{recursive:true});writeFileSync(destination,bytes);}
  const output=execFileSync(process.execPath,[generator,'--check'],{cwd:temporary,env:{...process.env,TMPDIR:temporary},maxBuffer,stdio:['pipe','pipe','pipe']}).toString().trim();
  return {sourceRef:SIX_SOURCE_REF,currentCallerRef:SIX_CURRENT_CALLER_REF,artifactsChecked:outputs.length,sourceFilesChecked:bindings.length,originalGeneratorOutput:output};
 }finally{rmSync(temporary,{recursive:true,force:true});}
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href)console.log(JSON.stringify(checkHistoricalSixPackets()));
