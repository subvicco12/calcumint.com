import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { captureStage7 } from './source-capture-stage7.mjs';
import { proveSourceStage7AndHistoricalInputs as prove } from './source-stage7.mjs';
import { makeGitReader } from '../parallel-source-20261110/git-reader.mjs';
function fixture(fn) {
 const root=mkdtempSync(join(tmpdir(),'source-stage7-'));
 const git=args=>execFileSync('git',args,{cwd:root,stdio:['ignore','pipe','pipe']});
 const read=path=>readFileSync(join(root,path));
 try {
  git(['init','-q']);git(['config','user.name','Stage7 Fixture']);git(['config','user.email','stage7@example.invalid']);
  mkdirSync(join(root,'src'));writeFileSync(join(root,'src/changed.ts'),'prior\n');git(['add','.']);git(['commit','-qm','Predecessor']);
  const predecessorRef=git(['rev-parse','HEAD']).toString().trim();
  writeFileSync(join(root,'src/changed.ts'),'current\n');writeFileSync(join(root,'src/added.ts'),'added\n');git(['add','.']);git(['commit','-qm','Exact APP delta']);
  const codeRef=git(['rev-parse','HEAD']).toString().trim(),capturePath='capture.json';
  const policy=captureStage7({root,predecessorRef,codeRef,capturePath,policyPath:'policy.mjs'});
  fn({root,git,read,policy,capturePath});
 } finally {rmSync(root,{recursive:true,force:true});}
}
test('all exact current rows prove before exposing predecessor bytes and HEAD',()=>fixture(f=>{
 const result=prove(f);assert.equal(result.live.size,2);
 assert.equal(result.historicalInput.read('src/changed.ts').toString(),'prior\n');
 assert.throws(()=>result.historicalInput.read('src/added.ts'),/no historical bytes/);
 assert.equal(result.historicalInput.git(['rev-parse','--verify','HEAD^{commit}']).toString().trim(),f.policy.predecessorRef);
 assert(result.historicalInput.read(f.capturePath).equals(f.read(f.capturePath)));
 f.git(['commit','--allow-empty','-qm','Evidence only']);assert.equal(prove(f).live.size,2);
 const records=f.policy.paths.map(path=>({ref:f.policy.codeRef,path,blob:JSON.parse(f.read(f.capturePath)).rows.find(row=>row.path===path).current.blob}));
 const actualCalls=[],reader=makeGitReader((args,options)=>{actualCalls.push(args);return f.git(args,options);});
 reader.preloadPaths(records);assert.deepEqual(actualCalls[0],['rev-parse','--revs-only','--end-of-options',...records.map(row=>row.ref+':'+row.path)]);
 for(const row of records){assert.equal(reader(['rev-parse',row.ref+':'+row.path]).toString().trim(),row.blob);assert(reader(['show',row.ref+':'+row.path]).equals(f.git(['cat-file','blob',row.blob])));}
 assert(!actualCalls.some(args=>args[0]==='ls-tree'),'Verified immutable paths avoid full-tree subprocesses');
 const[a,b]=records;let calls=0,mode='mixed-wrong',substitute=true,live=0;
 const injected=makeGitReader(args=>{if(args[0]==='rev-parse'&&args[1]==='--revs-only'&&args[2]==='--end-of-options'){calls++;return Buffer.from(args.slice(3).map(spec=>mode==='mixed-wrong'&&spec===b.ref+':'+b.path?'0'.repeat(40):records.find(row=>row.ref+':'+row.path===spec).blob).join('\n')+'\n');}if(args[0]==='cat-file')return substitute?Buffer.from('substituted immutable object'):f.git(args);if(args[0]==='status'||args.some(arg=>arg.startsWith('HEAD')))return Buffer.from('fresh-'+(++live));throw Error('Unexpected fallback '+JSON.stringify(args));});
 assert.throws(()=>injected.preloadPaths(records),/substitution/);mode='correct';injected.preloadPaths([a]);assert.equal(calls,2,'A mixed failed batch must not partly install its valid first mapping');
 assert.throws(()=>injected.preloadPaths([{...a,blob:b.blob}]),/poisoning/);assert.throws(()=>injected.preloadPaths([{...a,ref:'HEAD'}]),/identity/);assert.throws(()=>injected.preloadPaths([{...a,path:'../escape'}]),/identity/);assert.throws(()=>injected.preloadPaths([b,{...b,blob:a.blob}]),/Conflicting/);
 assert.throws(()=>injected(['show',a.ref+':'+a.path]),/content address/);substitute=false;assert(injected(['show',a.ref+':'+a.path]).equals(f.git(['cat-file','blob',a.blob])));
 assert.notEqual(injected(['rev-parse','HEAD:'+a.path]).toString(),injected(['rev-parse','HEAD:'+a.path]).toString());assert.notEqual(injected(['status','--porcelain','--','src']).toString(),injected(['status','--porcelain','--','src']).toString());
 for(const output of [a.blob+'\n',a.blob+'\n'+b.blob+'\n'+'f'.repeat(40)+'\n',a.ref+':'+a.path+'\n'+b.blob+'\n',a.blob.toUpperCase()+'\n'+b.blob+'\n',Buffer.from([0xff,...Buffer.from(a.blob.slice(1)+'\n'+b.blob+'\n')])]){let attempts=0;const batch=makeGitReader(()=>{attempts++;return Buffer.from(attempts===1?output:a.blob+'\n');});assert.throws(()=>batch.preloadPaths(records));batch.preloadPaths([a]);assert.equal(attempts,2,'Malformed batches must leave no newly installed path mapping');}

}));
test('dirty, unknown and committed unreviewed source fail outer proof',()=>fixture(f=>{
 writeFileSync(join(f.root,'src/changed.ts'),'dirty');assert.throws(()=>prove(f),/Dirty or unknown/);
 f.git(['checkout','--','src/changed.ts']);writeFileSync(join(f.root,'src/unknown.ts'),'unknown');assert.throws(()=>prove(f),/Dirty or unknown/);
 f.git(['add','src/unknown.ts']);f.git(['commit','-qm','Unreviewed SRC']);assert.throws(()=>prove(f),/Unreviewed current source delta/);
}));
test('current bytes cannot revert or mutate even when retained predecessor was valid',()=>fixture(f=>{
 for(const bytes of [Buffer.from('prior\n'),Buffer.from('tampered')])assert.throws(()=>prove({...f,read:path=>path==='src/changed.ts'?bytes:f.read(path)}),/Current factory bytes differ/);
}));
test('capture and immutable commit substitutions fail independently',()=>fixture(f=>{
 assert.throws(()=>prove({...f,read:path=>path===f.capturePath?Buffer.from('{}'):f.read(path)}),/capture digest differs/);
 assert.throws(()=>prove({...f,git:args=>args[0]==='cat-file'&&args[1]==='commit'&&args[2]===f.policy.codeRef?Buffer.from('substituted parent'):f.git(args)}),/content address/);
 assert.throws(()=>prove({...f,policy:{...f.policy,paths:['src/changed.ts']}}));
}));
test('same-byte filesystem redirection fails and preload capability survives only successful projection',()=>fixture(f=>{
 const calls=[];f.git.preloadCommits=refs=>calls.push(refs);
 const result=prove(f);result.historicalInput.git.preloadCommits(['retained']);assert.deepEqual(calls,[f.policy.ancestry,['retained']]);
 const target=join(f.root,'src/changed.ts'),bytes=f.read('src/changed.ts');rmSync(target);writeFileSync(join(f.root,'same-bytes'),bytes);symlinkSync(join(f.root,'same-bytes'),target);assert.throws(()=>prove(f));
}));
test('producer refuses uncommitted source before writing a nomination',()=>fixture(f=>{
 writeFileSync(join(f.root,'src/changed.ts'),'dirty');assert.throws(()=>captureStage7({root:f.root,predecessorRef:f.policy.predecessorRef,codeRef:f.policy.codeRef,capturePath:'bad.json',policyPath:'bad.mjs'}),/Commit all SRC/);
}));

test('composition invokes retained callback only after current proof and retains literal20 separately',()=>fixture(f=>{
 let calls=0;
 const retained=()=>{calls++;return {actualCurrent:new Map(Array.from({length:20},(_,i)=>['retained/'+i,{current:{path:'retained/'+i}}]))};};
 const result=compose(f,retained);assert.equal(calls,1);assert.equal(result.historicalStage6.size,20);assert.equal(result.stage7.size,2);assert.equal(result.actualCurrent.size,22);
 writeFileSync(join(f.root,'src/changed.ts'),'dirty');assert.throws(()=>compose(f,retained));assert.equal(calls,1);
}));
import { proveCurrentStage7AndHistoricalInputs as compose } from './source-stage7.mjs';
import { extendStage7Lineage, verifyStage7Lineage } from './source-lineage-stage7.mjs';
import { selectStage7HistoricalSource } from './source-stage7-historical.mjs';
test('lineage retains original rows, updates exact existing edges and appends finite new edges only',()=>{
 const prior='header\nconst bindings='+JSON.stringify([{path:'src/components/calculator-interactive.tsx',supplementalSources:[{path:'src/changed.ts',ref:'old',blob:'old',sha256:'old'}]}],null,2)+';\nexecutable-tail';
 const records=new Map(['changed','added'].map(name=>['src/'+name+'.ts',{current:{path:'src/'+name+'.ts',ref:'new',blob:name,sha256:name}}]));
 const current=extendStage7Lineage(prior,records);assert(current.endsWith('executable-tail'));assert.equal(verifyStage7Lineage({previous:prior,current,records}),true);
 for(const changed of [current.replace('new','foreign'),current.replace('executable-tail','no-op')])assert.throws(()=>verifyStage7Lineage({previous:prior,current:changed,records}));
 const ownedPrior='const bindings='+JSON.stringify([{path:'src/components/calculator-interactive.tsx'},{path:'src/lib/registered-snapshot-verification.ts',successorRef:'retained-v1',successorBlob:'retained-blob',successorSHA256:'retained-hash',intermediateSources:[{ref:'earlier',blob:'earlier-blob',sha256:'earlier-hash'}]}],null,2)+';';
 const ownedRecords=new Map([['src/lib/registered-snapshot-verification.ts',{current:{path:'src/lib/registered-snapshot-verification.ts',ref:'reviewed-successor',blob:'new-blob',sha256:'new-hash'}}]]);
 const ownedCurrent=extendStage7Lineage(ownedPrior,ownedRecords);const owned=JSON.parse(/const bindings=(\[[\s\S]*?\n\]);/.exec(ownedCurrent)[1])[1];assert.deepEqual(owned.intermediateSources,[{ref:'earlier',blob:'earlier-blob',sha256:'earlier-hash'},{ref:'retained-v1',blob:'retained-blob',sha256:'retained-hash'}]);assert.equal(owned.successorRef,'reviewed-successor');
 const path='src/lib/registered-snapshot-verification.ts',appRef='f042748d08caa4f51c19b7cf6fc675a3a1fb5dd5';
 const original={path,ref:appRef,blob:'old-blob',sha256:'old-hash',bytes:1464};
 const row={path,predecessor:{...original,ref:'reviewed-stage7-predecessor'},current:{path,ref:'actual-app6',blob:'new-blob',sha256:'new-hash',bytes:2000}};
 const input={path,stage7Paths:[path],row,original,appRef};
 assert.deepEqual(selectStage7HistoricalSource(input),original,'Legitimate exact historical F042 claim must retain its actual source record');
 for(const altered of [{...input,stage7Paths:[]},{...input,path:'src/unknown.ts'},{...input,original:{...original,ref:'actual-app6'}},{...input,original:{...original,ref:'unknown-ref'}},{...input,original:{...original,sha256:'new-hash'}},{...input,original:{...original,blob:'substituted'}},{...input,row:{...row,predecessor:{...row.predecessor,bytes:1}}},{...input,row:{...row,predecessor:null}}])assert.equal(selectStage7HistoricalSource(altered),undefined);

});
