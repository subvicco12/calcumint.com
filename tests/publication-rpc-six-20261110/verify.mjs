import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const base='docs/publication-rpc-six-20261110/',sha=x=>createHash('sha256').update(x).digest('hex');
const r=JSON.parse(await readFile(base+'receipt.json')),q=JSON.parse(await readFile(base+'qualification.json'));
assert.equal(r.passed,true);assert.equal(r.checks.length,7);assert.deepEqual(q.newChecks,r.checks);assert.equal(q.exactSix.length,6);assert.equal(new Set(q.exactSix.map(x=>x.name)).size,6);
for(const record of [r,q]){assert.equal(record.productionWrites,false);assert.equal(record.activationAuthorized,false);assert.equal(record.certificationGranted,false);assert.equal(record.releaseHold,true);}
for(const [file,hash] of Object.entries({...r.sources,...q.retainedEvidence}))assert.equal(sha(await readFile(file)),hash,file);
for(const row of q.exactSix){assert.equal(sha(await readFile(row.source)),row.sourceSHA256);const m=r.metadata.find(m=>m.name===row.name);assert(m);assert.equal(row.signature,m.signature);assert.equal(row.identityArguments,m.identityArguments);assert.equal(row.runtimeDefinitionSHA256,m.definitionSHA256);assert.equal(m.securityDefiner,false);assert.equal(row.anonExecute,false);assert.equal(row.authenticatedExecute,true);const refusal=r.revoked.find(x=>x.name===row.name);assert(refusal);assert(refusal.status>=400);assert.notEqual(refusal.status,404);assert.match(refusal.message,/permission|admin|owner/i);}
for(const file of ['receipt.json','qualification.json','acceptance.log','initial-harness-invalid-publication-envelope.log','second-harness-empty-void-response.log'])assert.doesNotMatch(await readFile(base+file,'utf8'),/\bcm_(?:test|live)_[A-Za-z0-9_-]+|\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_.-]+/);
console.log('PASS exact six signatures, seven bounded checks, source/retained bindings and held status');
