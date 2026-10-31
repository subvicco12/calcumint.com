// Keep only the identity needed to explain module transport failures. Protocol
// request headers, bodies, credentials, queries and fragments are never retained.
const moduleUrl=value=>{try{const url=new URL(value);return ['http:','https:'].includes(url.protocol)?url.origin+url.pathname:null}catch{return null}};
export function networkDiagnostics(){
 const requests=new Map(),networkFailures=[];let fatal;
 return {networkFailures,event(method,params){
  if(method==='Network.requestWillBeSent'){
   requests.set(params.requestId,moduleUrl(params.request?.url));
   if(requests.size>2000)requests.delete(requests.keys().next().value);
  }else if(method==='Network.loadingFinished')requests.delete(params.requestId);
  else if(method==='Network.loadingFailed'){
   const failure={url:requests.get(params.requestId)??null,type:params.type,errorText:/^net::ERR_[A-Z_]+$/.test(params.errorText)?params.errorText:'Network load failed',canceled:params.canceled===true?true:params.canceled===false?false:null};
   requests.delete(params.requestId);networkFailures.push(failure);if(networkFailures.length>200)networkFailures.shift();
   if(failure.type==='Script'&&failure.errorText==='net::ERR_NETWORK_CHANGED'&&failure.canceled===false)fatal??=failure;
  }
 },assertHealthy(){if(fatal)throw Error(`Script load failed: ${fatal.errorText}; module: ${fatal.url??'unknown'}. Check concurrent host network changes; no retry was attempted.`)}};
}
