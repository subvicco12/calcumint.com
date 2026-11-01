import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {evaluateAdoption} from './adoption.mjs';
const graph=JSON.parse(readFileSync(new URL('../../docs/p0-decision-contracts/adoption-graph.json',import.meta.url)));
const read=path=>readFileSync(new URL('../../'+path,import.meta.url));
test('exact graph is source-bound review preparation, never adoption authorization',()=>{
 const r=evaluateAdoption(graph,read);assert.equal(r.integrityValid,true,JSON.stringify(r.errors));assert.equal(r.activationAuthorized,false);assert(r.unresolvedGates.includes('RELEASE_AUTHORITY'));assert(r.unresolvedGates.includes('TARGET_SCHEMA'));assert.equal(r.reviewOrder.length,graph.nodes.length);
});
test('source drift or missing bytes fail closed even when a local test receipt passed',()=>{
 assert.equal(evaluateAdoption(graph,p=>Buffer.concat([read(p),Buffer.from(' ')] )).integrityValid,false);
 assert.equal(evaluateAdoption(graph,()=>{throw Error('missing');}).integrityValid,false);
});
test('unknown targets, dependency cycles and unsafe paths cannot become a plan',()=>{
 const unknown=structuredClone(graph);unknown.nodes[1].dependencies.push('M999');assert.equal(evaluateAdoption(unknown,read).integrityValid,false);
 const cycle=structuredClone(graph);cycle.nodes[0].dependencies.push('M009');assert.equal(evaluateAdoption(cycle,read).integrityValid,false);
 const unsafe=structuredClone(graph);unsafe.nodes[1].sourceBindings[0].path='../outside';assert.equal(evaluateAdoption(unsafe,()=>{throw Error('must not read');}).integrityValid,false);
});
test('self-asserted approvals cannot lift release hold or authorize SQL',()=>{
 for(const update of [{activationAuthorized:true},{releaseHold:false},{approvedBy:'fixture-owner'},{sqlExecutionImplemented:true}]){const g={...structuredClone(graph),...update};const r=evaluateAdoption(g,read);assert.equal(r.integrityValid,false);assert.equal(r.activationAuthorized,false);}
});
test('hard SQL requirements and release sequencing are explicit and preserve duplicate prefixes',()=>{
 for(const id of ['M032','M033','M034','M035']){assert(graph.nodes.some(n=>n.id===id));assert(graph.activationOrdering.some(e=>e.before==='PUB_P0'&&e.after===id));}
 assert(!graph.nodes.find(n=>n.id==='M038').dependencies.includes('M009'));assert(graph.activationOrdering.some(e=>e.before==='M009'&&e.after==='M038'));
});

test('a verified status string cannot resolve missing or unauthenticated evidence',()=>{
 const g=structuredClone(graph);for(const gate of g.gates)gate.status='VERIFIED_TARGET_EVIDENCE';
 const r=evaluateAdoption(g,read);assert.equal(r.integrityValid,false);assert.equal(r.unresolvedGates.length,g.gates.length);assert.equal(r.activationAuthorized,false);
 for(const gate of g.gates)gate.evidence={ownerClaim:'approved',proof:'self-asserted'};
 const claimed=evaluateAdoption(g,read);assert.equal(claimed.integrityValid,false);assert.equal(claimed.unresolvedGates.length,g.gates.length);
});
