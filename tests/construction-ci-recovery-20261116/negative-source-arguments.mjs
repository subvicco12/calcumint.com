/** Refusal only. Matching arguments still require every original source/provenance proof. */
import assert from 'node:assert/strict';
import {sourceStage9Policy} from '../four-worker-integration-20261115/source-stage9-policy.mjs';
import {sourceStage8Policy} from '../milestone100-20261114/source-stage8-policy-v3.mjs';
import {workflowSourceEvidenceClaims} from '../milestone100-20261114/workflow-source-evidence-claims.mjs';
const paths=new Set([...sourceStage9Policy.paths,...sourceStage8Policy.paths,...workflowSourceEvidenceClaims.map(row=>row.path)]);
export function rejectChangedSourceArgument(file,bytes,read,message){
 if(!paths.has(file))return;
 const current=read(file);
 assert(Buffer.isBuffer(bytes)&&Buffer.isBuffer(current)&&Buffer.prototype.equals.call(bytes,current),message);
}
