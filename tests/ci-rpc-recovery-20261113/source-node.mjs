/** Own each source verifier's descendants without changing its caller's deadline. */
import {spawn} from 'node:child_process';
import {readdirSync,readFileSync} from 'node:fs';
import {ensureOwnedSourceScope,reapOwnedSourceLocks} from '../parallel-source-20261110/source-lock-scope.mjs';
const scopeKeys=['CALCUMINT_SOURCE_LOCK_SCOPE_ROOT','CALCUMINT_SOURCE_LOCK_SCOPE_UUID','CALCUMINT_SOURCE_LOCK_SCOPE_OWNER_PID','CALCUMINT_SOURCE_LOCK_SCOPE_OWNER_START'];
async function waitOwnedGroupStopped(pid){
 if(!pid)return;
 for(let attempt=0;attempt<200;attempt++){let live=false;for(const entry of readdirSync('/proc')){if(!/^\d+$/.test(entry))continue;try{const text=readFileSync('/proc/'+entry+'/stat','utf8'),fields=text.slice(text.lastIndexOf(') ')+2).split(' ');if(Number(fields[2])===pid&&fields[0]!=='Z'&&fields[0]!=='X'){live=true;break;}}catch(error){if(error.code!=='ENOENT'&&error.code!=='ESRCH')throw error;}}if(!live)return;await new Promise(resolve=>setTimeout(resolve,5));}
 throw Error('Owned source verifier process group still executes; locks preserved');
}
export function runSourceNode(args,{stdio,timeout=0,maxBuffer=1024*1024,signal,encoding='utf8',cwd,env=process.env}={}){
 return new Promise((resolve,reject)=>{
  if(!Number.isInteger(timeout)||timeout<0){reject(Object.assign(new RangeError('Source verifier timeout must be a nonnegative integer'),{code:'ERR_OUT_OF_RANGE'}));return;}
  if(!Buffer.isEncoding(encoding)){reject(Object.assign(new TypeError('Unknown source verifier encoding'),{code:'ERR_UNKNOWN_ENCODING'}));return;}
  if(typeof maxBuffer!=='number'||Number.isNaN(maxBuffer)||maxBuffer<0){reject(Object.assign(new RangeError('Source verifier maxBuffer must be nonnegative'),{code:'ERR_OUT_OF_RANGE'}));return;}
  if(signal?.aborted){reject(Object.assign(new Error('Source verifier cancelled'),{code:'ABORT_ERR',cause:signal.reason,stdout:'',stderr:''}));return;}
  const scope=ensureOwnedSourceScope(process.env),childEnv={...env};for(const key of scopeKeys)childEnv[key]=scope.env[key];
  let child;try{child=spawn(process.execPath,args,{cwd,env:childEnv,detached:true,stdio:['ignore','pipe','pipe']});}catch(error){if(scope.owned)scope.cleanup();reject(error);return;}const out=[],err=[];
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
  child.once('close',async(code,termSignal)=>{
   clearTimeout(timer);signal?.removeEventListener('abort',abort);
   let cleanupReport,cleanupError;try{kill();await waitOwnedGroupStopped(child.pid);cleanupReport=scope.owned?scope.cleanup():reapOwnedSourceLocks(scope);}catch(error){cleanupError=error;if(!failure&&code===0)failure=error;}
   const stdout=Buffer.concat(out).toString(encoding),stderr=Buffer.concat(err).toString(encoding);
   if(cleanupReport?.preserved?.length)process.stderr.write('Source-owned lock cleanup preserved '+JSON.stringify(cleanupReport.preserved)+'\n');
   if(failure||code!==0){kill();reject(Object.assign(failure??new Error(`Source verifier exited ${code??termSignal}\n${stdout}\n${stderr}`),{stdout,stderr,...(!failure?{code}:{}),signal:termSignal,killed:!!termSignal,...(cleanupReport?{sourceLockCleanup:cleanupReport}:{}),...(cleanupError?{sourceLockCleanupError:cleanupError}:{})}));}else resolve(stdout);
  });
  if(timeout>0)timer=setTimeout(()=>fail(Object.assign(new Error(`Source verifier exceeded unchanged ${timeout}ms deadline`),{code:'ETIMEDOUT'})),timeout);
  signal?.addEventListener('abort',abort,{once:true});if(signal?.aborted)abort();
 });
}
