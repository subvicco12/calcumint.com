#!/usr/bin/env python3
"""Current engineering overlay; never rewrites frozen historical acceptance artifacts."""
import argparse, hashlib, json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
DOC=ROOT/'docs/canonical-calculus'
def load(p): return json.loads((ROOT/p).read_text())
def sha(p): return hashlib.sha256((ROOT/p).read_bytes()).hexdigest()
def derive():
    original=load('docs/blueprint-reconciliation/blueprint-to-540.json')
    native=load('docs/blueprint-reconciliation/native-blueprint.json')
    paragraphs={p['paragraphId']:p['text'] for p in native['paragraphs']}
    clauses={
      'strict-inputs-and-domain':['BP-0137','BP-0138','BP-0139','BP-0143','BP-0269'],
      'reconciled-results-and-basic-plot':['BP-0166','BP-0168','BP-0170','BP-0184','BP-0186','BP-0188','BP-0190','BP-0194','BP-0272','BP-0275'],
      'complete-scenarios-and-versioned-local-history':['BP-0180','BP-0389','BP-0550','BP-0552','BP-0554']}
    files=['src/calculators/canonical-calculus.ts','src/calculators/canonical-calculus-workflow.ts','src/lib/canonical-calculus-history.ts','src/components/canonical-calculus-workbench.tsx','src/calculators/private-calculus-successor.ts','src/calculators/advanced-math/expression-engine.ts','src/calculators/exact-rational.ts','src/calculators/completion-contracts.ts','src/lib/calculation-snapshot.ts','src/lib/entitlements.ts','src/components/final-calculator-renderer.tsx','src/components/result-series-panel.tsx','src/calculators/final-framework/types.ts','package-lock.json']
    binding={'baselineSHA':'50f307c67e3a5e5d289d2b83e2a285029151f866','nativeBlueprintSHA256':original['nativeSourceSHA256'],'engineId':'private.canonical-calculus','technicalRevision':3,'presentationRevision':1,'files':{p:sha(p) for p in files},'canonicalAccepted':False,'certificationAuthorized':False,'publicationAuthorized':False,'releaseHold':True}
    scope={246:'Exact rational-function derivatives on the original defined domain; unchanged analytical binary64 fallback for supported differentiable expressions.',247:'Exact oriented polynomial definite integration, degree at most32. No variable denominator/cancelled-hole extensions or non-polynomial quadrature.',248:'Exact rational removable/one-sided/two-sided limits by vanishing orders; unchanged analytical fallback only at verified open continuity domains.'}
    rows=[]
    for r in original['rows']:
        i=r['masterId']; blocked=r['implementationClass']=='CONTRACT_BLOCKED'
        rows.append({'masterId':i,'title':r['title'],'implementationClass':r['implementationClass'],'canonicalAccepted':False,'disposition':'AUTHORITY_BLOCKED' if blocked else 'FULL_CONTRACT_REVIEW_REQUIRED','originalTraceRow':f'docs/blueprint-reconciliation/blueprint-to-540.json#/rows/{i-1}','newEngineeringContract':({'engineId':binding['engineId'],'technicalRevision':3,'presentationRevision':1,'relatedCatalogId':i,'canonicalMappingApproved':False,'supportedScope':scope[i],'implementedEngineeringCapabilities':list(clauses),'fullClauseAcceptance':'NOT_INFERRED_FROM_SCOPED_ENGINEERING','remainingEngineering':['Canonical identity/complete required operator and expression scope acceptance remains unresolved.','General CAS expressions, transcendental removable/boundary limits and non-polynomial quadrature are unsupported.','Private local history does not establish authenticated account persistence or qualified production acceptance.'],'evidence':['src/calculators/canonical-calculus.test.ts','src/calculators/canonical-calculus.independent.test.ts','src/calculators/canonical-calculus-workflow.test.ts','src/lib/canonical-calculus-history.test.ts','tests/canonical-calculus-workbench/browser.mjs']} if i in scope else None),'releaseHold':True})
    counts={c:sum(r['implementationClass']==c for r in rows) for c in ['REGISTERED_IMPLEMENTED','PRIVATE_COMPLETE','COMPONENT_ONLY','CONTRACT_BLOCKED','MISSING_ENGINE','UNKNOWN']}
    overlay={'schemaVersion':1,'baselineSHA':binding['baselineSHA'],'nativeBlueprintSHA256':original['nativeSourceSHA256'],'sourceTraceSHA256':sha('docs/blueprint-reconciliation/blueprint-to-540.json'),'scopeMeaning':'Current engineering overlay on the preserved native Blueprint trace; no canonical acceptance or classification promotion.','counts':counts,'canonicalAccepted':0,'reviewRequired':497,'authorityBlocked':43,'newRelatedIds':[246,247,248],'requirements':{k:[{'paragraphId':p,'originalText':paragraphs[p]} for p in ps] for k,ps in clauses.items()},'rows':rows,'releaseHold':True}
    assert len(rows)==540 and len({r['masterId'] for r in rows})==540
    assert counts=={'REGISTERED_IMPLEMENTED':305,'PRIVATE_COMPLETE':192,'COMPONENT_ONLY':0,'CONTRACT_BLOCKED':43,'MISSING_ENGINE':0,'UNKNOWN':0}
    return {'source-binding.json':binding,'engineering-overlay-540.json':overlay}
def main():
    parser=argparse.ArgumentParser();parser.add_argument('--check',action='store_true');args=parser.parse_args()
    for name,value in derive().items():
        data=json.dumps(value,indent=2,ensure_ascii=False)+'\n';target=DOC/name
        if args.check:
            if target.read_text()!=data: raise SystemExit('Source/contract/trace binding differs: '+name)
        else: target.write_text(data)
    print('PASS: exact source binding, native clauses, 540 identities, 43 authority blockers; canonical acceptance remains zero')
if __name__=='__main__':main()
