import {readFile,readdir} from 'node:fs/promises';
import path from 'node:path';
import {setTimeout as pause} from 'node:timers/promises';

// Chrome can create the destination before it finishes writing. A readable file
// alone is not completion: require no temporary download, stable bytes, and a
// complete JSON document. Schema and replay assertions remain with the caller.
export async function downloaded(file,{timeoutMs=10000,pollMs=60}={}){
 const deadline=Date.now()+timeoutMs;let previous,lastCause='destination not observed';
 while(Date.now()<deadline){
  try{
   const pending=async()=>(await readdir(path.dirname(file))).some(name=>name.endsWith('.crdownload'));
   if(await pending()){previous=undefined;lastCause='Chrome .crdownload still present';}
   else{
    const text=await readFile(file,'utf8');
    JSON.parse(text);
    if(await pending()){previous=undefined;lastCause='Chrome .crdownload appeared during read';}
    else if(text===previous)return text;
    else{previous=text;lastCause='JSON bytes have not stabilized';}
   }
  }catch(error){
   if(!(error instanceof SyntaxError)&&error.code!=='ENOENT')throw error;
   previous=undefined;lastCause=error.message;
  }
  await pause(Math.min(pollMs,Math.max(0,deadline-Date.now())));
 }
 throw Error(`No completed actual report download ${file} within ${timeoutMs}ms: ${lastCause}`);
}
