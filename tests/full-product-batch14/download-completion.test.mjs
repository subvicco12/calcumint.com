import assert from 'node:assert/strict';
import {test} from 'node:test';
import {mkdtemp,writeFile,rm} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {setTimeout as pause} from 'node:timers/promises';
import {downloaded} from './download-completion.mjs';

for(const initial of ['', '{"scenarios":'])test(`waits for completed download after ${initial ? 'partial' : 'empty'} destination appears`,async()=>{
 const directory=await mkdtemp(path.join(os.tmpdir(),'report-download-test-'));
 const file=path.join(directory,'report.json'),temporary=file+'.crdownload';
 const expected='{"scenarios":[{"output":42}]}';
 try{
  await writeFile(temporary,'in progress');await writeFile(file,initial);
  let settled=false;
  const download=downloaded(file).then(text=>{settled=true;return text;});
  await pause(180);
  assert.equal(settled,false,'a readable destination is not a completed Chrome download');
  await writeFile(file,expected);await rm(temporary);
  assert.equal(await download,expected);
 }finally{await rm(directory,{recursive:true,force:true});}
});

for(const initial of ['', '{"scenarios":'])test(`waits for complete JSON without a temporary marker (${JSON.stringify(initial)})`,async()=>{
 const directory=await mkdtemp(path.join(os.tmpdir(),'report-download-test-')),file=path.join(directory,'report.json');
 try{
  await writeFile(file,initial);let settled=false;
  const download=downloaded(file).then(text=>{settled=true;return text;});
  await pause(180);assert.equal(settled,false);
  const expected=' {"scenarios":[]}\n';await writeFile(file,expected);
  assert.equal(await download,expected,'raw downloaded bytes must be preserved');
 }finally{await rm(directory,{recursive:true,force:true});}
});

test('incomplete JSON expires at a bounded deadline with the parse cause',async()=>{
 const directory=await mkdtemp(path.join(os.tmpdir(),'report-download-test-')),file=path.join(directory,'report.json');
 try{
  await writeFile(file,'{');const started=Date.now();
  await assert.rejects(downloaded(file,{timeoutMs:180,pollMs:20}),error=>{
   assert.match(error.message,/No completed actual report download/);assert.ok(error.message.includes(file));
   assert.match(error.message,/180ms/);assert.match(error.message,/JSON|property name/i);return true;
  });
  assert.ok(Date.now()-started<2000,'must stop instead of polling forever');
 }finally{await rm(directory,{recursive:true,force:true});}
});

test('temporary Chrome download expires with a useful completion cause',async()=>{
 const directory=await mkdtemp(path.join(os.tmpdir(),'report-download-test-')),file=path.join(directory,'report.json');
 try{
  await writeFile(file,'{}');await writeFile(file+'.crdownload','');
  await assert.rejects(downloaded(file,{timeoutMs:100,pollMs:20}),/Chrome \.crdownload still present/);
 }finally{await rm(directory,{recursive:true,force:true});}
});
