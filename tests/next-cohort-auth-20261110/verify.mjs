import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {cases} from './cases.mjs';
const root=new URL('../../',import.meta.url),base='docs/next-cohort-auth-20261110/';
const read=file=>readFile(new URL(file,root),'utf8'),json=async file=>JSON.parse(await read(file));
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const native=await json(base+'native-receipt.json'),final=await json(base+'receipt.json');
assert.equal(native.passed,true);assert.equal(native.releaseHold,true);assert.equal(native.newPublicationEligible,0);assert.equal(native.observations.length,8);
assert.deepEqual(native.observations.map(o=>o.catalogId),cases.map(c=>c.catalogId));
for(const c of cases){const o=native.observations.find(o=>o.catalogId===c.catalogId);assert.equal(o.layout320,true);assert.equal(o.namedAXControls,true);assert.equal(o.keyboardErrorRecovery,true);assert.equal(o.sourceResponse.catalogId,c.catalogId);assert.equal(o.sourceResponse.engineId,c.engine);assert.equal(o.sourceResponse.version,c.version);assert.equal(o.sourceResponse.output.value,c.expected);assert.deepEqual(o.sourceResponse.enteredInput,c.input);}
assert.equal(native.batch.catalogId,379);assert.equal(native.batch.rows[0].result.output.value,300);assert.equal(native.batch.rows[1].ok,false);assert.equal(native.batch.singleOutbox,true);assert.equal(native.batch.usageUnits,2);assert.equal(native.batch.readUsageDelta,0);
for(const [file,hash]of Object.entries(native.sqlSources))assert.equal(sha(await read(file)),hash,file);
const sources=await json(base+'build-source-sha256.json');assert.equal(Object.keys(sources).length,31);assert.deepEqual(Object.entries(sources).filter(([,v])=>!v.equal).map(([p])=>p),['src/calculators/registry.ts']);for(const [file,value]of Object.entries(sources))assert.equal(sha(await read(file)),value.source,file);
const producer=await json(base+'producer-source-sha256.json');for(const [file,hash]of Object.entries(producer.hashes))assert.equal(sha(await read(file)),hash,file);
const version=await json(base+'source-version.json');assert.equal(version.trackedChanges,'');
assert.equal(final.passed,true);assert.deepEqual(final.observations,native.observations);const personal=final.personalWorkflowProof;assert.equal(personal.passed,true);assert.equal(personal.journeys.length,24);assert.equal(personal.downloads.length,64);for(const plan of ['free','pro','business'])for(const c of cases){const journey=personal.journeys.filter(j=>j.plan===plan&&j.catalogId===c.catalogId);assert.equal(journey.length,1);assert.equal(journey[0].version,c.version);assert.equal(journey[0].output.value,c.expected);assert.equal(journey[0].exactReplay,true);}
console.log('PASS exact eight native proof, held SQL hashes, 31 current source bindings, and 24 personal journey metadata; download byte evidence is verified by the separate personal packet');
