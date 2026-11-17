import assert from 'node:assert/strict';
import {readFile,realpath,lstat} from 'node:fs/promises';
import path from 'node:path';
export async function readBoundedArtifact(directory,relative,expectedBytes){
 assert(typeof relative==='string'&&!path.isAbsolute(relative)&&!relative.split(/[\\/]/).includes('..'),'Relative artifact path');
 assert(Number.isSafeInteger(expectedBytes)&&expectedBytes>0&&expectedBytes<=8*1024*1024,'Bounded declared artifact bytes');
 const file=path.resolve(directory,relative);assert(file.startsWith(path.resolve(directory)+path.sep),'Artifact containment');
 assert.equal(await realpath(file),file,'No symlinked artifact path');
 const metadata=await lstat(file);assert(metadata.isFile(),'Regular artifact file');assert.equal(metadata.size,expectedBytes,'Bounded actual artifact bytes');
 return readFile(file);
}
