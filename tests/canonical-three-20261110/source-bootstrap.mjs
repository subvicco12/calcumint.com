/** Make one literal documentary predecessor available; never approve its contents. */
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

export const canonicalSourceCommit='3c9fc6bdcedf053d2315470f8c0ee549d53bd5de';
const root=fileURLToPath(new URL('../../',import.meta.url));
const origins=new Set(['https://github.com/subvicco12/calcumint.com','https://github.com/subvicco12/calcumint.com.git']);
const invoke=args=>execFileSync('git',['-c','protocol.file.allow=never','-c','protocol.ext.allow=never',...args],{
 cwd:root,env:{...process.env,GIT_TERMINAL_PROMPT:'0'},stdio:['ignore','pipe','pipe'],timeout:60000,maxBuffer:1024*1024,
});

export function ensureCanonicalSource(git=invoke){
 const urls=git(['remote','get-url','--all','origin']).toString().trim().split('\n');
 assert(urls.length===1&&origins.has(urls[0]),'Exact HTTPS CalcuMint repository origin required');
 function present(){
  let value;try{value=git(['rev-parse','--verify',canonicalSourceCommit+'^{commit}']).toString().trim();}catch{return false;}
  assert.equal(value,canonicalSourceCommit,'Substituted canonical source commit');return true;
 }
 const fetched=present()?0:1;
 if(fetched)git(['fetch','--no-tags','--depth=1','origin',canonicalSourceCommit]);
 assert(present(),'Exact canonical source unavailable after bounded fetch');
 return {sourceCommit:canonicalSourceCommit,sourceRevisions:1,fetched,releaseHold:true,productionWrites:false};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))console.log(JSON.stringify(ensureCanonicalSource()));
