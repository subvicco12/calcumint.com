import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {check} from '../../scripts/adoption1535/package.mjs';
import {assess} from '../execution-recovery-20261109/operations-preflight.mjs';
const root=new URL('../../',import.meta.url);
export async function qualify(){
 const packet=JSON.parse(await readFile(new URL('docs/milestone60-20261113/operations/attestations.json',root),'utf8'));
 assert.equal(packet.activationAuthorized,false);assert.equal(packet.productionWrites,false);assert.equal(packet.releaseHold,true);assert.deepEqual(packet.authorizedBatch,[]);
 const source=JSON.parse(await readFile(new URL('docs/operational-thirteen-20261110/operator-checklist.json',root),'utf8'));
 assert.deepEqual(packet.controls,source.controls,'Preserve actual controls and unsigned authority');assert.equal(packet.controls.length,10);
 for(const pin of packet.sourcePins){assert(!pin.path.startsWith('/')&&!pin.path.split('/').includes('..'));const bytes=await readFile(new URL(pin.path,root));assert.equal(createHash('sha256').update(bytes).digest('hex'),pin.sha256,pin.path);}
 const fresh=JSON.parse(await readFile(new URL('docs/milestone60-20261113/operations/fresh-observation-links.json',root),'utf8'));
 assert.equal(fresh.newProviderCalls,0);assert.equal(fresh.productionWrites,false);
 for(const pin of fresh.receiptCopies){const bytes=await readFile(new URL(pin.path,root));assert.equal(createHash('sha256').update(bytes).digest('hex'),pin.sha256,pin.path);}
 const observed=JSON.parse(await readFile(new URL(fresh.receiptCopies[0].path,root),'utf8')).observation;
 assert.equal(observed.read_only,'on');assert.equal(observed.relation_count,7);assert.equal(observed.seven_relation_projection_sha256,'56b55a34c29d2c0dc60863da60df510d5a70d962edbc6582591ba025a756c3f1');
 const candidate=JSON.parse(await readFile(new URL('docs/completion-wave-20261113/operations/release-candidate.json',root),'utf8'));
 assert.deepEqual(observed.held_rpc_metadata.map(x=>x.signature).sort(),candidate.exactSix.map(x=>x.signature).sort());assert(observed.held_rpc_metadata.every(x=>x.exists===false));
 await check();
 const input=JSON.parse(await readFile(new URL('docs/execution-recovery-20261109/operations/operator-references.json',root),'utf8'));
 const referenceAssessment=assess(input);assert.equal(referenceAssessment.productionExecutionAuthorized,false);
 const fixture=JSON.parse(await readFile(new URL('docs/adoption1535/package/rehearsal.json',root),'utf8'));assert.equal(fixture.passed,true);assert.equal(fixture.activationAuthorized,false);assert.equal(fixture.productionWrites,false);
 return {status:'OFFLINE_QUALIFIED_RELEASE_HELD',productionExecutionAuthorized:false,sourcePinsChecked:packet.sourcePins.length,unsignedControls:packet.controls.length,referenceAssessment,retainedFixture:{startedAt:fixture.startedAt,finishedAt:fixture.finishedAt,checks:fixture.checks.length},limitations:packet.qualificationScope};
}
if(process.argv[1]===fileURLToPath(import.meta.url)){assert.equal(process.argv.length,2,'Offline qualification only; no connection or execution arguments');console.log(JSON.stringify(await qualify(),null,2));}
