/// <reference lib="webworker" />
import {calculateCandidate,replayCandidateSnapshot,candidateIds,type CandidateCatalogId} from './workflow';
import type {CandidateRequest,CandidateResponse} from './runner';
const scope=self as unknown as DedicatedWorkerGlobalScope;
scope.onmessage=async(event:MessageEvent<CandidateRequest>)=>{
 const request=event.data;
 const response:CandidateResponse={protocol:'six-candidate-worker-1',serial:request.serial,catalogId:request.catalogId};
 try{
  if(request.protocol!==response.protocol||!Number.isSafeInteger(request.serial)||request.serial<1||!candidateIds.includes(request.catalogId))throw Error('Unknown calculation request');
  if(request.operation==='compute')response.artifact=calculateCandidate(request.catalogId as CandidateCatalogId,request.input);
  else if(request.operation==='replay')response.artifact=(await replayCandidateSnapshot(request.text,request.catalogId)).artifact;
  else throw Error('Unknown calculation operation');
 }catch(e){response.error=e instanceof Error?e.message:String(e);}
 scope.postMessage(response);
};
