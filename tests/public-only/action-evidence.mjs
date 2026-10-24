import assert from 'node:assert/strict';
export function findKnownLoginAction(registry) {
 const matches=Object.entries(registry.node??{}).filter(([,entry])=>entry.filename==='app/login/actions.ts'&&entry.exportedName==='signInWithGoogle'&&Object.hasOwn(entry.workers??{},'app/login/page'));
 assert.equal(matches.length,1,'exactly one compiled signInWithGoogle action must serve /login');
 const [id]=matches[0];assert.match(id,/^[0-9a-f]{42}$/,'compiled action ID');return id;
}
/** Test-only validation of existing Next development errors; no app instrumentation. */
export function assertNativeActionDenied({status,body,serverLog,providerRequests}) {
 assert.equal(status,500,'the invoked guard must reject the action');
 assert.equal(providerRequests,0,'the denied action must perform no provider operation');
 const errors=body.split('\n').flatMap(line=>{
  const match=line.match(/^[0-9a-f]+:E(\{.*\})$/);if(!match)return [];
  try{return [JSON.parse(match[1])];}catch{return [];}
 });
 const error=errors.find(entry=>entry.name==='FeatureUnavailableError'&&entry.message==='Feature unavailable in this release'&&entry.env==='Server');
 assert(error,'response must identify the product-policy guard error, not lookup/decoding failure');
 assert.match(error.digest??'',/^\d+$/,'guard error digest');
 const hasFrame=(name,file)=>Array.isArray(error.stack)&&error.stack.some(frame=>Array.isArray(frame)&&frame[0]===name&&typeof frame[1]==='string'&&frame[1].endsWith(file));
 assert(hasFrame('requireProductCapability','src/lib/product-mode-server.ts'),'response must trace the real product guard');
 assert(hasFrame('signInWithGoogle','src/app/login/actions.ts'),'response must trace the selected action');
 assert.match(serverLog,/Error \[FeatureUnavailableError\]: Feature unavailable in this release/,'fresh server guard error');
 assert.match(serverLog,/at requireProductCapability \(src\/lib\/product-mode-server\.ts:\d+:\d+\)/,'fresh server guard frame');
 assert.match(serverLog,/at signInWithGoogle \(src\/app\/login\/actions\.ts:\d+:\d+\)/,'fresh selected-action frame');
 assert.match(serverLog,new RegExp(`digest:\\s*['"]${error.digest}['"]`),'response and fresh server log must identify the same error');
 return {action:'app/login/actions.ts#signInWithGoogle',errorName:error.name,digest:error.digest,providerRequests};
}
