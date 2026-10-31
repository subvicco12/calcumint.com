import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {prepareCanonicalExpected} from '../../scripts/canonical-runtime-profile.mjs';
const source='docs/canonical-acceptance',base=JSON.parse(readFileSync('docs/blueprint-reconciliation/canonical-runtime-bindings.json','utf8'));
const runtime={node:'v22.23.4',platform:'linux',arch:'x64'};
test('independent wrong postimage and final digest cannot pass exact receipts',async()=>{
 for(const mutate of [b=>{b.profiles[runtime.node].patches[0].expectedAfter='f'.repeat(64);},b=>{b.profiles[runtime.node].canonicalLedgerOutputSHA256='f'.repeat(64);},b=>{b.profiles[runtime.node].patches.pop();},b=>{b.profiles[runtime.node].patches[0].path=['__proto__','polluted'];}]){const b=structuredClone(base);mutate(b);await assert.rejects(prepareCanonicalExpected(source,runtime,b));}
 assert.equal({}.polluted,undefined);
});
