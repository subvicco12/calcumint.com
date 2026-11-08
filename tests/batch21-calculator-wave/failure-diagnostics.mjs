// A failed renderer may also reject screenshots. Keep that secondary failure in
// the receipt while allowing the caller to rethrow the original acceptance error.
export async function captureFailureScreenshot(browser,writeScreenshot,report) {
 if(!browser)return;
 try {
  const screenshot=await browser.send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true});
  await writeScreenshot(Buffer.from(screenshot.data,'base64'));
 } catch(error) {
  report.screenshotError=String(error.stack||error);
 }
}

export function instrumentBrowser(instance,currentJourney,failures) {
 return new Proxy(instance,{get(target,name) {
  const member=target[name];
  if(typeof member!=='function'||name==='close')return member;
  return async(...args)=>{
   const journey=currentJourney();
   const operation={journey,method:name,argument:args[0],startedAt:new Date().toISOString()};
   try{return await member.apply(target,args);}
   catch(error){
    operation.error=String(error.stack||error);failures.push(operation);
    throw new Error(`Batch21 ${journey?.slug??'startup'} width=${journey?.width??'n/a'} ${name}(${JSON.stringify(args[0])}): ${error.message}`,{cause:error});
   }
  };
 }});
}
