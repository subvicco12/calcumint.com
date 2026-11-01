// Read-only readiness for PostgREST's mutation metadata. A successful SELECT can
// use PostgreSQL's new column while PostgREST's cached request-body parser is old.
export async function waitForCachedColumn({url,headers={},relation,column,timeoutMs=5000,pollMs=50,fetchImpl=fetch}) {
 if(!Number.isInteger(timeoutMs)||timeoutMs<1||timeoutMs>60000||!Number.isInteger(pollMs)||pollMs<1)throw Error('Invalid bounded readiness budget');
 const controller=new AbortController(),deadline=performance.now()+timeoutMs;
 const timer=setTimeout(()=>controller.abort(Error('PostgREST cache readiness deadline exceeded')),timeoutMs);
 let attempts=0;
 try {
  while(!controller.signal.aborted){
   attempts++;
   const response=await fetchImpl(url,{headers:{...headers,Accept:'application/openapi+json'},signal:controller.signal});
   if(response.status!==200)throw Error('PostgREST schema readiness HTTP '+response.status);
   const schema=await response.json(),properties=schema?.definitions?.[relation]?.properties;
   if(controller.signal.aborted||performance.now()>=deadline)throw Error('PostgREST cache readiness deadline exceeded');
   if(properties&&Object.hasOwn(properties,column))return {attempts};
   const remaining=deadline-performance.now();
   if(remaining<=0)throw Error('PostgREST cache readiness deadline exceeded');
   await new Promise(resolve=>setTimeout(resolve,Math.min(pollMs,remaining)));
  }
  throw controller.signal.reason;
 }finally{clearTimeout(timer);}
}
