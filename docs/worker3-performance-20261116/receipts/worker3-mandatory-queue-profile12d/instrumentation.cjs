const cp=require('node:child_process'),fs=require('node:fs'),path=require('node:path'),{syncBuiltinESMExports}=require('node:module');
const dir='/tmp/worker3-mandatory-queue-profile12d',nativeExecFile=cp.execFile,start=process.hrtime.bigint();fs.mkdirSync(dir,{recursive:true});
let sequence=0;const elapsed=()=>Number(process.hrtime.bigint()-start)/1e6,emit=row=>fs.appendFileSync(path.join(dir,'events.jsonl'),JSON.stringify(row)+'\n');
emit({event:'owner',pid:process.pid,pgid:Number(fs.readFileSync('/proc/self/stat','utf8').split(') ')[1].split(' ')[2]),node:process.version,timeMS:elapsed()});
cp.execFile=function(...args){
 const callback=args[args.length-1];if(typeof callback!=='function')return Reflect.apply(nativeExecFile,this,args);
 const id=++sequence,began=elapsed(),options=args.find(value=>value&&typeof value==='object'&&!Array.isArray(value))??{},argv=Array.isArray(args[1])?args[1]:[];let child;
 const label=argv.find(value=>value.endsWith('.mjs'))??'unknown',safe=path.basename(label).replace(/[^a-zA-Z0-9._-]/g,'_');
 args[args.length-1]=function(...values){
  const ended=elapsed(),[error,stdout,stderr]=values,out=path.join(dir,id+'-'+safe+'.stdout'),err=path.join(dir,id+'-'+safe+'.stderr');
  fs.writeFileSync(out,stdout??'');fs.writeFileSync(err,stderr??'');
  const tap=String(stdout??''),summary={};for(const key of ['tests','pass','fail','cancelled','skipped','duration_ms']){const match=tap.match(new RegExp('^# '+key+' ([0-9.]+)$','m'));if(match)summary[key]=Number(match[1]);}
  emit({event:'complete',id,label,pid:child?.pid,timeMS:ended,wallMS:ended-began,error:error?{name:error.name,message:error.message,code:error.code,killed:error.killed,signal:error.signal}:null,summary,stdout:out,stderr:err});
  return Reflect.apply(callback,this,values);
 };
 child=Reflect.apply(nativeExecFile,this,args);emit({event:'start',id,label,pid:child.pid,timeMS:began,executable:args[0],argv,timeout:options.timeout,maxBuffer:options.maxBuffer,encoding:options.encoding});return child;
};syncBuiltinESMExports();
