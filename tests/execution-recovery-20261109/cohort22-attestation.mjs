import assert from 'node:assert/strict';
import {readFile,realpath,stat} from 'node:fs/promises';
import {resolve,relative,isAbsolute} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {assess,requirements} from './operations-preflight.mjs';
export const reviewedSource='ddca21413199632fa7256967fffdded928a2a9de';
export async function inspectPacket(packet,directory){
 assert(packet&&typeof packet==='object'&&!Array.isArray(packet),'Packet object required');
 assert.deepEqual(Object.keys(packet).sort(),['deployedSource','evidence','records','reviewedSource']);
 assert.equal(packet.reviewedSource,reviewedSource,'Reviewed source binding mismatch');
 assert(packet.deployedSource===null||(typeof packet.deployedSource==='string'&&/^[a-f0-9]{40}$/.test(packet.deployedSource)),'Exact deployed SHA or explicit null required');
 const assessment=assess(packet.records);assert(Array.isArray(packet.evidence),'Evidence list required');
 const base=await realpath(directory),seen=new Set();
 for(const item of packet.evidence){
  assert.deepEqual(Object.keys(item).sort(),['evidenceRef','nonSecret','observedAt','path','requirement','sha256']);
  assert(requirements.includes(item.requirement)&&!seen.has(item.requirement),'Unknown/duplicate requirement');seen.add(item.requirement);
  assert.equal(item.evidenceRef,packet.records[item.requirement]?.evidenceRef,'Evidence reference mismatch');
  assert.equal(item.nonSecret,true,'Only declared nonsecret evidence permitted');
  assert(typeof item.observedAt==='string'&&/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d+)?Z$/.test(item.observedAt)&&Number.isFinite(Date.parse(item.observedAt)),'Explicit ISO UTC observation timestamp required');
  assert(typeof item.path==='string'&&item.path&&!isAbsolute(item.path)&&!item.path.split(/[\\/]/).includes('..'),'Relative path without traversal required');
  const file=await realpath(resolve(base,item.path)),rel=relative(base,file);
  assert(rel&&!isAbsolute(rel)&&!rel.split(/[\\/]/).includes('..'),'Evidence escapes declared directory');
  const info=await stat(file);assert(info.isFile()&&info.size<=1048576,'Bounded regular evidence file required');
  assert(/^[a-f0-9]{64}$/.test(item.sha256),'SHA256 required');
  assert.equal(createHash('sha256').update(await readFile(file)).digest('hex'),item.sha256,'Stale or mismatched evidence bytes');
 }
 const missingEvidence=requirements.filter(key=>!seen.has(key));
 return {status:assessment.missing.length||missingEvidence.length||packet.deployedSource===null?'BLOCKED_INCOMPLETE_PACKET':'BLOCKED_PENDING_INDEPENDENT_OPERATOR_ADJUDICATION',reviewedSource,deployedSource:packet.deployedSource,missingReferences:assessment.missing,missingEvidence,checkedEvidenceCount:seen.size,productionExecutionAuthorized:false,adoptionGo:false,limitations:'Local byte/reference integrity only; timestamps are asserted metadata, not fresh observations. No truth, identity, competence, freeze, restore, custody or deployment attestation is authenticated.'};
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
 assert.equal(process.argv.length,4,'Local packet JSON and evidence root required; no connection arguments');
 console.log(JSON.stringify(await inspectPacket(JSON.parse(await readFile(process.argv[2],'utf8')),process.argv[3]),null,2));process.exitCode=2;
}
