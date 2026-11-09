"""Exact-five evidence overlay; never certifies, publishes or rewrites prior ledgers."""
import hashlib,json,pathlib,sys
root=pathlib.Path(__file__).resolve().parents[2]
base=root/'docs/first-five-20261109/requirements-540.json'; prior=json.loads(base.read_text()); review=json.loads((root/'docs/five-full-contract-20261109/contract-review.json').read_text())
ids=[370,371,372,373,386]
evidence={
 'original_math_and_replay':['docs/first-five-20261109/NUMERICAL-ENVELOPE.md','docs/first-five-20261109/authenticated/receipt.json'],
 'batch_local':['docs/five-full-contract-20261109/batch/receipt.json','docs/five-full-contract-20261109/performance/receipt.json'],
 'native_api_embed_jobs':['docs/five-native-auth-20261109/receipt-identity-corrected.json','docs/five-native-auth-20261109/final-schema/receipt-identity-corrected.json','docs/first-five-native-20261109/current-delivery-packet.json'],
 'shared_workspace':['docs/first-five-full-contract-20261109/sharing/authenticated/receipt.json','docs/first-five-full-contract-20261109/sharing/workflows/receipt.json','docs/first-five-full-contract-20261109/sharing/plan-entitlements/receipt.json'],
 'interface_and_pdf':['docs/five-interface-qa-20261109/browser.json','docs/five-interface-qa-20261109/pdf.json'],
 'source_integrity':['docs/publication-workflows-20261109/source-successors/business/automation-integration-validation.json','docs/publication-workflows-20261109/source-successors/business/validation.json','docs/publication-workflows-20261109/source-successors/fresh-shallow-audit.json']}
for paths in evidence.values():
 for p in paths:assert (root/p).is_file(),p
facts={p:hashlib.sha256((root/p).read_bytes()).hexdigest() for paths in evidence.values() for p in paths}
for p in [evidence['native_api_embed_jobs'][0],evidence['native_api_embed_jobs'][1],evidence['shared_workspace'][1],evidence['interface_and_pdf'][0]]:
 assert json.loads((root/p).read_text())['passed'] is True,p
rows=[]
authority={'identity-full-contract','B-forward-math-rounding','editorial-methodology-source','source-risk-rule-applicability','certification-lifecycle'}
conditional={'K-brand-builder','K-lead-capture','ai-boundary'}
for before in review['rows']:
 clauses=[]
 for clause in before['outstandingClauses']:
  after={'engineering':'IMPLEMENTED_AND_SCOPED_ISOLATED_PROOF_AVAILABLE','approval':'NOT_GRANTED','remaining':'Exact-head final validation and competent requirement-specific acceptance remain separate.'}
  if clause['clauseId'] in authority:after.update(remaining='Authorized competent/canonical/source decision; existing engineering evidence does not sign or certify.',classification='COMPETENT_REVIEW_OR_SOURCE_AUTHORITY')
  elif clause['clauseId']=='ops-recovery-custody-deployment':after.update(engineering='ISOLATED_SOFTWARE_REHEARSAL_ONLY',remaining='Actual responsible operator writer/freeze/recovery/custody/deployment/schema attestations and separate release authorization.',classification='OPERATIONAL_DEPENDENCY')
  elif clause['clauseId']=='ci-and-evidence-integrity':after.update(engineering='CURRENT_SOURCE_GUARDS_VERIFIED_FINAL_CI_REQUIRED',remaining='Five mandatory exact-head CI jobs and aggregate must succeed; final external checkpoint establishes completion.',classification='QA_EVIDENCE_PENDING_EXACT_HEAD_CI')
  elif clause['clauseId'] in conditional:after.update(engineering='EXISTING_PLATFORM_OR_CONDITIONAL_SCOPE_RETAINED',remaining='No blanket N/A: existing builder remains a platform facility, organization branding is rendered in embeds, lead capture is conditional on consent/appropriateness, grounded AI is optional and cannot supply mathematics.',classification='DOCUMENTED_APPLICABILITY_NO_AUTOMATIC_WAIVER')
  else:after['classification']='ENGINEERING_AND_QA_EVIDENCE_AVAILABLE_NOT_COMPETENT_APPROVAL'
  clauses.append({'clauseId':clause['clauseId'],'before':clause,'after':after})
 rows.append({'masterId':before['masterId'],'slug':before['slug'],'engineId':before['engineId'],'version':1,'nativeCatalog':before['nativeCatalog'],'declaredContract':before['declaredContract'],'before':'PARTIAL_EXACT_BUSINESS_DELIVERY_AND_QA_MISSING','engineeringDisposition':'COMPLETE_CANDIDATE_PENDING_FINAL_EXACT_HEAD_CI','fullEngineeringCompleteEstablished':False,'completionPredicate':'All applicable current-contract engineering/evidence requirements plus successful frozen-source exact-head five-job CI and aggregate, recorded in final external checkpoint. No canonical/certification/publication approval follows.','canonicalAccepted':False,'certificationGranted':False,'publicationEligible':False,'criteria':clauses,'evidence':evidence})
assert [r['masterId'] for r in rows]==ids
matrix={'kind':'FIVE_CURRENT_CONTRACT_ENGINEERING_CANDIDATES_NOT_APPROVAL','baseline':'9fe66f65cd7da2536f9f2f21d32fbc771bee0892','runtimeCapture':'1f0f81732c1d69963413ffadad45ff3a27a42086','selectedIds':ids,'rows':rows,'evidenceSHA256':facts,'candidateCount':5,'establishedEngineeringCompleteBeforeFinalCI':0,'canonicalAcceptanceAdded':0,'certificationAdded':0,'publicationEligibleAdded':0,'releaseHold':True}
ledger={'kind':'CANONICAL_LEDGER_PRESERVING_EXACT_FIVE_ENGINEERING_OVERLAY','parentLedger':str(base.relative_to(root)),'parentSHA256':hashlib.sha256(base.read_bytes()).hexdigest(),'counts':prior['counts'],'catalogCount':540,'newCanonicalAcceptance':0,'newPublicationEligibility':0,'engineeringCandidates':ids,'rows':[],'releaseHold':True}
for index,row in enumerate(prior['rows']):
 ledger['rows'].append({'masterId':row['masterId'],'title':row['title'],'category':row['category'],'disposition':row['disposition'],'canonicalAccepted':row['canonicalAccepted'],'certificationGranted':row['certificationGranted'],'publicationEligibleEstablished':row['publicationEligibleEstablished'],'inheritedRow':f'{base.relative_to(root)}#/rows/{index}','engineeringAssessment': 'COMPLETE_CANDIDATE_PENDING_EXACT_HEAD_CI' if row['masterId'] in ids else 'NOT_REASSESSED_THIS_SPRINT'})
assert len(ledger['rows'])==len({r['masterId'] for r in ledger['rows']})==sum(ledger['counts'].values())==540
for name,data in [('acceptance-5.json',matrix),('requirements-540.json',ledger)]:
 p=root/'docs/five-full-contract-20261109'/name;content=json.dumps(data,indent=2,ensure_ascii=False)+'\n'
 if '--check' in sys.argv:assert p.read_text()==content,name+' differs'
 else:p.write_text(content)
print(json.dumps({'engineeringCandidates':ids,'canonicalCounts':ledger['counts'],'releaseHold':True}))
