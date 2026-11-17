/** Scheduling only: two child slots, with atomic globally exclusive fixture leases. */
export function createSourceChildScheduler(...extra){
 if(extra.length)throw Error('Source child scheduler has exactly two slots');
 let active=0;const queue=[];
 function pump(){
  while(queue.length){const job=queue[0];if(active+job.weight>2)return;queue.shift();job.started=true;job.signal?.removeEventListener('abort',job.abort);if(job.signal?.aborted){job.reject(cancelled(job.signal));continue;}active+=job.weight;
   Promise.resolve().then(job.run).then(value=>{active-=job.weight;job.resolve(value);pump();},error=>{active-=job.weight;job.reject(error);pump();});
  }
 }
 const cancelled=signal=>Object.assign(Error('Queued source child cancelled'),{code:'ABORT_ERR',cause:signal.reason});
 return function schedule(run,{exclusive=false,signal}={}){
  if(typeof run!=='function'||typeof exclusive!=='boolean')return Promise.reject(TypeError('Explicit source child function and exclusivity required'));
  if(signal?.aborted)return Promise.reject(cancelled(signal));
  return new Promise((resolve,reject)=>{const job={run,weight:exclusive?2:1,signal,resolve,reject,started:false};job.abort=()=>{if(job.started)return;const index=queue.indexOf(job);if(index>=0)queue.splice(index,1);signal?.removeEventListener('abort',job.abort);reject(cancelled(signal));pump();};signal?.addEventListener('abort',job.abort,{once:true});queue.push(job);pump();});
 };
}
