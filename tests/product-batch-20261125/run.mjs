// Reusable acceptance producer; no workflow, authority, source admission or publication.
import assert from 'node:assert/strict';
import fs from 'node:fs';import path from 'node:path';
import {execFileSync,spawnSync} from 'node:child_process';import {pathToFileURL} from 'node:url';
export const batches=Object.freeze({
 calendar:{ids:[443,444,445,446,451,452,455,456,457],driver:'tests/worker1-calendar-20261119/auth-browser.mjs',outputVariable:'WORKER1_ARTIFACTS'},
 construction:{ids:[347,351,352,353,357,358,359,360,361],driver:'tests/worker3-construction-acceptance-20261118/auth-browser.mjs',outputVariable:'WORKER3_CONSTRUCTION_ARTIFACTS'},
 sports:{ids:[508,513,514,515,519,520,521,523,524],driver:'tests/worker3-everyday-sports-20261118/auth-browser.mjs',outputVariable:'WORKER3_EVERYDAY_ARTIFACTS'},
});
export function plan(name,env,identity){
 assert(Object.hasOwn(batches,name),'Unknown batch');assert.equal(identity.uid,65534);assert.equal(identity.gid,65534);assert.deepEqual(identity.groups,[65534]);
 assert.equal(env.CALCUMINT_REQUIRE_SOCKET_FREE,'true');assert(env.CALCUMINT_SERVICE_CONFIG);assert.match(env.CALCUMINT_BATCH_SOURCE_SHA??'',/^[a-f0-9]{40}$/);
 assert.equal(env.GITHUB_RUN_ATTEMPT,'1');
 for(const key of ['GITHUB_TOKEN','GH_TOKEN','BOOTSTRAP_DRIVE_TOKEN','ACTIONS_RUNTIME_TOKEN','ACTIONS_ID_TOKEN_REQUEST_TOKEN','DATABASE_URL','SUPABASE_DB_URL','PGHOST','PGUSER','PGPASSWORD'])assert(!env[key],'Forbidden credential or external selector');
 return batches[name];
}
function main(){
 const [name,directory]=process.argv.slice(2),batch=plan(name,process.env,{uid:process.getuid(),gid:process.getgid(),groups:process.getgroups()});
 for(const mode of [fs.constants.R_OK,fs.constants.W_OK]){let exposed=false;try{fs.accessSync('/var/run/docker.sock',mode);exposed=true;}catch{}assert(!exposed,'Docker socket accessible');}
 const config=fs.lstatSync(process.env.CALCUMINT_SERVICE_CONFIG);assert(config.isFile()&&!config.isSymbolicLink()&&(config.mode&0o077)===0);
 assert.equal(execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),process.env.CALCUMINT_BATCH_SOURCE_SHA);
 assert.equal(execFileSync('git',['status','--porcelain','--','src','data','tests'],{encoding:'utf8'}).trim(),'','Commit source before acceptance');
 assert(path.isAbsolute(directory));fs.mkdirSync(directory,{recursive:false});
 fs.writeFileSync(path.join(directory,'batch-invocation.json'),JSON.stringify({batch:name,ids:batch.ids,source:process.env.CALCUMINT_BATCH_SOURCE_SHA,tree:execFileSync('git',['rev-parse','HEAD^{tree}'],{encoding:'utf8'}).trim(),driver:batch.driver,socketFree:true,hostedIdentityIndependentlyVerified:false,qualificationInferred:false,releaseHold:true})+'\n');
 const result=spawnSync(process.execPath,[batch.driver],{stdio:'inherit',env:{...process.env,[batch.outputVariable]:directory}});
 process.exitCode=result.status??1;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){try{main()}catch{console.error('Batch acceptance setup refused');process.exitCode=1;}}
