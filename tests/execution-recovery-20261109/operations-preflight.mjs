import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
export const requirements=['writerRoster','ddlFreezePlan','pauseDrainResume','backupCheckpoint','testedRestoreReceipt','credentialCustody','deployedCommit','rpcClientCompatibility','reversalAuthority','withdrawalAuthority'];
export function assess(input){
 assert(input&&typeof input==='object'&&!Array.isArray(input),'Object required');
 assert(Object.keys(input).every(k=>requirements.includes(k)),'Unknown fields refused; no credentials or configuration values accepted');
 const missing=[];
 for(const key of requirements){const x=input[key];if(x==null){missing.push(key);continue;}
  assert(x&&typeof x==='object'&&!Array.isArray(x),'Reference record required');
  assert.deepEqual(Object.keys(x).sort(),['evidenceRef','responsibleParty'],'Only party and evidence reference accepted');
  assert(typeof x.responsibleParty==='string'&&x.responsibleParty.trim().length>0,'Named responsible party required');
  assert(typeof x.evidenceRef==='string'&&/^(vault|change|receipt|repo|ticket):[a-zA-Z0-9._/#:-]+$/.test(x.evidenceRef),'Opaque approved reference handle required; no values/URLs/tokens');
 }
 return {status:missing.length?'BLOCKED_MISSING_EXTERNAL_EVIDENCE':'BLOCKED_PENDING_INDEPENDENT_OPERATOR_ADJUDICATION',missing,productionExecutionAuthorized:false,readOnly:true,limitations:'Reference syntax/presence only; does not verify truth, custody, freeze, backup availability, competence or deployment.'};
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
 assert.equal(process.argv.length,3,'Supply one local nonsecret evidence-reference JSON file; no connection arguments');
 const result=assess(JSON.parse(await readFile(process.argv[2],'utf8')));console.log(JSON.stringify(result,null,2));process.exitCode=2;
}
