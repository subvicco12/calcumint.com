import type {DecimalStatisticsInput} from './decimal-descriptive';
import type {FullSixArtifact} from '../result-contract';
import {STATISTICS_WORKER_PROTOCOL,validateStatisticsInput,validateStatisticsResponse,type StatisticsWorkerRequest} from './worker-protocol';
export type StatisticsJobResult={status:'complete';artifact:FullSixArtifact}|{status:'cancelled'|'budget-exhausted'|'error';message:string};
export interface StatisticsJobRunner{run(catalogId:282|283,input:DecimalStatisticsInput):Promise<StatisticsJobResult>;cancel():void;dispose():void}
export interface StatisticsWorkerPort{onmessage:((event:MessageEvent)=>void)|null;onerror:((event:ErrorEvent)=>void)|null;onmessageerror:((event:MessageEvent)=>void)|null;postMessage(message:StatisticsWorkerRequest):void;terminate():void}
export type StatisticsRunnerOptions={workerFactory?:()=>StatisticsWorkerPort;deadlineMs?:number};
/** Hard safety cutoff, distinct from the as-yet-unmet 500ms p95 performance policy. */
export function createStatisticsJobRunner(options:StatisticsRunnerOptions={}):StatisticsJobRunner{
 const deadline=options.deadlineMs??5000;if(!Number.isFinite(deadline)||deadline<1||deadline>10000)throw Error('Safety deadline must be 1..10000ms');
 let disposed=false,serial=0,active:((result:StatisticsJobResult)=>void)|undefined;
 function cancel(){active?.({status:'cancelled',message:'Calculation cancelled'});}
 return {cancel,dispose(){disposed=true;cancel();},run(catalogId,input){
  cancel();if(disposed)return Promise.resolve({status:'cancelled',message:'Runner disposed'});
  let request:StatisticsWorkerRequest;try{if(catalogId!==282&&catalogId!==283)throw Error('Invalid catalog identity');request={protocol:STATISTICS_WORKER_PROTOCOL,jobId:++serial,catalogId,input:validateStatisticsInput(input)};}catch{return Promise.resolve({status:'error',message:'Invalid or oversized statistics input'});}
  return new Promise(resolve=>{
   let worker:StatisticsWorkerPort|undefined,timer:ReturnType<typeof setTimeout>|undefined,settled=false;
   const finish=(result:StatisticsJobResult)=>{if(settled)return;settled=true;if(timer!==undefined)clearTimeout(timer);if(worker){worker.onmessage=null;worker.onerror=null;worker.onmessageerror=null;try{worker.terminate();}catch{ /* Already terminated. */ }}if(active===finish)active=undefined;resolve(result);};
   active=finish;
   try{worker=options.workerFactory?options.workerFactory():new Worker(new URL('./statistics.worker.ts',import.meta.url),{type:'module'});worker.onmessage=event=>{if(settled)return;try{finish({status:'complete',artifact:validateStatisticsResponse(event.data,request)});}catch{finish({status:'error',message:'Worker returned an invalid or mismatched artifact'});}};worker.onerror=()=>finish({status:'error',message:'Statistics worker failed'});worker.onmessageerror=()=>finish({status:'error',message:'Statistics worker message could not be decoded'});timer=setTimeout(()=>finish({status:'budget-exhausted',message:'Calculation exceeded the hard safety deadline'}),deadline);worker.postMessage(request);}catch{finish({status:'error',message:'Statistics worker could not start'});}
  });
 }};
}
