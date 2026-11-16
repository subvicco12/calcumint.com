/** Fresh command transport checks: source/proof acceptance remains in the original suites. */
import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {existsSync,mkdtempSync,writeFileSync,readFileSync,rmSync,chmodSync,mkdirSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
const moduleURL=new URL('./source-private-git-transport.mjs',import.meta.url);
const opts=(cwd,extra={})=>({cwd,env:{...process.env},stdio:['ignore','pipe','pipe'],maxBuffer:1024*1024,...extra});
async function transport(){assert(existsSync(moduleURL),'Private fresh Git transport has not been implemented');return(await import(moduleURL)).createPrivateGitTransport();}
function repository(){const root=mkdtempSync(join(tmpdir(),'calcumint-git-transport-'));const git=args=>execFileSync('git',args,opts(root));git(['init','-q']);git(['config','user.name','Transport fixture']);git(['config','user.email','fixture@invalid.test']);mkdirSync(join(root,'src'));writeFileSync(join(root,'src/source'),'first\n');git(['add','src/source']);git(['commit','-qm','first']);return{root,git,cleanup:()=>rmSync(root,{recursive:true,force:true})};}
test('private transport is available as a bounded Buffer-only command channel',async()=>{const channel=await transport();channel.close();assert.throws(()=>channel.run(['rev-parse','--show-toplevel'],opts(process.cwd())),/closed|poison/i);});
test('fresh native root and HEAD commands equal direct bytes and observe a subsequent commit',async()=>{const channel=await transport(),r=repository();try{for(const args of [['rev-parse','--show-toplevel'],['rev-parse','--verify','HEAD^{commit}']])assert.deepEqual(channel.run(args,opts(r.root)),r.git(args));const before=channel.run(['rev-parse','--verify','HEAD^{commit}'],opts(r.root));writeFileSync(join(r.root,'src/source'),'second\n');r.git(['add','src/source']);r.git(['commit','-qm','second']);const after=channel.run(['rev-parse','--verify','HEAD^{commit}'],opts(r.root));assert.notDeepEqual(after,before);assert.deepEqual(after,r.git(['rev-parse','--verify','HEAD^{commit}']));}finally{channel.close();r.cleanup();}});
test('status and index observations remain live across dirty source and index flags',async()=>{const channel=await transport(),r=repository();try{for(const args of [['status','--porcelain','--untracked-files=all','--','src'],['ls-files','-v','-z','--','src']])assert.deepEqual(channel.run(args,opts(r.root)),r.git(args));r.git(['update-index','--assume-unchanged','src/source']);const flags=['ls-files','-v','-z','--','src'];assert.deepEqual(channel.run(flags,opts(r.root)),r.git(flags));assert.match(channel.run(flags,opts(r.root)).toString(),/^h /);r.git(['update-index','--no-assume-unchanged','src/source']);writeFileSync(join(r.root,'src/source'),'dirty\n');const status=['status','--porcelain','--untracked-files=all','--','src'];assert.deepEqual(channel.run(status,opts(r.root)),r.git(status));assert(channel.run(status,opts(r.root)).length>0);}finally{channel.close();r.cleanup();}});
test('binary batch stdin and stdout are preserved including embedded NUL and newline',async()=>{const channel=await transport(),r=repository();try{const content=Buffer.from([0,255,10,13,65,0]);const id=execFileSync('git',['hash-object','-w','--stdin'],opts(r.root,{input:content,stdio:['pipe','pipe','pipe']})).toString().trim(),input=Buffer.from(id+'\n'),args=['cat-file','--batch'],options=opts(r.root,{input,stdio:['pipe','pipe','pipe']});assert.deepEqual(channel.run(args,options),execFileSync('git',args,options));}finally{channel.close();r.cleanup();}});
test('missing object failures poison the channel and preserve failure bytes',async()=>{const channel=await transport(),r=repository();try{assert.throws(()=>channel.run(['cat-file','blob','0'.repeat(40)],opts(r.root)),error=>error.status!==0&&Buffer.isBuffer(error.stderr)&&/fatal|invalid|bad object/i.test(error.stderr.toString()));assert.throws(()=>channel.run(['rev-parse','--show-toplevel'],opts(r.root)),/poison|closed/i);}finally{channel.close();r.cleanup();}});
test('unsupported option and command shapes dispatch directly before any private broker starts',async()=>{const channel=await transport(),r=repository();try{assert.equal(channel.run(['rev-parse','--show-toplevel'],opts(r.root,{encoding:'utf8'})),r.git(['rev-parse','--show-toplevel']).toString());assert.equal(channel.run(['config','user.name'],opts(r.root,{encoding:'utf8'})),'Transport fixture\n');}finally{channel.close();r.cleanup();}});
test('fresh Git commands use each request environment rather than broker bootstrap environment',async()=>{const channel=await transport(),r=repository();try{const args=['rev-parse','--show-toplevel'];assert.deepEqual(channel.run(args,opts(r.root)),r.git(args));const env={...process.env,GIT_DIR:join(r.root,'.git'),GIT_WORK_TREE:r.root};assert.deepEqual(channel.run(args,opts(tmpdir(),{env})),execFileSync('git',args,opts(tmpdir(),{env})));}finally{channel.close();r.cleanup();}});
test('positive timeout stays on the direct path and retains original child cancellation',async()=>{const channel=await transport(),directory=mkdtempSync(join(tmpdir(),'calcumint-git-timeout-'));try{const executable=join(directory,'git');writeFileSync(executable,'#!/usr/bin/python3\nimport os,time\nopen(os.environ["FIXTURE_PID_FILE"],"w").write(str(os.getpid()))\ntime.sleep(30)\n');chmodSync(executable,0o700);const pidFile=join(directory,'pid'),env={...process.env,PATH:directory+':/usr/bin:/bin',FIXTURE_PID_FILE:pidFile};assert.throws(()=>channel.run(['rev-parse','--show-toplevel'],opts(directory,{env,timeout:300})),error=>error.code==='ETIMEDOUT');const pid=Number(readFileSync(pidFile,'utf8'));assert.throws(()=>process.kill(pid,0),{code:'ESRCH'});assert(Buffer.isBuffer(channel.run(['rev-parse','--show-toplevel'],opts(process.cwd()))));}finally{channel.close();rmSync(directory,{recursive:true,force:true});}});
test('stdout and stderr overflow fail before an unbounded response can be retained',async()=>{for(const stream of ['stdout','stderr']){const channel=await transport(),directory=mkdtempSync(join(tmpdir(),'calcumint-git-overflow-'));try{const executable=join(directory,'git');writeFileSync(executable,'#!/usr/bin/python3\nimport os\nos.write('+ (stream==='stdout'?'1':'2') +',b"x"*200000)\n');chmodSync(executable,0o700);assert.throws(()=>channel.run(['rev-parse','--show-toplevel'],opts(directory,{env:{...process.env,PATH:directory+':/usr/bin:/bin'},maxBuffer:8192})),error=>error.code==='ENOBUFS');}finally{channel.close();rmSync(directory,{recursive:true,force:true});}}});
// Loaded-image and abrupt-death fault cases are added before their implementation;
// no public transport option may accept test program bytes, roots or fault flags.

test('broker refuses a missing creator thread before publishing READY',()=>{
 const source=readFileSync(new URL('./source-private-git-broker.py',import.meta.url),'utf8');
 assert.throws(()=>execFileSync('/usr/bin/python3',['-I','-S','-c',source,String(process.pid),'2147483647','0'],{env:{PATH:'/usr/bin:/bin',LANG:'C.UTF-8'},input:Buffer.alloc(0),stdio:['pipe','pipe','pipe'],timeout:2000}),error=>error.status===125&&error.stdout.length===0);
});

test('loaded helper bytes must match the independently fixed image policy',async()=>{
 const base=mkdtempSync(join(tmpdir(),'calcumint-git-image-'));
 try{
  const {mkdirSync,copyFileSync}=await import('node:fs');const local=join(base,'tests/next-engineering-20261115'),immutable=join(base,'tests/milestone100-20261114');mkdirSync(local,{recursive:true});mkdirSync(immutable,{recursive:true});
  for(const name of ['source-private-git-transport.mjs','source-private-git-worker.mjs','source-private-git-broker.py','source-private-git-images.mjs'])copyFileSync(new URL('./'+name,import.meta.url),join(local,name));
  copyFileSync(new URL('../milestone100-20261114/source-immutable-queries.mjs',import.meta.url),join(immutable,'source-immutable-queries.mjs'));
  writeFileSync(join(local,'source-private-git-broker.py'),'raise SystemExit(0)\n');
  const create=(await import(pathToFileURL(join(local,'source-private-git-transport.mjs')))).createPrivateGitTransport,channel=create();try{assert.throws(()=>channel.run(['rev-parse','--show-toplevel'],opts(process.cwd())),/Independent private Git image differs/);}finally{channel.close();}
 }finally{rmSync(base,{recursive:true,force:true});}
});

test('default native adapter runs a failed command once and recovers on the next independent invocation',async()=>{
 const directory=mkdtempSync(join(tmpdir(),'calcumint-git-recovery-'));
 try{
  const log=join(directory,'requests'),git=join(directory,'git');writeFileSync(git,'#!/usr/bin/python3\nimport os,sys,json\nwith open(os.environ["GIT_REQUEST_LOG"],"a") as f:f.write(json.dumps(sys.argv[1:])+"\\n")\nif "--verify" in sys.argv:\n sys.stderr.write("negative fixture\\n")\n sys.exit(7)\nprint("fresh")\n');chmodSync(git,0o700);
  const {runtimeNativeGit}=await import('./source-runtime-native-git.mjs'),options={env:{PATH:directory+':/usr/bin:/bin',GIT_REQUEST_LOG:log}};
  assert.throws(()=>runtimeNativeGit(['rev-parse','--verify','HEAD^{commit}'],options),error=>error.status===7);assert.equal(runtimeNativeGit(['rev-parse','--show-toplevel'],options).toString(),'fresh\n');
  assert.deepEqual(readFileSync(log,'utf8').trim().split('\n').map(row=>JSON.parse(row)),[['rev-parse','--verify','HEAD^{commit}'],['rev-parse','--show-toplevel']]);
 }finally{rmSync(directory,{recursive:true,force:true});}
});

test('combined stdout and stderr obey the original direct maxBuffer refusal',async()=>{
 const channel=await transport(),directory=mkdtempSync(join(tmpdir(),'calcumint-git-combined-limit-'));
 try{
  const git=join(directory,'git');writeFileSync(git,'#!/usr/bin/python3\nimport os\nos.write(1,b"o"*6000)\nos.write(2,b"e"*6000)\n');chmodSync(git,0o700);
  const args=['rev-parse','--show-toplevel'],options=opts(directory,{env:{...process.env,PATH:directory+':/usr/bin:/bin'},maxBuffer:8192});
  assert.throws(()=>execFileSync('git',args,options),error=>error.code==='ENOBUFS');assert.throws(()=>channel.run(args,options),error=>error.code==='ENOBUFS');
 }finally{channel.close();rmSync(directory,{recursive:true,force:true});}
});

test('Worker bootstrap excludes owner NODE_OPTIONS while each Git request retains its environment',async()=>{
 const directory=mkdtempSync(join(tmpdir(),'calcumint-git-bootstrap-')),saved=process.env.NODE_OPTIONS;const channel=await transport();
 try{
  const marker=join(directory,'preloaded'),preload=join(directory,'preload.cjs');writeFileSync(preload,'require("node:fs").writeFileSync('+JSON.stringify(marker)+',"unexpected preload")');process.env.NODE_OPTIONS='--require='+preload;
  const git=join(directory,'git');writeFileSync(git,'#!/usr/bin/python3\nimport os,json\nprint(json.dumps({k:os.environ.get(k) for k in ["NODE_OPTIONS","CUSTOM_COMMAND_ENV","PATH"]}))\n');chmodSync(git,0o700);const env={...process.env,PATH:directory+':/usr/bin:/bin',CUSTOM_COMMAND_ENV:'main-owned request value'};
  const observed=JSON.parse(channel.run(['rev-parse','--show-toplevel'],opts(process.cwd(),{env})));assert.deepEqual(observed,{NODE_OPTIONS:env.NODE_OPTIONS,CUSTOM_COMMAND_ENV:env.CUSTOM_COMMAND_ENV,PATH:env.PATH});assert.equal(existsSync(marker),false,'Owner preload executed in the supposedly verified Worker image');
 }finally{channel.close();if(saved===undefined)delete process.env.NODE_OPTIONS;else process.env.NODE_OPTIONS=saved;rmSync(directory,{recursive:true,force:true});}
});
