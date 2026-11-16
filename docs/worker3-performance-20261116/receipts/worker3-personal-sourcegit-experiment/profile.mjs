import cp from 'node:child_process';
import {syncBuiltinESMExports} from 'node:module';
import {appendFileSync} from 'node:fs';
import {performance} from 'node:perf_hooks';
const original=cp.execFileSync,output=process.env.WORKER3_PROFILE_OUTPUT;
cp.execFileSync=function(...parameters){
 if(parameters[0]!=='git')return original.apply(this,parameters);
 const start=performance.now();let ok=false;
 try{const result=original.apply(this,parameters);ok=true;return result;}
 finally{appendFileSync(output,JSON.stringify({pid:process.pid,kind:'direct',args:parameters[1],ms:performance.now()-start,ok})+'\n');}
};
syncBuiltinESMExports();
