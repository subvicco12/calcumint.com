import {ensureOwnedSourceScope,reapOwnedSourceLocks,registerOwnedSourceLock,forgetOwnedSourceLock} from './source-lock-scope.mjs';
import assert from 'node:assert/strict';
import {mkdirSync,rmdirSync,lstatSync,realpathSync} from 'node:fs';
import {join} from 'node:path';
import {performance} from 'node:perf_hooks';
export const sourceObjectLockName='calcumint-source-object-availability.lock';
const pause=new Int32Array(new SharedArrayBuffer(4));
/** Coordinate source-object fetches only; never remove Git's own lock files. */
export function withSourceObjectLock(commonGitDirectory,work,{timeoutMs=60000}={}){
 assert(Number.isFinite(timeoutMs)&&timeoutMs>=0&&timeoutMs<=60000,'Source-object wait must be bounded to at most60000ms');
 const scope=['ROOT','UUID','OWNER_PID','OWNER_START'].some(key=>process.env['CALCUMINT_SOURCE_LOCK_SCOPE_'+key]!==undefined)?ensureOwnedSourceScope(process.env):undefined;
 const directory=realpathSync(commonGitDirectory),lock=join(directory,sourceObjectLockName),deadline=performance.now()+timeoutMs;
 for(;;){
  try{mkdirSync(lock,{mode:0o700});break;}
  catch(error){if(error.code!=='EEXIST')throw error;if(scope&&reapOwnedSourceLocks(scope).removed.includes(lock))continue;const left=deadline-performance.now();if(left<=0)throw Error('Timed out waiting for source-object preparation lock');Atomics.wait(pause,0,0,Math.min(25,left));}
 }
 const owner=lstatSync(lock);let result,failure,failed=false,lease;
 try{if(scope)lease=registerOwnedSourceLock(scope,lock,lstatSync(lock,{bigint:true}));result=work();assert(!result||typeof result.then!=='function','Source-object preparation must be synchronous');}catch(error){failure=error;failed=true;}
 try{
  const current=lstatSync(lock);assert(current.isDirectory()&&!current.isSymbolicLink()&&current.dev===owner.dev&&current.ino===owner.ino,'Source-object lock ownership changed');
  rmdirSync(lock);if(lease)forgetOwnedSourceLock(scope,lease); // Empty directory owned by this call only; no recursive removal.
 }catch(error){if(failed)throw new AggregateError([failure,error],'Source preparation and owned lock release both failed');throw error;}
 if(failed)throw failure;return result;
}
