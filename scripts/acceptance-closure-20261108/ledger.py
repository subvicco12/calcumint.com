"""Inherit the exact 540-row ledger; add scoped proofs without acceptance promotion."""
from pathlib import Path
import json,hashlib,sys
root=Path(__file__).resolve().parents[2]
parent='docs/calculator-sprint-20261108/requirements-540.json'
expected='78c92c956976542bfeea5ec38150ab002e9501a44a4afe67e60cfbd84d10e78a'
raw=(root/parent).read_bytes();assert hashlib.sha256(raw).hexdigest()==expected,'Retained540 ledger bytes changed'
base=json.loads(raw);prefix='docs/acceptance-closure-20261108/'
shared=json.loads((root/(prefix+'shared-workflow-evidence.json')).read_text());ids={r['masterId'] for r in shared['rows']};assert len(ids)==51
rows=[]
for index,inherited in enumerate(base['rows']):
 ident=inherited['masterId'];assert ident==index+1
 row={'masterId':ident,'title':inherited['title'],'category':inherited['category'],'disposition':inherited['disposition'],'canonicalAccepted':False,'certificationGranted':False,'publicationEligibleEstablished':False,'inheritedEvidence':{'path':parent+'#/rows/'+str(index),'rowSHA256':hashlib.sha256(json.dumps(inherited,separators=(',',':'),sort_keys=True).encode()).hexdigest()},'newScopedChecks':[]}
 if ident in ids:
  assert inherited['disposition']=='PARTIALLY_IMPLEMENTED'
  row['privateTechnicalProfile']={'id':'private.remaining.'+str(ident),'slug':'private-remaining-'+str(ident),'version':1,'meaning':'Existing supplied profile; not canonical adoption'}
  row['newScopedChecks'].append({'requirement':'Reject lossy raw numeric input before actual profile execution','status':'VERIFIED','scope':'INDIVIDUAL_PRIVATE_PROFILE_UI_AND_NATIVE_BROWSER','evidence':[prefix+'shared-workflow-evidence.json',prefix+'shared-browser-report.json','src/components/remaining-engineering-review.lossless.test.tsx']})
  row['newScopedChecks'].append({'requirement':'Replay text boundary rejects raw identity/revision loss without changing canonical legacy import','status':'VERIFIED' if ident==477 else 'PARTIAL','scope':'INDIVIDUAL_NATIVE_DOWNLOAD_REPLAY_HISTORY_PLAN_MOBILE' if ident==477 else 'SHARED_CALLER_FIX_WITHOUT_NEW_INDIVIDUAL_TAMPER_WITNESS','evidence':[prefix+'shared-browser-report.json',prefix+'shared-workflow-closure.md']})
 if ident in [1,51]:
  row['newScopedChecks'].append({'requirement':'Exact monetary successor and explicit immutable adoption preview','status':'VERIFIED','scope':'PROPOSED_UNREGISTERED_SUPPORTED_RESULT_METHOD_ONLY','registeredEngineChanged':False,'allocatedVersion':None,'competentPolicyAcceptance':'PENDING','fullDomainAcceptance':'PENDING','evidence':[prefix+'financial-review-packet.json',prefix+'financial-rounding-witnesses.json',prefix+'financial-independent-review.json','src/lib/financial-successor/decimal-rounding-private.test.ts']})
 if ident in [432,440]:
  row['newScopedChecks'].append({'requirement':'Genuine authenticated scenario retry, cross-owner denial, paid-plan revocation and immutable replay','status':'VERIFIED','scope':'DISPOSABLE_REPOSITORY_SCHEMA_GOTRUE_POSTGREST_PG17_6_NOT_PRODUCTION','evidence':[prefix+'first-two-auth-receipt.json',prefix+'first-two-acceptance-matrix.json']})
  row['newScopedChecks'].append({'requirement':'Publication/withdrawal failclosed through actual authority-reader composition','status':'VERIFIED','scope':'EXISTING_TARGETED_TEST_REUSE_WITH_SDK_BOUNDARY_AND_CONDITIONAL_REGISTRY_FIXTURE','evidence':[prefix+'first-two-publication-receipt.json']})
 rows.append(row)
counts={name:sum(row['disposition']==name for row in rows) for name in base['counts']};assert counts==base['counts'] and sum(counts.values())==540
value={'kind':'540_ROW_INHERITED_LEDGER_WITH_EXACT_SCOPE_DELTAS','baselineSHA':'3350a313ebc6b5300757e64ae4c125af29bdfdb3','parentLedger':parent,'parentLedgerSHA256':expected,'counts':counts,'newFullEngineeringComplete':0,'newCanonicalAcceptances':0,'newCertifications':0,'newPublicationEligible':0,'newWorkflowProfilesImproved':51,'cumulativePrivateWorkflowProfilesImproved':116,'newAuthenticatedScopeClosure':[432],'retainedAuthenticatedScopeRegression':[440],'authorityBlockersResolved':0,'releaseHold':True,'interpretation':'No automated check is competent approval. Original full-scope unknown/partial/blocked requirements are inherited unchanged. #477 has precise full-contract/adoption authority blocker in shared-workflow-closure.md; financial proposals have numerical/work-domain and policy/adoption gates.','rows':rows}
text=json.dumps(value,indent=2)+'\n';target=root/(prefix+'requirements-540.json')
if '--check' in sys.argv:assert target.read_text()==text,'Acceptance closure ledger differs from scoped source evidence'
else:target.write_text(text)
print(json.dumps({'rows':540,'counts':counts,'newWorkflowProfiles':51,'newPublicationEligible':0}))
