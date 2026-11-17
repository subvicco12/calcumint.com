import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {types,isDeepStrictEqual} from 'node:util';

const preloadNames=Object.freeze(['preloadBlobs','preloadCommits','preloadPaths']);
const readonlyGit=new Set(['rev-parse','cat-file','ls-tree','show','status','diff','merge-base','rev-list','log','for-each-ref','check-ref-format']);
function gitDisposition(args){
 assert(Array.isArray(args)&&args.length&&args.every(value=>typeof value==='string'),'Unsupported Git command operands');
 let index=0;while(args[index]==='-c'){assert(['protocol.file.allow=never','protocol.ext.allow=never','credential.interactive=never'].includes(args[index+1]),'Unsupported Git command configuration');index+=2;}
 const command=args[index],rest=args.slice(index+1);
 assert(command!=='fetch','Fetch is forbidden inside authority observation constructor');
 assert(readonlyGit.has(command)||command==='remote'&&rest[0]==='get-url','Unexpected Git mutation or non-read-only command');
 assert(!rest.some(value=>value==='--output'||value.startsWith('--output=')||value==='--exec'||value.startsWith('--exec=')),'Unexpected Git mutation output operand');
 return 'observation';
}
// Data snapshots never invoke getters, preserve arity/type, and retain no aliases.
function snapshot(value,ancestors=new Set()){
 if(value===undefined)return ['undefined'];if(value===null)return ['null'];
 if(typeof value==='string'||typeof value==='boolean')return [typeof value,value];
 if(typeof value==='number'){assert(Number.isFinite(value),'Unsupported non-finite operand');return ['number',Object.is(value,-0)?'-0':String(value)];}
 if(Buffer.isBuffer(value))return ['buffer',Buffer.from(value)];
 assert(value&&typeof value==='object'&&!types.isProxy(value),'Unsupported observation operand/result or proxy');assert(!ancestors.has(value),'Unsupported cyclic operand');const next=new Set(ancestors).add(value);
 if(Array.isArray(value)){assert(Object.getPrototypeOf(value)===Array.prototype,'Unsupported array prototype');assert(Reflect.ownKeys(value).length===value.length+1,'Unsupported sparse or extended array');const fields=[];for(let index=0;index<value.length;index++){const d=Object.getOwnPropertyDescriptor(value,String(index));assert(d&&Object.hasOwn(d,'value'),'Unsupported accessor array operand');fields.push([String(index),d.enumerable,d.writable,d.configurable,snapshot(d.value,next)]);}return ['array',fields,value.length,Object.getOwnPropertyDescriptor(value,'length').writable,Object.isExtensible(value)];}
 const proto=Object.getPrototypeOf(value);assert(proto===Object.prototype||proto===null,'Unsupported observation object');const fields=[];
 for(const key of Reflect.ownKeys(value)){assert.equal(typeof key,'string','Unsupported symbol operand');const descriptor=Object.getOwnPropertyDescriptor(value,key);assert(descriptor&&Object.hasOwn(descriptor,'value'),'Unsupported accessor operand');fields.push([key,descriptor.enumerable,descriptor.writable,descriptor.configurable,snapshot(descriptor.value,next)]);}
 return [proto===null?'null-object':'object',fields,Object.isExtensible(value)];
}
function materialize(value){
 const [type,data]=value;if(type==='undefined')return undefined;if(type==='null')return null;if(type==='string'||type==='boolean')return data;if(type==='number')return data==='-0'?-0:Number(data);if(type==='buffer')return Buffer.from(data);
 const out=type==='array'?[]:Object.create(type==='null-object'?null:Object.prototype);
 for(const[key,enumerable,writable,configurable,child]of data)Object.defineProperty(out,key,{value:materialize(child),enumerable,writable,configurable});
 if(type==='array')Object.defineProperty(out,'length',{value:value[2],writable:value[3]});if(!(type==='array'?value[4]:value[2]))Object.preventExtensions(out);return out;
}
function dataKey(value){if(Buffer.isBuffer(value))return ['bytes',value.length,createHash('sha256').update(value).digest('hex')];if(Array.isArray(value))return value.map(dataKey);return value;}
function equalData(actual,expected,message){if(!isDeepStrictEqual(actual,expected))throw Error(message);}

/** Records observations only. The caller must separately run unchanged authority. */
export function createAuthorityObservationCollector(){
 let phase='observing',poison,replayDepth=0;const replaying=new Set();const receivers=new WeakMap(),facts=[],index=new Map(),gitEndpoints=[],paths=new Set(),identities=new Map();let nextIdentity=0;
 const negativeZeroReceiver=Symbol('private negative-zero receiver');
 const identity=value=>{const key=typeof value==='number'&&Object.is(value,-0)?negativeZeroReceiver:value;if(!identities.has(key))identities.set(key,++nextIdentity);return identities.get(key);};
 const fail=error=>{poison??=error;throw error;};
 const healthy=()=>{if(poison)throw poison;};
 const observing=()=>{healthy();if(phase!=='observing')fail(Error('Observation constructor is sealed/closed'));};
 const callable=()=>{healthy();if(phase!=='observing'&&!(phase==='replaying'&&replayDepth>0))fail(Error('Observation callback is sealed/closed'));};
 const receiver=value=>value!==null&&(typeof value==='object'||typeof value==='function')&&receivers.has(value)?receivers.get(value):value;
 const output=value=>{assert(value===undefined||typeof value==='string'||Buffer.isBuffer(value),'Unsupported read/Git result');return snapshot(value);};
 function record(fn,thisArg,role,args,kind,invoke){
  callable();let operands;
  try{operands=snapshot(args);}catch(error){return fail(error);}
  const key=JSON.stringify([identity(fn),identity(thisArg),role,dataKey(operands)]);if(phase==='replaying'){const fact=index.get(key);if(!fact||fact.kind!==kind)return fail(Error('Unknown sealed nested authority observation'));return execute(fact,args,invoke);}
  let value;
  try{value=invoke();}catch(error){return fail(error);}
  try{
   const after=snapshot(args);const expected=kind==='preload'?undefined:output(value);const prior=index.get(key);
   if(prior){equalData(after,prior.after,'Inconsistent repeated authority observation operand effects');if(kind!=='preload')equalData(expected,prior.expected,'Inconsistent repeated authority observation result');}
   if(!prior){const fact={key,fn,thisArg,role,operands,after,kind,expected};facts.push(fact);index.set(key,fact);}
   return kind==='preload'?value:materialize(expected);
  }catch(error){return fail(error);}
 }
 function execute(fact,args,invoke){
  healthy();if(replaying.has(fact.key))return fail(Error('Recursive authority observation replay cycle'));replaying.add(fact.key);replayDepth++;
  try{const value=invoke();healthy();equalData(snapshot(args),fact.after,'Replayed observation operand effects differ');if(fact.kind==='preload')return value;const observed=output(value);equalData(observed,fact.expected,'Replayed authority observation bytes/results differ');return materialize(observed);}
  catch(error){return fail(error);}finally{replayDepth--;replaying.delete(fact.key);}
 }
 function bindReceiver(facade,original){observing();try{assert(facade!==null&&(typeof facade==='object'||typeof facade==='function'),'Facade receiver object required');if(receivers.has(facade))assert(receivers.get(facade)===original,'Contradictory receiver binding');else receivers.set(facade,original);}catch(error){fail(error);}}
 function wrapRead(fn,role){observing();try{assert.equal(typeof fn,'function');assert.equal(typeof role,'string');assert(role.length>0);}catch(error){return fail(error);}
  return function(...args){callable();if(phase==='observing'&&typeof args[0]==='string')paths.add(args[0]);const bound=receiver(this);return record(fn,bound,'read:'+role,args,'read',()=>Reflect.apply(fn,bound,args));};
 }
 function checkCapabilities(endpoint){for(const name of preloadNames){const current=endpoint.fn[name];assert.equal(typeof current==='function',endpoint.methods.has(name),'Original Git preload capability presence changed');if(endpoint.methods.has(name))assert(current===endpoint.methods.get(name),'Original Git preload method identity changed');}}
 function wrapGit(fn,role){observing();try{assert.equal(typeof fn,'function');assert.equal(typeof role,'string');assert(role.length>0);}catch(error){return fail(error);}
  const endpoint={fn,methods:new Map()};try{for(const name of preloadNames){const method=fn[name];if(typeof method==='function')endpoint.methods.set(name,method);}gitEndpoints.push(endpoint);}catch(error){return fail(error);}
  function wrapped(...args){callable();const bound=receiver(this);let disposition;try{disposition=gitDisposition(args[0]);snapshot(args);}catch(error){return fail(error);}
   return record(fn,bound,'git:'+role,args,'git',()=>Reflect.apply(fn,bound,args));
  }
  for(const[name,method]of endpoint.methods)Object.defineProperty(wrapped,name,{value:function(...args){callable();try{checkCapabilities(endpoint);}catch(error){return fail(error);}return record(method,fn,'preload:'+role+':'+name,args,'preload',()=>Reflect.apply(method,fn,args));},enumerable:true});
  return wrapped;
 }
 function seal(){observing();try{for(const endpoint of gitEndpoints)checkCapabilities(endpoint);phase='sealed';}catch(error){fail(error);}}
 function replay(){healthy();if(phase!=='sealed')return fail(Error('Observation replay requires sealed constructor'));phase='replaying';
  try{
   for(const endpoint of gitEndpoints)checkCapabilities(endpoint);
   // Fresh closures for this replay; no authority verdict or mutable-byte cache.
   for(const fact of facts){const args=materialize(fact.operands),invoke=function(){return Reflect.apply(fact.fn,fact.thisArg,args);};execute(fact,args,invoke);}healthy();
  }catch(error){fail(error);}finally{phase='sealed';}
 }
 return Object.freeze({wrapRead,wrapGit,bindReceiver,seal,replay,readPaths:()=>[...paths],assertHealthy:healthy});
}
