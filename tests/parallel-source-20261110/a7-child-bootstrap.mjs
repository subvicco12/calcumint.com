import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {lstatSync,readFileSync,realpathSync} from 'node:fs';
import {resolve} from 'node:path';

const probePath='tests/parallel-source-20261110/baseline-probe.mjs';
// Exact executable closure of the reviewed probe and its literal A7 target.
const graph={"files":[{"scope":"historical","ref":"a7bab5b5534d51cea25ba5ffe4aa9b3630176909","path":"tests/next-five-20261110/source/accepted-authority.mjs","blob":"1dac1567d00881ae7ae1275a4ae1236a0b302019","bytes":3819,"sha256":"f93ef98fe8780049da0b08a9fb6a32e42f067cb0e5f6ceaa4d62b7ae2823b0f0"},{"scope":"historical","ref":"a7bab5b5534d51cea25ba5ffe4aa9b3630176909","path":"tests/next-five-20261110/source/current-proof.mjs","blob":"79ba518669e2f810b6db8a528a84adcd41a587a0","bytes":8740,"sha256":"14a23b2ed85129fa3ff302f77a5d0f19043f9c591a6188cc768a9dcda98e08ea"},{"scope":"historical","ref":"a7bab5b5534d51cea25ba5ffe4aa9b3630176909","path":"tests/next-five-20261110/source/fixed-anchor.mjs","blob":"beff85ff82e87879abf5fd203fb3e6d112c029c3","bytes":7381,"sha256":"ba3577c7549e075ab09fa0220f669b257e775e1a855a0f70eed4b2df1d78f510"},{"scope":"historical","ref":"a7bab5b5534d51cea25ba5ffe4aa9b3630176909","path":"tests/next-five-20261110/source/retained-r3-stage.mjs","blob":"b2fe64fd1170a947bcd6f9e75b3f2e967898c698","bytes":8787,"sha256":"95b5c47d9b88f9b202045b0113a5c1d8b3298e2592ac47091767cdd09b316c17"},{"scope":"live","ref":"83b4fec6a23efb3c188c47812eb892bc8a935c19","path":"tests/parallel-source-20261110/a7-batch-input.mjs","blob":"48c46baf527c28b37b6f2961a7d0c4e66c8ba889","bytes":933,"sha256":"ca8667a300dc71c7d07f32b5a838d45fe7043a80eeeaedb70ade66bd86cb6175"},{"scope":"live","ref":"83b4fec6a23efb3c188c47812eb892bc8a935c19","path":"tests/parallel-source-20261110/baseline-probe.mjs","blob":"859347d677bed99d2982a083cdea210df9a24490","bytes":2566,"sha256":"33b036c1c4afe418237b78724dc123a7ff8c9abc9d9c68340a32297e7916d47d"},{"scope":"live","ref":"83b4fec6a23efb3c188c47812eb892bc8a935c19","path":"tests/parallel-source-20261110/git-reader.mjs","blob":"4059f6cd3f50463302f4ea36c134b1a7f9dacc82","bytes":8618,"sha256":"8394e0a05c825a7ec3b4d250917581a8204eaaad1551bfed257de855af345d7a"}],"edges":[{"scope":"historical","from":"tests/next-five-20261110/source/current-proof.mjs","specifier":"node:assert/strict","to":"node:assert/strict","builtin":true},{"scope":"historical","from":"tests/next-five-20261110/source/current-proof.mjs","specifier":"node:fs","to":"node:fs","builtin":true},{"scope":"historical","from":"tests/next-five-20261110/source/current-proof.mjs","specifier":"node:child_process","to":"node:child_process","builtin":true},{"scope":"historical","from":"tests/next-five-20261110/source/current-proof.mjs","specifier":"node:crypto","to":"node:crypto","builtin":true},{"scope":"historical","from":"tests/next-five-20261110/source/current-proof.mjs","specifier":"./retained-r3-stage.mjs","to":"tests/next-five-20261110/source/retained-r3-stage.mjs","builtin":false},{"scope":"historical","from":"tests/next-five-20261110/source/current-proof.mjs","specifier":"./fixed-anchor.mjs","to":"tests/next-five-20261110/source/fixed-anchor.mjs","builtin":false},{"scope":"historical","from":"tests/next-five-20261110/source/current-proof.mjs","specifier":"./accepted-authority.mjs","to":"tests/next-five-20261110/source/accepted-authority.mjs","builtin":false},{"scope":"historical","from":"tests/next-five-20261110/source/accepted-authority.mjs","specifier":"node:assert/strict","to":"node:assert/strict","builtin":true},{"scope":"historical","from":"tests/next-five-20261110/source/accepted-authority.mjs","specifier":"node:fs","to":"node:fs","builtin":true},{"scope":"historical","from":"tests/next-five-20261110/source/accepted-authority.mjs","specifier":"node:child_process","to":"node:child_process","builtin":true},{"scope":"historical","from":"tests/next-five-20261110/source/accepted-authority.mjs","specifier":"node:crypto","to":"node:crypto","builtin":true},{"scope":"historical","from":"tests/next-five-20261110/source/fixed-anchor.mjs","specifier":"node:assert/strict","to":"node:assert/strict","builtin":true},{"scope":"historical","from":"tests/next-five-20261110/source/fixed-anchor.mjs","specifier":"node:crypto","to":"node:crypto","builtin":true},{"scope":"historical","from":"tests/next-five-20261110/source/retained-r3-stage.mjs","specifier":"node:assert/strict","to":"node:assert/strict","builtin":true},{"scope":"historical","from":"tests/next-five-20261110/source/retained-r3-stage.mjs","specifier":"node:crypto","to":"node:crypto","builtin":true},{"scope":"historical","from":"tests/next-five-20261110/source/retained-r3-stage.mjs","specifier":"node:fs","to":"node:fs","builtin":true},{"scope":"historical","from":"tests/next-five-20261110/source/retained-r3-stage.mjs","specifier":"node:child_process","to":"node:child_process","builtin":true},{"scope":"live","from":"tests/parallel-source-20261110/baseline-probe.mjs","specifier":"node:assert/strict","to":"node:assert/strict","builtin":true},{"scope":"live","from":"tests/parallel-source-20261110/baseline-probe.mjs","specifier":"node:fs","to":"node:fs","builtin":true},{"scope":"live","from":"tests/parallel-source-20261110/baseline-probe.mjs","specifier":"./a7-batch-input.mjs","to":"tests/parallel-source-20261110/a7-batch-input.mjs","builtin":false},{"scope":"live","from":"tests/parallel-source-20261110/baseline-probe.mjs","specifier":"node:crypto","to":"node:crypto","builtin":true},{"scope":"live","from":"tests/parallel-source-20261110/baseline-probe.mjs","specifier":"node:path","to":"node:path","builtin":true},{"scope":"live","from":"tests/parallel-source-20261110/baseline-probe.mjs","specifier":"node:url","to":"node:url","builtin":true},{"scope":"live","from":"tests/parallel-source-20261110/baseline-probe.mjs","specifier":"./git-reader.mjs","to":"tests/parallel-source-20261110/git-reader.mjs","builtin":false},{"scope":"live","from":"tests/parallel-source-20261110/baseline-probe.mjs","to":"tests/next-five-20261110/source/current-proof.mjs","targetScope":"historical","absolute":true},{"scope":"live","from":"tests/parallel-source-20261110/git-reader.mjs","specifier":"node:crypto","to":"node:crypto","builtin":true},{"scope":"live","from":"tests/parallel-source-20261110/a7-batch-input.mjs","specifier":"node:child_process","to":"node:child_process","builtin":true},{"scope":"live","from":"tests/parallel-source-20261110/a7-batch-input.mjs","specifier":"node:fs","to":"node:fs","builtin":true},{"scope":"live","from":"tests/parallel-source-20261110/a7-batch-input.mjs","specifier":"node:os","to":"node:os","builtin":true},{"scope":"live","from":"tests/parallel-source-20261110/a7-batch-input.mjs","specifier":"node:path","to":"node:path","builtin":true}]};

const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
function regularBytes(file){
 assert(lstatSync(file).isFile()&&realpathSync(file)===file,'Redirected A7 module: '+file);
 return readFileSync(file);
}

export function captureA7Child({root,tree,git}){
 const headQuery=['rev-parse','--verify','HEAD^{commit}'];
 const head=git(headQuery).toString().trim();
 const historical=graph.files.find(row=>row.scope==='historical').ref;
 const checkHead=()=>assert.equal(git(headQuery).toString().trim(),head,'Native HEAD moved during A7 capture');
 const roots={live:realpathSync(root),historical:realpathSync(tree)};
 const files=graph.files.map(row=>{
  const {scope,ref,path,blob,bytes,sha256}=row;
  assert.equal(git(['rev-parse',ref+':'+path]).toString().trim(),blob,'A7 immutable path differs: '+path);
  if(scope==='live')assert.equal(git(['rev-parse',head+':'+path]).toString().trim(),blob,'Unexpected A7 module binding: '+path);
  const content=git(['cat-file','blob',blob]);
  assert.equal(content.length,bytes);
  assert.equal(sha(content),sha256,'A7 module digest differs: '+path);
  const file=resolve(roots[scope],path);
  assert(regularBytes(file).equals(content),'Live A7 module differs: '+path);
  return {scope,path,source:content.toString('base64')};
 });
 const check=()=>{
  checkHead();
  for(const row of files)assert(regularBytes(resolve(roots[row.scope],row.path)).equals(Buffer.from(row.source,'base64')),'A7 module moved: '+row.path);
  checkHead();
 };
 check();
 const packet=Buffer.from(JSON.stringify({roots,head,historical,files,edges:graph.edges,probePath}));
 assert(packet.length<=64*1024,'A7 launch packet exceeds finite bound');
 const args=['--input-type=module','--eval','await ('+runA7Child.toString()+')();',probePath];
 return {args:[...args],packet:packet.toString('base64'),digest:sha(packet),check};
}

// This source is passed directly to Node, rather than loaded from a mutable path.
async function runA7Child(){
 const {default:assert}=await import('node:assert/strict');
 const {createHash}=await import('node:crypto');
 const {execFileSync}=await import('node:child_process');
 const {lstatSync,readFileSync,realpathSync}=await import('node:fs');
 const {isBuiltin,registerHooks}=await import('node:module');
 const {resolve}=await import('node:path');
 const {pathToFileURL}=await import('node:url');
 const packet=Buffer.from(process.argv[3],'base64');
 assert(packet.length<=64*1024);
 assert.equal(createHash('sha256').update(packet).digest('hex'),process.argv[4],'A7 launch packet digest differs');
 const {roots,head,historical,files,edges,probePath}=JSON.parse(packet);
 const headAt=cwd=>execFileSync('git',['rev-parse','--verify','HEAD^{commit}'],{
  cwd,stdio:['ignore','pipe','pipe'],timeout:15000,maxBuffer:1024,
 }).toString().trim();
 const url=(scope,path)=>pathToFileURL(resolve(roots[scope],path)).href;
 const sources=new Map(files.map(row=>[url(row.scope,row.path),Buffer.from(row.source,'base64')]));
 const allowed=new Map(edges.map(edge=>{
  const target=edge.builtin?edge.to:url(edge.targetScope??edge.scope,edge.to);
  if(edge.builtin)assert(isBuiltin(target));
  else assert(sources.has(target),'Unbound A7 import target');
  return [JSON.stringify([url(edge.scope,edge.from),edge.absolute?target:edge.specifier]),target];
 }));
 const check=()=>{
  assert.equal(headAt(roots.live),head,'Native HEAD moved during A7 execution');
  assert.equal(headAt(roots.historical),historical,'Historical A7 HEAD moved');
  for(const row of files){
   const file=resolve(roots[row.scope],row.path);
   assert(lstatSync(file).isFile()&&realpathSync(file)===file,'Redirected A7 runtime module: '+file);
   assert(readFileSync(file).equals(sources.get(url(row.scope,row.path))),'A7 runtime module moved: '+row.path);
  }
 };
 check();
 const entry=url('live',probePath);
 const hooks=registerHooks({
  resolve(specifier,context,next){
   if(context.parentURL===import.meta.url&&specifier===entry)return {url:entry,shortCircuit:true};
   const target=allowed.get(JSON.stringify([context.parentURL,specifier]));
   assert(target,'Unexpected A7 import: '+specifier);
   return target.startsWith('node:')?next(target,context):{url:target,shortCircuit:true};
  },
  load(url,context,next){
   if(isBuiltin(url))return next(url,context);
   const source=sources.get(url);
   assert(source,'Unexpected A7 executable module: '+url);
   return {format:'module',source:Buffer.from(source),shortCircuit:true};
  },
 });
 try{await import(entry);}
 finally{hooks.deregister();check();}
}
