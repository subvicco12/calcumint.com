/** Negative refusal only. Valid and unknown claims still require the caller's original full proof. */
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const workflowClaimCapture=Object.freeze({"path":"docs/parallel-source-20261110/capture-revision68.json","sha256":"e9bc59cd40b54da57bef70ccba322b22fc2bab255b31261a3a65d72cd2744fd3","ref":"f042748d08caa4f51c19b7cf6fc675a3a1fb5dd5","paths":["src/app/api/business/native-embeds/route.ts","src/app/api/business/technology-embeds/route.ts","src/app/api/internal/technology-webhooks/process/route.ts","src/app/api/native-embed/[grant]/calculate/route.ts","src/app/embed/native/[grant]/page.tsx","src/components/native-embed-grant-form.tsx","src/components/native-frequency-embed.tsx","src/lib/native-delivery/contract.ts","src/lib/native-delivery/embed-request.ts","src/lib/native-delivery/grant.ts","src/lib/native-delivery/metering.ts","src/lib/native-delivery/publication.ts","src/lib/native-delivery/technology-five-job-storage.ts","src/lib/native-delivery/technology-five-webhook-worker.ts","src/lib/native-delivery/contract.test.ts"]});
export function negativeReject(file,claim,read){
 if(!workflowClaimCapture.paths.includes(file))return;
 assert.equal(typeof read,'function','Explicit workflow claim reader required');
 const supplied=read(workflowClaimCapture.path);assert(Buffer.isBuffer(supplied),'Independent current target bytes differ: '+workflowClaimCapture.path);const bytes=Buffer.from(supplied);
 assert(hash(bytes)===workflowClaimCapture.sha256,'Independent current target bytes differ: '+workflowClaimCapture.path);
 const capture=JSON.parse(bytes);assert.equal(capture.appRef,workflowClaimCapture.ref);assert.deepEqual(capture.workflowHistoricalClaims.map(row=>row.path),workflowClaimCapture.paths);assert.equal(capture.workflowHistoricalClaims.length,15);assert.equal(new Set(workflowClaimCapture.paths).size,15);
 for(const row of capture.workflowHistoricalClaims){assert.deepEqual(Object.keys(row).sort(),['blob','bytes','path','ref','sha256']);assert.equal(row.ref,workflowClaimCapture.ref);assert.match(row.blob,/^[0-9a-f]{40}$/);assert(Number.isSafeInteger(row.bytes)&&row.bytes>=0);assert.match(row.sha256,/^[0-9a-f]{64}$/);}
 const row=capture.workflowHistoricalClaims.find(row=>row.path===file);assert(row);if(claim!==row.sha256)throw Error('Exact original F042 source claim required');
}
