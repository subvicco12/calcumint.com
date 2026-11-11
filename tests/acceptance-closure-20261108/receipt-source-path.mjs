import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {verifyCompletionBinding} from '../../scripts/product-completion-lineage.mjs';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const currentCaller='src/components/calculator-interactive.tsx';
const knownCallerRefs=['a7a656f71b04b50192485a49b0b56b3fa6bd86b9','7086b85437b025225f5736fb6b849415e518dc08','811bbd67bfcc635808101a351fa15eb133331369','3c2b768ecc9e6e0821df8e74c779d134e99c4f48','56763645c091743508c1b7a163c7c59dcb7f4b7d','d1ea2fd979fa02e1d107e48aedcba72086115f6e','955e2ed5df93e646275c4d94d33548cac5925380','00651cc382be5dcbd596882071787fd6702c13d3','6a8f10cb628b6f2735b184c1ca17c92b947b1b52','3dede6fa4c084594c4f35b5b4b17dd469436d208','2d0e2622292930d1992813998608d933ddf5024e',"2188237e0900b27620bc832ade902d895d085cec","5c3d38e9454b9dbeb9b8d1220ea8b68532fa4e01"];
const sourceGit=args=>execFileSync('git',args,{stdio:['ignore','pipe','pipe'],maxBuffer:8*1024*1024});
const sourceHash=bytes=>createHash('sha256').update(bytes).digest('hex');
/** Known historical receipt claims are not claims of current execution. Require exact current proof. */
export function verifyCapturedCurrentCaller(binding,read=readFileSync,git=sourceGit){
 if(binding.path!==currentCaller)throw Error('Unapproved current caller source path');
 const claims=knownCallerRefs.map(ref=>sourceHash(git(['show',ref+':'+currentCaller])));
 if(!claims.includes(binding.sha256))throw Error('Captured source historical claim differs: '+currentCaller);
 if(verifyCompletionBinding(currentCaller,read(currentCaller),claims[0],git,read)!==true)throw Error('Exact current caller successor required');
 return currentCaller;
}
export async function verifyCapturedSource(binding,read=readFile){
 const original=binding.path,cache='../batch13-deps/node_modules/';
 if(typeof original!=='string')throw Error('Unapproved captured source path');
 // Explicit historical Cloud-cache relocation only. The captured receipt is
 // unchanged and every relocated file still has to match its original hash.
 const path=original.startsWith(cache)?'node_modules/'+original.slice(cache.length):original;
 if(!path||path.includes('\\')||path.includes('\0')||path.startsWith('/')||path.split('/').some(part=>!part||part==='.'||part==='..')||
    !(/^(src|tests|scripts|data|docs|node_modules)\//.test(path)||['package-lock.json','package.json'].includes(path)))throw Error('Unapproved captured source path');
 const bytes=await read(path);
 if(path===currentCaller){
  const {completionBindingDependencies}=await import('../../scripts/product-completion-lineage.mjs');
  const target=new Map(await Promise.all(completionBindingDependencies(path).map(async name=>[name,await read(name)])));
  verifyCapturedCurrentCaller(binding,name=>name===path?bytes:target.get(name));
 }else if(path==='src/components/technology-five-analysis.tsx'){
  const historical=sourceHash(sourceGit(['show','00651cc382be5dcbd596882071787fd6702c13d3:'+path]));
  const {completionBindingDependencies}=await import('../../scripts/product-completion-lineage.mjs');
  const target=new Map(await Promise.all(completionBindingDependencies(path).map(async name=>[name,await read(name)])));
  const retained=sourceHash(sourceGit(['show','b282c57cc6b1e72adf7435fac1e849b2bdddd85a:'+path]));
  if(binding.sha256!==historical&&binding.sha256!==retained&&binding.sha256!==sourceHash(bytes))throw Error('Captured analysis historical claim differs');
  if(verifyCompletionBinding(path,bytes,historical,sourceGit,name=>target.get(name))!==true)throw Error('Exact analysis successor required');
 }else if(path==='src/lib/registered-snapshot-verification.ts'){
  const old='a7a656f71b04b50192485a49b0b56b3fa6bd86b9',current='7086b85437b025225f5736fb6b849415e518dc08',reviewed='f042748d08caa4f51c19b7cf6fc675a3a1fb5dd5';
  const git=args=>execFileSync('git',args,{stdio:['ignore','pipe','pipe'],maxBuffer:8*1024*1024});
  const digest=value=>createHash('sha256').update(value).digest('hex');
  const historical=digest(git(['show',old+':'+path])),fresh=digest(git(['show',current+':'+path])),qualified=digest(git(['show',reviewed+':'+path]));
  if(![historical,fresh,qualified].includes(binding.sha256))throw Error('Captured source historical claim differs: '+path);
  // Resolve every dependency through the SAME target reader, not the workspace.
  const {completionBindingDependencies}=await import('../../scripts/product-completion-lineage.mjs');
  const target=new Map(await Promise.all(completionBindingDependencies(path).map(async name=>[name,await read(name)])));
  if(verifyCompletionBinding(path,bytes,historical,git,name=>target.get(name))!==true)throw Error('Exact outer verifier successor required');
 }else if(!/^[a-f0-9]{64}$/.test(binding.sha256)||createHash('sha256').update(bytes).digest('hex')!==binding.sha256)throw Error('Captured source bytes differ: '+path);
 return path;
}
