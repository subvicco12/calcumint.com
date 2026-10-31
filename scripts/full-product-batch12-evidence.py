#!/usr/bin/env python3
"""Derive Batch12 requirement deltas without changing inherited acceptance."""
import hashlib,json,pathlib,sys
root=pathlib.Path(__file__).resolve().parents[1]
def read(p):return json.loads((root/p).read_text())
def sha(p):return hashlib.sha256((root/p).read_bytes()).hexdigest()
prior='docs/validation-scale/evidence-540.json'; trace='docs/blueprint-reconciliation/blueprint-to-540.json'
ledger=read(prior); trace_rows={r['masterId']:r for r in read(trace)['rows']}; assert len(ledger['rows'])==540
assert [r['masterId'] for r in ledger['rows']]==list(range(1,541))
assert sum(r['implementationClass']=='CONTRACT_BLOCKED' for r in ledger['rows'])==43
private=[r['masterId'] for r in ledger['rows'] if r['engineeringEvaluation']]
assert len(private)==79
registered=[1,2,26,50,51,52,207,388,426]
workflow_slugs=dict(zip(registered,['loan-payment-calculator','loan-emi-calculator','mortgage-payment','simple-interest-calculator','compound-interest-calculator','sip-calculator','percentage-of-value-calculator','bmi-calculator','unit-conversion-calculator']))
features=[
 {'id':'private-schema-controls','ids':private,'status':'ENGINEERING_COMPLETE','scope':'Schema-derived typed controls, explicit optional defaults, advanced JSON, strict errors and operation-scoped calculus input. Existing engine validation remains authoritative.','evidence':['src/components/contract-input-form.test.tsx','src/components/contract-input-form.independent.test.tsx','src/lib/contract-input-schema.test.ts']},
 {'id':'private-stored-result-details','ids':[3,5,6,7,8,22,27,29,25,246,247,248],'status':'ENGINEERING_COMPLETE','scope':'Eight stored amortization tables/charts, exact calendar payment dates, three stored calculus segment/anchor views. No synthesized mathematical results.','evidence':['src/components/contract-result-details.test.tsx']},
 {'id':'private-scenario-set-recovery','ids':private,'status':'ENGINEERING_COMPLETE','scope':'Verified immutable A/B/C packet export, restore and atomic complete-set recovery; Pro/Business gates, Free mathematics unchanged.','evidence':['src/lib/private-review-scenarios.test.ts','src/components/scaled-contract-review-functional.test.tsx']},
 {'id':'registered-exact-replay-recovery','ids':registered,'status':'ENGINEERING_COMPLETE','scope':'Explicit nine immutable forward-engine allowlist, full recorded JSON agreement, strict atomic scenario recovery with unit context and no upgrade. Identity associations retain prior mapping/applicability limits.','evidence':['src/lib/registered-snapshot-replay.test.ts','src/lib/registered-recovery.independent.test.ts','src/lib/scenario-set-recovery.test.ts','src/components/scenario-set-recovery.test.tsx']},
 {'id':'owned-record-actions','ids':registered,'status':'ENGINEERING_COMPLETE','scope':'Owned historical JSON/CSV/PDF downloads and separate scenarios; no recalculation during read/export, unknown historical versions remain exportable. External production authorization acceptance excluded.','evidence':['src/components/saved-calculation-actions.test.tsx','src/components/saved-calculation-boundary.test.tsx','src/app/account/saved/saved-actions-integration.test.tsx']},
 {'id':'blank-number-and-comparison-units','ids':[207,426],'status':'ENGINEERING_COMPLETE','scope':'Blank percentage/conversion values reject, explicit zero succeeds; comparison metadata carries recorded conversion units. Generic family associations do not establish canonical full-product mapping.','evidence':['src/components/registered-batch12-integration.test.tsx']},
 {'id':'save-status-calculation-context','ids':registered,'status':'ENGINEERING_COMPLETE','scope':'Pending/success/error notifications identify previous calculation after input changes; saved immutable bytes and owner locks preserved. Shared account-action infrastructure applies beyond these exercised IDs.','evidence':['src/components/calculator-account-context.independent.test.tsx']},
]
rows=[]
for r in ledger['rows']:
 i=r['masterId'];blocked=r['implementationClass']=='CONTRACT_BLOCKED'
 rows.append({'masterId':i,'title':r['title'],'implementationClass':r['implementationClass'],'canonicalDisposition':r['disposition'],'canonicalAccepted':False,'observedRegisteredBindings':trace_rows[i]['observedContracts'].get('registeredCandidates',[]),'privateAdapterBinding':({k:r['engineeringEvaluation'][k] for k in ['adapterKey','catalogId','engineVersion']} if r['engineeringEvaluation'] else None),'registeredWorkflowAssociation':({'slug':workflow_slugs[i],'version':1,'basis':'EXERCISED_ENGINE_ASSOCIATION_NOT_CANONICAL_MAPPING','evidence':'src/lib/registered-snapshot-replay.test.ts'} if i in workflow_slugs else None),'inheritedEvidence':prior+'#/rows/'+str(i-1),'inheritedCanonicalRequirements':trace_rows[i]['missingCanonicalRequirements'],'sourceAndQualifiedReviewEvidence':trace+'#/rows/'+str(i-1)+'/sourceAndReviewRestrictions','blueprintTrace':trace+'#/rows/'+str(i-1),'engineeringRequirements':[{'requirementId':f['id'],'status':f['status'],'scope':f['scope'],'evidence':f['evidence']} for f in features if i in f['ids']],'remainingRequirements':[{'requirement':'complete-canonical-contract-and-applicability','status':'BLOCKED' if blocked else 'PARTIAL','action':'Retain original source/policy/qualified review prerequisites.' if blocked else 'Review complete canonical scope, exact identity mapping, per-ID UX/output requirements and qualified applicability; bounded workflow completion is insufficient.'},{'requirement':'production-authentication-and-schema-acceptance','status':'BLOCKED','action':'Nonproduction real GoTrue credentials and authorized schema-equivalent fixture required; synthetic identity is not acceptance.'}],'releaseHold':True})
products={
 'requirements-540.json':{'schemaVersion':1,'baselineSHA':'32df71008d69839b08bf23597cad462717b7b0c7','inheritedLedgerSHA256':sha(prior),'blueprintTraceSHA256':sha(trace),'summary':{**ledger['summary'],'newAdapters':0,'newCanonicalAcceptances':0,'rowsWithEngineeringDeltas':len([r for r in rows if r['engineeringRequirements']])},'rows':rows,'releaseHold':True},
 'engineering-closure.json':{'schemaVersion':1,'meaning':'Requirement-scoped software closure, not canonical acceptance, applicability approval or source authentication. Browser execution outcomes are separately recorded in validation.json.','features':features,'preserved':{'catalogIdentities':540,'acceptanceRecords':424,'originalPrivateDrafts':14,'authorityBlocked':43,'canonicalAccepted':0,'historicalEnginesChanged':False},'releaseHold':True}}
for name,value in products.items():
 p=root/'docs/full-product-batch12'/name; content=json.dumps(value,indent=2)+'\n'
 if '--check' in sys.argv:
  assert p.read_text()==content,name+' stale'
 else:p.write_text(content)
print('PASS exact 540-row scoped engineering deltas; no canonical acceptance inferred')
