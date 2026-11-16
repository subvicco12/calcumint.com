import cp from 'node:child_process';
import {syncBuiltinESMExports} from 'node:module';
import {appendFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {performance} from 'node:perf_hooks';
const native=cp.execFileSync;
cp.execFileSync=function(...parameters){
 if(parameters[0]!=='git')return native.apply(this,parameters);
 const start=performance.now();let ok=false;
 try{const value=native.apply(this,parameters);ok=true;return value;}
 finally{const options=parameters[2]??{};appendFileSync(process.env.WORKER3_PROFILE_OUTPUT,JSON.stringify({args:parameters[1],ms:performance.now()-start,ok,...(options.input?{inputSHA256:createHash('sha256').update(options.input).digest('hex'),inputBytes:options.input.length}:{})})+'\n');}
};syncBuiltinESMExports();
