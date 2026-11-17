import {execFile as original} from 'node:child_process';import {appendFileSync,writeFileSync} from 'node:fs';import {basename} from 'node:path';import {emit,directory,processGroup} from './events.mjs';
let sequence=0;
export function execFile(...args){
 const callback=args.at(-1);if(typeof callback!=='function')return Reflect.apply(original,this,args);
 const id=++sequence,argv=Array.isArray(args[1])?args[1]:[],options=args.find(value=>value&&typeof value==='object'&&!Array.isArray(value))??{},label=argv.filter(value=>typeof value==='string'&&value.endsWith('.mjs')).map(value=>basename(value)).join('+'),stem=directory+'/child-'+id+'-'+(label.slice(0,90)||'unknown'),start=process.hrtime.bigint();let child;
 writeFileSync(stem+'.stdout','');writeFileSync(stem+'.stderr','');
 args[args.length-1]=function(...values){const[error]=values;emit({event:'child-complete',id,childPID:child?.pid,pgid:processGroup(),wallMS:Number(process.hrtime.bigint()-start)/1e6,error:error?{name:error.name,code:error.code,killed:error.killed,signal:error.signal,message:String(error.message).slice(0,600)}:null,stdout:stem+'.stdout',stderr:stem+'.stderr'});return Reflect.apply(callback,this,values);};
 child=Reflect.apply(original,this,args);child.stdout?.on('data',bytes=>appendFileSync(stem+'.stdout',bytes));child.stderr?.on('data',bytes=>appendFileSync(stem+'.stderr',bytes));emit({event:'child-start',id,childPID:child.pid,pgid:processGroup(),executable:args[0],argv,timeout:options.timeout,maxBuffer:options.maxBuffer,encoding:options.encoding,hasSignal:options.signal!==undefined,stdout:stem+'.stdout',stderr:stem+'.stderr'});return child;
}
