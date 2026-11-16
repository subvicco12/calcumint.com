/** Private Linux Buffer transport. Every supported invocation executes a fresh Git process. */
import {execFileSync} from 'node:child_process';
import {Worker} from 'node:worker_threads';
import {readFileSync,lstatSync,realpathSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {isAbsolute} from 'node:path';
import {types} from 'node:util';
import {privateGitImages} from './source-private-git-images.mjs';
import {isImmutableTreeQuery} from '../milestone100-20261114/source-immutable-queries.mjs';
const MAX_OUTPUT=128*1024*1024,META=16384,STDOUT=64+META,STDERR=STDOUT+MAX_OUTPUT;
const WAIT=0,READY=1,SUCCESS=2,CLOSED=4;
const config=new Set(['diff.renames=false','diff.orderFile=/dev/null','diff.ignoreSubmodules=none','core.quotePath=true','core.fsmonitor=false','core.ignorestat=false','core.untrackedCache=false','protocol.file.allow=never','protocol.ext.allow=never']);
const oid=/^[a-f0-9]{40}$/;
function ownData(value){
 if(!value||typeof value!=='object'||types.isProxy(value)||![Object.prototype,null].includes(Object.getPrototypeOf(value)))return undefined;
 const descriptors=Object.getOwnPropertyDescriptors(value);for(const key in value)if(!Object.hasOwn(descriptors,key))return undefined;if(Reflect.ownKeys(descriptors).some(key=>typeof key!=='string'||!Object.hasOwn(descriptors[key],'value')))return undefined;
 return Object.fromEntries(Object.entries(descriptors).map(([key,descriptor])=>[key,descriptor.value]));
}
function literalArgs(args){
 if(types.isProxy(args)||!Array.isArray(args)||Object.getPrototypeOf(args)!==Array.prototype)return undefined;
 const descriptors=Object.getOwnPropertyDescriptors(args),length=descriptors.length?.value;if(!Number.isSafeInteger(length)||length<1||length>8192)return undefined;
 const result=[];for(let index=0;index<length;index++){const field=descriptors[index];if(!field||!Object.hasOwn(field,'value')||typeof field.value!=='string'||field.value.includes('\0')||!field.value.isWellFormed())return undefined;result.push(field.value);}return result;
}
function supported(args){
 let offset=0;while(args[offset]==='-c'){if(!config.has(args[offset+1]))return false;offset+=2;}
 const query=args.slice(offset),[command,...tail]=query;
 if(command==='rev-parse')return tail.length===1&&['--show-toplevel','--git-common-dir'].includes(tail[0])||tail.length===2&&tail[0]==='--verify'&&/^(?:HEAD|[a-f0-9]{40})\^\{commit\}$/.test(tail[1])||tail.length===1&&/^(?:HEAD|[a-f0-9]{40}):[^\0\r\n]+$/.test(tail[0])||tail[0]==='--revs-only'&&tail[1]==='--end-of-options'&&tail.length>2&&tail.slice(2).every(value=>/^[a-f0-9]{40}:[^\0\r\n]+$/.test(value));
 if(command==='cat-file')return tail.length===1&&tail[0]==='--batch'||tail.length===2&&['blob','commit'].includes(tail[0])&&oid.test(tail[1]);
 if(command==='status')return JSON.stringify(tail)===JSON.stringify(['--porcelain','--untracked-files=all','--','src'])||JSON.stringify(tail)===JSON.stringify(['--porcelain=v2','--branch','--ignored=matching','--untracked-files=all','--','src']);
 if(command==='ls-files')return JSON.stringify(tail)===JSON.stringify(['-v','-z','--','src']);
 if(command==='diff')return isImmutableTreeQuery(query.filter(value=>!['--no-relative','--no-ext-diff','--no-textconv'].includes(value)));
 return command==='ls-tree'&&isImmutableTreeQuery(query);
}
function requestFor(args,options){
 const argv=literalArgs(args),plain=ownData(options);if(!argv||!plain||!supported(argv)||process.platform!=='linux')return undefined;
 if(Object.keys(plain).some(key=>!['cwd','env','stdio','maxBuffer','input','timeout','killSignal'].includes(key)))return undefined;
 const stdio=literalArgs(plain.stdio);if(!stdio||stdio.length!==3||!['ignore','pipe'].includes(stdio[0])||stdio[1]!=='pipe'||stdio[2]!=='pipe')return undefined;
 if(typeof plain.cwd!=='string'||!plain.cwd.isWellFormed()||!isAbsolute(plain.cwd))return undefined;
 const suppliedEnv=plain.env===undefined?{...process.env}:ownData(plain.env);if(!suppliedEnv||Object.entries(suppliedEnv).some(([key,value])=>key.includes('=')||key.includes('\0')||typeof value!=='string'||value.includes('\0')||!key.isWellFormed()||!value.isWellFormed()))return undefined;
 if(!Object.hasOwn(suppliedEnv,'PATH'))return undefined;
 const maxBuffer=plain.maxBuffer??1024*1024,timeout=plain.timeout??0,killSignal=plain.killSignal??'SIGTERM';
 // Positive timeout behavior remains exactly the existing execFileSync path.
 if(timeout!==0)return undefined;
 if(!Number.isSafeInteger(maxBuffer)||maxBuffer<1||maxBuffer>MAX_OUTPUT||!Number.isSafeInteger(timeout)||timeout<0||timeout>2147483647||killSignal!=='SIGTERM')return undefined;
 if(plain.input!==undefined&&(!Buffer.isBuffer(plain.input)||plain.input.length>1024*1024||stdio[0]!=='pipe'))return undefined;
 const result={argv,cwd:plain.cwd,env:{...suppliedEnv},maxBuffer,timeout,killSignal};if(plain.input!==undefined)result.inputBytes=Buffer.from(plain.input);return result;
}
function verifiedImage(record){
 const path=fileURLToPath(new URL(record.path,import.meta.url)),stat=lstatSync(path);if(!stat.isFile()||stat.isSymbolicLink()||realpathSync(path)!==path)throw Error('Redirected private Git image: '+record.path);
 const bytes=readFileSync(path);if(createHash('sha256').update(bytes).digest('hex')!==record.sha256)throw Error('Independent private Git image differs: '+record.path);return bytes.toString('utf8');
}
const channels=new Set();
export function createPrivateGitTransport(...extra){
 if(extra.length)throw Error('Custom private Git transport inputs are forbidden');
 let worker,shared,words,all,sequence=0,closed=false,poisoned=false;
 function metadata(){const length=Atomics.load(words,6);if(length<0||length>META)throw Error('Invalid private response metadata length');return JSON.parse(Buffer.from(all.subarray(64,64+length)));}
 function awaitResult(milliseconds){
  const wait=Atomics.wait(words,0,WAIT,milliseconds);if(wait==='timed-out'){Atomics.store(words,7,1);worker.terminate();const error=Error('Private Git relay watchdog expired');error.code='ETIMEDOUT';throw error;}return Atomics.load(words,0);
 }
 function start(){
  // Execute exactly the verified loaded images; no script pathname is re-opened.
  const workerSource=verifiedImage(privateGitImages.worker),brokerSource=verifiedImage(privateGitImages.broker);
  shared=new SharedArrayBuffer(STDERR+MAX_OUTPUT);words=new Int32Array(shared,0,16);all=new Uint8Array(shared);
  worker=new Worker(new URL('data:text/javascript;base64,'+Buffer.from(workerSource).toString('base64')),{workerData:{shared,brokerSource,parentPID:process.pid},execArgv:[]});worker.unref();
  // Worker errors cannot be allowed to become uncaught owner-process exceptions.
  worker.on('error',()=>{});
  if(awaitResult(15000)!==READY)throw Object.assign(Error('Private Git startup failed: '+metadata().message),{code:'EPRIVATEGIT'});
 }
 function dispatch(request,operation='run'){
  sequence++;Atomics.store(words,0,WAIT);worker.postMessage({...request,sequence,operation});const state=awaitResult(operation==='close'?3000:request.timeout?request.timeout+5000:180000);if(Atomics.load(words,1)!==sequence)throw Error('Private Git response sequence differs');return state;
 }
 function close(){
  if(closed)return;closed=true;channels.delete(channel);
  if(!worker)return;
  try{
   if(Atomics.load(words,7)!==0){worker.terminate();return;}
   const state=dispatch({argv:['rev-parse','--show-toplevel'],cwd:process.cwd(),env:{},maxBuffer:1,timeout:0,killSignal:'SIGTERM'},'close');if(state!==CLOSED)throw Error('Private Git shutdown failed');
  }finally{worker.terminate();}
 }
 const channel=Object.freeze({
  run(args,options={}){
   if(closed||poisoned)throw Error('Private Git transport is closed or poisoned');
   const request=requestFor(args,options);if(!request)return execFileSync('git',args,options);
   try{
    if(!worker)start();const state=dispatch(request),record=metadata(),stdout=Buffer.from(all.subarray(STDOUT,STDOUT+Atomics.load(words,2))),stderr=Buffer.from(all.subarray(STDERR,STDERR+Atomics.load(words,3)));
    if(state!==SUCCESS){const error=Error(record.message??('Command failed: git '+request.argv.join(' ')+'\n'+stderr));Object.assign(error,{code:record.code,status:record.status,signal:record.signal,pid:record.pid,stdout,stderr,output:[null,stdout,stderr]});throw error;}
    return stdout;
   }catch(error){poisoned=true;try{close();}catch{/* Preserve the original failure; kernel parent-death fences relay teardown. */}throw error;}
  },close,
 });channels.add(channel);return channel;
}
process.once('exit',()=>{for(const channel of channels){try{channel.close();}catch{/* Exit cannot grant a source verdict. */}}});
let defaultChannel;
/** Called only by existing private native adapters. Unsupported requests stay direct before dispatch. */
export function privateGitBuffer(args,options){
 const channel=defaultChannel??=createPrivateGitTransport();
 try{return channel.run(args,options);}catch(error){try{channel.close();}catch{/* Preserve the failed command's original diagnostic. */}defaultChannel=undefined;throw error;}
}
