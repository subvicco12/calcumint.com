import {sourceOwnershipRef} from './source-stage8-current-ref-join.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {sourceGit} from '../parallel-source-20261110/baseline-runtime.mjs';
import {savedActionsClaim,proveSavedActionsClaim} from './source-stage8-saved-actions-claim.mjs';
const input=()=>({file:savedActionsClaim.path,recordedSHA256:savedActionsClaim.historical.sha256,row:{predecessor:structuredClone(savedActionsClaim.predecessor),current:structuredClone(savedActionsClaim.current)},currentBytes:sourceGit(['cat-file','blob',savedActionsClaim.current.blob]),git:sourceGit});
test('the one fixed F042 claim joins to exact eac9 and reviewed current Git bytes',()=>{assert.equal(proveSavedActionsClaim(input()),true);const args=input();args.row.current.ref=sourceOwnershipRef;assert.equal(proveSavedActionsClaim(args),true);});
test('unknown or added paths and wrong historical claims refuse',()=>{
 for(const patch of [{file:'src/components/unknown.tsx'},{recordedSHA256:'0'.repeat(64)},{row:{predecessor:null,current:savedActionsClaim.current}}])assert.throws(()=>proveSavedActionsClaim({...input(),...patch}));
});
test('every predecessor/current identity field remains exact',()=>{
 for(const activeRef of [savedActionsClaim.current.ref,sourceOwnershipRef])for(const side of ['predecessor','current'])for(const [key,value]of [['path','src/unknown.ts'],['ref','0'.repeat(40)],['blob','1'.repeat(40)],['bytes',1],['sha256','0'.repeat(64)]]){const args=input();args.row.current.ref=activeRef;args.row[side][key]=value;assert.throws(()=>proveSavedActionsClaim(args));}
});
test('current tamper and valid old-byte reversion refuse',()=>{
 for(const ref of [savedActionsClaim.current.ref,sourceOwnershipRef])for(const bytes of [Buffer.from('tamper'),sourceGit(['cat-file','blob',savedActionsClaim.predecessor.blob])]){const args=input();args.row.current.ref=ref;assert.throws(()=>proveSavedActionsClaim({...args,currentBytes:bytes}),/Current named application successor differs|Fresh current source join bytes differ/);}
});
test('missing or substituted immutable provenance refuses',()=>{
 assert.throws(()=>proveSavedActionsClaim({...input(),git:()=>{throw Error('missing provenance');}}),/missing provenance/);
 assert.throws(()=>proveSavedActionsClaim({...input(),git:()=>Buffer.from('0'.repeat(40))}));
});

import {savedActionsReceiptHistoricalClaim} from './source-stage8-saved-actions-claim.mjs';
test('both exact historical and current receipt claims use a separately fixed historical chain claim',()=>{
 for(const sha256 of [savedActionsClaim.historical.sha256,savedActionsClaim.current.sha256])assert.equal(savedActionsReceiptHistoricalClaim({path:savedActionsClaim.path,sha256},input().currentBytes),savedActionsClaim.historical.sha256);
});
test('unknown receipt claims, paths, changed bytes and old-byte reversion refuse',()=>{
 assert.throws(()=>savedActionsReceiptHistoricalClaim({path:savedActionsClaim.path,sha256:'0'.repeat(64)},input().currentBytes));
 assert.throws(()=>savedActionsReceiptHistoricalClaim({path:'src/unknown.ts',sha256:savedActionsClaim.current.sha256},input().currentBytes));
 for(const bytes of [Buffer.from('tamper'),sourceGit(['cat-file','blob',savedActionsClaim.predecessor.blob])])for(const sha256 of [savedActionsClaim.historical.sha256,savedActionsClaim.current.sha256])assert.throws(()=>savedActionsReceiptHistoricalClaim({path:savedActionsClaim.path,sha256},bytes),/Captured source bytes differ/);
});


// Integration cases run after the independently reviewed G7/A6 authority is installed.
import {verifyCapturedSource} from './receipt-source-path-stage8.mjs';
import {completionBindingDependencies} from '../../scripts/product-completion-stage8.mjs';
import {readFileSync} from 'node:fs';
const caller='src/components/calculator-interactive.tsx';
test('historical and current SavedActions receipts use the complete same supplied target map',async()=>{
 const names=completionBindingDependencies(caller),target=new Map(names.map(path=>[path,readFileSync(path)]));assert(target.has(savedActionsClaim.path));
 for(const sha256 of [savedActionsClaim.historical.sha256,savedActionsClaim.current.sha256]){const seen=new Set();assert.equal(await verifyCapturedSource({path:savedActionsClaim.path,sha256},async path=>{assert(target.has(path),'Undeclared saved-actions dependency '+path);seen.add(path);return target.get(path);}),savedActionsClaim.path);assert(seen.has('docs/milestone100-20261114/source-stage8.json'));}
});
test('SavedActions receipt rejects supplied current tamper or unavailable new dependency with no fallback',async()=>{
 const binding={path:savedActionsClaim.path,sha256:savedActionsClaim.historical.sha256};
 await assert.rejects(verifyCapturedSource(binding,async path=>path===binding.path?Buffer.from('tamper'):readFileSync(path)));
 const dependency='tests/milestone100-20261114/source-stage8-saved-actions-claim.mjs';
 await assert.rejects(verifyCapturedSource(binding,async path=>{if(path===dependency)throw Error('Supplied dependency unavailable');return readFileSync(path);}),/Supplied dependency unavailable/);
});
