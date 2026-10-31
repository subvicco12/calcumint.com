// Campaign-only buffered fetch: bound headers AND body; no streaming consumers.
export function createBoundedFetch({deadline,maxRequestMs=5000,fetchImpl=globalThis.fetch}) {
 return async function boundedFetch(input,init={}) {
  const remaining=deadline-Date.now();
  if(remaining<=0)throw new DOMException('Campaign request deadline exceeded','TimeoutError');
  const controller=new AbortController();
  const callerSignal=init.signal??(input instanceof Request?input.signal:undefined);
  let timer,onAbort;
  const aborted=new Promise((_,reject)=>{
   onAbort=()=>{controller.abort(callerSignal.reason);reject(callerSignal.reason)};
   if(callerSignal?.aborted){onAbort();return;}
   callerSignal?.addEventListener('abort',onAbort,{once:true});
   timer=setTimeout(()=>{const reason=new DOMException('Campaign request timeout','TimeoutError');controller.abort(reason);reject(reason)},Math.min(maxRequestMs,remaining));
  });
  try {
   if(callerSignal?.aborted)return await aborted;
   const transport=(async()=>{
    const response=await fetchImpl(input,{...init,signal:controller.signal});
    const body=response.body===null?null:await response.arrayBuffer();
    return new Response(body,{status:response.status,statusText:response.statusText,headers:response.headers});
   })();
   return await Promise.race([transport,aborted]);
  } finally {
   clearTimeout(timer);callerSignal?.removeEventListener('abort',onAbort);
  }
 };
}
