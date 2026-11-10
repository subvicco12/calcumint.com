"""Add only individually evidenced scoped candidates; never adjudicate canonical acceptance."""
from pathlib import Path
from collections import Counter
import hashlib,json,sys
OUT=Path('docs/remaining-five-20261110')
BASE='3c9fc6bdcedf053d2315470f8c0ee549d53bd5de'
IDS=[374,382,383,384,385]
BASE_COMPLETE=[370,371,372,373,377,378,379,386]
def read(path):return json.loads(Path(path).read_text())
def sha(path):return hashlib.sha256(Path(path).read_bytes()).hexdigest()
def write(name,data):
 text=json.dumps(data,indent=2)+'\n'
 if '--check' in sys.argv:assert (OUT/name).read_text()==text,name+' differs'
 else:(OUT/name).write_text(text)
team_path='docs/remaining-five-team-20261110/receipt.json'
native_path='docs/remaining-five-native-20261110/receipt.json'
team=read(team_path);native=read(native_path)
assert team['passed'] and not team['originalWorkflowRunPassed']
assert team['completedDownloads']==55 and [p['completedDownloads']for p in team['phases']]==[40,15]
assert [r['catalogId']for r in team['perId']]==IDS
assert native['passed'] and [r['catalogId']for r in native['observations']]==IDS
prior_path='docs/next-cohort-20261110/requirements-540.json'
ledger=read(prior_path);assert len(ledger['rows'])==540 and len({r['masterId']for r in ledger['rows']})==540
counts={'COMPLETE_AND_CERTIFIED':0,'IMPLEMENTED_REVIEW_PENDING':2,'IMPLEMENTED_TEST_GAPS':0,'PARTIALLY_IMPLEMENTED':495,'NOT_IMPLEMENTED':0,'IDENTITY_OR_SCOPE_BLOCKED':43}
assert dict(Counter(r['disposition']for r in ledger['rows']))=={k:v for k,v in counts.items()if v}
old={r['masterId']:r for r in read('docs/next-cohort-20261110/acceptance-8.json')['rows']}
rows=[]
for ident in IDS:
 source=old[ident];t=next(r for r in team['perId']if r['catalogId']==ident);n=next(r for r in native['observations']if r['catalogId']==ident)
 assert t['version']==n['version']==source['version']==(2 if ident==383 else 1)
 assert t['slug']==source['slug'];assert t['teamWorkflowEvidenceComplete'];assert t['remainingWithinThisTeamWorkflowScope']==[]
 criteria=[]
 for clause in source['criteria']:
  c=dict(clause)
  if c['clauseId']in['K-organizations-roles','K-client-project-share-template']:
   c.update(classification='GENUINE_INDIVIDUAL_ENGINEERING_EVIDENCE_NOT_APPROVAL',status='EXPLICIT_TWO_FIXTURE_WORKFLOW_ROLES_HISTORY_COMPARISON_RECOVERY_EXPORT_EVIDENCE_AVAILABLE')
  if c['clauseId']=='ci-and-evidence-integrity':c.update(status='NEW_FOCUSED_EVIDENCE_AVAILABLE_FINAL_EXACT_HEAD_CI_REQUIRED')
  criteria.append(c)
 assert len(criteria)==34
 rows.append({'masterId':ident,'title':source['title'],'engineId':source['engineId'],'slug':source['slug'],'version':source['version'],'offeredContract':source['offeredContract'],'nativeCatalog':source['nativeCatalog'],'before':'PARTIAL_INDIVIDUAL_BUSINESS_TEAM_UI_EVIDENCE_MISSING','afterBeforeFinalCI':'SCOPED_CURRENT_CONTRACT_ENGINEERING_CANDIDATE_PENDING_EXACT_HEAD_CI','engineeringCompleteEstablishedBeforeFinalCI':False,'appOrEngineSourceChanged':False,'individualTeam':t,'individualNativeBatchAndAutomation':n,'criteria':criteria,'remainingAuthority':source['remainingAuthority'],'evidenceLimits':['Team proof is two separately authenticated disposable development-runtime fixtures, not one uninterrupted successful original run.','Native batch proof uses actual production-built routes and genuine isolated Auth/PostgREST; lower publication availability is synthetic.','Signed webhook delivery uses a controlled local HTTP lower transport; no public HTTPS receiver qualification is claimed.','Retained old24personal journeys remain historical; current source/math/history bindings and separately current UI/browser receipts supplement them without relabelling execution.','Canonical full scope, formal source applicability, risk/precision/QA competent decisions and production operator attestations remain pending.'],'canonicalAccepted':False,'certificationGranted':False,'publicationEligible':False})
paths=[prior_path,'docs/next-cohort-20261110/acceptance-8.json',team_path,native_path,'docs/canonical-three-20261110/evidence-manifest.json','docs/remaining-five-20261110/baseline-ci.json','docs/remaining-five-20261110/operations-readonly-summary.json','docs/remaining-five-20261110/hosting-build-metadata.json']
write('acceptance-5.json',{'kind':'FIVE_INDIVIDUAL_SCOPED_ENGINEERING_CANDIDATES_NOT_CANONICAL_ACCEPTANCE','baselineSHA':BASE,'rows':rows,'sourceHashes':{p:sha(p)for p in paths},'baselineScopedEngineeringComplete':BASE_COMPLETE,'newScopedCandidatesPendingFinalCI':IDS,'newCanonicalAcceptance':0,'newCertification':0,'newPublicationEligible':0,'releaseHold':True})
for row in ledger['rows']:
 ident=row['masterId']
 if ident in BASE_COMPLETE:row['engineeringAssessment']='SCOPED_CURRENT_CONTRACT_ENGINEERING_COMPLETE_AT_GREEN_BASELINE_3c9fc6bd';row['engineeringEvidence']='docs/remaining-five-20261110/baseline-ci.json'
 elif ident in IDS:row['engineeringAssessment']='SCOPED_CURRENT_CONTRACT_CANDIDATE_PENDING_FINAL_EXACT_HEAD_CI';row['engineeringEvidence']='docs/remaining-five-20261110/acceptance-5.json'
 else:row['engineeringAssessment']='INHERITED_NOT_REASSESSED_THIS_CONTINUATION'
ledger.update(kind='UNCHANGED_540_CANONICAL_DISPOSITIONS_WITH_NEW_FIVE_SCOPED_ENGINEERING_CANDIDATES',baselineSHA=BASE,parentLedger=prior_path,parentSHA256=sha(prior_path),counts=counts,baselineScopedEngineeringCompleteIds=BASE_COMPLETE,newScopedEngineeringCandidates=IDS,engineeringOverlayBeforeFinalCI={'baselineScopedComplete':8,'newScopedCandidates':5,'otherNotReassessed':527},newCanonicalAcceptance=0,newCertification=0,newPublicationEligibility=0)
write('requirements-540.json',ledger)
print(json.dumps({'rows':540,'canonicalCounts':counts,'baselineScopedComplete':8,'newScopedCandidatesPendingFinalCI':IDS,'potentialScopedTotalAfterSuccessfulCI':13,'newCanonicalApprovals':0,'newPublicationEligible':0}))
