"""Deterministic scoped22 supplement; never reclassifies canonical acceptance."""
from pathlib import Path
import json,hashlib,sys
root=Path(__file__).resolve().parents[2]
read=lambda p:json.loads((root/p).read_bytes())
sha=lambda p:hashlib.sha256((root/p).read_bytes()).hexdigest()
parent='docs/execution-recovery-20261109/requirements-540.json'
before=read(parent);ids=[368,*range(370,388),429,437,439]
assert ids==before['identitiesAdvanced'] and len(ids)==len(set(ids))==22 and 369 not in ids
technology=read('docs/cohort22-closure-20261109/technology/criteria.json')['rows']
private=read('docs/cohort22-closure-20261109/converters/criteria-decisions.json')['rows']
inventory=read('docs/product-completion-20261108/inventory-540.json')['rows']
hazards=read('docs/cohort22-closure-20261109/technology/hazard-witnesses.json')['cases'];affected=sorted({row['masterId']for row in hazards})
rows=[]
for item in technology:
 i=item['masterId'];original=inventory[i-1]
 rows.append({'masterId':i,'title':item['title'],'slug':item['slug'],'technicalVersion':item['technicalVersion'],
 'engineeringStatus':'PARTIAL_FULL_PRODUCT_REQUIREMENTS_REMAIN','fullEngineeringComplete':False,'canonicalAccepted':False,'certificationGranted':False,'publicationEligible':False,
 'declaredContract':item['offeredContract'],'inheritedCanonicalRequirements':original['requirements'],
 'closedCurrentEngineeringFindings':[
  {'criterion':'Worked example/editorial requirement','status':'VERIFIED_CURRENT_UI','evidence':['src/components/technology-worked-example.tsx','src/components/technology-worked-example.test.tsx','docs/cohort22-closure-20261109/native-browser.json'],'scope':'Original schema/example/engine, formulas, units, exact technical-revision methodology/export context and source references; all three plans; does not approve publisher applicability.'},
  {'criterion':'Central input/output-table entitlement resolution','status':'VERIFIED_EXISTING_BOUNDARY_PRESERVED','evidence':['src/lib/presentation-entitlements.ts','src/lib/presentation-entitlements.test.ts'],'scope':'Existing Free false / Pro true / Business true; no schedule alias or commercial limit change.'},
  {'criterion':'Specified numeric input/result/intermediate capture refusals','status':'VERIFIED_DEMONSTRATED_REFUSALS'if i in affected else'RETAINED_BOUNDARY_WITH_NO_NEW_ARITHMETIC_DEFECT_DEMONSTRATED','evidence':['src/lib/technology-capture-trust.test.ts','docs/cohort22-closure-20261109/technology/hazard-witnesses.json'],'scope':'Current UI and worked-example surface only. Original engine and historical replay remain unchanged; not a blanket SDK/server-write validation claim.'},
  {'criterion':'Scenario/history/export/replay and plan parity','status':'VERIFIED_SCOPED_COMPOSITION','evidence':['docs/execution-recovery-20261109/technology-auth/receipt.json','docs/execution-recovery-20261109/technology-auth/plan-isolation-receipt.json','docs/cohort22-closure-20261109/native-browser.json'],'scope':'Retained genuine isolated API history/RLS plus current source browser with synthetic transport, distinct A/B preserved through recovery, JSON export/replay/tamper,38 retained CSV/PDF Blob records and independent PDF raw-value/revision reading; no native-download, PDF/UA or production qualification inferred.'},
 ],
 'remainingEngineeringCriteria':[
  {'criterion':'Complete declared canonical input/output/feature contract','status':'CONTRACT_ADJUDICATION_REQUIRED','responsibleParty':'Canonical contract authority and competent reviewer','minimumAction':'Adjudicate exact offered scope against native catalog G–M/Blueprint. Do not infer extra subnet outputs or blanket advanced-feature N/A from a title.'},
  {'criterion':'Native B-Analytical/J analysis and K Business delivery','status':'SPECIFIC_PRODUCT_GAPS_OR_APPLICABILITY_UNRESOLVED','responsibleParty':'Engineering after exact per-ID applicability disposition','minimumAction':'Native registered API/embed currently supports440 only; the held docs/native440-remediation/embed-metering.sql also explicitly constrains catalog_id=440 and engine_id=conversion.frequency. Personal history/projects do not supply this delivery. A broader exact native contract requires its own governed source-compatible proposal/adoption; do not repurpose or relax the held440 checks. Bind required analysis/reverse/sensitivity/chart and delivery behavior where applicable; do not fabricate exemptions.'},
  {'criterion':'Full supported numerical domain and precision across capture surfaces','status':'PARTIAL','responsibleParty':'Engineering and competent precision reviewer','minimumAction':'Adjudicate explicit new-capture precision/refusal envelope and any version-safe successor. Historical engine schemas/behavior and historical-save semantics remain, not silently corrected by UI refusal.'},
  {'criterion':'Complete accessibility, performance and export qualification','status':'PARTIAL','responsibleParty':'Engineering and technical QA reviewer','minimumAction':'Current keyboard/semantic tables/three viewport checks do not establish every WCAG requirement, production performance, or PDF accessibility; retain requirement-specific outstanding evidence.'},
 ],
 'remainingAcceptanceAuthority':['Competent source/formula/precision/technical-QA determinations and actual appointment/attestation','Canonical contract adoption, applicable specialist obligations and certification','Separately authorized hosted adoption/deployment/publication under release hold'],
 'newFullEngineeringComplete':False})
for entry in rows:
 if entry['masterId']==386:
  entry['closedCurrentEngineeringFindings'].append({'criterion':'Complete integer-forward mathematical domain of the registered padded Base64 formula','status':'ENGINEERING_PROOF_COMPLETE_FOR_DECLARED_SCHEMA_REVIEW_PENDING','evidence':['docs/cohort22-closure-20261109/technology/386-forward-domain-proof.md','src/lib/base64-size-domain-proof.test.ts'],'scope':'IEEE754 bound argument plus independent BigInt model; no exhaustive-enumeration or canonical/reviewer approval claim.'})
  entry['remainingEngineeringCriteria'][2]={'criterion':'Precision/rounding applicability acceptance','status':'COMPETENT_REVIEW_PENDING_ON_COMPLETE_DECLARED_FORWARD_DOMAIN_PROOF','responsibleParty':'Competent precision/formula reviewer','minimumAction':'Adjudicate the exact integer-domain proof and signed-zero/JSON interpretation. B/J/K delivery and full-product applicability remain separate incomplete criteria.'}
for item in private:
 i=item['catalogId'];rows.append({'masterId':i,'title':item['title'],'technicalVersion':1,'privateRevision':item['privateProposal']['implementationRevision'],'registeredSuccessorVersion':None,
 'engineeringStatus':'DECLARED_PRIVATE_SOFTWARE_VERIFIED_CANONICAL_METHOD_BLOCKED','fullEngineeringComplete':False,'canonicalAccepted':False,'certificationGranted':False,'publicationEligible':False,
 'inheritedCanonicalRequirements':inventory[i-1]['requirements'],'privatePacket':'docs/cohort22-closure-20261109/converters/'+str(i)+('-pressure.md'if i==429 else'-density.md'if i==437 else'-torque.md'),
 'sourceRelationshipFactResolved':True,'sourceApplicabilityApproved':False,'oldRegisteredBehaviorPreserved':True,
 'closedCurrentEngineeringFindings':[],'remainingEngineeringCriteria':[{'criterion':'Select retained-v1 or exact source-supported private successor contract','status':'METHOD_VERSION_APPLICABILITY_DECISION_REQUIRED','responsibleParty':'Owner/contract authority and competent reviewer','minimumAction':'Use the exact three-row method packet; no new factor research needed. Record precision/domain/quantity semantics and authorized version mapping; historicalv1 remains immutable.'},{'criterion':'Applicable full-product authenticated workflows, CSV/PDF/API/batch','status':'NOT_ESTABLISHED_FOR_UNADOPTED_PRIVATE_METHOD','responsibleParty':'Engineering after method/version/scope prerequisites','minimumAction':'Bind required surfaces to an approved exact method/version; local JSON/history/A-B does not establish account or Business acceptance.'}],
 'remainingAcceptanceAuthority':['Unsigned source/applicability/precision/QA decisions in the per-ID packet','Explicit version-safe adoption and canonical contract scope','Certification and separately authorized publication'],
 'newFullEngineeringComplete':False})
rows.sort(key=lambda r:r['masterId']);assert [r['masterId']for r in rows]==ids
summary={'kind':'EXACT22_REQUIREMENT_RECONCILIATION_NOT_CERTIFICATION','baselineSHA':'ddca21413199632fa7256967fffdded928a2a9de',
 'cohortReconciliation':{'ids':ids,'count':22,'expression':'1 +(387-370+1) +3 =22','id369Selected':False,'discrepancy':'The reported ranges themselves enumerate22.23 would require also including369, which neither the target list nor the retained ledger selects.'},
 'numericalFindingsClosedAtCurrentUI':affected,'sourceProvenance':'Exact baseline native Catalog/Blueprint/engine bindings are in technology/criteria.json; source factor provenance is in converters/criteria-decisions.json. Reference integrity is not publisher applicability approval.',
 'rows':rows,'newFullEngineeringComplete':0,'newCanonicalAcceptances':0,'newCertifications':0,'newPublicationEligible':0,'releaseHold':True}
ledger=json.loads(json.dumps(before));ledger.update(kind='COHORT22_SCOPED_ENGINEERING_CLOSURE_540_SUPPLEMENT',baselineSHA=summary['baselineSHA'],parentLedger=parent,parentLedgerSHA256=sha(parent),identitiesAdvanced=ids,newFullEngineeringComplete=0,newCanonicalAcceptances=0,newCertifications=0,newPublicationEligible=0,interpretation='Per-ID current requirements reconciled; no full-product promotion from shared tests or scoped private arithmetic.')
ledger['retainedPreviousExecutionEngineering']={key:ledger.pop(key) for key in ['newTechnologyCallersMigrated','newExactReplayIdentities','privateProposalsAdvanced'] if key in ledger}
ledger['currentFindingsClosed']={'workedExampleInterfaces':19,'centralCapabilityCallers':19,'unsafeCurrentUICaptureIdentities':affected,'newRegisteredEngines':0,'newVersionAdoptions':0}
lookup={r['masterId']:r for r in rows}
for row in ledger['rows']:
 if row['masterId']in lookup:row['newScopedChecks'].append({'requirement':'Existing22 per-ID criteria and demonstrated engineering closure','status':lookup[row['masterId']]['engineeringStatus'],'evidence':'docs/cohort22-closure-20261109/acceptance-22.json#/rows/'+str(ids.index(row['masterId'])),'fullCanonicalAcceptance':False})
assert ledger['counts']==before['counts'] and len(ledger['rows'])==540
out=root/'docs/cohort22-closure-20261109'
for name,data in [('acceptance-22.json',summary),('requirements-540.json',ledger)]:
 text=json.dumps(data,indent=2)+'\n';p=out/name
 if '--check'in sys.argv:assert p.read_text()==text,'Stale scoped evidence: '+name
 else:p.write_text(text)
print(json.dumps({'identities':len(ids),'newFullEngineeringComplete':0,'counts':ledger['counts'],'uiNumericalIdentities':affected,'releaseHold':True}))
