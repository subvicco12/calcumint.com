import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {resolve} from 'node:path';
import {withSourceObjectLock} from '../parallel-source-20261110/source-object-lock.mjs';
/** Availability only: call after independent policy verification. All adapters share actual repository lock. */
export function ensureExactStageObjects({root,refs,git}){
 assert(Array.isArray(refs)&&refs.length>0&&refs.length<=3);for(const ref of refs)assert.match(ref,/^[0-9a-f]{40}$/);
 const actual=args=>execFileSync('git',['-c','protocol.file.allow=never','-c','protocol.ext.allow=never',...args],{cwd:root,env:{...process.env,GIT_TERMINAL_PROMPT:'0'},stdio:['ignore','pipe','pipe'],timeout:60000,maxBuffer:4*1024*1024});
 const transport=git??actual,common=resolve(root,actual(['rev-parse','--git-common-dir']).toString().trim());
 return withSourceObjectLock(common,()=>{
  const urls=transport(['remote','get-url','--all','origin']).toString().trim().split('\n');assert.equal(urls.length,1);assert(['https://github.com/subvicco12/calcumint.com','https://github.com/subvicco12/calcumint.com.git'].includes(urls[0]));
  for(const ref of new Set(refs)){
   const present=()=>{let value;try{value=transport(['rev-parse','--verify',ref+'^{commit}']).toString().trim();}catch{return false;}assert.equal(value,ref,'Source commit substitution');return true;};
   if(!present())transport(['fetch','--no-tags','--depth=1','origin',ref]);assert(present(),'Exact factory object unavailable');
  }
 });
}
