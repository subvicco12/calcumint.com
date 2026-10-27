import test from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {mkdtemp,access,writeFile,rm} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {cleanupBrowser} from './next-runtime/browser-cleanup.mjs';
test('cleanup waits for its owned child and removes only its unique profile',async()=>{
 const profile=await mkdtemp(path.join(os.tmpdir(),'calcumint-cleanup-test-'));
 const child=spawn(process.execPath,['-e','setInterval(()=>{},1000)'],{stdio:'ignore'});
 await new Promise((resolve,reject)=>{child.once('spawn',resolve);child.once('error',reject);});
 await writeFile(path.join(profile,'owned'),'test');let socketClosed=false;
 try{
  await cleanupBrowser(child,{close(){socketClosed=true;}},profile);
  assert(socketClosed);assert(child.exitCode!==null||child.signalCode!==null);
  await assert.rejects(access(profile),{code:'ENOENT'});
 }finally{if(child.exitCode===null&&child.signalCode===null)child.kill('SIGKILL');await rm(profile,{recursive:true,force:true});}
});
test('cleanup also removes a profile when no child was started',async()=>{
 const profile=await mkdtemp(path.join(os.tmpdir(),'calcumint-no-browser-'));
 await cleanupBrowser(undefined,undefined,profile);await assert.rejects(access(profile),{code:'ENOENT'});
});

test('cleanup requests browser shutdown before closing its control channel or terminating its process',async()=>{
 const profile=await mkdtemp(path.join(os.tmpdir(),'calcumint-graceful-browser-'));
 const child=spawn(process.execPath,['-e',"process.send('ready');process.on('message',m=>{if(m==='Browser.close')process.exit(0)});"],{stdio:['ignore','ignore','ignore','ipc']});
 await new Promise((resolve,reject)=>{child.once('message',resolve);child.once('error',reject);});
 let requested=false,closed=false;
 const socket={readyState:1,send(message){assert(!closed);assert.equal(JSON.parse(message).method,'Browser.close');requested=true;child.send('Browser.close');},close(){closed=true;}};
 try{
  await cleanupBrowser(child,socket,profile);
  assert(requested,'Browser.close must precede forceful termination');assert(closed);
  assert.equal(child.exitCode,0);assert.equal(child.signalCode,null);
  await assert.rejects(access(profile),{code:'ENOENT'});
 }finally{if(child.exitCode===null&&child.signalCode===null)child.kill('SIGKILL');await rm(profile,{recursive:true,force:true});}
});
