/** Private relay: no Git invocation or mutable repository fact is cached here. */
import {parentPort,workerData} from 'node:worker_threads';
import {spawn} from 'node:child_process';
import {readFileSync,readlinkSync} from 'node:fs';
const {shared,brokerSource,parentPID}=workerData;
const words=new Int32Array(shared,0,16),all=new Uint8Array(shared);
const metaOffset=64,metaCapacity=16384,stdoutOffset=metaOffset+metaCapacity,streamCapacity=128*1024*1024,stderrOffset=stdoutOffset+streamCapacity;
const READY=1,SUCCESS=2,FAILURE=3,CLOSED=4;
let sequence=0,busy=true,ready=false,closing=false,poisoned=false,terminal=false,closeAcknowledged=false,completed,pending=Buffer.alloc(0),stdoutLength=0,stderrLength=0,currentLimit=0;
// Python bootstrap is isolated from each command's complete effective environment.
const task=/^([0-9]+)\/task\/([0-9]+)$/.exec(readlinkSync('/proc/thread-self'));
if(!task||Number(task[1])!==parentPID)throw Error('Private relay creator thread identity unavailable');
const taskStat=readFileSync('/proc/'+parentPID+'/task/'+task[2]+'/stat','utf8'),taskFields=taskStat.slice(taskStat.lastIndexOf(')')+2).trim().split(/\s+/);
if(taskFields.length<20||['Z','X','x'].includes(taskFields[0])||(BigInt(taskFields[6])&4n)!==0n)throw Error('Private relay creator thread is exiting');
const child=spawn('/usr/bin/python3',['-I','-S','-c',brokerSource,String(parentPID),task[2],taskFields[19]],{env:{PATH:'/usr/bin:/bin',LANG:'C.UTF-8'},stdio:['pipe','pipe','pipe']});
function publish(state,value){
 const bytes=Buffer.from(JSON.stringify(value));
 if(bytes.length>metaCapacity)throw Error('Private response metadata exceeds finite limit');
 all.set(bytes,metaOffset);Atomics.store(words,6,bytes.length);Atomics.store(words,2,stdoutLength);Atomics.store(words,3,stderrLength);Atomics.store(words,1,sequence);Atomics.store(words,0,state);Atomics.notify(words,0);
}
function stop(error){
 if(terminal)return;
 terminal=true;poisoned=true;busy=false;Atomics.store(words,7,1);
 try{child.kill('SIGTERM');}catch{/* Parent-death policy remains the final worker-exit fence. */}
 publish(FAILURE,{code:'EPRIVATEGIT',message:error?.message??String(error),status:null,signal:null,pid:Atomics.load(words,5)||null});
 parentPort.close();
}
function body(sequenceIn,kind,bytes){
 if(kind===0){
  if(ready||sequenceIn!==0||!busy)throw Error('Unexpected private ready frame');
  const record=JSON.parse(bytes);if(record.version!==1||!Number.isSafeInteger(record.pid)||record.pid<=0||record.pid!==child.pid)throw Error('Invalid private broker identity');
  Atomics.store(words,4,record.pid);ready=true;busy=false;publish(READY,{version:1});return;
 }
 if(!ready||!busy||sequenceIn!==sequence)throw Error('Private response sequence differs');
 if(kind===1||kind===2){
  if(closing||bytes.length>65536)throw Error('Unexpected private stream chunk');
  const offset=kind===1?stdoutLength:stderrLength;if(offset+bytes.length>currentLimit||stdoutLength+stderrLength+bytes.length>currentLimit)throw Error('Private stream exceeds requested maxBuffer');
  all.set(bytes,(kind===1?stdoutOffset:stderrOffset)+offset);if(kind===1)stdoutLength+=bytes.length;else stderrLength+=bytes.length;return;
 }
 if(kind===5){
  const record=JSON.parse(bytes);if(closing||!Number.isSafeInteger(record.pid)||record.pid<=0||Atomics.load(words,5)!==0)throw Error('Invalid private Git process identity');Atomics.store(words,5,record.pid);return;
 }
 if(kind===3){
  const record=JSON.parse(bytes),keys=Object.keys(record),pid=Atomics.load(words,5);
  if(closing||keys.some(key=>!['status','signal','pid','code','message'].includes(key))||!['status','signal','pid'].every(key=>Object.hasOwn(record,key))||!(record.status===null||Number.isInteger(record.status)&&record.status>=0&&record.status<=255)||!(record.signal===null||typeof record.signal==='string'&&/^SIG[A-Z0-9]+$/.test(record.signal))||record.code!==undefined&&!(typeof record.code==='string'&&/^E[A-Z0-9_]+$/.test(record.code))||record.message!==undefined&&typeof record.message!=='string')throw Error('Malformed private final response');
  const spawnFailure=record.pid===null&&record.status===null&&record.signal===null&&record.code!==undefined;
  if(!spawnFailure&&(!Number.isSafeInteger(record.pid)||record.pid<=0||record.pid!==pid||record.status===null&&record.signal===null||record.status!==null&&record.signal!==null))throw Error('Private final Git identity differs');
  Atomics.store(words,5,0);busy=false;
  const failed=record.code!==undefined||record.status!==0||record.signal!==null;
  if(failed)poisoned=true;
  completed={state:failed?FAILURE:SUCCESS,record};return;
 }
 if(kind===4){if(!closing||closeAcknowledged||JSON.parse(bytes).closed!==true)throw Error('Unexpected private close acknowledgement');closeAcknowledged=true;return;}
 throw Error('Unknown private response frame');
}
child.stdout.on('data',chunk=>{
 try{
  pending=Buffer.concat([pending,chunk]);
  while(pending.length>=9){const sequenceIn=pending.readUInt32BE(0),kind=pending[4],length=pending.readUInt32BE(5);if(length>(kind===1||kind===2?65536:metaCapacity))throw Error('Private frame exceeds finite limit');if(pending.length<9+length)break;const bytes=pending.subarray(9,9+length);pending=pending.subarray(9+length);body(sequenceIn,kind,bytes);}
  if(pending.length>65545)throw Error('Oversized partial private frame');
  if(completed){if(pending.length)throw Error('Trailing partial private response');const result=completed;completed=undefined;publish(result.state,result.record);}
 }catch(error){stop(error);}
});
// Bootstrap stderr is diagnostic only and is never accepted as protocol data.
let startupError='';child.stderr.on('data',bytes=>{if(startupError.length<4096)startupError+=bytes.toString('utf8').slice(0,4096-startupError.length);});
child.stdin.on('error',stop);child.stdout.on('error',stop);child.on('error',stop);
child.on('close',(status,signal)=>{
 Atomics.store(words,4,0);
 if(closing&&closeAcknowledged&&status===0&&signal===null&&!pending.length){Atomics.store(words,5,0);publish(CLOSED,{closed:true});parentPort.close();}
 else stop(Error('Private Git broker exited '+status+'/'+signal+(startupError?': '+startupError:'')));
});
parentPort.on('message',request=>{
 try{
  if(!ready||busy||closing)throw Error('Concurrent or unready private request');
  if(request.sequence!==sequence+1)throw Error('Private request sequence differs');
  if(poisoned&&request.operation!=='close')throw Error('Poisoned private Git transport');
  sequence=request.sequence;busy=true;closing=request.operation==='close';stdoutLength=0;stderrLength=0;currentLimit=request.maxBuffer;Atomics.store(words,5,0);
  const input=request.inputBytes;const metadata={...request,inputLength:input?.length??0,inputPresent:input!==undefined};delete metadata.inputBytes;
  const bytes=Buffer.from(JSON.stringify(metadata));if(bytes.length>2*1024*1024)throw Error('Private request metadata exceeds finite limit');const header=Buffer.alloc(4);header.writeUInt32BE(bytes.length);child.stdin.write(header);child.stdin.write(bytes);if(input?.length)child.stdin.write(input);
 }catch(error){stop(error);}
});
parentPort.on('close',()=>{try{child.kill('SIGTERM');}catch{/* Kernel parent-death handles abrupt relay exit. */}});
process.on('exit',()=>{try{child.kill('SIGTERM');}catch{/* Kernel parent-death handles abrupt relay exit. */}});
