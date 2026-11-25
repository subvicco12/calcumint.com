// Fixed source enumeration; no fallback, source mutation, provider calls or Docker API.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
const output=path.join(process.env.WORKER2_MOBILITY_BROWSER_ARTIFACTS,'ripgrep-isolation.json');
try {
 assert.equal(process.getuid(),65534);assert.equal(process.getgid(),65534);assert.deepEqual(process.getgroups(),[65534]);
 const status=fs.readFileSync('/proc/self/status','utf8');
 assert.match(status,/^NoNewPrivs:\s+1$/m);assert.match(status,/^CapEff:\s+0+$/m);
 const readable=p=>{try{fs.accessSync(p,fs.constants.R_OK);return true;}catch{return false;}};
 const writable=p=>{try{fs.accessSync(p,fs.constants.W_OK);return true;}catch{return false;}};
 assert(!readable('/var/run/docker.sock')&&!writable('/var/run/docker.sock'));
 for(const key of ['GITHUB_TOKEN','GH_TOKEN','BOOTSTRAP_DRIVE_TOKEN','ACTIONS_RUNTIME_TOKEN','ACTIONS_ID_TOKEN_REQUEST_TOKEN'])assert(!process.env[key]);
 const root=process.env.APP_SOURCE,tools=path.resolve(root,'..','tools'),binary=path.join(tools,'rg');
 const resolved=execFileSync('/bin/sh',['-c','command -v rg'],{encoding:'utf8'}).trim();assert.equal(resolved,binary);
 assert(!writable(tools)&&!writable(binary));
 const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
 assert.equal(sha(fs.readFileSync(binary)),'f401154e2393f9002ac77e419f9ee5521c18f4f8cd3e32293972f493ba06fce7');
 const version=execFileSync('rg',['--version'],{encoding:'utf8'}).split('\n')[0];assert.equal(version,'ripgrep 14.1.1 (rev 4649aa9700)');
 const files=execFileSync('rg',['--files','src','data'],{cwd:root,encoding:'utf8',maxBuffer:16*1024*1024}).trim().split('\n');
 assert(files.length>0&&new Set(files).size===files.length);
 const entries=[...files,'next.config.ts'].sort().map(name=>[name,sha(fs.readFileSync(path.join(root,name)))]);
 fs.writeFileSync(output,JSON.stringify({passed:true,uid:process.getuid(),gid:process.getgid(),groups:process.getgroups(),noNewPrivs:true,effectiveCapabilitiesZero:true,dockerSocketAccessible:false,providerCredentialsPresent:false,ripgrep:{path:resolved,version,sha256:sha(fs.readFileSync(binary)),directoryWritable:false,binaryWritable:false},sourceFileCount:files.length,sourceManifestSha256:sha(Buffer.from(JSON.stringify(entries))),uidMap:fs.readFileSync('/proc/self/uid_map','utf8').trim(),gidMap:fs.readFileSync('/proc/self/gid_map','utf8').trim(),node:process.version})+'\n');
} catch {
 fs.writeFileSync(output,JSON.stringify({passed:false,category:'ripgrep-execution-or-isolation-refused'})+'\n');
 process.exitCode=1;
}
