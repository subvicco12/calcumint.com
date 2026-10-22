import {readFile} from 'node:fs/promises';
import {performance} from 'node:perf_hooks';
import os from 'node:os';

// Startup only: no URLs, command arguments, environment or credentials are recorded.
export function startupDiagnostics(executable,{enabled=false}={}){
 const started=performance.now(),events=[],samples=[];
 const event=(phase,details={})=>events.push({phase,elapsedMs:Math.round(performance.now()-started),...details});
 async function sample(pid){
  const files=['/proc/pressure/cpu','/proc/pressure/io','/sys/fs/cgroup/cpu.stat','/sys/fs/cgroup/memory.events',...(pid?[`/proc/${pid}/stat`,`/proc/${pid}/wchan`]:[])];
  const reads=await Promise.all(files.map(async file=>[file,await readFile(file,{encoding:'utf8',signal:AbortSignal.timeout(100)}).catch(()=>null)]));
  samples.push({elapsedMs:Math.round(performance.now()-started),load:os.loadavg(),freeMemory:os.freemem(),files:Object.fromEntries(reads)});
  if(samples.length>24)samples.shift();
 }
 let timer;
 return {event,start(pid){event('spawn',{pid,executable});if(enabled){void sample(pid);timer=setInterval(()=>{void sample(pid)},1000);timer.unref()}},async finish(pid){clearInterval(timer);if(enabled)await sample(pid);return {events,samples}},events};
}
