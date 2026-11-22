import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import {capturePath,proveNinePathSuccessor,reconcileBatch14Membership} from './proof.mjs';
const git=args=>execFileSync('git',args,{stdio:['ignore','pipe','pipe'],maxBuffer:32*1024*1024});
const input={git,read:readFileSync,root:process.cwd()};
const proposal=JSON.parse(readFileSync(capturePath));
const row=proposal.sourcePaths[0];

test('nine current paths preserve the 80-path Stage 9 and Stage 8 proofs',()=>{
 const result=proveNinePathSuccessor(input);
 assert.equal(result.historicalCount,80);
 assert.equal(result.approvedPaths.length,9);
 assert.equal(result.stage8Verified,true);
});
test('altered capture fails closed before projection',()=>{
 assert.throws(()=>proveNinePathSuccessor({...input,read:path=>path===capturePath?Buffer.from('{}'):readFileSync(path)}),/proposal digest/);
});
test('substituted current bytes fail closed',()=>{
 assert.throws(()=>proveNinePathSuccessor({...input,read:path=>path===row.path?Buffer.from('forged'):readFileSync(path)}),/Current bytes differ/);
});
test('substituted historical bytes fail closed',()=>{
 assert.throws(()=>proveNinePathSuccessor({...input,git:args=>args[0]==='cat-file'&&args[2]===row.before.blob?Buffer.alloc(row.before.bytes):git(args)}),/Immutable bytes differ/);
});
test('missing historical blob fails closed',()=>{
 assert.throws(()=>proveNinePathSuccessor({...input,git:args=>{
  if(args[0]==='cat-file'&&args[2]===row.before.blob)throw Error('missing historical blob');
  return git(args);
 }}),/missing historical blob/);
});
test('dirty source status fails closed',()=>{
 assert.throws(()=>proveNinePathSuccessor({...input,git:args=>args[0]==='status'?Buffer.from('?? src/unbound.ts\n'):git(args)}),/Clean current src required/);
});
test('Batch14 permits precisely the two immutable engine additions without altering the historical artifact',()=>{
 const {batch14}=proposal;
 const raw=readFileSync(batch14.artifact);
 const history=JSON.parse(raw).implementationSourceSnapshot.files;
 const supplemental={path:batch14.supplemental};
 const additions=batch14.additions.map(path=>({path,sha256:proposal.sourcePaths.find(row=>row.path===path).after.sha256}));
 const sort=files=>files.sort((a,b)=>a.path<b.path?-1:a.path>b.path?1:0);
 const current=sort([...history,supplemental,...additions]);
 assert.deepEqual(reconcileBatch14Membership(input,current,raw),sort([...history,supplemental]));
 assert.throws(()=>reconcileBatch14Membership(input,current.slice(1),raw),/414 !== 415/);
 const unexpected=sort([...current.slice(1),{path:'src/calculators/unbound.ts',sha256:'0'.repeat(64)}]);
 assert.throws(()=>reconcileBatch14Membership(input,unexpected,raw),/Exact Batch14 current membership differs/);
 assert.throws(()=>reconcileBatch14Membership(input,current,Buffer.from('{}')),/artifact differs/);
 const changed=current.map(value=>value.path===additions[0].path?{...value,sha256:'0'.repeat(64)}:value);
 assert.throws(()=>reconcileBatch14Membership(input,changed,raw),/engine digest differs/);
});

test('substituted protected live dependency fails closed',()=>{
 const target=proposal.protectedRecords[0].path;
 assert.throws(()=>proveNinePathSuccessor({...input,read:path=>path===target?Buffer.from('forged'):readFileSync(path)}),/Protected live bytes differ/);
});
