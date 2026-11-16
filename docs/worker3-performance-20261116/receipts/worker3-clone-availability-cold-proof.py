import subprocess,pathlib,tempfile,json,time,hashlib,os
node='/workspace/.pr1467/sprint/node-v22.23.4-linux-x64/bin/node'
source=pathlib.Path('/workspace/calcumint-worker3-clone-availability-admission')
head='3b7cbf3f760a71255d7306f8b9cccefaa5ac1b4a'
base=pathlib.Path(tempfile.mkdtemp(prefix='worker3-actual-shallow-source-'));parent=base/'parent';before=base/'before';after=base/'after';receipt={'head':head,'base':str(base),'qualified':False,'events':[]}
def command(args,cwd,check=True,timeout=60):
 started=time.monotonic();p=subprocess.run(args,cwd=cwd,capture_output=True,text=True,timeout=timeout)
 receipt['events'].append({'command':args[0:4],'milliseconds':(time.monotonic()-started)*1000,'exitCode':p.returncode})
 if check and p.returncode:raise RuntimeError(p.stderr[-4000:]+'\n'+p.stdout[-4000:])
 return p
try:
 refs=json.loads(command([node,'--input-type=module','-e','import{cloneSourceLineageRefs}from"./scripts/fetch-source-lineage.mjs";console.log(JSON.stringify(cloneSourceLineageRefs));'],source).stdout)
 parent.mkdir();command(['git','init','-q'],parent);command(['git','remote','add','origin',str(source)],parent)
 command(['git','fetch','--no-tags','--depth=1','origin',head],parent);command(['git','checkout','--detach',head],parent)
 command(['git','fetch','--no-tags','--depth=1','origin',*refs],parent)
 receipt['parentIsShallow']=command(['git','rev-parse','--is-shallow-repository'],parent).stdout.strip()=='true'
 code='50240fb1d59a1f8d298718f85e58bd55b4b990c2';receipt['parentContainsCodeRef']=command(['git','cat-file','-e',code+'^{commit}'],parent).returncode==0
 command(['git','clone','--shared','--no-checkout',str(parent),str(before)],base)
 receipt['unmodifiedCloneBeforeContainsCodeRef']=command(['git','cat-file','-e',code+'^{commit}'],before,False).returncode==0
 assert receipt['parentIsShallow'] and receipt['parentContainsCodeRef'] and not receipt['unmodifiedCloneBeforeContainsCodeRef']
 command(['git','remote','set-url','origin','https://github.com/subvicco12/calcumint.com.git'],parent)
 original_head=(parent/'.git/HEAD').read_bytes();original_index=(parent/'.git/index').read_bytes()
 cli=command([node,'scripts/fetch-source-lineage.mjs'],parent);(base/'bootstrap.stdout').write_text(cli.stdout);(base/'bootstrap.stderr').write_text(cli.stderr)
 receipt['bootstrap']=json.loads(cli.stdout);assert receipt['bootstrap']['fetched']==0 and receipt['bootstrap']['cloneAvailability']['created']==len(refs)
 assert (parent/'.git/HEAD').read_bytes()==original_head and (parent/'.git/index').read_bytes()==original_index
 command(['git','clone','--shared','--no-checkout',str(parent),str(after)],base)
 checked=command(['git','cat-file','--batch-check'],after) if False else subprocess.run(['git','cat-file','--batch-check'],cwd=after,input='\n'.join(refs)+'\n',capture_output=True,text=True,check=True,timeout=60)
 assert all(line.split()[0]==ref and line.split()[1]=='commit' for line,ref in zip(checked.stdout.splitlines(),refs)) and len(checked.stdout.splitlines())==len(refs)
 receipt['unmodifiedCloneAfterContainsEveryApprovedCommit']=True;receipt['approvedCommitCount']=len(refs)
 path=parent/'tests/next-engineering-20261115/source-current32.test.mjs';receipt['rawFixtureSHA256']=hashlib.sha256(path.read_bytes()).hexdigest();assert receipt['rawFixtureSHA256']=='dce9ab31f02577cc410559d559fcec9bbb376ccc1326c513412c69d2677de52d'
 script='import{runSourceNode}from"./tests/ci-rpc-recovery-20261113/source-node.mjs";const started=performance.now();try{const out=await runSourceNode(["--test","tests/next-engineering-20261115/source-current32.test.mjs"],{cwd:process.cwd(),env:{...process.env},timeout:30000,maxBuffer:1000000});process.stdout.write(out);process.stderr.write("RAW_FOUR_ELAPSED_MS="+(performance.now()-started)+"\\n");}catch(error){process.stdout.write(error.stdout??"");process.stderr.write(String(error.stack)+"\\n"+String(error.stderr??""));process.exitCode=1;}'
 result=command([node,'--input-type=module','-e',script],parent,False,40);(base/'raw-four.stdout').write_text(result.stdout);(base/'raw-four.stderr').write_text(result.stderr)
 receipt['rawFourExitCode']=result.returncode;receipt['rawFourPassed']=result.returncode==0 and '# tests 4\n' in result.stdout and '# pass 4\n' in result.stdout and '# fail 0\n' in result.stdout
 assert receipt['rawFourPassed'],result.stderr[-4000:]+result.stdout[-4000:]
 receipt['HEADAndIndexUnchanged']=original_head==(parent/'.git/HEAD').read_bytes() and original_index==(parent/'.git/index').read_bytes();assert receipt['HEADAndIndexUnchanged']
 receipt['success']=True
except Exception as error:
 receipt['success']=False;receipt['error']=str(error)
finally:
 pathlib.Path('/tmp/worker3-clone-availability-actual-cold-proof.json').write_text(json.dumps(receipt,indent=2)+'\n');print(json.dumps(receipt,indent=2))
if not receipt['success']:raise SystemExit(1)
