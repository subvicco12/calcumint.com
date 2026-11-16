import os,json,subprocess,time,hashlib
from pathlib import Path
s=json.loads(Path('/tmp/worker3-final77-fresh-remote-location.json').read_text());base=Path(s['directory']);repo=Path(s['repository']);env=os.environ.copy()
for k in ['GIT_DIR','GIT_WORK_TREE','GIT_COMMON_DIR','GIT_OBJECT_DIRECTORY','GIT_ALTERNATE_OBJECT_DIRECTORIES','GIT_INDEX_FILE','GIT_SHALLOW_FILE','GIT_REPLACE_REF_BASE','GIT_NAMESPACE']:
 env.pop(k,None)
env['GIT_TERMINAL_PROMPT']='0';env['GIT_NO_REPLACE_OBJECTS']='1'
steps=[]
def run(key,args):
 start=time.monotonic();p=subprocess.run(args,cwd=repo,env=env,stdout=subprocess.PIPE,stderr=subprocess.PIPE);elapsed=time.monotonic()-start;(base/'logs'/f'{key}.stdout').write_bytes(p.stdout);(base/'logs'/f'{key}.stderr').write_bytes(p.stderr);steps.append({'key':key,'argv':args,'exitCode':p.returncode,'seconds':elapsed});(base/'fetch-steps.json').write_text(json.dumps(steps,indent=2)+'\n');print(key,p.returncode,round(elapsed,3),flush=True)
 if p.returncode:raise SystemExit(p.returncode)
 return p.stdout
def git(key,args):return run(key,['git','-c','protocol.file.allow=never','-c','protocol.ext.allow=never',*args])
git('init',['init','--quiet']);git('origin',['remote','add','origin',s['origin']]);git('fetch-head',['fetch','--no-tags','--depth=1','origin',s['target']]);git('checkout',['checkout','--detach',s['target']]);assert git('head',['rev-parse','HEAD']).decode().strip()==s['target'];assert git('origin-readback',['remote','get-url','--all','origin']).decode().strip()==s['origin'];assert git('initial-shallow',['rev-parse','--is-shallow-repository']).decode().strip()=='true';assert (repo/'.git').is_dir();assert not (repo/'.git/objects/info/alternates').exists();assert not (repo/'.git/objects/info/http-alternates').exists();assert (repo/'.git/shallow').read_text().splitlines()==[s['target']]
git('initial-object-count',['count-objects','-v']);bootstrap=run('actual-source-bootstrap',[s['node'],'scripts/fetch-source-lineage.mjs']);receipt=json.loads(bootstrap);assert receipt['releaseHold'] is True and receipt['productionWrites'] is False;assert receipt['fetched']>0
published=['aaf369e67096718fd3bfff3d86c9c8e861a1cd42','f94521a5c3a038dfd725c870cc27061ecf3376b5','7db01d0744ce150154746a19b5f70d01271f4a29','50240fb1d59a1f8d298718f85e58bd55b4b990c2','939ea3b6ab204b0b5c12d3724949f0d85b62e0c8','b3f19a897bc564e0bee079ae5d7c80b6b6a5e8ae'];git('fetch-published-comparison-refs',['fetch','--no-tags','--depth=1','origin',*published]);git('post-bootstrap-object-count',['count-objects','-v']);assert not (repo/'.git/objects/info/alternates').exists();assert not (repo/'.git/objects/info/http-alternates').exists();(base/'bootstrap-result.json').write_text(json.dumps({'setup':s,'actualBootstrap':receipt,'publishedComparisonRefs':published,'noAlternates':True,'objectStore':'Fresh git init directory, only HTTPS GitHub fetches; no clone/share/local objects.'},indent=2)+'\n')
