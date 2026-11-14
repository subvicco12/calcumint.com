import assert from 'node:assert/strict';
import {mkdirSync,rmdirSync,lstatSync,realpathSync} from 'node:fs';
import {join} from 'node:path';
import {performance} from 'node:perf_hooks';
export const sourceObjectLockName='calcumint-source-object-availability.lock';
const pause=new Int32Array(new SharedArrayBuffer(4));
/** Coordinate source-object fetches only; never remove Git's own lock files. */
export function withSourceObjectLock(commonGitDirectory,work,{timeoutMs=60000}={}){
 assert(Number.isFinite(timeoutMs)&&timeoutMs>=0&&timeoutMs<=60000,'Source-object wait must be bounded to at most60000ms');
 const directory=realpathSync(commonGitDirectory),lock=join(directory,sourceObjectLockName),deadline=performance.now()+timeoutMs;
 for(;;){
  try{mkdirSync(lock,{mode:0o700});break;}
  catch(error){if(error.code!=='EEXIST')throw error;const left=deadline-performance.now();if(left<=0)throw Error('Timed out waiting for source-object preparation lock');Atomics.wait(pause,0,0,Math.min(25,left));}
 }
 const owner=lstatSync(lock);let result,failure,failed=false;
 try{result=work();assert(!result||typeof result.then!=='function','Source-object preparation must be synchronous');}catch(error){failure=error;failed=true;}
 try{
  const current=lstatSync(lock);assert(current.isDirectory()&&!current.isSymbolicLink()&&current.dev===owner.dev&&current.ino===owner.ino,'Source-object lock ownership changed');
  rmdirSync(lock); // Empty directory owned by this call only; no recursive removal.
 }catch(error){if(failed)throw new AggregateError([failure,error],'Source preparation and owned lock release both failed');throw error;}
 if(failed)throw failure;return result;
}
