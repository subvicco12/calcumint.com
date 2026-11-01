import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,writeFile,mkdir,symlink,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {verifySourceBindings,sha} from './bundle.mjs';
test('preflight verifies supplementary rollback bytes before producing an adoption bundle',async()=>{
 const root=await mkdtemp(join(tmpdir(),'calcumint-source-'));
 try{
  await writeFile(join(root,'apply.sql'),'apply');await writeFile(join(root,'reverse.sql'),'reverse');
  const plan={sourceBindings:[{path:'apply.sql',sha256:sha('apply')}],supplementarySourceBindings:[{path:'reverse.sql',sha256:sha('reverse')}]};
  assert.equal((await verifySourceBindings(plan,root)).length,2);
  await writeFile(join(root,'reverse.sql'),'tampered');
  await assert.rejects(verifySourceBindings(plan,root),/Source changed: reverse.sql/);
 }finally{await rm(root,{recursive:true,force:true});}
});
test('preflight rejects duplicate, traversal, absolute and symlink-escaped sources',async()=>{
 const root=await mkdtemp(join(tmpdir(),'calcumint-source-'));
 try{
  await mkdir(join(root,'inside'));await writeFile(join(root,'outside.sql'),'outside');
  await symlink(join(root,'outside.sql'),join(root,'inside','escape.sql'));
  for(const path of ['../outside.sql','/outside.sql','escape.sql'])await assert.rejects(verifySourceBindings({sourceBindings:[{path,sha256:sha('outside')}],supplementarySourceBindings:[]},join(root,'inside')));
  const source={path:'outside.sql',sha256:sha('outside')};await assert.rejects(verifySourceBindings({sourceBindings:[source],supplementarySourceBindings:[source]},root),/Duplicate source/);
 }finally{await rm(root,{recursive:true,force:true});}
});
