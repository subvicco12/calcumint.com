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

// Exercise the real broker run loop with real subprocesses. Only selector waiting
// is observed: stdout/stderr, exit status, deadlines and process cleanup stay real.
const emptyWaitFixture=String.raw`
import pathlib, os, json, selectors, tempfile, signal, shutil, sys, time
source=pathlib.Path(sys.argv[1]).read_text().split('\ntry:\n    parent_death')
assert len(source)==2, 'Exact broker bootstrap separator required'
namespace={}
exec(compile(source[0],sys.argv[1],'exec'),namespace)
root=tempfile.mkdtemp(prefix='calcumint-empty-selector-')
original_selector=selectors.DefaultSelector
original_popen=namespace['subprocess'].Popen
case=sys.argv[2]
frames=[]
results=[]
pids=[]
empty=[]
class ObservedSelector(original_selector):
    def select(self,timeout=None):
        if not self.get_map():
            empty.append(timeout)
            if case=='closed':
                raise AssertionError('Empty selector must not add a polling delay after pipes close')
        return super().select(timeout)
def spawn(*args,**kwargs):
    child=original_popen(*args,**kwargs)
    pids.append(child.pid)
    until=time.monotonic()+10
    while not pathlib.Path(root,'ready').exists():
        assert child.poll() is None, 'Fixture exited before readiness'
        assert time.monotonic()<until, 'Fixture readiness exceeded test watchdog'
        time.sleep(.001)
    if case=='closed':
        original_wait=child.wait
        def release_and_wait(*args,**kwargs):
            pathlib.Path(root,'release').touch()
            return original_wait(*args,**kwargs)
        child.wait=release_and_wait
    return child
def observe_frame(sequence,kind,data=b''):
    frames.append((kind,list(data)))
    if case=='interrupted' and {kind for kind,data in frames}=={1,2}:
        signal.setitimer(signal.ITIMER_REAL,.05)
namespace['frame']=observe_frame
namespace['metadata']=lambda sequence,kind,value:results.append((kind,value))
namespace['subprocess'].Popen=spawn
selectors.DefaultSelector=ObservedSelector
previous=signal.signal(signal.SIGALRM,namespace['stopped'])
try:
    body='import os,time,signal,sys,pathlib\n'
    if case=='positive':
        body+='signal.signal(signal.SIGTERM,lambda signum,frame:sys.exit(7))\n'
    body+='os.write(1,b"abc\\x00")\nos.write(2,b"err")\npathlib.Path("ready").touch()\n'
    if case=='inherited':
        body+='if os.fork()==0:\n time.sleep(.04)\n os._exit(0)\nsys.exit(7)\n'
    else:
        body+='os.close(1)\nos.close(2)\n'
        if case=='closed':
            body+='while not pathlib.Path("release").exists():\n time.sleep(.001)\nsys.exit(7)\n'
        else:
            body+='while True:\n time.sleep(.01)\n'
    executable=pathlib.Path(root,'git')
    executable.write_text('#!/usr/bin/python3\n'+body)
    executable.chmod(0o700)
    request={'sequence':1,'argv':['rev-parse','--show-toplevel'],'cwd':root,'env':{**os.environ,'PATH':root+':/usr/bin:/bin'},'inputPresent':False,'timeout':50 if case=='positive' else 0,'maxBuffer':134217728,'killSignal':'SIGTERM'}
    interrupted=False
    try:
        namespace['run'](request,b'')
    except SystemExit as error:
        assert case=='interrupted' and error.code==128+signal.SIGALRM
        interrupted=True
    finally:
        signal.setitimer(signal.ITIMER_REAL,0)
    assert interrupted==(case=='interrupted')
    assert bytes(value for kind,data in frames if kind==1 for value in data)==b'abc\x00'
    assert bytes(value for kind,data in frames if kind==2 for value in data)==b'err'
    final=[value for kind,value in results if kind==3]
    if case=='interrupted':
        assert not final
    else:
        assert len(final)==1 and final[0]['status']==7 and final[0]['signal'] is None
        assert final[0].get('code')==('ETIMEDOUT' if case=='positive' else None)
    if case=='positive':
        assert empty, 'Original positive-deadline polling path must remain in use'
    for pid in pids:
        try:
            os.kill(pid,0)
        except ProcessLookupError:
            pass
        else:
            raise AssertionError('Owned Git child survived cleanup')
    print(json.dumps({'case':case,'status':'passed','emptySelects':len(empty)}))
finally:
    signal.setitimer(signal.ITIMER_REAL,0)
    signal.signal(signal.SIGALRM,previous)
    selectors.DefaultSelector=original_selector
    namespace['subprocess'].Popen=original_popen
    shutil.rmtree(root)
`;
for(const kind of ['closed','inherited','interrupted','positive'])test('broker empty-pipe wait preserves '+kind+' subprocess semantics',()=>{
 const output=execFileSync('/usr/bin/python3',['-I','-S','-c',emptyWaitFixture,new URL('./source-private-git-broker.py',import.meta.url).pathname,kind],{encoding:'utf8',timeout:15000});
 assert.equal(JSON.parse(output).status,'passed');
});

// The baseline provider keeps one immutable reader while each mutable command
// crosses the same fresh native transport exercised above.
async function baselineProviderFixture(){
 const r=repository(),{copyFileSync}=await import('node:fs');
 for(const directory of ['parallel-source-20261110','next-engineering-20261115','milestone100-20261114'])mkdirSync(join(r.root,'tests',directory),{recursive:true});
 for(const name of ['baseline-runtime.mjs','git-reader.mjs'])copyFileSync(new URL('../parallel-source-20261110/'+name,import.meta.url),join(r.root,'tests/parallel-source-20261110',name));
 for(const name of ['source-private-git-transport.mjs','source-private-git-worker.mjs','source-private-git-broker.py','source-private-git-images.mjs'])copyFileSync(new URL('./'+name,import.meta.url),join(r.root,'tests/next-engineering-20261115',name));
 copyFileSync(new URL('../milestone100-20261114/source-immutable-queries.mjs',import.meta.url),join(r.root,'tests/milestone100-20261114/source-immutable-queries.mjs'));
 const module=await import(pathToFileURL(join(r.root,'tests/parallel-source-20261110/baseline-runtime.mjs')));
 const saved=new Map();
 const environment=values=>{for(const[key,value]of Object.entries(values)){if(!saved.has(key))saved.set(key,process.env[key]);if(value===undefined)delete process.env[key];else process.env[key]=value;}};
 const fake=(label='first')=>{
  const directory=join(r.root,'bin-'+label);mkdirSync(directory);const executable=join(directory,'git');
  writeFileSync(executable,`#!/usr/bin/python3\nimport os,sys,json\nwith open(os.environ['BASELINE_FIXTURE_LOG'],'a') as f:f.write(json.dumps(sys.argv[1:])+'\\n')\nmode=os.environ.get('BASELINE_FIXTURE_MODE','observe')\nif mode=='fail':\n sys.stderr.write('started failure\\n')\n sys.exit(7)\nif mode=='binary':\n sys.stdout.buffer.write(b'\\x00\\xff'*(5*1024*1024))\nelse:\n print(json.dumps({'ppid':os.getppid(),'cwd':os.getcwd(),'marker':os.environ.get('BASELINE_FIXTURE_MARKER'),'label':${JSON.stringify(label)},'argv':sys.argv[1:]}))\n`);chmodSync(executable,0o700);
  return directory+':/usr/bin:/bin';
 };
 const cleanup=()=>{for(const[key,value]of saved){if(value===undefined)delete process.env[key];else process.env[key]=value;}r.cleanup();};
 return{...r,sourceGit:module.sourceGit,environment,fake,log:join(r.root,'requests'),cleanup};
}

test('baseline provider keeps a shared broker while observing fresh default environment PATH and explicit cwd',async()=>{
 const r=await baselineProviderFixture(),previous=process.cwd();
 try{
  const first=r.fake('first'),second=r.fake('second');r.environment({PATH:first,BASELINE_FIXTURE_LOG:r.log,BASELINE_FIXTURE_MARKER:'first default'});
  const args=['rev-parse','--show-toplevel'];process.chdir(tmpdir());
  const before=JSON.parse(r.sourceGit(args));assert.notEqual(before.ppid,process.pid,'Baseline Git must fork from the private broker rather than the loaded verifier');assert.equal(before.cwd,r.root);assert.equal(before.marker,'first default');assert.equal(before.label,'first');assert.deepEqual(before.argv,args);
  r.environment({PATH:second,BASELINE_FIXTURE_MARKER:'second default'});
  const after=JSON.parse(r.sourceGit(args));assert.equal(after.ppid,before.ppid,'Independent mutable observations use the same private command backend');assert.equal(after.marker,'second default');assert.equal(after.label,'second');
  const overridden=JSON.parse(r.sourceGit(args,{cwd:tmpdir(),env:{...process.env,PATH:first,BASELINE_FIXTURE_MARKER:'explicit environment'}}));assert.equal(overridden.cwd,tmpdir());assert.equal(overridden.marker,'explicit environment');assert.equal(overridden.label,'first');assert.equal(overridden.ppid,before.ppid);
 }finally{process.chdir(previous);r.cleanup();}
});

test('baseline provider observes a subsequent commit dirty source and changed index flags',async()=>{
 const r=await baselineProviderFixture();
 try{
  const head=['rev-parse','--verify','HEAD^{commit}'],status=['status','--porcelain','--untracked-files=all','--','src'],flags=['ls-files','-v','-z','--','src'];
  const before=r.sourceGit(head);assert.deepEqual(before,r.git(head));assert.deepEqual(r.sourceGit(status),Buffer.alloc(0));
  writeFileSync(join(r.root,'src/source'),'second\n');assert.deepEqual(r.sourceGit(status),r.git(status));assert.match(r.sourceGit(status).toString(),/ M src\/source/);
  r.git(['add','src/source']);r.git(['commit','-qm','second']);assert.notDeepEqual(r.sourceGit(head),before);assert.deepEqual(r.sourceGit(head),r.git(head));
  r.git(['update-index','--assume-unchanged','src/source']);assert.deepEqual(r.sourceGit(flags),r.git(flags));assert.match(r.sourceGit(flags).toString(),/^h /);
  r.git(['update-index','--no-assume-unchanged','src/source']);assert.match(r.sourceGit(flags).toString(),/^H /);
 }finally{r.cleanup();}
});

test('baseline provider retains its sixteen MiB binary default and caller maxBuffer refusal',async()=>{
 const r=await baselineProviderFixture();
 try{
  r.environment({PATH:r.fake(),BASELINE_FIXTURE_LOG:r.log,BASELINE_FIXTURE_MODE:'binary'});
  const args=['rev-parse','--show-toplevel'],bytes=r.sourceGit(args);assert(Buffer.isBuffer(bytes));assert.equal(bytes.length,10*1024*1024);assert.deepEqual(bytes.subarray(0,4),Buffer.from([0,255,0,255]));assert.deepEqual(bytes.subarray(-4),Buffer.from([0,255,0,255]));
  assert.throws(()=>r.sourceGit(args,{maxBuffer:8192}),error=>error.code==='ENOBUFS'&&Buffer.isBuffer(error.stdout)&&Buffer.isBuffer(error.stderr));
  assert.equal(readFileSync(r.log,'utf8').trim().split('\n').length,2,'An overflowing started request is never retried');
 }finally{r.cleanup();}
});

test('baseline provider preserves positive-timeout and unsupported-option direct dispatch',async()=>{
 const r=await baselineProviderFixture();
 try{
  r.environment({PATH:r.fake(),BASELINE_FIXTURE_LOG:r.log});const args=['rev-parse','--show-toplevel'];
  const positive=JSON.parse(r.sourceGit(args,{timeout:1000}));assert.equal(positive.ppid,process.pid,'Positive timeouts retain the original direct child process');
  const encoded=r.sourceGit(args,{encoding:'utf8'});assert.equal(typeof encoded,'string');assert.equal(JSON.parse(encoded).ppid,process.pid,'Unsupported transport options dispatch directly before starting a broker');
  assert.deepEqual(readFileSync(r.log,'utf8').trim().split('\n').map(JSON.parse),[args,args]);
 }finally{r.cleanup();}
});

test('baseline provider never retries a failed started command and recovers on a new request',async()=>{
 const r=await baselineProviderFixture();
 try{
  r.environment({PATH:r.fake(),BASELINE_FIXTURE_LOG:r.log,BASELINE_FIXTURE_MODE:'fail'});
  const failure=['rev-parse','--verify','HEAD^{commit}'];assert.throws(()=>r.sourceGit(failure),error=>error.status===7&&error.stderr.toString()==='started failure\n');
  r.environment({BASELINE_FIXTURE_MODE:'observe'});const next=['rev-parse','--show-toplevel'],observed=JSON.parse(r.sourceGit(next));assert.notEqual(observed.ppid,process.pid);
  assert.deepEqual(readFileSync(r.log,'utf8').trim().split('\n').map(JSON.parse),[failure,next]);
 }finally{r.cleanup();}
});
