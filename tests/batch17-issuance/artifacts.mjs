import {mkdir,realpath} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const source=await realpath(fileURLToPath(new URL('../../',import.meta.url)));
function outside(candidate){
 const relative=path.relative(source,candidate);
 if(!relative||(!relative.startsWith('..'+path.sep)&&relative!=='..'&&!path.isAbsolute(relative)))throw Error('ISSUANCE_ARTIFACTS must be outside the source checkout');
}
export async function artifactDirectory(value){
 if(!value?.trim())throw Error('ISSUANCE_ARTIFACTS is required and must name an outside-source artifact directory');
 const target=path.resolve(value);outside(target);
 let ancestor=target;
 for(;;){try{outside(await realpath(ancestor));break;}catch(error){if(error.code!=='ENOENT')throw error;ancestor=path.dirname(ancestor);}}
 await mkdir(target,{recursive:true});
 const canonical=await realpath(target);outside(canonical);
 return canonical;
}
