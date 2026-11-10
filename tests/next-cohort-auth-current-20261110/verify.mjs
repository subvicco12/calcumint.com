import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {cases} from './cases.mjs';
const root=new URL('../../',import.meta.url),base='docs/next-cohort-auth-current-20261110/';
const bytes=file=>readFile(new URL(file,root)),read=async file=>(await bytes(file)).toString(),json=async file=>JSON.parse(await read(file)),sha=b=>createHash('sha256').update(b).digest('hex');
const native=await json(base+'native-receipt.json'),final=await json(base+'receipt.json');
assert.equal(native.passed,true);assert.equal(native.releaseHold,true);assert.equal(native.newPublicationEligible,0);assert.deepEqual(native.observations.map(o=>o.catalogId),cases.map(c=>c.catalogId));
for(const c of cases){const o=native.observations.find(o=>o.catalogId===c.catalogId);for(const k of ['layout320','namedAXControls','keyboardErrorRecovery'])assert.equal(o[k],true);assert.equal(o.sourceResponse.catalogId,c.catalogId);assert.equal(o.sourceResponse.engineId,c.engine);assert.equal(o.sourceResponse.version,c.version);assert.equal(o.sourceResponse.output.value,c.expected);assert.deepEqual(o.sourceResponse.enteredInput,c.input);}
assert.equal(native.batch.catalogId,379);assert.equal(native.batch.rows[0].result.output.value,300);assert.equal(native.batch.rows[1].ok,false);assert.equal(native.batch.singleOutbox,true);assert.equal(native.batch.usageUnits,2);assert.equal(native.batch.readUsageDelta,0);
for(const [file,hash]of Object.entries(native.sqlSources))assert.equal(sha(await bytes(file)),hash,file);
const sources=await json(base+'build-source-sha256.json');assert.equal(Object.keys(sources).length,31);assert.deepEqual(Object.entries(sources).filter(([,v])=>!v.equal).map(([p])=>p),['src/calculators/registry.ts']);for(const [file,v]of Object.entries(sources))assert.equal(sha(await bytes(file)),v.source,'Direct current source mismatch: '+file);
const version=await json(base+'source-version.json');assert.equal(version.trackedChanges,'');const producer=await json(base+'producer-source-sha256.json');for(const [file,hash]of Object.entries(producer.hashes))assert.equal(sha(await bytes(file)),hash,file);
assert.equal(final.passed,true);assert.deepEqual(final.observations,native.observations);const personal=await json(base+'personal-current-caller/receipt.json');assert.deepEqual(final.personalWorkflowProof,personal);assert.equal(personal.passed,true);assert.equal(personal.journeys.length,6);assert.equal(personal.downloads.length,20);
for(const [file,hash]of Object.entries(personal.sourceHashes))assert.equal(sha(await bytes(file)),hash,'Direct current personal source mismatch: '+file);assert.equal(sha(await bytes('tests/next-cohort-sharing-20261110/personal-current-caller.mjs')),personal.producerSha256);
for(const plan of ['free','pro','business'])for(const id of [374,379]){const c=cases.find(c=>c.catalogId===id),j=personal.journeys.filter(j=>j.plan===plan&&j.catalogId===id);assert.equal(j.length,1);assert.equal(j[0].version,1);assert.equal(j[0].output.value,c.expected);assert.equal(j[0].exactReplay,true);}
const sets=new Map();
for(const item of personal.downloads){assert(!item.file.includes('..'));const b=await bytes(base+'personal-current-caller/'+item.file);assert.equal(b.length,item.bytes);assert.equal(sha(b),item.sha256);assert(item.events.some(e=>e.event==='begin'&&e.suggestedFilename===item.filename));assert(item.events.some(e=>e.event==='progress'&&e.state==='completed'&&e.receivedBytes===b.length&&e.totalBytes===b.length));const id=Number(item.tag.split(':')[1]),c=cases.find(c=>c.catalogId===id);assert([374,379].includes(id));
 if(item.tag.endsWith(':local-scenarios')||item.tag.endsWith(':recovered-scenarios')){const set=JSON.parse(b);assert.equal(set.calculatorSlug,c.slug);assert.equal(set.calculatorVersion,1);assert.equal(set.scenarios.length,2);for(const row of set.scenarios)assert.equal(row.displayMetadata.outputs.value.unit,id===379?'pixels/inch':row.input.toUnit);sets.set(item.tag,set);}
 else if(item.label==='Export recorded JSON'){const x=JSON.parse(b);assert.equal(x.calculatorSlug,c.slug);assert.equal(x.calculatorVersion,1);assert.equal(x.output.value,c.expected);}
 else if(item.label==='Export recorded CSV'){const lines=b.toString().split(/\r?\n/);assert(lines.includes('"identity","calculatorVersion","1"'));assert(lines.includes('"output","value","'+c.expected+'"'));}
 else if(item.label==='Export recorded PDF'){const text=execFileSync('pdftotext',['-layout','-','-'],{input:b,encoding:'utf8',timeout:10000,maxBuffer:1048576});assert.deepEqual([...text.matchAll(/^\s*output\["value"\]\s*=\s*([^\r\n]+)\s*$/gm)].map(m=>m[1].trim()),[String(c.expected)]);assert.deepEqual([...text.matchAll(/Engine\s+version:\s*(\d+)\s*$/gm)].map(m=>Number(m[1])),[1]);}
 else throw Error('Unexpected download label');
}
for(const plan of ['pro','business'])for(const id of [374,379]){const pick=set=>set.scenarios.map(row=>({input:row.input,output:row.output}));assert.deepEqual(pick(sets.get(plan+':'+id+':local-scenarios')),pick(sets.get(plan+':'+id+':recovered-scenarios')));}
const artifacts=await json(base+'artifact-hashes.json');for(const [file,hash]of Object.entries(artifacts.hashes))assert.equal(sha(await bytes(file)),hash,file);
console.log('PASS fresh current eight native journeys, direct 31 native + '+Object.keys(personal.sourceHashes).length+' personal source hashes, six targeted personal journeys and 20 exact semantic download files; no stale source exceptions');
