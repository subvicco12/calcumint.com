import {rm} from 'node:fs/promises';
/** Wait for the owned browser process before deleting its unique test profile.
 * Windows cannot unlink Crashpad files while a child still holds them open. */
export async function cleanupBrowser(browser,socket,profile){
 const running=()=>browser&&browser.exitCode===null&&browser.signalCode===null;
 if(running()){
  const wait=ms=>new Promise(resolve=>{
   if(browser.exitCode!==null||browser.signalCode!==null)return resolve(true);
   const done=value=>{clearTimeout(timer);browser.removeListener('exit',exited);resolve(value);},exited=()=>done(true);
   const timer=setTimeout(()=>done(false),ms);browser.once('exit',exited);
  });
  // Browser.close lets Chromium release its renderer/Crashpad children and files.
  // TerminateProcess on Windows kills only the parent, leaving profile locks.
  if(socket?.readyState===1){
   // Teardown owns this final command; no journey reply handler should consume it.
   socket.onmessage=null;
   try{socket.send(JSON.stringify({id:2147483647,method:'Browser.close'}));await wait(5000);}catch{/* Fall back only for an unavailable control channel. */}
  }
  if(running()){
   browser.kill('SIGTERM');
   if(!await wait(5000)){browser.kill('SIGKILL');if(!await wait(5000))throw Error('Owned test browser failed to exit');}
  }
 }
 try{socket?.close();}catch{/* The process has already been reaped. */}
 await rm(profile,{recursive:true,force:true});
}
