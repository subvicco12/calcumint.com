import subprocess,re,json,hashlib
from pathlib import Path
ROOT='/workspace/calcumint-worker3-recovery'; BASE='12d1bac81a0e01e46c8654f61c4f4a96ad26e92b'; HEAD='92633d8dac6dc5b6fd325e447ea488ec682331e5'
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
p='docs/next-engineering-20261115/source/guard-capture-warmup-recovery.json';raw=at(HEAD,p);cap=json.loads(raw);stage=cap['sourceStage10SourceWarmup'];retained=json.loads(at(BASE,stage['retainedCapturePath']))
check('retained capture hash',hashlib.sha256(at(BASE,stage['retainedCapturePath'])).hexdigest()==stage['retainedCaptureSHA256'])
check('historical capture fields',all(cap.get(k)==v for k,v in retained.items() if k not in ['currentSources','sourceStage10']))
oldSources={r['path']:r for r in retained['currentSources']};rows={r['path']:r for r in cap['currentSources']};guard=stage['guardPaths']
check('currentSources unchanged outside named guard',all(rows.get(k)==v for k,v in oldSources.items() if k not in guard))
check('guard roster finite8',len(guard)==8 and len(set(guard))==8)
verified=[]
for p in guard:
 r=rows[p];b=at(r['ref'],p);blob=git('rev-parse',r['ref']+':'+p).decode().strip();disk=Path(ROOT,p).read_bytes()
 check('guard '+p,r['ref']==stage['guardRef'] and r['blob']==blob and r['bytes']==len(b) and r['sha256']==hashlib.sha256(b).hexdigest() and b==at(HEAD,p)==disk);verified.append(r)
accepted=json.loads(re.search(r'export const acceptedStage10SourceWarmup=Object.freeze\((\[[\s\S]*?\])\);',new)[1]);expected=[{k:r[k] for k in ['path','blob','sha256']} for r in verified];expected.append({'path':'docs/next-engineering-20261115/source/guard-capture-warmup-recovery.json','blob':git('rev-parse',HEAD+':docs/next-engineering-20261115/source/guard-capture-warmup-recovery.json').decode().strip(),'sha256':hashlib.sha256(raw).hexdigest()})
sourceCap=json.loads(at(HEAD,stage['capturePath']));expected.extend({k:r['current'][k] for k in ['path','blob','sha256']} for r in sourceCap['rows']);check('41 exact new acceptance records',accepted==expected and len(accepted)==41)
p='tests/parallel-source-20261110/current.test.mjs';base=text(BASE,p);disk=Path(ROOT,p).read_text();oldtuple="const expectedAuthority={ref:'5330ad1d70534c202313a1adc8836c2050e3454b',blob:'18030baf7bbed974656160f0fcb1f42d773cb274',sha256:'6e7d551e205be06cbf67330b0b14d193f2bc035db255579f6ec3ed1d1785f5eb'};"
newtuple=oldtuple.replace('expectedAuthority','retainedStage10FixtureRecoveryAuthority')+"\nconst expectedAuthority={ref:'92633d8dac6dc5b6fd325e447ea488ec682331e5',blob:'500ad592c346ba0c52d012aab7c82f55ff5c3e7a',sha256:'95a94095b179789e73a998c8355bc9cebd80339a68ceb52ea6c502b73ed0fee6'};"
normalized=disk.replace(newtuple,oldtuple).replace(',retainedStage10FixtureRecoveryAuthority,expectedAuthority])',',expectedAuthority])')
marker="test('mandatory source guard regressions exercise exact source and immutable availability without skips'"
check('first96 bodies and source registration order unchanged',normalized[:normalized.index(marker)]==base[:base.index(marker)])
bq=base[base.index(marker):];nq=normalized[normalized.index(marker):]
check('original files counts and child command deadline/env/PGID body unchanged',bq[:bq.index(' const results=new Map()')]==nq[:nq.index(' const results=new Map()')])
check('cold first-alone phase preserved',bq[bq.index(' const results=new Map()'):bq.index(' const remaining=')]==nq[nq.index(' const results=new Map()'):nq.index(' const remaining=')])
check('original all-result report and assertions unchanged',bq[bq.index(' const failures=[];'):]==nq[nq.index(' const failures=[];'):])
check('pair bothsettledresults before2workerpool',"await Promise.all([record(scope),record(preload)]);" in nq and "await Promise.all([worker(),worker()]);assert.equal(results.size,files.length" in nq)
check('preload removedfrompool once',"pool=[...heavy,...companion].filter(row=>row!==preload).sort" in nq)
check('plan completeness and unique exactremainingnames asserted',"assert.equal(planned.length,remaining.length);assert.equal(new Set(planned).size,remaining.length);assert.deepEqual([...planned].sort(),remaining.map(([file])=>file).sort());" in nq)
check('populated authority tuple',git('rev-parse',HEAD+':'+A).decode().strip()=='500ad592c346ba0c52d012aab7c82f55ff5c3e7a' and hashlib.sha256(at(HEAD,A)).hexdigest()=='95a94095b179789e73a998c8355bc9cebd80339a68ceb52ea6c502b73ed0fee6')
p='tests/next-engineering-20261115/source-current32.test.mjs';check('opaque current32 fixture entire482bytes restored',at(HEAD,p)==at('482d5aedb5be11e2da836980a98fbfabaa5a5f16',p))
p='tests/completion-first-20261112/personal-stage.test.mjs';o=text(BASE,p);n=text(HEAD,p);old=" for(const row of JSON.parse(readFileSync(personalCapturePath)).rows){const path=row.path;retainedRuntimeBytes('tests/gotrue-runtime/acceptance.mjs');for(const bytes of [Buffer.from('changed after immutable warm'),sourceGit(['cat-file','blob',row.predecessor.blob])])assert.throws(()=>retainedRuntimeBytes('tests/gotrue-runtime/acceptance.mjs',p=>p===path?bytes:readFileSync(p)),/Current factory bytes differ/);}";first=n.index(' for(const row of JSON.parse(readFileSync(personalCapturePath)).rows){');last=n.index(' verifyCurrentRuntimeContext();',first);check('only one personal setup/control block modified',n[:first]+old+'\n'+n[last:]==o)
check('personal exact observed target refusals and postfailure NS recovery',"error.message.includes(path)" in n[first:last] and "assert.equal(visited,true" in n[first:last] and "assert(retainedRuntimeBytes(nsPath).equals(nsOld),'Default NS historical bytes recover after every personal source refusal');" in n[first:last])
r={'kind':'INDEPENDENT_FINAL_WARMUP_ADMISSION_AND_PAIRED_QUEUE_REVIEW','base':BASE,'candidate':HEAD,'guardRef':stage['guardRef'],'captureSHA256':hashlib.sha256(raw).hexdigest(),'priorAuthorityArrayCount':len(oldArrays),'priorDocsCaptureJSONCount':len(captures),'exactGuardBindings':len(verified),'newAcceptanceRecords':len(accepted),'blockingFindings':fail,'applicationSRCChanged':False,'ownerOnlyChanges':'retained5330 tuple/new92633 pin, existingpoolpriority, scope/preload pair and exactonce plan assertions','deadlineOrSecurityAssertionWeakeningFound':False,'testRegistrationOrderChanged':False,'childExecutionPriorityChanged':True,'scopePreloadPairedPhaseChanged':True,'preservedSourceGuardCaptureCount':67,'runtimeTestsRunByReviewer':False,'qualified':False,'requiredFollowup':['Full9 API controls after admission','Full mandatory40-child source verification','Complete115 source cases within unchanged150 seconds','Exact-head hosted CI and individual qualification reconciliation']}
Path('/tmp/worker3-warmup-final-independent-review.json').write_text(json.dumps(r,indent=2)+'\n');print(json.dumps(r,indent=2));assert not fail
