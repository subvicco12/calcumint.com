import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
const directory=path.resolve(process.env.FACTORY_ACCOUNT_ARTIFACTS||'/tmp/calculator-factory-account');
const receipt=JSON.parse(await readFile(path.join(directory,'account-receipt.json'),'utf8'));
const expected=[208,209,210,211,212,215,216,218,219,220,423,424,425,427,428,430,431,432,433,434,438,440];
assert.equal(receipt.passed,true);assert.deepEqual(receipt.catalogIds,expected);assert.equal(receipt.observations.length,66);
assert.equal(receipt.productionWrites,false);assert.equal(receipt.certificationGranted,false);assert.equal(receipt.publicationGranted,false);assert.equal(receipt.releaseHold,true);
const sha=x=>createHash('sha256').update(x).digest('hex');
for(const[p,digest]of Object.entries(receipt.producerSources))assert.equal(sha(await readFile(new URL('../../'+p,import.meta.url))),digest,p);
for(const[p,digest]of Object.entries(receipt.sourceHashes))assert.equal(sha(await readFile(path.join(receipt.sourceRoot,p))),digest,p);
for(const id of expected){const rows=receipt.observations.filter(x=>x.catalogId===id);assert.deepEqual(rows.map(x=>x.plan),['free','pro','business']);for(const row of rows){assert.equal(row.version,1);for(const k of ['realJWT','exactRetry','conflictDenied','foreignReadUpdateDeleteDenied'])assert.equal(row[k],true);assert.equal(row.freeScenarioDenied,row.plan==='free');assert.equal(row.scenarioId===null,row.plan==='free');}assert.deepEqual(rows[0].output,rows[1].output);assert.deepEqual(rows[0].output,rows[2].output);}
assert(receipt.requests.some(r=>r.path==='/rest/v1/rpc/save_calculation_history_atomic'&&r.status===200));
assert(receipt.requests.some(r=>r.path==='/rest/v1/rpc/save_project_scenario_atomic'&&r.status===200));
assert.equal(receipt.fixture.authMigrationCount,75);assert.equal(receipt.fixture.productionEquivalence,'UNKNOWN');
console.log('PASS exact22 identities /66 real-JWT account observations, producer/source hashes and honest scope');
