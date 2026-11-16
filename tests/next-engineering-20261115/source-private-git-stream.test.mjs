/** One large immutable output must not enlarge the process that forks later Git commands. */
import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {Worker} from 'node:worker_threads';
import {readFileSync,mkdtempSync,rmSync} from 'node:fs';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
const wait=milliseconds=>new Promise(resolve=>setTimeout(resolve,milliseconds));
async function until(check,label){for(let tries=0;tries<1500;tries++){if(check())return;await wait(10);}assert.fail(label);}
function rss(pid){return Number(/^VmRSS:\s+(\d+)/m.exec(readFileSync('/proc/'+pid+'/status','utf8'))[1])*1024;}
test('67MiB immutable bytes stream exactly while broker RSS stays bounded before the next fresh command',async()=>{
 const root=mkdtempSync(join(tmpdir(),'calcumint-git-stream-')),shared=new SharedArrayBuffer(64+16384+2*128*1024*1024),words=new Int32Array(shared,0,16);let worker,monitor;
 try{
  const content=Buffer.alloc(67*1024*1024,0xab),sha=createHash('sha256').update(content).digest('hex'),options={cwd:root,stdio:['pipe','pipe','pipe'],maxBuffer:1024*1024};
  execFileSync('git',['init','-q'],options);const id=execFileSync('git',['hash-object','-w','--stdin'],{...options,input:content}).toString().trim();
  const workerSource=readFileSync(new URL('./source-private-git-worker.mjs',import.meta.url),'utf8'),brokerSource=readFileSync(new URL('./source-private-git-broker.py',import.meta.url),'utf8');
  worker=new Worker(new URL('data:text/javascript;base64,'+Buffer.from(workerSource).toString('base64')),{workerData:{shared,brokerSource,parentPID:process.pid},execArgv:[]});worker.on('error',()=>{});
  await until(()=>Atomics.load(words,0)===1,'stream broker did not become ready');const pid=Atomics.load(words,4),before=rss(pid);let peak=before;
  monitor=setInterval(()=>{try{peak=Math.max(peak,rss(pid));}catch{/* A premature death is checked by the response state. */}},5);
  Atomics.store(words,0,0);worker.postMessage({sequence:1,operation:'run',argv:['cat-file','blob',id],cwd:root,env:{...process.env},maxBuffer:128*1024*1024,timeout:0,killSignal:'SIGTERM'});
  await until(()=>Atomics.load(words,0)!==0,'large stream did not finish');assert.equal(Atomics.load(words,0),2);assert.equal(Atomics.load(words,2),content.length);assert.equal(createHash('sha256').update(Buffer.from(shared,64+16384,content.length)).digest('hex'),sha);
  const after=rss(pid);peak=Math.max(peak,after);assert(peak-before<32*1024*1024,'Broker retained a large output instead of streaming it');
  Atomics.store(words,0,0);worker.postMessage({sequence:2,operation:'run',argv:['rev-parse','--show-toplevel'],cwd:root,env:{...process.env},maxBuffer:1024*1024,timeout:0,killSignal:'SIGTERM'});
  await until(()=>Atomics.load(words,0)!==0,'subsequent fresh command did not finish');assert.equal(Atomics.load(words,0),2);assert.equal(Buffer.from(shared,64+16384,Atomics.load(words,2)).toString(),root+'\n');
  process.stdout.write('# transport-stream '+JSON.stringify({bytes:content.length,sha256:sha,brokerRSSBefore:before,brokerRSSAfter:after,brokerRSSPeak:peak})+'\n');
  Atomics.store(words,0,0);worker.postMessage({sequence:3,operation:'close',argv:['rev-parse','--show-toplevel'],cwd:root,env:{},maxBuffer:1,timeout:0,killSignal:'SIGTERM'});await until(()=>Atomics.load(words,0)===4,'stream broker did not shut down');
 }finally{clearInterval(monitor);if(worker)await worker.terminate();rmSync(root,{recursive:true,force:true});}
});
