"""Offline evidence/admission audit only. No calculator implementation or approvals."""
import argparse, collections, hashlib, io, json, pathlib, zipfile
ROOT=pathlib.Path('docs/partial16-ci-recovery')
EXPECTED_SHA='d49d5a60737546dc8208ff5d1cbfb68740b3e153da3ca56501a7966f290fc1c3'
IDS=[9,19,20,23,95,97,98,112,120,128,129,130,132,199,204,527]
CANDIDATES=[9,20,23,95,97,98,112,132,199,204]
PARTIAL=[19,120,128,129,130]
def digest(data):return hashlib.sha256(data).hexdigest()
def manifest(z):
 if z.testzip() is not None:raise ValueError('Archive CRC failure')
 m=json.loads(z.read('MANIFEST-SHA256.json'))
 if set(z.namelist())!=set(m)|{'MANIFEST-SHA256.json'}:raise ValueError('Uncovered archive members')
 for name,value in m.items():
  if digest(z.read(name))!=value:raise ValueError('Member hash mismatch:'+name)
 return len(m)
def audit(path):
 raw=path.read_bytes()
 if digest(raw)!=EXPECTED_SHA:raise ValueError('Source archive SHA256 mismatch')
 z=zipfile.ZipFile(io.BytesIO(raw));count=manifest(z);assert count==53
 get=lambda name:json.loads(z.read(name))
 original=zipfile.ZipFile(io.BytesIO(z.read('input-authority43/CalcuMint_43_Authority_Resolution_2026-10-30.zip')));assert manifest(original)==36
 assert digest(z.read('input-authority43/CalcuMint_43_Authority_Resolution_2026-10-30.zip'))=='5d608c2e26262da2a5edc3c540a081ea0c829f2b4be4e8f3d52abb70b73c61e7'
 authority=get('input-authority43/resolution-register-43.json')['rows'];old={r['masterId']:r for r in authority};assert len(old)==43
 rows=get('source-resolution-register-16.json')['rows'];tasks=get('conditional-codex-tasks-16.json')['rows'];assert [r['masterId'] for r in rows]==[r['masterId'] for r in tasks]==IDS
 assert [r['masterId'] for r in rows if r['conditionalEngineCandidate']]==CANDIDATES
 assert [r['masterId'] for r in rows if r['disposition']=='SOURCE_PARTIAL']==PARTIAL
 assert collections.Counter(r['disposition'] for r in rows)=={'SOURCE_RESOLVED_BOUNDED':11,'SOURCE_PARTIAL':5}
 for r in rows:
  assert r['title']==old[r['masterId']]['title']
  for field in ['ownerAdopted','actualEngineAcceptance','fullCanonicalSourceAuthorityAccepted','certificationAuthorized','publicationAuthorized','readyAfterCISuccessAlone']:assert r[field] is False,(r['masterId'],field)
  assert r['releaseHold'] is True
 for r in tasks:assert r['implementationNowAuthorized'] is False and r['afterCIAloneReady'] is False
 cohorts={}
 for name,label in [('unchanged-policy-cohort-13.json','policy'),('unchanged-qualified-cohort-13.json','qualified')]:
  selected=get(name)['rows'];assert len(selected)==13
  for r in selected:assert r==old[r['masterId']]
  cohorts[label]=[r['masterId'] for r in selected]
 assert len(set(IDS+cohorts['policy']+cohorts['qualified']+[485]))==43
 delivered=[];omitted=[]
 for r in get('SOURCE-CAPTURE-HASHES.json')['records']:
  name=r['researchWorkspacePath']
  if name in z.namelist():
   data=z.read(name);assert digest(data)==r['sha256'] and len(data)==r['bytes'],name;delivered.append(name)
  else:omitted.append(name)
 assert len(delivered)==15 and len(omitted)==33
 for r in get('uk-capture-index.json'):
  name=pathlib.PurePosixPath(r['capturePath']).name;assert digest(z.read(name))==r['sha256'],name
 ira=[]
 for r in get('ira-captures/hash-register.json').values():
  name=r['readableCapture'].split('partial16-20261030/',1)[-1];assert digest(z.read(name))==r['sha256'];ira.append(name)
 assert len(ira)==4
 for r in get('candidate-evidence/exact-github-file-hashes.json'):
  data=z.read('candidate-evidence/'+r['path']);local=pathlib.Path('docs/authority485')/r['path'];assert local.read_bytes()==data
  assert digest(data)==r['sha256'];assert hashlib.sha1(b'blob '+str(len(data)).encode()+b'\0'+data).hexdigest()==r['gitBlobSHA']
 queue=[]
 for r in tasks:
  if r['masterId'] in CANDIDATES:queue.append({'masterId':r['masterId'],'title':r['title'],'sourceDisposition':r['sourceDisposition'],'boundedContract':r['proposedContract'],'exactConditions':r['conditions'],'independentExampleSpecifications':r['independentExampleSpecifications'],'implementationAdmitted':False,'reason':'Exact-head CI failed twice by timeout; packet owner adoption/mapping/applicability gates remain pending. No adoption inferred from an instruction to evaluate prerequisites.'})
 golf=next(r for r in tasks if r['masterId']==527)
 return {'schemaVersion':1,'archiveSHA256':EXPECTED_SHA,'zipCRCVerified':True,'memberHashesVerified':53,'nestedAuthority43MemberHashesVerified':36,'exact16Ids':IDS,'sourceDispositions':{'SOURCE_RESOLVED_BOUNDED':11,'SOURCE_PARTIAL':5},'candidateCount':10,'conditionalCandidateIds':CANDIDATES,'sourcePartialIds':PARTIAL,'sourceCaptureCounts':{'listed':48,'verifiedDelivered':15,'omittedNotVerifiable':33},'verifiedDeliveredCapturePaths':delivered,'omittedCapturePaths':omitted,'ukCaptureHashesVerified':13,'iraMarkdownHashesVerified':4,'hashMeaning':'Delivered extraction/structured-response/markdown hashes are verified. Omitted capture hashes cannot be verified here. Neither is a publisher-byte identity claim.','unchangedPolicyCohort':cohorts['policy'],'unchangedQualifiedCohort':cohorts['qualified'],'component485Unchanged':True,'candidates':queue,'nationalProfile527':{'implementationAdmitted':False,'conditions':golf['conditions'],'boundedMethod':golf['proposedContract']},'implementationAdmitted':0,'canonicalAccepted':False,'certificationAuthorized':False,'publicationAuthorized':False,'releaseHold':True}
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--input',type=pathlib.Path,default=ROOT/'input/source-resolution-16.zip');p.add_argument('--check',action='store_true');args=p.parse_args();result=audit(args.input);text=json.dumps(result,indent=2,ensure_ascii=False)+'\n';target=ROOT/'source-audit.json'
 if args.check:
  if target.read_text()!=text:raise SystemExit('Stale source-admission audit')
 else:target.write_text(text)
 print('PASS 53 member hashes; exact16/10conditional/5partial;15supplied source captures,33omitted; zero calculator implementations admitted')
