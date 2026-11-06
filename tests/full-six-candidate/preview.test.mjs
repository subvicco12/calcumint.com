import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,writeFile,rm} from 'node:fs/promises';
import os from 'node:os';
import {request} from 'node:http';
import path from 'node:path';
import {startSixCandidatePreview} from '../../scripts/full-six-candidate-preview.mjs';
test('private six-candidate fixture requires authentication, exact origin and read-only methods',async()=>{
 const fixture=await startSixCandidatePreview(),outside=await mkdtemp(path.join(os.tmpdir(),'candidate-outside-'));
 try{
  const headers={Authorization:fixture.authorization};
  assert.equal((await fetch(fixture.origin+'/tests/full-six-candidate/')).status,401);
  assert.equal((await fetch(fixture.origin+'/src/lib/full-six/candidate/workflow.ts')).status,401);
  assert.equal((await fetch(fixture.origin+'/tests/full-six-candidate/',{headers})).status,200);
  assert.equal((await fetch(fixture.origin+'/tests/full-six-candidate/',{headers:{...headers,Origin:'https://unrelated.invalid'}})).status,403);
  const wrongHost=await new Promise((resolve,reject)=>{const req=request(new URL('/tests/full-six-candidate/',fixture.origin),{headers:{...headers,Host:'unrelated.invalid'}},res=>{res.resume();resolve(res.statusCode);});req.on('error',reject);req.end();});assert.equal(wrongHost,403);
  assert.equal((await fetch(fixture.origin+'/tests/full-six-candidate/',{method:'POST',headers,body:'{}'})).status,405);
  const file=path.join(outside,'synthetic.txt');await writeFile(file,'NON_SECRET_TEST_MARKER');
  assert.equal((await fetch(fixture.origin+'/@fs'+file,{headers})).status,403);
 }finally{await fixture.close();await rm(outside,{recursive:true,force:true});}
});
