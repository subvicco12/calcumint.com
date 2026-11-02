import {computeStatisticsArtifact} from '../statistics-workflow';
import {STATISTICS_WORKER_PROTOCOL,validateStatisticsRequest} from './worker-protocol';
// Dedicated module worker: computation is never imported as a main-thread fallback.
const workerScope=globalThis as unknown as {onmessage:(event:MessageEvent)=>void;postMessage:(value:unknown)=>void};
workerScope.onmessage=event=>{
 const request=validateStatisticsRequest(event.data);
 const artifact=computeStatisticsArtifact(request.catalogId,request.input);
 workerScope.postMessage({protocol:STATISTICS_WORKER_PROTOCOL,jobId:request.jobId,catalogId:request.catalogId,artifact});
};
