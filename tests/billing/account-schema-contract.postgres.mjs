// Offline PostgreSQL17 reproduction. No production URL, external network or published port.
import { spawn } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { verifyAccountSchemaContract } from './account-schema-contract-postgres.mjs';
const image='postgres:17-alpine@sha256:b0f9560a2de083e2cc7382e75f808c7381a32852a7ec49117deedb300e552b24';
const name=`calcumint-account-contract-${randomUUID()}`;
const env={...process.env};
for(const key of ['DOCKER_HOST','DOCKER_CONTEXT','DOCKER_TLS','DOCKER_TLS_VERIFY','DOCKER_CERT_PATH']) delete env[key];
const command=(args,input='')=>new Promise((resolve,reject)=>{
  const child=spawn('docker',['--host=unix:///var/run/docker.sock',...args],{env,stdio:['pipe','pipe','pipe'],timeout:30000});
  let out='',err='';
  child.stdout.on('data',value=>out+=value);child.stderr.on('data',value=>err+=value);
  child.on('error',reject);child.stdin.on('error',reject);
  child.on('close',code=>code===0?resolve(out.trim()):reject(new Error(err||out||`docker exited ${code}`)));
  child.stdin.end(input);
});
const sql=text=>command(['exec','-i',name,'psql','-h','127.0.0.1','-X','-qAt','-v','ON_ERROR_STOP=1','-U','postgres'],text);
let created=false;
try {
  await command(['run','-d','--rm','--name',name,'--network','none','--tmpfs','/var/lib/postgresql/data','-e','POSTGRES_HOST_AUTH_METHOD=trust',image]);
  created=true;
  for(let attempt=0;;attempt++) {
    try{await sql('SELECT 1;');break;}catch(error){if(attempt>=100)throw error;await new Promise(resolve=>setTimeout(resolve,100));}
  }
  console.log(await sql('SELECT version();'));
  await sql('CREATE ROLE anon; CREATE ROLE authenticated;');
  await verifyAccountSchemaContract(sql);
}finally{if(created)await command(['rm','-f',name]);}
