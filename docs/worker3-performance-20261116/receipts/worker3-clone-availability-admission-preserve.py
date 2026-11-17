import subprocess,re,hashlib,json,pathlib
baseline='79745baf553091a77e51e7d23b2832b6319e918c'
old=subprocess.check_output(['git','show',baseline+':tests/parallel-source-20261110/authority.mjs']).decode()
current=pathlib.Path('tests/parallel-source-20261110/authority.mjs').read_text()
pattern=r'export const (\w+)=Object\.freeze\((\[[\s\S]*?)\);'
old_arrays=dict(re.findall(pattern,old));new_arrays=dict(re.findall(pattern,current));mismatch=[name for name,body in old_arrays.items() if name!='accepted' and new_arrays.get(name)!=body]
assert new_arrays['accepted'].count(',...acceptedStage10CloneAvailability')==1
assert new_arrays['accepted'].replace(',...acceptedStage10CloneAvailability','')==old_arrays['accepted']
paths=subprocess.check_output(['git','diff','--name-only',baseline,'HEAD']).decode().splitlines();src=[p for p in paths if p.startswith('src/')]
old_docs=subprocess.check_output(['git','ls-tree','-r','--name-only',baseline,'docs/next-engineering-20261115/source']).decode().splitlines();changed_old=[]
for p in old_docs:
 oldbytes=subprocess.check_output(['git','show',baseline+':'+p]);currentbytes=pathlib.Path(p).read_bytes()
 if oldbytes!=currentbytes:changed_old.append(p)
capture=pathlib.Path('docs/next-engineering-20261115/source/guard-capture-clone-availability.json');data=json.loads(capture.read_bytes());stage=data['sourceStage10CloneAvailability'];invalid=[]
for row in data['currentSources']:
 if row['path'] not in stage['guardPaths']:continue
 gitbytes=subprocess.check_output(['git','show',row['ref']+':'+row['path']]);disk=pathlib.Path(row['path']).read_bytes();blob=subprocess.check_output(['git','rev-parse',row['ref']+':'+row['path']]).decode().strip()
 if disk!=gitbytes or blob!=row['blob'] or len(disk)!=row['bytes'] or hashlib.sha256(disk).hexdigest()!=row['sha256']:invalid.append(row['path'])
result=dict(head=subprocess.check_output(['git','rev-parse','HEAD']).decode().strip(),baseline=baseline,retainedAuthorityArrays=len(old_arrays)-1,acceptedAggregationOnlyAppendsNewArray=True,retainedArrayMismatches=mismatch,retainedSourceCaptureCount=len(old_docs),retainedCaptureMismatches=changed_old,applicationSourceChanges=src,newGuardRef=stage['guardRef'],newGuardPathCount=len(stage['guardPaths']),invalidGuardBindings=invalid,captureSHA256=hashlib.sha256(capture.read_bytes()).hexdigest(),qualified=False)
assert not(mismatch or changed_old or src or invalid),result
pathlib.Path('/tmp/worker3-clone-availability-admission-preservation.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result))
