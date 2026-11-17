import {execFileSync} from 'node:child_process';
import {performance} from 'node:perf_hooks';
import {writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {createPrivateGitTransport} from './tests/next-engineering-20261115/source-private-git-transport.mjs';
const mib=Number(process.argv[2]),cwd='/workspace/calcumint-worker3-recovery',env={...process.env};
const ballast=Buffer.alloc(mib*1024*1024,123);globalThis.ballast=ballast;
const options={cwd,env,stdio:['ignore','pipe','pipe'],maxBuffer:8*1024*1024};
const channel=createPrivateGitTransport();
const commands=[['rev-parse','--verify','HEAD^{commit}'],['status','--porcelain=v1','--untracked-files=all']];
const hash=b=>createHash('sha256').update(b).digest('hex');
const result={mib,node:process.version,options:{...options,env:'current process.env snapshot'},memory:process.memoryUsage(),cold:[],pairs:[]};
try{
 for(const args of commands){const start=performance.now();const value=channel.run(args,options);result.cold.push({args,ms:performance.now()-start,bytes:value.length,sha256:hash(value)});}
 for(let repetition=0;repetition<32;repetition++)for(const args of commands){
  const pair={repetition,args,order:repetition%2?['broker','direct']:['direct','broker']};
  for(const method of pair.order){const start=performance.now();const bytes=method==='direct'?execFileSync('git',args,options):channel.run(args,options);pair[method]={ms:performance.now()-start,length:bytes.length,sha256:hash(bytes)};}
  pair.equal=pair.direct.sha256===pair.broker.sha256;result.pairs.push(pair);
 }
 result.memoryAfter=process.memoryUsage();
}finally{channel.close();}
writeFileSync('/tmp/worker3-raw-state-benchmark/ballast-'+mib+'.json',JSON.stringify(result,null,2));
const summary={mib,rss:result.memory.rss,rssAfter:result.memoryAfter.rss,cold:result.cold,mismatches:result.pairs.filter(p=>!p.equal).length,commands:result.pairs.length,measurements:commands.map(args=>({args,...Object.fromEntries(['direct','broker'].map(method=>{const values=result.pairs.filter(p=>JSON.stringify(p.args)===JSON.stringify(args)).map(p=>p[method].ms).sort((a,b)=>a-b);return[method,{median:values[Math.floor(values.length/2)],p95:values[Math.floor(values.length*.95)],sum:values.reduce((a,b)=>a+b,0)}]}))}))};
console.log(JSON.stringify(summary,null,2));
