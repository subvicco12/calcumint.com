/** Iframe navigation can replace its realm after getFrameTree has reported the URL. */
export async function evaluateFrame(browser,url,expression){
 let last;
 for(let attempt=0;attempt<100;attempt++){
  try{
   const tree=await browser.send('Page.getFrameTree');const frame=tree.frameTree.childFrames?.find(f=>f.frame.url===url)?.frame;
   if(frame){const world=await browser.send('Page.createIsolatedWorld',{frameId:frame.id,worldName:'next-cohort-acceptance'});const result=await browser.send('Runtime.evaluate',{expression,contextId:world.executionContextId,returnByValue:true,awaitPromise:true});if(result.exceptionDetails)throw Error(result.exceptionDetails.exception?.description||result.exceptionDetails.text);return result.result.value;}
  }catch(error){if(!/Cannot find context|Execution context was destroyed|No frame with given id|Frame with the given frameId was not found/.test(error.message))throw error;last=error;}
  await new Promise(resolve=>setTimeout(resolve,50));
 }
 throw last||Error('Expected iframe did not commit');
}
