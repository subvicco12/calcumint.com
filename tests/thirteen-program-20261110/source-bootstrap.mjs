/** Fetch only two exact historical proof objects; never approve their contents. */
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
export const thirteenProgramSourceCommits=Object.freeze([
 '40d3c8e03125b9075a273805b6760066ad828b8f',
 '531d677e0cca42d7259d4a2440057ccc74daea86',
]);
const root=fileURLToPath(new URL('../../',import.meta.url));
const origins=new Set(['https://github.com/subvicco12/calcumint.com','https://github.com/subvicco12/calcumint.com.git']);
const invoke=args=>execFileSync('git',['-c','protocol.file.allow=never','-c','protocol.ext.allow=never',...args],{
 cwd:root,env:{...process.env,GIT_TERMINAL_PROMPT:'0'},stdio:['ignore','pipe','pipe'],timeout:60000,maxBuffer:1024*1024,
});
export function ensureThirteenProgramSources(git=invoke){
 const urls=git(['remote','get-url','--all','origin']).toString().trim().split('\n');
 assert(urls.length===1&&origins.has(urls[0]),'Exact HTTPS CalcuMint repository origin required');
 let fetched=0;
 for(const ref of thirteenProgramSourceCommits){
  function present(){let value;try{value=git(['rev-parse','--verify',ref+'^{commit}']).toString().trim();}catch{return false;}assert.equal(value,ref,'Substituted thirteen-program source commit');return true;}
  if(!present()){git(['fetch','--no-tags','--depth=1','origin',ref]);fetched++;}
  assert(present(),'Exact thirteen-program source unavailable after bounded fetch');
 }
 return {sourceCommits:[...thirteenProgramSourceCommits],sourceRevisions:2,fetched,releaseHold:true,productionWrites:false};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))console.log(JSON.stringify(ensureThirteenProgramSources()));
