import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,symlink,truncate,rm} from 'node:fs/promises';
import {readBoundedArtifact} from './artifact-file.mjs';
test('artifact reader refuses parent paths, symlink files/directories and excessive bytes before content read',async()=>{
 const root=await mkdtemp('/tmp/first-five-artifact-boundary-');
 try{
  await mkdir(root+'/artifacts');await mkdir(root+'/outside');await writeFile(root+'/outside/value','outside');await writeFile(root+'/artifacts/value','valid');
  assert.equal((await readBoundedArtifact(root+'/artifacts','value',5)).toString(),'valid');
  await assert.rejects(readBoundedArtifact(root+'/artifacts','../outside/value',7),/Relative artifact/);
  await assert.rejects(readBoundedArtifact(root+'/artifacts',root+'/outside/value',7),/Relative artifact/);
  await symlink(root+'/outside/value',root+'/artifacts/link');await assert.rejects(readBoundedArtifact(root+'/artifacts','link',7),/No symlinked/);
  await symlink(root+'/outside',root+'/artifacts/linkdir');await assert.rejects(readBoundedArtifact(root+'/artifacts','linkdir/value',7),/No symlinked/);
  await assert.rejects(readBoundedArtifact(root+'/artifacts','value',8*1024*1024+1),/Bounded declared/);
  await truncate(root+'/artifacts/value',8*1024*1024+1);await assert.rejects(readBoundedArtifact(root+'/artifacts','value',5),/Bounded actual/);
 }finally{await rm(root,{recursive:true,force:true});}
});
