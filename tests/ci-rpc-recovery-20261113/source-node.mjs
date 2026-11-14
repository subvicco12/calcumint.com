/** Own each source verifier's descendants without changing its caller's deadline. */
import {spawn} from 'node:child_process';
export function runSourceNode(args,{stdio,timeout=0,maxBuffer=1024*1024,signal,encoding='utf8',cwd,env=process.env}={}){
 return new Promise((resolve,reject)=>{
  if(!Number.isInteger(timeout)||timeout<0){reject(Object.assign(new RangeError('Source verifier timeout must be a nonnegative integer'),{code:'ERR_OUT_OF_RANGE'}));return;}
  if(!Buffer.isEncoding(encoding)){reject(Object.assign(new TypeError('Unknown source verifier encoding'),{code:'ERR_UNKNOWN_ENCODING'}));return;}
  if(typeof maxBuffer!=='number'||Number.isNaN(maxBuffer)||maxBuffer<0){reject(Object.assign(new RangeError('Source verifier maxBuffer must be nonnegative'),{code:'ERR_OUT_OF_RANGE'}));return;}
  if(signal?.aborted){reject(Object.assign(new Error('Source verifier cancelled'),{code:'ABORT_ERR',cause:signal.reason,stdout:'',stderr:''}));return;}
  const child=spawn(process.execPath,args,{cwd,env,detached:true,stdio:['ignore','pipe','pipe']}),out=[],err=[];
  let failure,timer,outSize=0,errSize=0;
  const kill=()=>{if(child.pid)try{process.kill(-child.pid,'SIGKILL');}catch(error){if(error.code!=='ESRCH')failure??=error;}};
  const fail=error=>{failure??=error;kill();};
  const abort=()=>fail(Object.assign(new Error('Source verifier cancelled'),{code:'ABORT_ERR',cause:signal.reason}));
  const collect=(parts,isOut)=>chunk=>{
   if(isOut)outSize+=chunk.length;else errSize+=chunk.length;
   if(stdio!=='inherit'&&(isOut?outSize:errSize)>maxBuffer){fail(Object.assign(new Error('Source verifier output exceeds maxBuffer'),{code:'ERR_CHILD_PROCESS_STDIO_MAXBUFFER'}));return;}
   parts.push(chunk);
  };
  child.stdout.on('data',collect(out,true));child.stderr.on('data',collect(err,false));
  if(stdio==='inherit'){child.stdout.pipe(process.stdout);child.stderr.pipe(process.stderr);}
  child.once('error',error=>fail(error));
  // A normally exiting parent can leave descendants holding its inherited pipes open.
  child.once('exit',kill);
  child.once('close',(code,termSignal)=>{
   clearTimeout(timer);signal?.removeEventListener('abort',abort);
   const stdout=Buffer.concat(out).toString(encoding),stderr=Buffer.concat(err).toString(encoding);
   if(failure||code!==0){kill();reject(Object.assign(failure??new Error(`Source verifier exited ${code??termSignal}\n${stdout}\n${stderr}`),{stdout,stderr,...(!failure?{code}:{}),signal:termSignal,killed:!!termSignal}));}else resolve(stdout);
  });
  if(timeout>0)timer=setTimeout(()=>fail(Object.assign(new Error(`Source verifier exceeded unchanged ${timeout}ms deadline`),{code:'ETIMEDOUT'})),timeout);
  signal?.addEventListener('abort',abort,{once:true});if(signal?.aborted)abort();
 });
}
