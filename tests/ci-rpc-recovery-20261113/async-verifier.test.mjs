import {test} from 'node:test';import assert from 'node:assert/strict';
import {runVerifier} from './async-verifier.mjs';
const node=process.execPath;
test('yields while retaining successful output and exit',async()=>{
 let heartbeat=false;const timer=setTimeout(()=>{heartbeat=true;},20);
 const result=await runVerifier(node,['-e',"setTimeout(()=>{process.stdout.write('verified');process.stderr.write('diagnostic');},100)"]);
 clearTimeout(timer);assert.equal(heartbeat,true);assert.equal(result.stdout,'verified');assert.equal(result.stderr,'diagnostic');assert.equal(result.code,0);
});
test('retains nonzero status and both diagnostic streams',async()=>{
 await assert.rejects(runVerifier(node,['-e',"process.stdout.write('out');process.stderr.write('err');process.exit(7)"]),error=>error.code===7&&error.stdout==='out'&&error.stderr==='err'&&error.message.includes('out')&&error.message.includes('err'));
});
test('refuses deadline and output-cap extensions',()=>{
 assert.throws(()=>runVerifier(node,[],{timeout:120001}));assert.throws(()=>runVerifier(node,[],{maxBuffer:4000001}));
});
test('kills the verifier process group at the unchanged caller deadline',async()=>{
 let childPid;
 const script="const {spawn}=require('node:child_process');const child=spawn(process.execPath,['-e','setInterval(()=>{},1000)'],{stdio:'ignore'});process.stdout.write(String(child.pid));setInterval(()=>{},1000)";
 await assert.rejects(runVerifier(node,['-e',script],{timeout:200}),error=>{childPid=Number(error.stdout);return error.code==='ETIMEDOUT'&&error.message.includes('deadline')&&error.signal==='SIGKILL';});
 assert(Number.isInteger(childPid)&&childPid>0);
 // A reaped or zombie descendant cannot execute; /proc is read-only process evidence.
 const {readFileSync}=await import('node:fs');let stopped=false;const deadline=Date.now()+1000;
 while(Date.now()<deadline){try{stopped=readFileSync('/proc/'+childPid+'/stat','utf8').split(') ')[1][0]==='Z';}catch(error){if(error.code==='ENOENT')stopped=true;else throw error;}if(stopped)break;await new Promise(resolve=>setTimeout(resolve,10));}
 assert.equal(stopped,true,'Owned descendant must no longer execute after deadline cancellation');
});
test('rejects output overflow and cancelled execution',async()=>{
 const stopped=new AbortController();stopped.abort();await assert.rejects(runVerifier(node,[],{signal:stopped.signal}),error=>error.code==='ABORT_ERR');
 await assert.rejects(runVerifier(node,['-e',"process.stdout.write('x'.repeat(1000));setInterval(()=>{},1000)"],{maxBuffer:10}),/bounded buffer/);
 const controller=new AbortController();const result=runVerifier(node,['-e','setInterval(()=>{},1000)'],{signal:controller.signal});setTimeout(()=>controller.abort(),50);await assert.rejects(result,/cancelled/);
});
