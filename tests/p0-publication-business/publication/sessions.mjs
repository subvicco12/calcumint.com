import {spawn} from 'node:child_process';
import {randomUUID} from 'node:crypto';
// Persistent local psql connections; marker output is a deterministic SQL barrier.
export function session(container,label){
 const env={...process.env};for(const k of ['DOCKER_HOST','DOCKER_CONTEXT','DOCKER_TLS','DOCKER_TLS_VERIFY','DOCKER_CERT_PATH'])delete env[k];
 const child=spawn('docker',['--host=unix:///var/run/docker.sock','exec','-i',container,'psql','-h','127.0.0.1','-U','postgres','-X','-qAt','-v','ON_ERROR_STOP=1'],{env,stdio:['pipe','pipe','pipe']});
 let pending,out='',err='',closed=false;child.stdout.on('data',x=>{out+=x;if(pending&&out.includes(pending.marker)){const p=pending;pending=null;p.resolve(out);out='';}});child.stderr.on('data',x=>err+=x);child.on('error',e=>pending?.reject(e));child.on('close',()=>{closed=true;if(pending){pending.reject(Error(err||out||'Session closed'));pending=null;}});
 const query=q=>new Promise((resolve,reject)=>{if(pending||closed)return reject(Error('Session unavailable'));const marker='barrier_'+randomUUID();pending={marker,resolve,reject};child.stdin.write(q+'\n\\echo '+marker+'\n');});
 return {query,ready:()=>query(`SET application_name='${label}';SET statement_timeout='12s';`),close:()=>{child.stdin.end('ROLLBACK;\n\\q\n');}};
}
export async function blocked(db,label){
 const deadline=Date.now()+10000;for(;;){if(await db.sql(`SELECT EXISTS(SELECT FROM pg_stat_activity WHERE application_name='${label}' AND wait_event_type='Lock' AND cardinality(pg_blocking_pids(pid))>0);`)==='t')return;if(Date.now()>deadline)throw Error('Expected database lock barrier: '+label);}
}
