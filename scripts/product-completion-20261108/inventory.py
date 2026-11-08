#!/usr/bin/env python3
"""Deterministic evidence inventory; does not execute engines or promote acceptance."""
import argparse, csv, hashlib, io, json, pathlib, re
from collections import Counter
ROOT=pathlib.Path(__file__).resolve().parents[2]
OUT=ROOT/'docs/product-completion-20261108'
parser=argparse.ArgumentParser()
parser.add_argument('--check',action='store_true',help='Compare retained outputs without writing; native bytes are not reopened')
parser.add_argument('--native-catalog',type=pathlib.Path,help='Explicitly reverify original workbook bytes and native triples locally')
args=parser.parse_args()
SOURCES={
 'reconciliation':'docs/publication540-shared/catalog/reconciliation-540.json',
 'requirements':'docs/full-product-batch16/requirements-540.json',
 'blueprint':'docs/blueprint-reconciliation/blueprint-to-540.json',
 'numerical':'docs/canonical-acceptance/canonical-ledger.json',
 'rootcause':'docs/product-completion-20261108/inventory-rootcause-projection.json',
 'legacyFinancialBoundary':'docs/product-completion-20261108/legacy-financial-boundary.json',
 'reviewPacket':'docs/product-completion-20261108/inventory-work-packet.json'}
def digest(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def load(p):return json.loads((ROOT/p).read_text())
data={k:load(v) for k,v in SOURCES.items()}
CATALOG_HASH='4dbc3ade32ad20413aec7533838b969ece4185d0b62641b581bffc6ccf5d2899'
attestation=load('docs/product-completion-20261108/native-catalog-verification.json')
assert attestation['rawWorkbookSHA256']==CATALOG_HASH
native={r['masterId']:r for r in attestation['rows']}
assert sorted(native)==list(range(1,541))
def normalized_triples(records):
 return json.dumps([{k:r[k] for k in ['masterId','domain','title']} for r in records],ensure_ascii=False,separators=(',',':')).encode()
assert hashlib.sha256(normalized_triples(attestation['rows'])).hexdigest()==attestation['normalizedTriplesSHA256']
assert attestation['verification']=='PASS' and attestation['mismatches']==0
if args.native_catalog:
 import openpyxl
 assert digest(args.native_catalog)==CATALOG_HASH, 'Authoritative workbook bytes changed'
 book=openpyxl.load_workbook(args.native_catalog,read_only=True,data_only=True)
 actual=[{'masterId':r[0],'domain':r[1],'title':r[2],'sheetRow':i} for i,r in enumerate(book['Master Catalog'].values,1) if isinstance(r[0],int)]
 book.close()
 assert actual==attestation['rows'], 'Retained native catalog attestation mismatch'

indexes={k:{r['masterId']:r for r in v['rows']} for k,v in data.items() if 'rows' in v}
review={r['catalogId']:r for r in data['reviewPacket']['candidates']}
classes=['COMPLETE_AND_CERTIFIED','IMPLEMENTED_REVIEW_PENDING','IMPLEMENTED_TEST_GAPS','PARTIALLY_IMPLEMENTED','NOT_IMPLEMENTED','IDENTITY_OR_SCOPE_BLOCKED']
# Follow local imports, including barrel modules; exact lexical binding is a locator, not canonical approval.
files={p.relative_to(ROOT).as_posix():p.read_text() for p in (ROOT/'src/calculators').rglob('*.ts') if not p.name.endswith('.test.ts')}
changed={'src/calculators/finance/compound-interest.ts','src/calculators/finance/loan-payment.ts','src/calculators/precision.ts'} & set(files)

def deps(path,seen=None):
 seen=set() if seen is None else seen
 if path in seen:return seen
 seen.add(path)
 for imp in re.findall(r'(?:from\s*|import\s*)[\'\"]([^\'\"]+)[\'\"]',files.get(path,'')):
  if not imp.startswith('.'):continue
  base=pathlib.Path(path).parent/imp
  for cand in [str(base)+'.ts',str(base/'index.ts')]:
   norm=pathlib.Path(__import__('os').path.normpath(cand)).as_posix()
   if norm in files:deps(norm,seen)
 return seen
rows=[]
for mid in range(1,541):
 r=indexes['reconciliation'][mid]; assert all(r[k]==native[mid][k] for k in ['masterId','domain','title']), f'Native catalog mismatch {mid}'
 q=indexes['requirements'][mid]; b=indexes['blueprint'][mid]; n=indexes['numerical'][mid]
 req={x['requirementId']:x for x in q['requirements']}; packet=review.get(mid)
 # Complete offered scope is affirmative evidence only for exact retained determinations.
 scope_complete=bool(packet and (ROOT/packet['engineBinding']['path']).is_file() and digest(ROOT/packet['engineBinding']['path'])==packet['engineBinding']['sha256'] and packet.get('retainedGoverningDispositions',{}).get('bounded_product_scope',{}).get('status')=='complete')
 if q['implementationClass']=='CONTRACT_BLOCKED':cls='IDENTITY_OR_SCOPE_BLOCKED';reason='Explicit authority/contract blocker retained; implementation absence not inferred.'
 elif scope_complete:cls='IMPLEMENTED_REVIEW_PENDING';reason='Exact retained native identity and coherent offered scope complete; unsigned qualified QA/canonical lifecycle decision pending.'
 else:cls='PARTIALLY_IMPLEMENTED';reason='Existing candidate/engineering evidence retained; affirmative complete per-ID scope proof absent. This is incomplete evidence of product completeness, not proof code is missing.'
 bindings=[]; affected=[]
 for c in r['candidates']:
  eid=c['engineId']; paths=[p for p,t in files.items() if re.search(r'[\'\"]'+re.escape(eid)+r'[\'\"]',t)]
  impacts=sorted(set().union(*(deps(p)&changed for p in paths))) if paths else []
  bindings.append({'engineId':eid,'version':c['version'],'sourceLocators':[{'path':p,'sha256':digest(ROOT/p)} for p in sorted(paths)],'bindingMeaning':'LEXICAL_ENGINE_ID_LOCATOR_NOT_RUNTIME_OR_CANONICAL_APPROVAL','changedDependenciesSincePR1537':impacts,'historicalExactSourceProof':'INVALIDATED_PENDING_EXACT_VERSION_RERUN' if impacts else 'NOT_REVALIDATED_BY_THIS_INVENTORY'})
  if impacts:affected.append(eid)
 restrictions=b['sourceAndReviewRestrictions']; jurisdiction='UNKNOWN'
 if packet and packet.get('retainedGoverningDispositions',{}).get('jurisdiction_rule_pack_and_high_risk_external_specialist',{}).get('status')=='justifiedNA':jurisdiction='JUSTIFIED_NA_FOR_DECLARED_GENERIC_SCOPE'
 rows.append({'masterId':mid,'title':r['title'],'domain':r['domain'],'classification':cls,'classificationReason':reason,'knownLegacyFindings':[{'path':SOURCES['legacyFinancialBoundary']+'#/cases/'+str(i),'finding':case,'sharedCause':'LEGACY_FINANCIAL_ROUNDING_BOUNDARY','remediationStatus':'EXACT_GRID_COMPONENT_IMPLEMENTED; REGISTERED_VERSION_ADOPTION_AND_BROADER_ROUNDING_REVIEW_PENDING'} for i,case in enumerate(data['legacyFinancialBoundary']['cases']) if case['catalogReviewCandidate']==mid],'nativeCatalogBinding':{'driveURI':attestation['driveURI'],'driveFileId':attestation['driveFileId'],'sha256':CATALOG_HASH,'sheet':'Master Catalog','row':native[mid]['sheetRow'],'columns':'A/B/C','comparison':'EXACT_ID_DOMAIN_TITLE_MATCH'},'engineeringVsReviewUncertainty':{'registeredImplementationEstablished':scope_complete or bool(r['candidates']),'declaredOfferedScopeComplete':True if scope_complete else 'UNKNOWN','canonicalQualifiedQADecision':'PENDING' if scope_complete else 'UNKNOWN_NOT_ESTABLISHED','businessApplicabilityAcceptance':'PENDING' if scope_complete else 'UNKNOWN_NOT_ESTABLISHED','implementationCompletenessMustNotBeInferredFromReviewStatus':True},'jurisdiction':jurisdiction,'fullMathematicalCompleteness':'OFFERED_SCOPE_COMPLETE_REVIEW_PENDING' if scope_complete else ('DEMONSTRATED_LEGACY_PRECISION_DEFECT' if any(c['catalogReviewCandidate']==mid and c['matchesIdentity'] is False for c in data['legacyFinancialBoundary']['cases']) else 'UNKNOWN_NOT_ESTABLISHED'),'canonicalCompleteAndCertified':False,'engineSourceBindings':bindings,'potentialSourceBindingImpactEngineIds':affected,'validationAndNumericalEvidence':n['numericalEvidence'],'goldenReferenceMeaning':'AUTHORED_OR_BOUNDED_FIXTURES_NOT_FULL_DOMAIN_INDEPENDENT_ACCEPTANCE','requirements':q['requirements'],'requirementCounts':dict(Counter(x['status'] for x in q['requirements'])),'dimensionEvidence':{k:req.get(k,{'status':'UNKNOWN'}) for k in ['inputs','goldens-and-rounding','domain-negative','full-domain-numerical-acceptance','browser-interaction','charts','accessibility','source-publisher-and-applicability','qualified-review','authenticated-history','scenario-workflows','export-workflows','canonical-product-acceptance']},'sourceAndReviewRestrictions':restrictions,'missingRequirements':b['missingCanonicalRequirements'],'currentPublicState':'UNKNOWN_CURRENT_EXACT_HEAD_NOT_ATTESTED_BY_HISTORICAL_OBSERVATIONS','certificationState':'QUALIFIED_CANONICAL_DECISION_NOT_ESTABLISHED','historicalRootCauseEvidence':indexes['rootcause'][mid],'historicalExactTupleReconciliation':r,'blueprintEvidence':b,'requirementTechnicalEvidence':q['technicalContractEvidence'],'currentReviewPacket':packet or 'UNKNOWN_NO_EXACT_PACKET','evidencePointers':{k:SOURCES[k]+'#/rows/'+str(mid-1) for k in ['reconciliation','requirements','blueprint','numerical']}})
counts=Counter(r['classification'] for r in rows)
summary={'rows':len(rows),'classificationCounts':{c:counts[c] for c in classes},'requirements':dict(Counter(x['status'] for r in rows for x in r['requirements'])),'jurisdictionUnknown':sum(r['jurisdiction']=='UNKNOWN' for r in rows),'mathematicalCompletenessUnknown':sum(r['fullMathematicalCompleteness']=='UNKNOWN_NOT_ESTABLISHED' for r in rows),'potentialSourceBindingImpactCatalogIds':[r['masterId'] for r in rows if r['potentialSourceBindingImpactEngineIds']]}
rules={'precedence':['Explicit authority/contract blockage => IDENTITY_OR_SCOPE_BLOCKED','Affirmative full implementation + exact certified full product acceptance => COMPLETE_AND_CERTIFIED','Affirmative coherent complete offered scope with unsigned qualified/canonical decision => IMPLEMENTED_REVIEW_PENDING','Affirmative complete implementation with documented missing numerical/browser coverage => IMPLEMENTED_TEST_GAPS','Affirmative absence of implementation => NOT_IMPLEMENTED','Existing bounded implementation evidence without complete per-ID scope proof => PARTIALLY_IMPLEMENTED'],'unknownPolicy':'Unknown means missing proof, never missing code. Historical certified/draft/PRIVATE_COMPLETE labels never establish canonical completion. No absent implementation is inferred. No new acceptance is granted.','reviewPacketCaveat':'Native coherent narrow scope does not require inventing optional features; #432/#440 retain justified NA decisions. Exact-a955 packet source binding must match current source bytes.'}
manifest_audit=[]
for name,doc in data.items():
 for path,expected in doc.get('sourceHashes',{}).items():
  local=ROOT/path
  actual=digest(local) if local.is_file() else None
  manifest_audit.append({'manifest':SOURCES[name],'path':path,'recordedSHA256':expected,'currentSHA256':actual or 'UNKNOWN_MISSING_LOCAL_FILE','status':'EXACT_BYTES_MATCH' if actual==expected else ('SOURCE_DRIFT_HISTORICAL_EVIDENCE_NOT_CURRENT_PROOF' if actual else 'UNKNOWN_MISSING_LOCAL_FILE')})
summary['sourceManifestBindingCounts']=dict(Counter(x['status'] for x in manifest_audit))
summary['potentialSourceBindingImpactCatalogIdCount']=len(summary['potentialSourceBindingImpactCatalogIds'])
summary['knownLegacyFindings']={'confirmedSharedCauseCount':1,'confirmedAffectedReviewIds':sorted({c['catalogReviewCandidate'] for c in data['legacyFinancialBoundary']['cases'] if c['matchesIdentity'] is False}),'standaloneExactGridFoundation':'UNREGISTERED_NO_ADOPTION_NO_FULL_ENGINE_COMPLETION_OR_POLICY_REPAIR_INFERRED'}
summary['authoritativeNativeCatalogComparison']={'sha256':CATALOG_HASH,'exactIdDomainTitleMatches':540,'mismatches':0}
result={'kind':'FULL_PRODUCT_540_EVIDENCE_INVENTORY_NOT_ACCEPTANCE','baselineSHA':'af92e4f4fc2a024d50fb2c71271b09e221b2c6fe','historicalBaselineSHA':'a955cdad7019a645b7ed2950299d0603ba1784a7','productionWrites':False,'rules':rules,'sourceHashes':{v:digest(ROOT/v) for v in [*SOURCES.values(),'docs/product-completion-20261108/native-catalog-verification.json']},'summary':summary,'sourceManifestAudit':manifest_audit,'rows':rows}
assert [r['masterId'] for r in rows]==list(range(1,541))
assert sum(counts.values())==540
csv_buffer=io.StringIO(newline='')
fields=['masterId','title','domain','classification','jurisdiction','fullMathematicalCompleteness','classificationReason']
w=csv.DictWriter(csv_buffer,fieldnames=fields,extrasaction='ignore');w.writeheader();w.writerows(rows)
outputs={'inventory-540.json':json.dumps(result,indent=2,ensure_ascii=False)+'\n','inventory-540.csv':csv_buffer.getvalue(),'inventory-summary.json':json.dumps(summary,indent=2)+'\n'}
if args.check:
 for name,content in outputs.items():
  assert (OUT/name).read_bytes()==content.encode(), f'Stale inventory artifact: {name}; regenerate inventory.py'
 print('PASS: 540 unique IDs; retained native catalog attestation matches exact repository triples; deterministic inventory outputs match. Native workbook bytes '+('reopened and verified.' if args.native_catalog else 'not reopened; retained attestation only.'))
else:
 OUT.mkdir(exist_ok=True)
 for name,content in outputs.items():(OUT/name).write_bytes(content.encode())
 print(json.dumps(summary,indent=2))
