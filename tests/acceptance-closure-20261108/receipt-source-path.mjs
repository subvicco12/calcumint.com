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
 if(!/^[a-f0-9]{64}$/.test(binding.sha256)||createHash('sha256').update(bytes).digest('hex')!==binding.sha256)throw Error('Captured source bytes differ: '+path);
 return path;
}
