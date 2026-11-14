import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {fetchSourceLineage} from '../scripts/fetch-source-lineage.mjs';
import {proveSourcePreflightAndHistoricalInputs} from './milestone100-20261114/source-preflight-stage8.mjs';
test('reuses verified revisions without redundant network fetch',()=>{
 let calls=0;const result=fetchSourceLineage(args=>{assert.equal(args[0],'rev-parse');calls++;return Buffer.from(args[2].slice(0,40));});
 assert.equal(result.fetched,0);assert.equal(calls,result.sourceRevisions*2);assert.equal(result.releaseHold,true);
});
test('fetches only exact missing commits and re-verifies them',()=>{
 const available=new Set(),fetches=[];
 const result=fetchSourceLineage(args=>{if(args[0]==='fetch'){assert.deepEqual(args.slice(0,4),['fetch','--no-tags','--depth=1','origin']);for(const ref of args.slice(4)){assert.match(ref,/^[a-f0-9]{40}$/);available.add(ref);}fetches.push(args);return Buffer.from('');}const ref=args[2].slice(0,40);if(!available.has(ref))throw Error('missing');return Buffer.from(ref);});
 for(const ref of ['7eff39b23a52953c028852d50d5571211a3f8a44','2f088187dd395fd26262c32195b427258f44fa44','9c0b5dc3e3aec18ed03fb6849562ebddc854db06','761b850479ea36b2b4ebf8039664d8400c762555','ee3d0a70cf5a908ce3588bb02b67bbb86576a8a7'])assert(fetches[0].slice(4).includes(ref),'Historical source comparison must be fetched: '+ref);
 assert.equal(fetches.length,1);assert.equal(result.fetched,result.sourceRevisions);assert.equal(result.productionWrites,false);
});
test('fails closed on absent or substituted revisions after fetch',()=>{
 assert.throws(()=>fetchSourceLineage(args=>args[0]==='fetch'?Buffer.from(''):Buffer.from('0'.repeat(40))),/unavailable/);
 assert.throws(()=>fetchSourceLineage(()=>{throw Error('network denied');}),/network denied/);
});

const sourceGit=args=>execFileSync('git',args,{stdio:['ignore','pipe','pipe'],maxBuffer:8*1024*1024});
const sourceHash=bytes=>createHash('sha256').update(bytes).digest('hex');
function verifyBootstrapSuccession(read=readFileSync,git=sourceGit){
 const proved=proveSourcePreflightAndHistoricalInputs({read,git});
 read=proved.historicalInput.read;git=proved.historicalInput.git;
 const capture=JSON.parse(readFileSync('docs/execution-recovery-20261109/source-successors/governed-bootstrap/capture.json','utf8'));
 assert.equal(capture.predecessor.ref,'a7a656f71b04b50192485a49b0b56b3fa6bd86b9');
 assert.equal(capture.predecessor.path,'scripts/fetch-source-lineage.mjs');
 const original=git(['show',capture.predecessor.ref+':'+capture.predecessor.path]);
 assert.equal(sourceHash(original),capture.predecessor.sha256);
 assert.equal(git(['rev-parse',capture.predecessor.ref+':'+capture.predecessor.path]).toString().trim(),capture.predecessor.gitBlob);
 const retained=JSON.parse(readFileSync('docs/product-completion-20261108/implementation-manifest.json','utf8')).files.find(row=>row.path===capture.predecessor.path);
 assert.equal(retained.sha256,capture.predecessor.sha256);
 assert.deepEqual(capture.current.map(row=>row.path).sort(),['scripts/fetch-source-lineage.mjs','scripts/frequency-presentation-lineage.mjs','scripts/n1-publication-lineage.mjs','tests/source-lineage-bootstrap.test.mjs'].sort());
 for(const record of capture.current){
  // HEAD is already present in a shallow checkout: no self-referential fetch needed.
  assert.equal(git(['rev-parse','HEAD:'+record.path]).toString().trim(),record.gitBlob,'Exact current HEAD source object differs');
  const bytes=git(['cat-file','blob',record.gitBlob]);assert.equal(sourceHash(bytes),record.sha256);assert(read(record.path).equals(bytes),'Exact current bootstrap source bytes differ');
 }
 assert.deepEqual(capture.governedRefs,['761b850479ea36b2b4ebf8039664d8400c762555','ee3d0a70cf5a908ce3588bb02b67bbb86576a8a7']);
 assert.equal(capture.productionWrites,false);return true;
}
test('standalone exact bootstrap source capture preserves frozen manifest and governing verifier sources',()=>assert.equal(verifyBootstrapSuccession(),true));
test('bootstrap source audit refuses old-valid reversion, arbitrary tamper and missing Git proof',()=>{
 const name='scripts/fetch-source-lineage.mjs';
 const old=sourceGit(['show','a7a656f71b04b50192485a49b0b56b3fa6bd86b9:'+name]);
 for(const bytes of [old,Buffer.from('tampered bootstrap')])assert.throws(()=>verifyBootstrapSuccession(path=>path===name?bytes:readFileSync(path)),/current bootstrap source bytes differ/);
 assert.throws(()=>verifyBootstrapSuccession(readFileSync,()=>{throw Error('Missing exact bootstrap Git proof');}),/Missing exact bootstrap Git proof/);
});
