import {execFileSync} from 'node:child_process';
import {appendFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {privateGitBuffer} from '/workspace/calcumint-worker3-recovery/tests/next-engineering-20261115/source-private-git-transport.mjs';
let sequence=0;
export function observe(args,root){
 const variant=process.env.WORKER3_P0_PROBE_VARIANT==='private',id=++sequence,start=process.hrtime.bigint(),options={cwd:variant?fileURLToPath(root):root,stdio:['ignore','pipe','pipe'],maxBuffer:8*1024*1024},base={id,pid:process.pid,argv:args,options:{cwd:fileURLToPath(root),cwdType:variant?'string':'URL',stdio:options.stdio,maxBuffer:options.maxBuffer},utc:new Date().toISOString()};
 try{const result=variant?privateGitBuffer(args,options):execFileSync('git',args,options);appendFileSync(process.env.WORKER3_P0_PROBE_TRACE,JSON.stringify({...base,wallMS:Number(process.hrtime.bigint()-start)/1e6,ok:true,buffer:Buffer.isBuffer(result),bytes:result.length,sha256:createHash('sha256').update(result).digest('hex')})+'\n');return result;}
 catch(error){appendFileSync(process.env.WORKER3_P0_PROBE_TRACE,JSON.stringify({...base,wallMS:Number(process.hrtime.bigint()-start)/1e6,ok:false,error:{name:error.name,code:error.code,status:error.status,signal:error.signal,message:error.message}})+'\n');throw error;}
}
