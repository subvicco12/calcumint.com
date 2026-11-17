import subprocess,re,json,hashlib
from pathlib import Path
ROOT='/workspace/calcumint-worker3-recovery'; BASE='482d5aedb5be11e2da836980a98fbfabaa5a5f16'; HEAD='5330ad1d70534c202313a1adc8836c2050e3454b'
def git(*args):return subprocess.check_output(['git',*args],cwd=ROOT)
def at(ref,p):return git('show',ref+':'+p)
def text(ref,p):return at(ref,p).decode()
fail=[]
def check(name,ok):
 if not ok:fail.append(name)
 return ok
A='tests/parallel-source-20261110/authority.mjs'; old=text(BASE,A);new=text(HEAD,A)
pat=r'(?:export )?const\s+(\w+)\s*=\s*Object\.freeze\((\[[\s\S]*?\])\);'
def arrays(s):
 out={}
 for m in re.finditer(pat,s):
  if m[1]!='accepted':out[m[1]]=m[0]
 return out
oldArrays=arrays(old);newArrays=arrays(new)
check('prior authority array literals',all(newArrays.get(k)==v for k,v in oldArrays.items()))
check('authority verifier body',old[old.index('export function verifyParallelAuthority'):]==new[new.index('export function verifyParallelAuthority'):])
paths=git('ls-tree','-r','--name-only',BASE,'docs').decode().splitlines();captures=[p for p in paths if 'capture' in p and p.endswith('.json')]
check('prior docs capture JSONs',all(at(BASE,p)==at(HEAD,p) for p in captures))
check('application SRC unchanged',not git('diff','--name-only',BASE,HEAD,'--','src').strip())
p='docs/next-engineering-20261115/source/guard-capture-fixture-recovery.json';raw=at(HEAD,p);cap=json.loads(raw);stage=cap['sourceStage10FixtureRecovery'];retained=json.loads(at(BASE,stage['retainedCapturePath']))
check('retained capture hash',hashlib.sha256(at(BASE,stage['retainedCapturePath'])).hexdigest()==stage['retainedCaptureSHA256'])
check('historical capture fields',all(cap.get(k)==v for k,v in retained.items() if k not in ['currentSources','sourceStage10']))
oldSources={r['path']:r for r in retained['currentSources']};rows={r['path']:r for r in cap['currentSources']};guard=stage['guardPaths']
check('currentSources unchanged outside named guard',all(rows.get(k)==v for k,v in oldSources.items() if k not in guard))
check('guard roster finite13',len(guard)==13 and len(set(guard))==13)
verified=[]
for p in guard:
 r=rows[p];b=at(r['ref'],p);blob=git('rev-parse',r['ref']+':'+p).decode().strip();disk=Path(ROOT,p).read_bytes()
 check('guard '+p,r['ref']==stage['guardRef'] and r['blob']==blob and r['bytes']==len(b) and r['sha256']==hashlib.sha256(b).hexdigest() and b==at(HEAD,p)==disk);verified.append(r)
accepted=json.loads(re.search(r'export const acceptedStage10FixtureRecovery=Object.freeze\((\[[\s\S]*?\])\);',new)[1]);expected=[{k:r[k] for k in ['path','blob','sha256']} for r in verified];expected.append({'path':'docs/next-engineering-20261115/source/guard-capture-fixture-recovery.json','blob':git('rev-parse',HEAD+':docs/next-engineering-20261115/source/guard-capture-fixture-recovery.json').decode().strip(),'sha256':hashlib.sha256(raw).hexdigest()})
sourceCap=json.loads(at(HEAD,stage['capturePath']));expected.extend({k:r['current'][k] for k in ['path','blob','sha256']} for r in sourceCap['rows']);check('46 exact new acceptance records',accepted==expected and len(accepted)==46)
p='tests/parallel-source-20261110/current.test.mjs';base=text(BASE,p);disk=Path(ROOT,p).read_text();oldtuple="const expectedAuthority={ref:'69c56e391cabe36976e8c4bdfc82db183be70bca',blob:'9e14956bd6b892e5249b807cadd8e4c974b97409',sha256:'558c93f7e0c50e8909fd7dd3e583a71edc7b64c7c64e22018ff82254827fd783'};"
newtuple=oldtuple.replace('expectedAuthority','retainedStage10BrokerDefaultAuthority')+"\nconst expectedAuthority={ref:'5330ad1d70534c202313a1adc8836c2050e3454b',blob:'18030baf7bbed974656160f0fcb1f42d773cb274',sha256:'6e7d551e205be06cbf67330b0b14d193f2bc035db255579f6ec3ed1d1785f5eb'};"
normalized=disk.replace(newtuple,oldtuple).replace(',retainedStage10BrokerDefaultAuthority,expectedAuthority])',',expectedAuthority])').replace("['tests/milestone100-20261114/source-stage8-api-runtime-anchor.test.mjs',9]","['tests/milestone100-20261114/source-stage8-api-runtime-anchor.test.mjs',6]")
check('owner body ordering all40 commands and deadlines unchanged',normalized==base)
check('populated authority tuple',git('rev-parse',HEAD+':'+A).decode().strip()=='18030baf7bbed974656160f0fcb1f42d773cb274' and hashlib.sha256(at(HEAD,A)).hexdigest()=='6e7d551e205be06cbf67330b0b14d193f2bc035db255579f6ec3ed1d1785f5eb')
p='tests/completion-wave-20261113/source-authority-preload.test.mjs';o=text(BASE,p);n=text(HEAD,p);check('all6 preload test bodies untouched',o[o.index("test("):]==n[n.index("test("):])
p='tests/milestone100-20261114/source-stage8-runtime-prime-coalescing.test.mjs';o=text(BASE,p);n=text(HEAD,p);check('all7 coalescing test bodies untouched',o[o.index("test("):]==n[n.index("test("):])
p='tests/milestone100-20261114/source-stage8-immutable-prime.test.mjs';o=re.split(r'(?m)^test\(',text(BASE,p));n=re.split(r'(?m)^test\(',text(HEAD,p));check('8 remaining immutable-prime bodies untouched',len(o)==len(n)==10 and o[2:]==n[2:])
p='tests/milestone100-20261114/source-stage8-api-runtime-anchor.test.mjs';check('original6 API tests exactprefix',at(HEAD,p).startswith(at(BASE,p)))
r={'kind':'INDEPENDENT_COMPOSITE_FIXTURE_RECOVERY_STRUCTURAL_SECURITY_REVIEW','base':BASE,'candidate':HEAD,'guardRef':stage['guardRef'],'captureSHA256':hashlib.sha256(raw).hexdigest(),'priorAuthorityArrayCount':len(oldArrays),'priorDocsCaptureJSONCount':len(captures),'exactGuardBindings':len(verified),'newAcceptanceRecords':len(accepted),'blockingFindings':fail,'applicationSRCChanged':False,'ownerOnlyChanges':'retained historical authority tuple, exact new populated pin, API test count6to9','deadlineOrSecurityAssertionWeakeningFound':False,'testOrderChanged':False,'runtimeTestsRunByReviewer':False,'qualified':False,'requiredFollowup':['Full9 API controls after admission','Full mandatory40-child source verification','Complete115 source cases within unchanged150 seconds','Exact-head hosted CI and individual qualification reconciliation']}
Path('/tmp/worker3-fixture-recovery-independent-review.json').write_text(json.dumps(r,indent=2)+'\n');print(json.dumps(r,indent=2));assert not fail
