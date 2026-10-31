import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,rm,symlink} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {artifactDirectory} from './artifacts.mjs';
test('requires an artifact directory and rejects source destinations including symlinks',async()=>{
 await assert.rejects(artifactDirectory(undefined),/ISSUANCE_ARTIFACTS/);
 await assert.rejects(artifactDirectory(process.cwd()),/outside/);
 const dir=await mkdtemp(path.join(os.tmpdir(),'issuance-config-'));
 try{
  assert.equal(await artifactDirectory(dir),dir);
  await symlink(process.cwd(),path.join(dir,'source'));
  await assert.rejects(artifactDirectory(path.join(dir,'source')),/outside/);
  await assert.rejects(artifactDirectory(path.join(dir,'source','must-not-create')),/outside/);
 }finally{await rm(dir,{recursive:true,force:true});}
});
