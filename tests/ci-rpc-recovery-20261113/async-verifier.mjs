/** Yield the Vitest worker while preserving a bounded verifier and its descendants. */
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';

export function runVerifier(command,args,{cwd,env=process.env,timeout=120000,maxBuffer=4000000,signal}={}){
 assert(Number.isInteger(timeout)&&timeout>0&&timeout<=120000,'Verifier deadline must not exceed the retained120000ms bound');
 assert(Number.isInteger(maxBuffer)&&maxBuffer>0&&maxBuffer<=4000000,'Bounded verifier output required');
 return new Promise((resolve,reject)=>{
  if(signal?.aborted){reject(Object.assign(new Error('Verifier cancelled'),{code:'ABORT_ERR',cause:signal.reason}));return;}
  const child=spawn(command,args,{cwd,env,detached:true,stdio:['ignore','pipe','pipe']}),stdout=[],stderr=[];let size=0,failure,timer;
  const kill=()=>{if(child.pid){try{process.kill(-child.pid,'SIGKILL');}catch(error){if(error.code!=='ESRCH')failure??=error;}}};
  const fail=error=>{failure??=error;kill();};
  const abort=()=>fail(Object.assign(new Error('Verifier cancelled'),{code:'ABORT_ERR',cause:signal.reason}));
  const collect=parts=>chunk=>{size+=chunk.length;if(size>maxBuffer){fail(Object.assign(new Error('Verifier output exceeds its bounded buffer'),{code:'MAX_BUFFER'}));return;}parts.push(chunk);};
  child.stdout.on('data',collect(stdout));child.stderr.on('data',collect(stderr));
  child.once('error',error=>{failure??=error;});
  child.once('exit',()=>kill());
  child.once('close',(code,termSignal)=>{
   clearTimeout(timer);signal?.removeEventListener('abort',abort);
   const result={stdout:Buffer.concat(stdout).toString('utf8'),stderr:Buffer.concat(stderr).toString('utf8'),code,signal:termSignal};
   if(failure||code!==0){kill();const error=failure??new Error(`Verifier exited ${code??termSignal}`);Object.assign(error,{stdout:result.stdout,stderr:result.stderr,exitCode:code,signal:termSignal});if(!failure)error.code=code;error.message+=`\n${result.stdout}\n${result.stderr}`;reject(error);}else resolve(result);
  });
  timer=setTimeout(()=>fail(Object.assign(new Error(`Verifier exceeded unchanged${timeout}ms deadline`),{code:'ETIMEDOUT'})),timeout);
  signal?.addEventListener('abort',abort,{once:true});
  if(signal?.aborted)abort();
 });
}
