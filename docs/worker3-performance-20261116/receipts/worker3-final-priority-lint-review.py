import subprocess,re,json,hashlib
from pathlib import Path
ROOT='/workspace/calcumint-worker3-recovery'; OLD='73a31f220bda8071928aed04eed3d16100f9cc7a'; NEW='79745baf553091a77e51e7d23b2832b6319e918c'; POP='16d64cce4a5fc65b8075a59ee0ede6a1f3f4b038'
def git(*a,**kw):return subprocess.check_output(['git',*a],cwd=ROOT,**kw)
def data(ref,p):return git('show',ref+':'+p)
def text(ref,p):return data(ref,p).decode()
findings=[]
def ck(name,ok):
 if not ok:findings.append(name)
A='tests/parallel-source-20261110/authority.mjs';old=text(OLD,A);new=text(NEW,A)
pat=r'(?:export )?const\s+(\w+)\s*=\s*Object\.freeze\((\[[\s\S]*?\])\);'
arrays=lambda s:{m[1]:m[0] for m in re.finditer(pat,s) if m[1]!='accepted'}
oa=arrays(old);na=arrays(new);ck('historical frozen authority arrays preserved',all(na.get(k)==v for k,v in oa.items()))
ck('authority verifier unchanged',old[old.index('export function verifyParallelAuthority'):]==new[new.index('export function verifyParallelAuthority'):])
ck('zero SRC changes',not git('diff','--name-only',OLD,NEW,'--','src').strip())
def tree(ref):
 result={}
 for line in git('ls-tree','-r',ref,'docs').decode().splitlines():
  meta,p=line.split('\t',1);result[p]=meta.split()[2]
 return result
ot=tree(OLD);nt=tree(NEW);caps=[p for p in ot if 'capture' in p and p.endswith('.json')];ck('all prior captures unchanged',all(nt.get(p)==ot[p] for p in caps))
p='docs/next-engineering-20261115/source/guard-capture-fixture-lint.json';raw=data(NEW,p);cap=json.loads(raw);stage=cap['sourceStage10FixtureLint'];retained=json.loads(data(OLD,stage['retainedCapturePath']));ck('retained source capture exact',hashlib.sha256(data(OLD,stage['retainedCapturePath'])).hexdigest()==stage['retainedCaptureSHA256']);ck('historical capture fields retained',all(cap.get(k)==v for k,v in retained.items() if k not in ['currentSources','sourceStage10']))
oldrows={r['path']:r for r in retained['currentSources']};rows={r['path']:r for r in cap['currentSources']};paths=stage['guardPaths'];ck('seven finite guards',len(paths)==len(set(paths))==7);ck('other current source records unchanged',all(rows.get(k)==v for k,v in oldrows.items() if k not in paths))
entries={}
for line in git('ls-tree','-r',stage['guardRef'],'--',*paths).decode().splitlines():
 meta,path=line.split('\t',1);entries[path]=meta.split()[2]
ids=[rows[p]['blob'] for p in paths];out=git('cat-file','--batch',input=('\n'.join(ids)+'\n').encode());offset=0;verified=[]
for p,expected in zip(paths,ids):
 end=out.index(b'\n',offset);header=out[offset:end].decode().split();assert header[:2]==[expected,'blob'];size=int(header[2]);b=out[end+1:end+1+size];offset=end+1+size+1;r=rows[p];disk=Path(ROOT,p).read_bytes();ck('guard '+p,r['ref']==stage['guardRef'] and entries[p]==expected and r['bytes']==len(b) and r['sha256']==hashlib.sha256(b).hexdigest() and b==disk and hashlib.sha1(b'blob '+str(len(b)).encode()+b'\0'+b).hexdigest()==expected);verified.append(r)
assert offset==len(out)
acc=json.loads(re.search(r'export const acceptedStage10FixtureLint=Object.freeze\((\[[\s\S]*?\])\);',new)[1]);exp=[{k:r[k] for k in ['path','blob','sha256']} for r in verified];exp.append({'path':'docs/next-engineering-20261115/source/guard-capture-fixture-lint.json','blob':nt['docs/next-engineering-20261115/source/guard-capture-fixture-lint.json'],'sha256':hashlib.sha256(raw).hexdigest()});sc=json.loads(data(NEW,stage['capturePath']));exp.extend({k:r['current'][k] for k in ['path','blob','sha256']} for r in sc['rows']);ck('40 exact acceptance records',acc==exp and len(acc)==40)
p='tests/next-engineering-20261115/source-private-git-transport.test.mjs';b=text(OLD,p);n=text(NEW,p);ck('exactly two identifier occurrences renamed',n.replace('const baselineModule=await import(','const module=await import(').replace('sourceGit:baselineModule.sourceGit','sourceGit:module.sourceGit')==b and n.count('const baselineModule=await import(')==n.count('sourceGit:baselineModule.sourceGit')==1)
p='tests/parallel-source-20261110/current.test.mjs';b=text(OLD,p);n=text(NEW,p)
oldtuple="const expectedAuthority={ref:'92633d8dac6dc5b6fd325e447ea488ec682331e5',blob:'500ad592c346ba0c52d012aab7c82f55ff5c3e7a',sha256:'95a94095b179789e73a998c8355bc9cebd80339a68ceb52ea6c502b73ed0fee6'};"
newtuple=oldtuple.replace('expectedAuthority','retainedStage10WarmupRecoveryAuthority')+"\nconst expectedAuthority={ref:'16d64cce4a5fc65b8075a59ee0ede6a1f3f4b038',blob:'3c947a27fecec036ddc39decb7ad710843e0b828',sha256:'2c3e16ba332be86ca360df41488570a0c594c0a0041fb6c912c4e91cf9d7c877'};"
ck('root owner only pin changes after passed priority candidate',n.replace(newtuple,oldtuple).replace(',retainedStage10WarmupRecoveryAuthority,expectedAuthority])',',expectedAuthority])')==b)
ck('new populated pin exact',git('rev-parse',POP+':'+A).decode().strip()=='3c947a27fecec036ddc39decb7ad710843e0b828' and data(POP,A)==data(NEW,A) and hashlib.sha256(data(POP,A)).hexdigest()=='2c3e16ba332be86ca360df41488570a0c594c0a0041fb6c912c4e91cf9d7c877')
prev=git('rev-parse',OLD+'^').decode().strip();pb=text(prev,p);priority=lambda s:json.loads(re.search(r' const priority=(\[[^\n]+\]);',s)[1].replace("'",'"'));before=priority(pb);after=priority(b);ck('priority reorder exact same unique file keys',len(before)==len(after)==len(set(after)) and sorted(before)==sorted(after));strip=lambda s:re.sub(r' // (?:Start measured long jobs early[^\n]*|Run lock-dependent proofs[^\n]*)\n const priority=\[[^\n]+\];',' // PRIORITY\n const priority=[];',s);ck('priority commit changes no other owner bytes',strip(pb)==strip(b))
for term in ['timeout:30000','maxBuffer:1000000','signal:context.signal','await Promise.all([record(scope),record(preload)]);','filter(row=>row!==preload)','assert.equal(new Set(planned).size,remaining.length)','assert.equal(results.size,files.length']:
 ck('queue invariant '+term,term in n)
r={'kind':'INDEPENDENT_FINAL_PRIORITY_AND_LINT_ADMISSION_REVIEW','priorPassingSourceHead':OLD,'finalHead':NEW,'populatedAuthorityRef':POP,'guardRef':stage['guardRef'],'captureSHA256':hashlib.sha256(raw).hexdigest(),'preservedAuthorityArrays':len(oa),'preservedPriorCaptureJSONs':len(caps),'exactGuardBindings':len(paths),'newAcceptanceRecords':len(acc),'blockingFindings':findings,'SRCChanged':False,'priorityChange':'same unique11file keys reordered only; same40jobs/counts/deadlines/locks, pairedphase and2workers','lintChange':'two fixture-local identifier occurrences only; all23test bodies/contracts unchanged','ownerPin':'prior92633tuple retained; exact16d64authority pinned byfinal79745','runtimeTestsRunByReviewer':False,'sourceEditsByReviewer':False,'requiredFollowup':['Exact final-head150source proof','Full mandatory exact-head hosted CI','Individual applicable calculator qualification review'],'qualified':False}
Path('/tmp/worker3-final-priority-lint-independent-review.json').write_text(json.dumps(r,indent=2)+'\n');print(json.dumps(r,indent=2));assert not findings
