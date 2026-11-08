"""Apply bounded technical evidence to the retained 540 rows; no acceptance promotion."""
import hashlib,json,sys
from pathlib import Path
root=Path(__file__).resolve().parents[2]
base_path='docs/product-completion-20261108/inventory-540.json'
base_bytes=(root/base_path).read_bytes()
assert hashlib.sha256(base_bytes).hexdigest()=='8c3e60c9da8b5654b953569d351f7f6eaa3127ae8f7d3bb0692c72a558dba19a','Immutable baseline inventory differs'
base=json.loads(base_bytes)
prefix='docs/calculator-sprint-20261108/'
cohort_a=json.loads((root/(prefix+'cohort-boundary-repair.json')).read_text())['cohort']
cohort_b=json.loads((root/(prefix+'cohort-business-boundary-repair.json')).read_text())['cohort']
assert len(cohort_a)==29 and len(cohort_b)==36
cohort=cohort_a+cohort_b
business_ids={r['masterId'] for r in cohort_b}
business_observed={r['id']:r for r in json.loads((root/(prefix+'cohort-business-browser-report.json')).read_text())['profiles']}
authority=json.loads((root/(prefix+'authority-43.json')).read_text())['rows']
private=json.loads((root/'docs/cloud-batch06/implementation-manifest.json').read_text())['calculators']
cohort_ids={r['masterId'] for r in cohort};assert len(cohort_ids)==65
blocked={r['masterId']:i for i,r in enumerate(authority)};assert len(blocked)==43
profiles={r['masterId']:r for r in private}
rows=[]
for i,r in enumerate(base['rows']):
 ident=r['masterId'];assert ident==i+1
 if ident in cohort_ids:assert r['classification']=='PARTIALLY_IMPLEMENTED'
 row={'masterId':ident,'title':r['title'],'category':r['domain'],'disposition':r['classification'],
 'canonicalAccepted':False,'certificationGranted':False,'publicationEligibleEstablished':False,
 'inheritedEvidence':{'path':base_path+'#/rows/'+str(i),'rowSHA256':hashlib.sha256(json.dumps(r,separators=(',',':'),sort_keys=True).encode()).hexdigest()},
 'newBoundedEngineeringEvidence':[]}
 if ident in cohort_ids:
  profile={'definitionId':business_observed[ident]['actualProfileId'],'version':business_observed[ident]['calculatorVersion']} if ident in business_ids else profiles[ident]
  row['privateProfile']={'definitionId':profile['definitionId'],'version':profile['version'],'meaning':'Existing exact supplied private profile binding; not canonical identity adoption.'}
  row['newBoundedEngineeringEvidence']=[{'requirement':name,'status':'VERIFIED','scope':'PRIVATE_PROFILE_WORKFLOW_ONLY','evidence':[prefix+('cohort-business-boundary-repair.json' if ident in business_ids else 'cohort-boundary-repair.json'),prefix+('cohort-business-browser-report.json' if ident in business_ids else 'cohort-browser-report.json'),'tests/calculator-sprint-20261108/'+('cohort-business-boundary.test.tsx' if ident in business_ids else 'cohort-input-boundary.test.tsx')]} for name in ['serialized identity/version loss rejection','canonical legacy JSON replay and recovery','native exported output matches current engine result','Free/Pro/Business full mathematical artifact parity']]
 if ident in [1,51]:
  row['newBoundedEngineeringEvidence'].append({'requirement':'private exact-grid successor numerical identity and immutable replay','status':'VERIFIED','scope':'UNREGISTERED_PRIVATE_REMEDY_ONLY','evidence':[prefix+'financial-successor.json','src/lib/financial-successor/exact-grid-private.test.ts'],'registeredEngineChanged':False,'allocatedSuccessorVersion':None,'fullRoundingProof':'PENDING'})
 if ident in [432,440]:row['exactReviewPacket']=prefix+'first-two-packet.json#/rows/'+str([432,440].index(ident))
 if ident in blocked:row['authorityActionRegister']=prefix+'authority-43.json#/rows/'+str(blocked[ident])
 rows.append(row)
counts={k:sum(r['disposition']==k for r in rows) for k in base['summary']['classificationCounts']}
assert counts==base['summary']['classificationCounts'] and sum(counts.values())==540
value={'kind':'540_ROW_INHERITED_ACCEPTANCE_LEDGER_WITH_BOUNDED_TECHNICAL_DELTAS','baselineSHA':'6e5b8aa3dd07b1c57993c4cc8b6f1cf1be7ce2ef','baselineInventorySHA256':hashlib.sha256(base_bytes).hexdigest(),'releaseHold':True,'counts':counts,'newCanonicalAcceptances':0,'newEngineeringCompleteFullProducts':0,'newPublicationEligible':0,'sharedWorkflowProfilesImproved':65,'privateFinancialRemedyAssociations':2,'authorityBlockersResolved':0,'interpretation':'Technical requirement checks do not certify a calculator or resolve unreviewed full-contract scope. Existing requirements are inherited unchanged; no old UNKNOWN is silently promoted.','rows':rows}
text=json.dumps(value,indent=2)+'\n';target=root/(prefix+'requirements-540.json')
if '--check' in sys.argv:
 assert target.read_text()==text,'Sprint ledger differs from source-backed bounded deltas'
else:target.write_text(text)
print(json.dumps({'rows':540,'counts':counts,'sharedWorkflowProfilesImproved':65,'newCanonicalAcceptances':0,'authorityBlockersResolved':0}))
