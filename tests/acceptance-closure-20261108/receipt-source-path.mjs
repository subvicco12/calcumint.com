import {execFileSync} from 'node:child_process';
import {verifyCompletionBinding} from '../../scripts/product-completion-lineage.mjs';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
export async function verifyCapturedSource(binding,read=readFile){
 const original=binding.path,cache='../batch13-deps/node_modules/';
 if(typeof original!=='string')throw Error('Unapproved captured source path');
 // Explicit historical Cloud-cache relocation only. The captured receipt is
 // unchanged and every relocated file still has to match its original hash.
 const path=original.startsWith(cache)?'node_modules/'+original.slice(cache.length):original;
 if(!path||path.includes('\\')||path.includes('\0')||path.startsWith('/')||path.split('/').some(part=>!part||part==='.'||part==='..')||
    !(/^(src|tests|scripts|data|docs|node_modules)\//.test(path)||['package-lock.json','package.json'].includes(path)))throw Error('Unapproved captured source path');
 const bytes=await read(path);
 if(path==='src/lib/registered-snapshot-verification.ts'){
  const old='a7a656f71b04b50192485a49b0b56b3fa6bd86b9',current='7086b85437b025225f5736fb6b849415e518dc08';
  const git=args=>execFileSync('git',args,{stdio:['ignore','pipe','pipe'],maxBuffer:8*1024*1024});
  const digest=value=>createHash('sha256').update(value).digest('hex');
  const historical=digest(git(['show',old+':'+path])),fresh=digest(git(['show',current+':'+path]));
  if(![historical,fresh].includes(binding.sha256))throw Error('Captured source historical claim differs: '+path);
  // Resolve every dependency through the SAME target reader, not the workspace.
  const {completionBindingDependencies}=await import('../../scripts/product-completion-lineage.mjs');
  const target=new Map(await Promise.all(completionBindingDependencies(path).map(async name=>[name,await read(name)])));
  if(verifyCompletionBinding(path,bytes,historical,git,name=>target.get(name))!==true)throw Error('Exact outer verifier successor required');
 }else if(!/^[a-f0-9]{64}$/.test(binding.sha256)||createHash('sha256').update(bytes).digest('hex')!==binding.sha256)throw Error('Captured source bytes differ: '+path);
 return path;
}
