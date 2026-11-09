import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {readFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {verifyCapturedCurrentCaller,verifyCapturedSource} from '../acceptance-closure-20261108/receipt-source-path.mjs';
import {verifyCompletionBinding,completionBindingDependencies,completionSourceRefs} from '../../scripts/product-completion-lineage.mjs';
const current='00651cc382be5dcbd596882071787fd6702c13d3',old='955e2ed5df93e646275c4d94d33548cac5925380',caller='src/components/calculator-interactive.tsx',workflow='.github/workflows/ci.yml';
const git=args=>execFileSync('git',args,{stdio:['ignore','pipe','pipe'],maxBuffer:8*1024*1024});
const hash=x=>createHash('sha256').update(x).digest('hex');
const deps=['src/lib/technology-five-analysis.ts','src/lib/technology-five-analysis.test.ts','src/components/technology-five-analysis.tsx','src/components/technology-five-analysis.test.tsx'];
for(const ref of [old,current])test('exact retained/current receipt '+ref+' requires current caller',()=>assert.equal(verifyCapturedCurrentCaller({path:caller,sha256:hash(git(['show',ref+':'+caller]))}),caller));
test('retained955 receipt cannot admit former caller bytes',()=>{const bytes=git(['show',old+':'+caller]);assert.throws(()=>verifyCapturedCurrentCaller({path:caller,sha256:hash(bytes)},name=>name===caller?bytes:readFileSync(name)),/current successor/);});
for(const dep of deps)test('each exact analysis source is required through same sync/async target reader '+dep,async()=>{
 assert(completionBindingDependencies(caller).includes(dep));const claim={path:caller,sha256:hash(git(['show',old+':'+caller]))};
 assert.throws(()=>verifyCapturedCurrentCaller(claim,name=>name===dep?Buffer.from('tampered target'):readFileSync(name)),/supplemental source bytes differ/);
 await assert.rejects(verifyCapturedSource(claim,async name=>name===dep?Buffer.from('tampered target'):readFile(name)),/supplemental source bytes differ/);
});
test('new caller provenance cannot be missing or substituted',()=>{const claim={path:caller,sha256:hash(readFileSync(caller))};for(const substitute of [()=>{throw Error('Exact application revision missing');},()=>Buffer.from('0'.repeat(40))])assert.throws(()=>verifyCapturedCurrentCaller(claim,readFileSync,args=>args[0]==='rev-parse'&&args[1]==='--verify'&&args[2]===current+'^{commit}'?substitute():git(args)),/missing|unavailable/);});
test('workflow successor changes only cumulative publication job budget and explanatory comments',()=>{
 const previous=git(['show','b2d72aa66293b752739b7924745a57a51c4b5acb:'+workflow]).toString(),now=readFileSync(workflow,'utf8');
 const expected=previous.replace('  publication-factory:\n    runs-on: ubuntu-latest\n    timeout-minutes: 18','  publication-factory:\n    runs-on: ubuntu-latest\n    # Run42648534309 exhausted18min after152 successful journeys; retain every\n    # acceptance step and its own tighter timeout within a bounded25min job.\n    timeout-minutes: 25');assert.equal(now,expected);
 const claim=hash(git(['show','a955cdad7019a645b7ed2950299d0603ba1784a7:'+workflow]));assert.equal(verifyCompletionBinding(workflow,Buffer.from(now),claim,git),true);assert.throws(()=>verifyCompletionBinding(workflow,Buffer.from(previous),claim,git),/current successor/);
 assert(completionSourceRefs.includes(old));assert(completionSourceRefs.includes('b2d72aa66293b752739b7924745a57a51c4b5acb'));assert(completionSourceRefs.includes(current));
});
