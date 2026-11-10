"""Exact target reconciliation; engineering evidence never grants canonical approval."""
import hashlib,json,zipfile,sys,xml.etree.ElementTree as ET
from pathlib import Path
from collections import Counter
root=Path('.'); out=root/'docs/next-cohort-20261110'
def read(p): return json.loads(Path(p).read_text())
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def write(name,d):
 text=json.dumps(d,indent=2)+'\n'
 if '--check' in sys.argv: assert (out/name).read_text()==text, 'Generated target reconciliation differs: '+name
 else: (out/name).write_text(text)
parent='docs/five-full-contract-20261109/requirements-540.json'; ledger=read(parent)
assert len(ledger['rows'])==540 and len({r['masterId']for r in ledger['rows']})==540
counts={'COMPLETE_AND_CERTIFIED':0,'IMPLEMENTED_REVIEW_PENDING':2,'IMPLEMENTED_TEST_GAPS':0,'PARTIALLY_IMPLEMENTED':495,'NOT_IMPLEMENTED':0,'IDENTITY_OR_SCOPE_BLOCKED':43}
assert dict(Counter(r['disposition']for r in ledger['rows']))=={k:v for k,v in counts.items()if v}
cases=read('tests/next-cohort-ui-20261110/cases.json'); assert [c['id']for c in cases]==[374,377,378,379,382,383,384,385]
cat='docs/first20-publication/input/input/governing/01-CalcuMint_Master_Calculator_Catalog_2026-1-.xlsx'; blueprint='docs/first20-publication/input/input/governing/03-CalcuMint_Final_Master_Blueprint_and_Product_Architecture_2026.docx'
assert sha(cat)=='4dbc3ade32ad20413aec7533838b969ece4185d0b62641b581bffc6ccf5d2899'; assert sha(blueprint)=='d9534dbcce0eb8a301beb5d1027a4bd50022ce863c30b461ae6f53fdf7724455'
ns={'s':'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
with zipfile.ZipFile(cat)as z:
 strings=[''.join(n.itertext())for n in ET.fromstring(z.read('xl/sharedStrings.xml')).findall('s:si',ns)]
 sheet=ET.fromstring(z.read('xl/worksheets/sheet2.xml')); native={}
 for row in sheet.findall('.//s:row',ns):
  if int(row.attrib['r'])not in {c['id']+1 for c in cases}:continue
  cells={}
  for cell in row.findall('s:c',ns):
   v=cell.find('s:v',ns);text=''if v is None else v.text or ''
   if cell.attrib.get('t')=='s':text=strings[int(text)]
   elif cell.attrib.get('t')=='inlineStr':text=''.join(cell.find('s:is',ns).itertext())
   cells[cell.attrib['r']]=text
  ident=int(cells['A'+row.attrib['r']]);native[ident]={'sheet':'Master Catalog (native sheet2.xml)','row':int(row.attrib['r']),'cells':cells}
assert len(native)==8
team=read('docs/next-cohort-sharing-20261110/workflows/receipt.json');assert team['passed']; verified={w['slug']for w in team['workflows']if all(w[k]for k in ['templateClone','recovered','tamperRejected'])}
assert verified=={c['slug']for c in cases if c['id']in[377,378,379]}
current=read('docs/next-cohort-sharing-20261110/workflows/personal-current-caller/receipt.json');assert current['passed'] and len(current['journeys'])==6
native_proof=read('docs/next-cohort-auth-current-20261110/receipt.json'); assert native_proof['passed']
old_criteria=read('docs/cohort22-closure-20261109/technology/criteria.json'); old={r['masterId']:r for r in old_criteria['rows']}
clauses=[r['clauseId']for r in read('docs/five-full-contract-20261109/acceptance-5.json')['rows'][0]['criteria']]
assert len(clauses)==34
external={'identity-full-contract','K-brand-builder','K-lead-capture','source-risk-rule-applicability','ai-boundary','certification-lifecycle','ops-recovery-custody-deployment'}
workspace={'K-organizations-roles','K-client-project-share-template'}
rows=[]
for c in cases:
 ident=c['id']; assert str(ident)==native[ident]['cells']['A'+str(ident+1)]; assert c['version']==(2 if ident==383 else 1)
 complete_candidate=c['slug']in verified
 criteria=[]
 for clause in clauses:
  if clause in external: status='AUTHORITY_OR_OPERATIONAL_DECISION_PENDING'; classification='COMPETENT_REVIEW_SOURCE_APPLICABILITY_OR_OPERATOR_AUTHORITY'
  elif clause in workspace and not complete_candidate:status='INDIVIDUAL_END_TO_END_WORKSPACE_QA_MISSING';classification='QA_EVIDENCE_MISSING'
  elif clause=='editorial-methodology-source':status='TECHNICAL_METHOD_REFERENCES_BOUND_FORMAL_APPLICABILITY_PENDING';classification='SOURCE_PROVENANCE_AND_COMPETENT_REVIEW'
  elif clause=='qa-seo-discovery':status='UNCHANGED_FAIL_CLOSED_PUBLICATION_FILTERS_RETAINED_NO_PRODUCTION_VISIBILITY_CLAIM';classification='ENGINEERING_GUARDS_PLUS_OPERATOR_LIFECYCLE_DEPENDENCY'
  elif clause=='ci-and-evidence-integrity':status='FOCUSED_PROOFS_AVAILABLE_FINAL_SOURCE_AND_EXACT_HEAD_CI_REQUIRED';classification='FINAL_VALIDATION_PENDING'
  else:status='IMPLEMENTATION_AND_SCOPED_ISOLATED_EVIDENCE_AVAILABLE';classification='ENGINEERING_AND_QA_NOT_APPROVAL'
  criteria.append({'clauseId':clause,'nativeSource':f'Master Catalog!G{ident+1}:M{ident+1}','classification':classification,'status':status})
 rows.append({'masterId':ident,'title':native[ident]['cells']['C'+str(ident+1)],'engineId':c['engine'],'slug':c['slug'],'version':c['version'],'nativeCatalog':native[ident],'offeredContract':old[ident]['offeredContract'],'before':'PARTIAL_ANALYSIS_AND_EXACT_BUSINESS_DELIVERY_OR_WORKFLOW_EVIDENCE','engineeringDisposition':'ENGINEERING_COMPLETE_CANDIDATE_PENDING_FINAL_SOURCE_AND_EXACT_HEAD_CI'if complete_candidate else'PARTIAL_INDIVIDUAL_BUSINESS_WORKSPACE_UI_ACCEPTANCE_MISSING','engineeringCompleteEstablished':False,'remainingEngineeringEvidence':[]if complete_candidate else['Actual per-identity authenticated team template/comparison/history/recovery and exported-content journey; SQL eight-tuple proof and unit/component tests are not that journey.'],'remainingAuthority':old[ident]['authorityOrScopeUncertainty'],'canonicalAccepted':False,'certificationGranted':False,'publicationEligible':False,'criteria':criteria,'evidence':{'actualUI':'docs/next-cohort-ui-current-20261110/browser.json (fresh current 24 journeys; synthetic account transport)','native':'docs/next-cohort-auth-current-20261110/receipt.json (production-mode isolated auth; synthetic lower publication authority)','personal':'docs/next-cohort-sharing-20261110/personal/receipt.json (retained eight identities; no new metadata rewrite)','currentPersonal':'docs/next-cohort-auth-current-20261110/personal-current-caller/receipt.json'if ident in[374,379]else'Prior personal source plus narrowly reviewed current caller delta; no current per-ID rerun claimed','workspace':'docs/next-cohort-sharing-20261110/workflows/receipt.json'if complete_candidate else'MISSING_INDIVIDUAL_WORKSPACE_UI_JOURNEY','workspaceSQL':'docs/next-cohort-sharing-20261110/pg/receipt.json'}})
evidence_paths=[parent,cat,blueprint,'docs/canonical-five-20261110/evidence-manifest.json','docs/next-cohort-auth-current-20261110/receipt.json','docs/next-cohort-native-20261110/validation/sql-receipt.json','docs/next-cohort-native-20261110/supplemental/receipt.json','docs/next-cohort-sharing-20261110/personal/verification.json','docs/next-cohort-sharing-20261110/workflows/receipt.json','docs/next-cohort-sharing-20261110/workflows/personal-current-caller/receipt.json','docs/next-cohort-20261110/baseline-ci.json','docs/next-cohort-ui-current-20261110/browser.json','docs/next-cohort-ui-20261110/boundary/final.json','docs/next-cohort-auth-current-20261110/personal-current-caller/receipt.json']
write('acceptance-8.json',{'kind':'EIGHT_EXACT_CURRENT_CONTRACT_ENGINEERING_EVIDENCE_NOT_CANONICAL_APPROVAL','baseline':'1ec63cd11626df15063546c7e5bfedecec33f6ee','selectedIds':[c['id']for c in cases],'engineeringCandidates':[377,378,379],'engineeringCompleteEstablishedBeforeFinalCI':0,'firstFiveUnsignedCanonicalReviewPackets':[370,371,372,373,386],'rows':rows,'sourceHashes':{p:sha(p)for p in evidence_paths},'newCanonicalAcceptance':0,'newCertification':0,'newPublicationEligibility':0,'releaseHold':True})
for row in ledger['rows']:
 ident=row['masterId'];row['inheritedCanonicalDisposition']=row['disposition']
 if ident in[370,371,372,373,386]:row['engineeringAssessment']='BASELINE_CURRENT_CONTRACT_ENGINEERING_COMPLETE_AT_1ec63cd1';row['engineeringEvidence']='docs/next-cohort-20261110/baseline-ci.json';row['canonicalReviewPacket']=f'docs/canonical-five-20261110/{ident}-v1-review-packet.json'
 elif ident in[377,378,379]:row['engineeringAssessment']='CANDIDATE_PENDING_FINAL_SOURCE_AND_EXACT_HEAD_CI';row['engineeringEvidence']='docs/next-cohort-20261110/acceptance-8.json'
 elif ident in[374,382,383,384,385]:row['engineeringAssessment']='PARTIAL_INDIVIDUAL_WORKSPACE_UI_QA_MISSING';row['engineeringEvidence']='docs/next-cohort-20261110/acceptance-8.json'
 else:row['engineeringAssessment']='INHERITED_NOT_REASSESSED_THIS_SPRINT'
ledger['inheritedEngineeringCandidates']=ledger.pop('engineeringCandidates',[])
ledger.update(engineeringCandidates=[377,378,379],kind='PRESERVED_540_CANONICAL_DISPOSITIONS_WITH_SEPARATE_ENGINEERING_OVERLAY',parentLedger=parent,parentSHA256=sha(parent),counts=counts,newCanonicalAcceptance=0,newPublicationEligibility=0,baselineEngineeringCompleteIds=[370,371,372,373,386],newEngineeringCandidates=[377,378,379],partialAdditionalCohort=[374,382,383,384,385],otherIdentitiesNotReassessed=527)
write('requirements-540.json',ledger)
print(json.dumps({'rows':540,'canonicalCounts':counts,'baselineEngineeringComplete':5,'newEngineeringCandidates':[377,378,379],'additionalPartial':[374,382,383,384,385],'newPublicationEligible':0}))
