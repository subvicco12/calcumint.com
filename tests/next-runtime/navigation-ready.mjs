/** Page.navigate acknowledges a committed navigation, not loaded module scripts.
 * Keep resource loading separate from the subsequent strict UI assertions. */
export async function waitForDocument(events,loaderId,{timeoutMs=120000}={}){
 const deadline=Date.now()+timeoutMs;
 while(Date.now()<deadline){
  if(events.some(event=>event.method==='Page.lifecycleEvent'&&event.params.loaderId===loaderId&&event.params.name==='DOMContentLoaded'))return;
  await new Promise(resolve=>setTimeout(resolve,25));
 }
 throw Error('Document did not finish loading: '+loaderId);
}
