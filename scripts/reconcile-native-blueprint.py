"""Offline original-DOCX provenance, complete scope and catalog traceability. Never approves calculators."""
import argparse,csv,hashlib,io,json,pathlib,re,zipfile
import xml.etree.ElementTree as ET
ROOT=pathlib.Path('docs/blueprint-reconciliation')
SOURCE_SHA='d9534dbcce0eb8a301beb5d1027a4bd50022ce863c30b461ae6f53fdf7724455'
NS={'w':'http://schemas.openxmlformats.org/wordprocessingml/2006/main','r':'http://schemas.openxmlformats.org/package/2006/relationships'}
def sha(b):return hashlib.sha256(b).hexdigest()
def source(path):
 raw=path.read_bytes()
 if sha(raw)!=SOURCE_SHA:raise ValueError('Original Blueprint SHA256 mismatch')
 z=zipfile.ZipFile(io.BytesIO(raw))
 if z.testzip() is not None or len(z.namelist())!=len(set(z.namelist())):raise ValueError('DOCX CRC/duplicate-member failure')
 doc=ET.fromstring(z.read('word/document.xml'));all_p=doc.findall('.//w:p',NS);native=[];indices={};raw_indices={}
 for i,p in enumerate(all_p,1):
  raw_indices[id(p)]=i;text=''.join(t.text or '' for t in p.findall('.//w:t',NS))
  if text.strip():
   n=len(native)+1;indices[id(p)]=n;style=p.find('./w:pPr/w:pStyle',NS)
   native.append({'paragraphId':f'BP-{n:04d}','nativeNonemptyOrdinal':n,'rawParagraphOrdinal':i,'text':text,'styleId':style.get('{'+NS['w']+'}val') if style is not None else None,'tableContexts':[]})
 tables=[]
 for ti,t in enumerate(doc.findall('.//w:tbl',NS),1):
  rows=[]
  for ri,row in enumerate(t.findall('./w:tr',NS),1):
   cells=[];grid_start=1
   for ci,cell in enumerate(row.findall('./w:tc',NS),1):
    span_node=cell.find('./w:tcPr/w:gridSpan',NS);span=int(span_node.get('{'+NS['w']+'}val','1')) if span_node is not None else 1
    merge_node=cell.find('./w:tcPr/w:vMerge',NS);merge=merge_node.get('{'+NS['w']+'}val','continue') if merge_node is not None else None
    ids=[indices[id(p)] for p in cell.findall('.//w:p',NS) if id(p) in indices];text=' | '.join(native[n-1]['text'] for n in ids)
    for n in ids:native[n-1]['tableContexts'].append({'table':ti,'row':ri,'cell':ci,'gridStart':grid_start,'gridSpan':span,'verticalMerge':merge})
    cells.append({'cell':ci,'gridStart':grid_start,'gridSpan':span,'verticalMerge':merge,'paragraphIds':[f'BP-{n:04d}' for n in ids],'text':text});grid_start+=span
   rows.append({'row':ri,'explicitHeaderRow':row.find('./w:trPr/w:tblHeader',NS) is not None,'cells':cells})
  tables.append({'tableId':f'TABLE-{ti:03d}','nativeGridWidths':[n.get('{'+NS['w']+'}w') for n in t.findall('./w:tblGrid/w:gridCol',NS)],'headerCandidate':rows[0]['cells'] if rows else [],'rows':rows,'meaning':'Native row/cell context retained; header semantics require contextual review, not automatic scope approval.'})
 relationships=[]
 for info in z.infolist():
  if info.filename.endswith('.rels'):
   for rel in ET.fromstring(z.read(info.filename)):
    relationships.append({'member':info.filename,'id':rel.get('Id'),'type':rel.get('Type'),'target':rel.get('Target'),'targetMode':rel.get('TargetMode','Internal')})
 ancillary=[]
 for name in z.namelist():
  if re.match(r'word/(header|footer|footnotes|endnotes|comments)',name) and name.endswith('.xml'):
   xml=ET.fromstring(z.read(name));ancillary.append({'member':name,'paragraphText':[''.join(t.text or '' for t in p.findall('.//w:t',NS)) for p in xml.findall('.//w:p',NS)]})
 if len(native)!=1116 or len(all_p)!=1160 or len(tables)!=33:raise ValueError('Native Blueprint structure drift')
 return {'schemaVersion':1,'source':{'filename':'CalcuMint_Final_Master_Blueprint_and_Product_Architecture_2026.docx','uploadedAttachmentName':'CalcuMint_Final_Master_Blueprint_and_Product_Architecture_2026 (2).docx','frozenRepositoryPath':'docs/blueprint-reconciliation/input/master-blueprint.docx','uploadedOriginalSHA256':SOURCE_SHA,'bytes':len(raw),'zipCRCVerified':True,'memberCount':len(z.namelist()),'memberHashes':{n:sha(z.read(n)) for n in sorted(z.namelist())},'authority':'User-supplied governing architecture; not deployment/certification/publication authorization.'},'scope':{'rawParagraphs':len(all_p),'nonemptyParagraphs':len(native),'tables':len(tables),'trackedInsertions':len(doc.findall('.//w:ins',NS)),'trackedDeletions':len(doc.findall('.//w:del',NS)),'textMeaning':'Exact concatenated native w:t text, preserving table/cell and raw paragraph identity. Original archive remains authoritative for layout/other markup.'},'paragraphs':native,'tables':tables,'ancillaryText':ancillary,'relationships':relationships}
GROUPS={
 'authority-and-immutable-identity':([25,26,27,28,29,30,33,34,35,38,110,111,136,142,883,940],['docs/RELEASE-GOVERNANCE.md','src/calculators/types.ts']),
 'typed-compute-inputs-rounding':(list(range(136,163)),['src/calculators/types.ts','src/calculators/engine.ts']),
 'structured-result-and-reconciliation':(list(range(163,195)),['src/calculators/final-framework/types.ts','src/lib/calculation-snapshot.ts']),
 'presentation-and-shared-ux':(list(range(195,281)),['src/components/final-calculator-renderer.tsx']),
 'plan-parity-and-accuracy-inputs':(list(range(281,383))+[676],['src/components/use-calculator-plan.ts','src/calculators/final-framework/entitlements.ts']),
 'advanced-analysis':(list(range(383,400)),['src/calculators/scenarios.ts']),
 'business-workflow':(list(range(400,415)),['src/app/business/page.tsx']),
 'trust-methodology-lifecycle':(list(range(415,470)),['src/lib/admin/publishing.ts']),
 'qualified-rule-applicability':(list(range(470,477)),['src/calculators/rule-packs.ts']),
 'ai-assistance-boundaries':(list(range(477,491)),['src/calculators/engine.ts']),
 'governing-entitlement-matrix':(list(range(800,882)),['src/calculators/final-framework/entitlements.ts','src/lib/entitlements.ts']),
 'catalog-planning-not-final':(list(range(882,941)),['data/catalog/master-catalog-2026.csv']),
 'glossary-and-locked-invariants':(list(range(1077,1117)),['docs/RELEASE-GOVERNANCE.md']),
 'reference-six-framework':(list(range(562,601)),['tests/next-runtime/calculator-review.mjs']),
 'discovery-and-seo':(list(range(491,514)),['src/lib/master-catalog.ts']),
 'accessibility-responsive-performance':(list(range(514,524)),['src/components/final-calculator-renderer.tsx']),
 'auth-billing-security':(list(range(524,548)),['tests/next-runtime/security.mjs','tests/next-runtime/auth-fixture.mjs']),
 'history-scenarios-exports':(list(range(548,562)),['src/lib/calculation-snapshot.ts']),
 'factory-and-definition-of-done':(list(range(652,677)),['src/calculators/launch-certification.test.ts']),
 'production-protection-and-research-hierarchy':(list(range(677,748)),['docs/MASTER-BLUEPRINT-GOVERNANCE-AMENDMENT-2026-10-26.md'])}
REFERENCE={1:list(range(568,573)),2:list(range(568,573)),52:list(range(573,578)),51:list(range(578,583)),26:list(range(583,588)),388:list(range(588,593)),138:list(range(593,598))}
def reconcile(path):
 native=source(path);ps=native['paragraphs'];ledger_path=pathlib.Path('docs/audits/final-acceptance-p0-2026-10-21/acceptance-ledger.csv');ledger_bytes=ledger_path.read_bytes();old=list(csv.DictReader(io.StringIO(ledger_bytes.decode())));covered=set();matches=[];non_bp=[]
 if len(old)!=424 or len({r['requirementId'] for r in old})!=424:raise ValueError('Historical424ledger drift')
 for row in old:
  if not row['requirementId'].startswith('BP-'):non_bp.append(row);continue
  numbers=[int(n) for n in row['sourceParagraphs'].split(',')];text=' | '.join(ps[n-1]['text'] for n in numbers)
  if text!=row['requirement']:raise ValueError('Historical/native requirement mismatch:'+row['requirementId'])
  covered.update(numbers);matches.append({'requirementId':row['requirementId'],'nativeParagraphIds':[ps[n-1]['paragraphId'] for n in numbers],'exactTextMatch':True,'historicalStatus':row['status'],'statusMeaning':'Retained historical scoped evidence, not new canonical acceptance.'})
 if len(matches)!=410 or len(non_bp)!=14 or len(covered)!=800:raise ValueError('Expected410native/14RC/800covered structure drift')
 omitted=[p for p in ps if p['nativeNonemptyOrdinal'] not in covered]
 groups=[{'groupId':name,'sourceParagraphIds':[f'BP-{n:04d}' for n in numbers],'sourceTextSHA256':sha('\n'.join(ps[n-1]['text'] for n in numbers).encode()),'repositoryCandidateEvidence':[{'path':p,'exists':pathlib.Path(p).exists(),'sha256':sha(pathlib.Path(p).read_bytes()) if pathlib.Path(p).is_file() else None} for p in paths],'scopeMeaning':'Architecture traceability, not per-ID formula approval or a requirement to render every optional field for every calculator.','acceptance':'NOT_INFERRED_FROM_REFERENCES'} for name,(numbers,paths) in GROUPS.items()]
 base=json.loads(pathlib.Path('docs/canonical-acceptance/canonical-ledger.json').read_text());catalog=list(csv.DictReader(io.StringIO(pathlib.Path('data/catalog/master-catalog-2026.csv').read_text())))
 if len(base['rows'])!=540 or len(catalog)!=540 or len({int(r['master_id']) for r in catalog})!=540:raise ValueError('Exact540catalog required')
 rows=[]
 for before,identity in zip(base['rows'],catalog):
  mid=int(identity['master_id'])
  if (before['masterId'],before['title'],before['domain'])!=(mid,identity['title'],identity['domain']):raise ValueError('Catalog identity/title/domain drift')
  rows.append({'masterId':mid,'title':before['title'],'domain':before['domain'],'blueprintSourceAvailable':True,'blueprintOriginalSHA256':SOURCE_SHA,'blueprintArchitectureGroups':list(GROUPS),'referenceSixNativeParagraphIds':[f'BP-{n:04d}' for n in REFERENCE.get(mid,[])],'referenceSixMeaning':'Native framework reference; Loan/EMI covers candidate IDs1/2 without choosing canonical identity for the owner. Not full-product acceptance.','sourceAvailabilityDiscrepancy':{'previous':'UNKNOWN_FULL_BLUEPRINT_UNAVAILABLE','current':'ORIGINAL_ARCHITECTURE_SOURCE_VERIFIED','applicationMessage':'Still old in frozen1497; do not extend app until failed exactheadCI is repaired/verified.'},'implementationClass':before['implementationClass'],'observedContracts':before['observedContracts'],'latestBoundedProfiles':before['latestBoundedProfiles'],'sourceAndReviewRestrictions':before['sourceAndReviewRestrictions'],'declaredFixtureIssues':before['declaredFixtureIssues'],'demonstratedDefects':before.get('demonstratedDefects',[]),'canonicalDisposition':'AUTHORITY_BLOCKED' if before['implementationClass']=='CONTRACT_BLOCKED' else 'FULL_CONTRACT_AND_EVIDENCE_REVIEW_REQUIRED','canonicalAccepted':False,'missingCanonicalRequirements':[m for m in before['missingRequirements'] if not m.startswith('Full Master Blueprint attachment and verified content hash unavailable')],'activeEngineeringGate':{'pr':1497,'sha':'7eff39b23a52953c028852d50d5571211a3f8a44','runId':41162017661,'conclusion':'failure','blocksApplicationExtension':True},'nextEngineeringAction':'After exact-head CI recovery: use native clauses to update the stale source-availability view, select/verify full identity-version-methodology contract and reconcile required shared UX. Preserve case-specific authority/qualified/publication gates.','certificationAuthorized':False,'publicationAuthorized':False,'releaseHold':True})
 coverage=[{'paragraphId':p['paragraphId'],'text':p['text'],'tableContexts':p['tableContexts'],'historicalRequirementIds':[m['requirementId'] for m in matches if p['paragraphId'] in m['nativeParagraphIds']],'architectureGroupIds':[g['groupId'] for g in groups if p['paragraphId'] in g['sourceParagraphIds']],'sourceStatus':'PRESERVED_WITH_CONTEXT_NOT_WAIVED','acceptanceInferred':False} for p in ps]
 return native,{'schemaVersion':1,'nativeSourceSHA256':SOURCE_SHA,'historicalLedgerSHA256':sha(ledger_bytes),'historicalRecordsPreserved':424,'nativeLinkedRecords':410,'nonNativeRCRecords':14,'exactMatches':matches,'nonNativeRecords':non_bp,'nativeParagraphsCovered':800,'previouslyUnrepresentedCount':len(omitted),'previouslyUnrepresentedNativeParagraphs':omitted,'allNativeParagraphTraceability':coverage,'fullScopeMeaning':'All1116nativeparagraphs/33tables retained.316outside selectedledger are not discarded or automatically classified as nonrequirements.','releaseHold':True},{'schemaVersion':1,'nativeSourceSHA256':SOURCE_SHA,'architectureGroups':groups,'catalogIdentityCount':540,'canonicalAccepted':0,'rows':rows,'sourceBoundary':ps[882]['text'],'releaseHold':True}
def artifacts(path):
 native,comparison,matrix=reconcile(path)
 text='\n'.join(p['paragraphId']+': '+p['text'] for p in native['paragraphs'])+'\n'
 discrepancies=[
 {'id':'source-availability-stale','nativeClauses':['BP-0025','BP-0026','BP-0027','BP-0883'],'affectedIds':[r['masterId'] for r in matrix['rows']],'fact':'Original source is now verified, but frozen1497 application still reports it unavailable. Correct source-availability integration after genuine CI recovery; do not promote canonical status.'},
 {'id':'canonical-contract-binding','nativeClauses':['BP-0136','BP-0137','BP-0654','BP-0655','BP-0940'],'affectedIds':[r['masterId'] for r in matrix['rows']],'fact':'Existing ledger has no approved complete canonical scope/mapping. Blueprint supplies architecture and delegates inventory; it does not itself approve the observed per-ID formulas.'},
 {'id':'declared-fixture-review','nativeClauses':['BP-0139','BP-0194','BP-0657','BP-0670','BP-0676'],'affectedIds':[r['masterId'] for r in matrix['rows'] if r['declaredFixtureIssues']],'fact':'Retained exact authored-fixture mismatches require explicit precision/contract review, not blanket tolerance. Not all are proven mathematical defects.'},
 {'id':'independent-v1-numerical-defects','nativeClauses':['BP-0027','BP-0030','BP-0110','BP-0138','BP-0657'],'affectedIds':[r['masterId'] for r in matrix['rows'] if r['demonstratedDefects']],'fact':'The independently demonstrated integral/limit defects and bounded private successors remain as recorded. Preserve historical versions; full-domain canonical correction remains unaccepted.'},
 {'id':'bounded-does-not-imply-final','nativeClauses':['BP-0034','BP-0658','BP-0661','BP-0662','BP-0663','BP-0940'],'affectedIds':[r['masterId'] for r in matrix['rows'] if r['observedContracts']['privateCandidates'] or r['latestBoundedProfiles']],'fact':'Bounded profiles and component evidence are not complete canonical products or lifecycle authority.'},
 {'id':'retained-authority-and-applicability','nativeClauses':['BP-0038','BP-0471','BP-0473','BP-0474','BP-0662'],'affectedIds':[r['masterId'] for r in matrix['rows'] if r['implementationClass']=='CONTRACT_BLOCKED'],'fact':'43case-specific full-product authority blocks remain; generic architecture does not supply provider, tax, clinical or institutional applicability.'}]
 queue={'schemaVersion':1,'globalPrerequisites':[{'priority':0,'action':'Repair and genuinely verify the failed exacthead CI. All application changes remain gated.'},{'priority':1,'action':'AftergreenCI integrate verified native source availability without replacing the immutable424record history or promoting canonical acceptance.'}],'perId':sorted([{'masterId':r['masterId'],'title':r['title'],'priority':0 if r['demonstratedDefects'] else 1 if r['declaredFixtureIssues'] else 2 if r['implementationClass']=='CONTRACT_BLOCKED' else 3,'discrepancyIds':[d['id'] for d in discrepancies if r['masterId'] in d['affectedIds']],'nativeArchitectureGroups':r['blueprintArchitectureGroups'],'nextAction':r['nextEngineeringAction'],'canonicalAccepted':False,'releaseHold':True} for r in matrix['rows']],key=lambda r:(r['priority'],r['masterId'])),'releaseHold':True}
 return {'discrepancies.json':json.dumps({'schemaVersion':1,'nativeSourceSHA256':SOURCE_SHA,'discrepancies':discrepancies,'meaning':'Evidence discrepancies and retained unestablished requirements, not an assertion that every unavailable full feature is absent.','releaseHold':True},ensure_ascii=False,indent=2)+'\n','remaining-work-queue.json':json.dumps(queue,ensure_ascii=False,indent=2)+'\n','native-blueprint.json':json.dumps(native,ensure_ascii=False,indent=2)+'\n','native-paragraphs.txt':text,'historical-ledger-reconciliation.json':json.dumps(comparison,ensure_ascii=False,indent=2)+'\n','blueprint-to-540.json':json.dumps(matrix,ensure_ascii=False,indent=2)+'\n','blueprint-to-540.csv':'masterId,title,canonicalDisposition,canonicalAccepted,blueprintSHA256\n'+''.join(str(r['masterId'])+',"'+r['title'].replace('"','""')+'",'+r['canonicalDisposition']+',false,'+SOURCE_SHA+'\n' for r in matrix['rows'])}
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--input',type=pathlib.Path,default=ROOT/'input/master-blueprint.docx');p.add_argument('--output',type=pathlib.Path,default=ROOT);p.add_argument('--check',action='store_true');a=p.parse_args();files=artifacts(a.input);a.output.mkdir(parents=True,exist_ok=True)
 for name,content in files.items():
  target=a.output/name
  if a.check:
   if target.read_text()!=content:raise ValueError('Stale native reconciliation:'+name)
  else:target.write_text(content)
 print('PASS originalDOCXCRC/SHA;1116paragraphs/33tables;410exacthistoricalmatches/14RCrecords;316additionalparagraphs preserved;540identitytraces;noacceptancepromoted')
