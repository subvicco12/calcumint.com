import {boundedData} from '../statistics/worker-protocol';
import {validateCandidateArtifact,type CandidateArtifact,type CandidateCatalogId} from './workflow';
export type CandidateRequest={protocol:'six-candidate-worker-1';serial:number;catalogId:CandidateCatalogId;operation:'compute';input:unknown}|{protocol:'six-candidate-worker-1';serial:number;catalogId:CandidateCatalogId;operation:'replay';text:string};
export type CandidateResponse={protocol:'six-candidate-worker-1';serial:number;catalogId:CandidateCatalogId;artifact?:CandidateArtifact;error?:string};
export interface CandidateWorkerPort{onmessage:((e:MessageEvent)=>void)|null;onerror:((e:ErrorEvent)=>void)|null;onmessageerror:((e:MessageEvent)=>void)|null;postMessage(value:CandidateRequest):void;terminate():void}
export function createCandidateRunner(options:{factory?:()=>CandidateWorkerPort;deadlineMs?:number}={}){
 const deadline=options.deadlineMs??5000;if(!Number.isSafeInteger(deadline)||deadline<1||deadline>10000)throw Error('Invalid worker deadline');
 let serial=0,disposed=false,active:(()=>void)|undefined;
 function cancel(){active?.();}
 function job(id:CandidateCatalogId,operation:'compute'|'replay',data:unknown):Promise<CandidateArtifact>{
  cancel();if(disposed)return Promise.reject(Error('Runner disposed'));
  let request:CandidateRequest;
  try{if(operation==='replay'){if(typeof data!=='string'||data.length>2_000_000)throw Error('Replay size bound');request={protocol:'six-candidate-worker-1',serial:++serial,catalogId:id,operation,text:data};}
   else request={protocol:'six-candidate-worker-1',serial:++serial,catalogId:id,operation,input:boundedData(data)};
  }catch(e){return Promise.reject(e);}
  return new Promise((resolve,reject)=>{
   let worker:CandidateWorkerPort|undefined,timer:ReturnType<typeof setTimeout>|undefined,done=false;
   const finish=(error?:Error,artifact?:CandidateArtifact)=>{if(done)return;done=true;if(timer!==undefined)clearTimeout(timer);if(worker){worker.onmessage=null;worker.onerror=null;worker.onmessageerror=null;try{worker.terminate();}catch{/* Termination cannot prevent settlement or retry. */}}if(active===abort)active=undefined;if(error)reject(error);else resolve(artifact!);};
   const abort=()=>finish(Error('Calculation cancelled'));active=abort;
   try{
    worker=options.factory?options.factory():new Worker(new URL('./candidate.worker.ts',import.meta.url),{type:'module'});
    worker.onmessage=e=>{try{const r=e.data as CandidateResponse;if(!r||r.protocol!==request.protocol||r.serial!==request.serial||r.catalogId!==id||Object.keys(r).some(k=>!['protocol','serial','catalogId','artifact','error'].includes(k)))throw Error('Worker response identity mismatch');if(r.error)throw Error(String(r.error));const artifact=validateCandidateArtifact(r.artifact);if(artifact.catalogId!==id)throw Error('Worker artifact identity mismatch');if(request.operation==='compute'&&JSON.stringify(artifact.input)!==JSON.stringify(request.input))throw Error('Worker input identity mismatch');finish(undefined,artifact);}catch(e){finish(e instanceof Error?e:Error(String(e)));}};
    worker.onerror=()=>finish(Error('Private calculation worker failed'));worker.onmessageerror=()=>finish(Error('Invalid worker message'));
    timer=setTimeout(()=>finish(Error('Calculation budget exhausted; inputs preserved')),deadline);worker.postMessage(request);
   }catch(e){finish(e instanceof Error?e:Error(String(e)));}
  });
 }
 return {run:(id:CandidateCatalogId,input:unknown)=>job(id,'compute',input),replay:(id:CandidateCatalogId,text:string)=>job(id,'replay',text),cancel,dispose(){disposed=true;cancel();}};
}
export type CandidateRunner=ReturnType<typeof createCandidateRunner>;
