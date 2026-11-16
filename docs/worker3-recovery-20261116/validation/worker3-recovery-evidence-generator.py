#!/usr/bin/env python3
"""Documentation-only recovery evidence generator. Promotion requires explicit frozen-head input."""
import argparse,copy,hashlib,json,pathlib,subprocess,sys
P=argparse.ArgumentParser();P.add_argument('--repo',required=True);P.add_argument('--frozen-config');a=P.parse_args()
R=pathlib.Path(a.repo).resolve(); D=R/'docs/worker3-recovery-20261116';D.mkdir(parents=True,exist_ok=True)
def sha(b):return hashlib.sha256(b).hexdigest()
def git(*args):return subprocess.check_output(['git','-C',str(R),*args],text=True).strip()
def blob(ref,p):return subprocess.check_output(['git','-C',str(R),'show',ref+':'+p])
def read(p):return json.loads(pathlib.Path(p).read_text())
def bind(p):
 p=pathlib.Path(p);p=p if p.is_absolute() else R/p
 return {'path':str(p.relative_to(R)) if p.is_relative_to(R) else str(p),'bytes':p.stat().st_size,'sha256':sha(p.read_bytes())}
def put(name,obj): (D/name).write_text(json.dumps(obj,indent=2,ensure_ascii=False)+'\n')
base=read(R/'docs/next-engineering-20261115/candidate-dispositions.json');rec=read(D/'candidate-reconciliation.json')
ids=[*range(284,292),300,329,*range(333,343)]
assert sorted(r['catalogId'] for r in base['rows'])==ids
assert not set(ids)&set(base['prior80']+[226]+base['excludedAuthority43']+[322,323,324,325,327])
assert len(base['prior80'])==80 and len(base['excludedAuthority43'])==43
expectedIdentities={284: ('statistics.z-score', 'z-score-calculator'), 285: ('statistics.confidence-interval', 'confidence-interval-calculator'), 286: ('statistics.sample-size', 'sample-size-calculator'), 287: ('statistics.probability', 'probability-calculator'), 288: ('statistics.permutation', 'permutation-calculator'), 289: ('statistics.combination', 'combination-calculator'), 290: ('statistics.binomial-probability', 'binomial-probability-calculator'), 291: ('statistics.normal-distribution', 'normal-distribution-calculator'), 300: ('statistics.bayes-theorem', 'bayes-theorem-calculator'), 329: ('chemistry.molality', 'molality-calculator'), 333: ('chemistry.ph', 'ph-calculator'), 334: ('chemistry.ideal-gas-law', 'ideal-gas-law-calculator'), 335: ('chemistry.gas-density', 'gas-density-calculator'), 336: ('chemistry.percent-composition', 'percent-composition-calculator'), 337: ('chemistry.solution-concentration', 'solution-concentration-calculator'), 338: ('chemistry.stoichiometry', 'stoichiometry-calculator'), 339: ('chemistry.half-life', 'half-life-calculator'), 340: ('chemistry.nernst-equation', 'nernst-equation-calculator'), 341: ('chemistry.beer-lambert-law', 'beer-lambert-law-calculator'), 342: ('chemistry.titration', 'titration-calculator')}
head=git('rev-parse','HEAD');branch=git('branch','--show-current')
gates={};errors=[]
def check(name,ok,detail):gates[name]={'passed':bool(ok),'detail':detail};errors.extend([] if ok else [name])
check('unchangedWorkflow',blob(head,'.github/workflows/ci.yml')==blob('50240fb1d59a1f8d298718f85e58bd55b4b990c2','.github/workflows/ci.yml'),'Exact workflow bytes retained')
for scope in ['.github','supabase/migrations','docs/milestone100-20261114/requirements-540.json']:
 check('protectedDiff-'+scope,not git('diff','--name-only','419d56c17ca72dae58132aa00c7424b07477aa6c',head,'--',scope),'No protected-scope diff')
cp='docs/next-engineering-20261115/candidate-dispositions.json'
check('originalCandidateBytes',(R/cp).read_bytes()==blob('419d56c17ca72dae58132aa00c7424b07477aa6c',cp)==blob(head,cp),bind(cp))
ledger=read(R/'docs/milestone100-20261114/requirements-540.json')
# Canonical row serialization matches the historical per-row binding, independently of JSON whitespace.
def locate(node,key):
 if isinstance(node,dict):
  if node.get('masterId')==key or node.get('catalogId')==key or node.get('id')==key:return node
  for v in node.values():
   z=locate(v,key)
   if z is not None:return z
 if isinstance(node,list):
  for v in node:
   z=locate(v,key)
   if z is not None:return z
 return None
for row in base['rows']:
 identity=row['identity'];i=row['catalogId'];engine=identity['engineId']
 check('identity-'+str(i),identity['version']==1 and identity['sourceVersion']=='factory-wave1-20261112.1/'+engine+'@1/private.next-engineering.20261115.1' and (engine,identity['slug'])==expectedIdentities[i],identity)
 lr=locate(ledger,i);check('ledgerRow-'+str(i),lr is not None and sha(json.dumps(lr,separators=(',',':'),ensure_ascii=False).encode())==row['ledgerBinding']['rowSha256'],row['ledgerBinding'])
 p=row['engineBinding']['path'];check('engine-'+str(row['catalogId']),sha((R/p).read_bytes())==row['engineBinding']['sha256'],bind(p))
 for e in row['localEvidence']:check('publisher-'+str(row['catalogId'])+'-'+e['path'],sha((R/e['path']).read_bytes())==e['sha256'],bind(e['path']))
 # Entire canonical ledger must remain byte-identical to the admitted original CODE.
# Bind original identity/source-version producers and raw source captures.
for p in ['src/lib/calculator-factory/completion/next-engineering-statistics-a.ts','src/lib/calculator-factory/completion/next-engineering-statistics-b.ts','src/lib/calculator-factory/completion/next-engineering-chemistry-a.ts','src/lib/calculator-factory/completion/next-engineering-chemistry-b.ts','src/lib/calculator-factory/completion/next-engineering-core.ts']:
 check('identitySourceVersion-'+p,(R/p).read_bytes()==subprocess.check_output(['git','-C',str(R),'show','50240fb1d59a1f8d298718f85e58bd55b4b990c2:'+p]),bind(p))
for p in ['docs/next-engineering-20261115/source/stage10-current32.json','docs/next-engineering-20261115/source/guard-capture-current32.json']:
 check('current32Capture-'+p,(R/p).read_bytes()==subprocess.check_output(['git','-C',str(R),'show','67ecffa8397c7344888b68448ef4ee1d66d526e1:'+p]),bind(p))
source32=read(R/'docs/next-engineering-20261115/source/stage10-current32.json')
check('source32ExactApplicationCapture',source32['codeRef']=='50240fb1d59a1f8d298718f85e58bd55b4b990c2' and len(source32['rows'])==32 and all(sha((R/r['path']).read_bytes())==r['current']['sha256'] and r['current']['ref']==source32['codeRef'] for r in source32['rows']),{'codeRef':source32['codeRef'],'rows':len(source32['rows'])})
check('sourceDiffExactly 32',set(git('diff','--name-only','3ccdd6d026ca0ec51063ff4501901ac92e8ace6a',head,'--','src').splitlines())=={r['path'] for r in source32['rows']},'Exact current32 src path set')
check('expectedRepository',git('remote','get-url','origin')=='https://github.com/subvicco12/calcumint.com.git','calcumint.com origin')
check('canonicalLedgerUnchanged',(R/'docs/milestone100-20261114/requirements-540.json').read_bytes()==subprocess.check_output(['git','-C',str(R),'show','419d56c17ca72dae58132aa00c7424b07477aa6c:docs/milestone100-20261114/requirements-540.json']),'No accepted-ledger edits')
B=pathlib.Path('/tmp/calcumint-worker3-business-refresh');business={}
if B.exists():
 for f in ['receipt.json','execution.json','cleanup.json','source-bindings.json','dependency-map-125.json']:
  (D/'business-refresh').mkdir(exist_ok=True);(D/'business-refresh'/f).write_bytes((B/f).read_bytes());business[f]=read(B/f)
 bm=business['dependency-map-125.json'];check('business125SourceBindings',len(bm)==125 and all(sha((R/p).read_bytes())==s for p,s in bm.items()),{'count':len(bm),'file':'business-refresh/dependency-map-125.json'})
 check('businessHeldSQLUnchanged',all(sha((R/p).read_bytes())==s for p,s in business['source-bindings.json']['heldSQLHashes'].items()),business['source-bindings.json']['heldSQLHashes'])
 br=business['receipt.json'];be=business['execution.json'];bc=business['cleanup.json']
 check('businessRefreshed',br['passed'] is True and be['exitStatus']==0 and br['productionWrites'] is False and br['sqlActivated'] is False and bc['containersMatchBefore'] and bc['networksMatchBefore'],{'sourceHead':be['sourceHead'],'elapsedSeconds':be['elapsedSeconds'],'fixtureOnly':True})
else:check('businessRefreshed',False,'Missing genuine refresh receipts')
config=read(a.frozen_config) if a.frozen_config else None
check('explicitFrozenHeadProvided',bool(config),'Never derive a promotable head from the current branch')
if config:
 check('rootExplicitIndividualQualificationDecision',config.get('rootQualificationDecision')=='QUALIFY_SCOPED_20_AFTER_INDIVIDUAL_REVIEW','Root must separately evaluate all per-ID contracts and normative hosted evidence; CI success alone does not qualify')
 check('frozenHeadAndBranch',config['frozenHead']==head and config['evidenceBranch']==branch,{'expectedHead':config['frozenHead'],'actualHead':head,'branch':branch})
 check('candidateSource32Frozen',config['sourceCaptureHead']=='50240fb1d59a1f8d298718f85e58bd55b4b990c2' and config['sourceCount']==32,'Frozen current32 capture, not historical26 or future39')
 for field in ['ciRun','ciJobs','ciWorkflow']:
  p=config[field];(D/'ci').mkdir(exist_ok=True);(D/'ci'/(field+'.json')).write_bytes(pathlib.Path(p).read_bytes())
 run=read(config['ciRun']);jobs=read(config['ciJobs']);wf=read(config['ciWorkflow']);jobs=jobs['jobs'] if isinstance(jobs,dict) else jobs
 check('exactHeadHostedCI',run['repository']['full_name']=='subvicco12/calcumint.com' and run['path']=='.github/workflows/ci.yml' and run['id']==config['runId'] and run['head_sha']==head and run['head_branch']==config['candidateBranch'] and run['event']=='workflow_dispatch' and run['status']=='completed' and run['conclusion']=='success' and run['workflow_id']==357576907 and run['run_attempt']==config['runAttempt'],{'runId':run['id'],'attempt':run['run_attempt'],'head':run['head_sha']})
 names=['checks','build','full-product','source-acceptance','publication-factory','validate']
 check('allSixUniqueJobs',len(jobs)==6 and sorted(j['name'] for j in jobs)==sorted(names) and len({j['id'] for j in jobs})==6 and all(j['status']=='completed' and j['conclusion']=='success' and all(k in j for k in ['run_id','head_sha','run_attempt']) and j['run_id']==run['id'] and j['head_sha']==head and j['run_attempt']==config['runAttempt'] for j in jobs),'Exactly six completed successful unique jobs, same run/attempt/head')
 check('workflowIdentity',wf['id']==357576907 and wf['path']=='.github/workflows/ci.yml','Unchanged mandatory workflow identity')
 # Coordinator supplies signed-off, head-bound assertions only after examining actual artifacts.
 required=['sourceAdmissionAndSecurity','freshGitTransportCorrectness','originalApi5000ms','originalUiBudget','mandatorySource150s','deliveryActualUiJsonCsvPdfEmbedBatch','all20ScopedContracts','remoteFrozenBranchProof','originalExclusionsAndPhysicsHeld']
 for name in required:
  q=config['gateReceipts'].get(name,{});p=pathlib.Path(q.get('path','/nonexistent'))
  valid=p.is_file() and sha(p.read_bytes())==q.get('sha256') and q.get('passed') is True and q.get('testedHead')==head
  facts=read(p) if valid else {}
  if 'gates' in facts:facts=facts['gates'].get(name,{})
  valid=valid and facts.get('testedHead')==head and facts.get('passed') is True and facts.get('sourceCaptureHead')=='50240fb1d59a1f8d298718f85e58bd55b4b990c2'
  if name in ['originalApi5000ms','originalUiBudget']:valid=valid and facts.get('exitStatus')==0 and facts.get('selectedCases')==1 and facts.get('passedCases')==1 and facts.get('skippedCases')==0 and isinstance(facts.get('elapsedMs'),(int,float)) and 0<facts['elapsedMs']<=5000 and facts.get('budgetMs')==5000
  elif name=='mandatorySource150s':valid=valid and facts.get('exitStatus')==0 and facts.get('testCount')==115 and facts.get('passedTests')==115 and facts.get('failedTests')==0 and facts.get('skippedTests')==0 and isinstance(facts.get('elapsedMs'),(int,float)) and 0<facts['elapsedMs']<=150000 and facts.get('budgetMs')==150000
  elif name=='remoteFrozenBranchProof':valid=valid and facts.get('repository')=='subvicco12/calcumint.com' and facts.get('branch')==config['candidateBranch'] and facts.get('remoteHead')==head and facts.get('commandExitStatus')==0
  elif name=='deliveryActualUiJsonCsvPdfEmbedBatch':valid=valid and set(facts.get('surfaces',[]))=={'ui','json','csv','pdf','embed','batch'} and sorted(facts.get('catalogIds',[]))==ids and facts.get('failedTests')==0 and facts.get('metadataTamperRefused') is True and facts.get('legacy69FingerprintsUnchanged') is True
  elif name=='all20ScopedContracts':valid=valid and sorted(facts.get('catalogIds',[]))==ids and facts.get('failedContracts')==0 and facts.get('unqualifiedContracts')==0 and facts.get('perIdMatrixReviewed') is True
  elif name=='originalExclusionsAndPhysicsHeld':valid=valid and facts.get('prior80')==base['prior80'] and facts.get('additionalPriorId')==226 and facts.get('authorityBlocked43')==base['excludedAuthority43'] and facts.get('physicsHeld')==[322,323,324,325,327] and facts.get('canonicalChanges')==0
  elif name=='freshGitTransportCorrectness':valid=valid and facts.get('failedTests')==0 and facts.get('skippedTests')==0 and facts.get('correctnessTests')==14 and facts.get('lifecycleTests')==6 and facts.get('streamTests')==1 and facts.get('ownedProcessGroupPreserved') is True and facts.get('freshPerQuery') is True
  elif name=='sourceAdmissionAndSecurity':valid=valid and facts.get('sourceCount')==32 and facts.get('sourceAdmissionExitStatus')==0 and facts.get('failedTests')==0 and facts.get('skippedTests')==0 and facts.get('historicalAuthoritiesRetained') is True and facts.get('callbackSecurityUnchanged') is True
  check(name,valid,q)
  if p.is_file():
   (D/'qualification-receipts').mkdir(exist_ok=True);(D/'qualification-receipts'/(name+p.suffix)).write_bytes(p.read_bytes())
 sb=config.get('source32Bindings',{});expected={r['path'] for r in source32['rows']}
 check('source32Bindings',set(sb)==expected and len(sb)==32 and all(isinstance(v,dict) and set(v)=={'blob','bytes','sha256'} and v['sha256']==sha((R/p).read_bytes()) and v['bytes']==len((R/p).read_bytes()) and v['blob']==git('rev-parse',head+':'+p)==git('rev-parse','50240fb1d59a1f8d298718f85e58bd55b4b990c2:'+p) and blob(head,p)==blob('50240fb1d59a1f8d298718f85e58bd55b4b990c2',p)==(R/p).read_bytes() for p,v in sb.items()),'Exactly 32 paths, blob/byte-count/SHA bound to50240 and finalHEAD')
 put('frozen-input.json',config)
supp=D/'sources/root-coefficient-review.json'
if supp.is_file():
 review=read(supp);imagePath=D/'sources/ams55-page299-mirror.jpg'
 check('supplementary291CoefficientProvenance',sha(supp.read_bytes())=='afe2433851dbfc70b7c7d1d285d8016d3762d16f7d2e6d7b61fcca4b2e99c8d2' and sha(imagePath.read_bytes())=='ec184caf269b7905c640c2bba439b0f93ceeabd46cdbfead478a80efe78a90b5' and review['allSixCoefficientLiteralsAndSignsMatch'] and review['rootIndependentlyViewedImage'] and review['publisherHostClaim'] is False and review['globalJavaScriptFloatingPointErrorCertified'] is False,bind(supp))
qualified=not errors
stats=read(D/'review/calcumint-worker3-statistics-audit.json');chem=read(D/'review/calcumint-worker3-chemistry-audit.json');audits={r.get('catalogId',r.get('id')):r for r in stats['rows']+chem['rows']}
rows=[]
for original in base['rows']:
 r=copy.deepcopy(original);i=r['catalogId'];audit=audits[i]
 r['disposition']='QUALIFIED_SCOPED_ENGINEERING' if qualified else 'IMPLEMENTED_NOT_QUALIFIED'
 r['scopeAudit']=audit.get('scopeAudit',audit.get('scope'));r['numericalQuality']=audit.get('numericalQuality',audit.get('publisherRelevanceAudit'))
 r['contractMatrix']=audit.get('sharedContractMatrix',audit.get('commonContracts',{}))
 r['contractMatrixHistoricalAudit']=True
 if i==291:
  r['supplementaryCoefficientSourceGate']={'status':'COEFFICIENT_LITERALS_AND_ERFC_ALGEBRA_MATCH_PRIMARY_PRINTED_FORMULA_ROOT_REVIEWED','publisherHosting':'UBC university mirror, not NIST-hosted retrieval','historicalAuditPreserved':True,'rootReview':bind(D/'sources/root-coefficient-review.json'),'sourceBinding':bind(D/'sources/coefficient-source-binding.json'),'scan':bind(D/'sources/ams55-page299-mirror.jpg'),'publishedRealErfBound':1.5e-7,'conditionalExactRealCdfBound':7.5e-8,'globalJavaScriptFloatingPointBoundCertified':False,'sharedQualificationGranted':False}
 r['reusedNumericalReceiptBindings']=[bind(p) for p in [original['receipts']['focused']]+[str(p.relative_to(R)) for p in (R/original['receipts']['lane']).rglob('*') if p.is_file()]]
 r['deliveryGate']={'repairSource':'50240fb1d59a1f8d298718f85e58bd55b4b990c2','gate':'deliveryActualUiJsonCsvPdfEmbedBatch','passed':gates.get('deliveryActualUiJsonCsvPdfEmbedBatch',{}).get('passed',False),'repair':'Compiled scoped metadata now reaches actual UI, versioned JSON report envelope, CSV, PDF, embed and batch; unchanged immutable snapshot and legacy replay retained. New evidence required separately from historical audit.'}
 r['businessGate']={'passed':gates.get('businessRefreshed',{}).get('passed',False) and gates.get('business125SourceBindings',{}).get('passed',False),'receipt':'business-refresh/receipt.json','sourceBindings':'business-refresh/dependency-map-125.json','productionEquivalence':'UNKNOWN','sqlActivated':False}
 r['testedHead']=config['frozenHead'] if config else None;r['sharedGatesPassed']=qualified
 r['limitations']=list(original.get('limitations',[]))+(['Rounded inherited critical-value table; no ideal-normal coverage claim.'] if i==285 else [])+(['Rounded inherited critical-value table; five ideal-ceil witnesses demonstrate rounding effects. No ideal minimum-sample-size or coverage claim.'] if i==286 else [])+(['Historical coefficient provenance was UNQUALIFIED. New supplementary primary printed AMS55 page 299 formula 7.1.26 evidence matches all six coefficients and erfc algebra, independently viewed by root, via UBC mirror. Published real-erf error <=1.5e-7 and conditional exact-real CDF error <=7.5e-8 are not a global JavaScript/IEEE754 error bound. Finite |z|<=4 grid remains finite-grid evidence.'] if i==291 else [])+(['No uniform numerical accuracy claim across entire accepted binomial domain.'] if i==290 else [])
 rows.append(r)
put('dispositions.json',{'kind':'WORKER3_RECOVERY_SCOPED_ENGINEERING_DOCUMENTATION_ONLY','testedHead':config['frozenHead'] if config else None,'confirmedEngineeringBaseline':81,'newConfirmedEngineering':20 if qualified else 0,'engineeringTotal':101 if qualified else 81,'potentialTotal':101,'historicalBaseline80Preserved':True,'canonicalCountsChanged':False,'certified':False,'publicationEligible':False,'releaseHold':True,'productionChanges':False,'PR1538Modified':False,'gates':gates,'blockedGates':errors,'exclusions':{'prior80':base['prior80'],'priorAdditional226':226,'authorityBlocked43':base['excludedAuthority43'],'physicsHeld':[322,323,324,325,327]},'rows':rows})
files=[p for p in D.rglob('*') if p.is_file() and p.name!='receipt-manifest.json'];put('receipt-manifest.json',{'kind':'SHA256_DOCUMENTATION_RECEIPT_MANIFEST','files':[bind(p) for p in sorted(files)]})
print(json.dumps({'qualified':qualified,'engineeringTotal':101 if qualified else 81,'blockedGates':errors,'output':str(D)}))
