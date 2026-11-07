// Test-fixture synchronization only. Never call application mutations to poll readiness.
export const nativeSchema={
 native_embed_grants:['id','organization_id','issuer_id','api_key_id','token_hash','allowed_origin','catalog_id','engine_id','technical_version','issued_at','expires_at','revoked_at'],
 native_embed_usage:['grant_id','request_id','organization_id','issuer_id','api_key_id','catalog_id','engine_id','technical_version','request_hash','result_hash','created_at','units']
};
const rpcArguments=['p_grant_id','p_request_id','p_request_hash','p_result_hash'];
export async function waitForNativeSchema({url,serviceKey,timeoutMs=10000,intervalMs=50,fetchImpl=fetch,now=Date.now,pause=ms=>new Promise(r=>setTimeout(r,ms))}){
 if(new URL(url).hostname!=='127.0.0.1')throw Error('Readiness is restricted to disposable loopback fixtures');
 const started=now(),observations=[];
 for(;;){
  const response=await fetchImpl(url+'/rest/v1/',{method:'GET',headers:{apikey:serviceKey,Authorization:'Bearer '+serviceKey,Accept:'application/openapi+json'},signal:AbortSignal.timeout(Math.max(1,timeoutMs-(now()-started)))});
  const schema=await response.json();
  if(!response.ok)throw Error('Nontransient schema readiness failure: '+JSON.stringify({status:response.status,body:schema}));
  const missing=[];
  for(const [table,columns] of Object.entries(nativeSchema)){
   if(!schema.paths?.['/'+table])missing.push('path:'+table);
   for(const column of columns)if(!schema.definitions?.[table]?.properties?.[column])missing.push(table+'.'+column);
  }
  const rpc=schema.paths?.['/rpc/consume_native_embed_v1']?.post?.parameters?.find(p=>p.in==='body')?.schema;
  for(const arg of rpcArguments)if(!rpc?.properties?.[arg]||!rpc.required?.includes(arg))missing.push('rpc:'+arg);
  observations.push({elapsedMs:now()-started,missing});
  if(!missing.length)return{elapsedMs:now()-started,attempts:observations.length,observations,method:'GET OpenAPI cached table columns and exact RPC arguments'};
  if(now()-started>=timeoutMs)throw Error('Native schema cache readiness timeout: '+JSON.stringify(observations));
  await pause(Math.min(intervalMs,timeoutMs-(now()-started)));
 }
}
