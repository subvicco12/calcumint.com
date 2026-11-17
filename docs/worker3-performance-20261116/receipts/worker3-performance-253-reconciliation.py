import json,hashlib,subprocess,pathlib,collections
repo='/workspace/calcumint-worker3-recovery-evidence'
source='b7a7c176cf6a2349a468d10ce30c25552835de5e';evidence='487de5291ab22690f8fc527fa8903c721504b05f';historical='4a895fcba82c719c21749d0efcfa5f8f1bad26a6';baseline='aa7b496a3b8bb4847a5d989d3c1e537f88296f9e'
auditpath='docs/worker3-recovery-20261116/validation/final-aa7-per-id-review-bindings.json';sha=lambda b:hashlib.sha256(b).hexdigest()
def git(*args,required=True):
 p=subprocess.run(['git','-C',repo,*args],stdout=subprocess.PIPE,stderr=subprocess.PIPE)
 if p.returncode:
  if required:raise RuntimeError(p.stderr.decode())
  return None
 return p.stdout
def data(ref,p,required=True):return git('show',ref+':'+p,required=required)
def blob(ref,p):return git('rev-parse',ref+':'+p).decode().strip()
raw=data(evidence,auditpath);audit=json.loads(raw);rows=[];counts=collections.Counter();source_defects=[];mismatches=[]
for index,old in enumerate(audit['rows']):
 path=old['path'];container,sep,fragment=path.partition('#');expected=old['expectedSHA256'];r={'index':index,'path':path,'expectedSHA256':expected,'originalReviewScope':old['reviewScope'],'originalBindingKind':old['bindingKind'],'originalLocation':old['location']}
 if container.startswith('/'):
  ref='EXTERNAL_LOCAL_RECEIPT';body=pathlib.Path(container).read_bytes();bound=body;category='EXTERNAL_RECEIPT_EXACT';r['scopeLimit']='Original external receipt bytes preserved; not a new test execution.'
 elif 'Git original evidence 4a895' in old['location']:
  ref=historical;body=data(ref,container);bound=body;category='HISTORICAL_GIT_EVIDENCE';r['scopeLimit']='Historical receipt only; does not qualify current implementation or CI.'
 elif sep and 'Exact captured text fragment' in old['bindingKind']:
  ref=evidence;body=data(ref,container);capture=json.loads(body);matches=[x for x in capture if x.get('name')==fragment];assert len(matches)==1
  bound=matches[0]['text'].encode();category='CAPTURED_TEXT_FRAGMENT';r.update({'fragment':fragment,'fragmentSelector':'unique record.name equals fragment; hash UTF-8 record.text','containerSHA256':sha(body),'catalogIds':matches[0].get('catalogIds'),'publisherURL':matches[0].get('url')})
 else:
  ref=evidence;body=data(ref,container,required=False)
  if body is None:ref=source;body=data(ref,container)
  bound=body;category='EXACT_FILE_BYTES'
  if container=='docs/worker3-recovery-20261116/candidate-reconciliation.json':category='FINAL_EVIDENCE_ADMINISTRATION_EXACT';r['scopeLimit']='Final487 administrative reconciliation, not engine/source implementation or new qualification proof.'
  if container=='docs/worker3-recovery-20261116/dispositions.json':category='ADMINISTRATIVE_DOCUMENT_SUPERSEDED';r['scopeLimit']='Original audit bound an in-progress workspace snapshot. Final487 administration supersedes it; old expected bytes are not asserted to match or to be recovered.'
 actual=sha(bound);match=actual==expected;r.update({'category':category,'readRef':ref,'gitBlob':blob(ref,container) if ref!='EXTERNAL_LOCAL_RECEIPT' else None,'actualSHA256':actual,'bytes':len(bound),'exactExpectedBindingMatch':match})
 if category=='ADMINISTRATIVE_DOCUMENT_SUPERSEDED':
  j=json.loads(bound);r['finalAdministrativeDisposition']={k:j.get(k) for k in ['testedHead','confirmedEngineeringBaseline','newConfirmedEngineering','engineeringTotal','potentialTotal','canonicalCountsChanged','certified','publicationEligible','releaseHold','productionChanges','PR1538Modified','hostedConclusion','qualifiedTestedHead']};r['originalHashRecoverability']='No matching original committed version located in path history; only final487 version is reachable for this path.'
  history=git('log','--all','--format=%H','--',container).decode().splitlines();r['reachablePathHistory']=[{'ref':h,'sha256':sha(data(h,container))} for h in history]
 elif not match:mismatches.append(r)
 # Compare current source ref with aa7 byte-for-byte wherever the bound path exists at both.
 current=data(source,container,required=False) if not container.startswith('/') else None;prior=data(baseline,container,required=False) if not container.startswith('/') else None
 if current is not None and prior is not None:
  same=current==prior;r['sourcePreservation']={'baselineRef':baseline,'currentRef':source,'baselineSHA256':sha(prior),'currentSHA256':sha(current),'unchanged':same}
  if not same:source_defects.append({'path':container,'baselineSHA256':sha(prior),'currentSHA256':sha(current)})
 counts[category]+=1;rows.append(r)
assert len(rows)==253
naive=json.load(open('/tmp/worker3-performance-preservation.json'));original_naive=[r['path'] for r in naive['bindingMismatches']]
report={'kind':'INDEPENDENT_ORIGINAL_253_BINDING_RECONCILIATION_NOT_QUALIFICATION','currentSourceRef':source,'originalImplementationRef':baseline,'finalEvidenceRef':evidence,'historicalEvidenceRef':historical,'originalAudit':{'path':auditpath,'gitBlob':blob(evidence,auditpath),'sha256':sha(raw),'recordedBindingCount':audit['bindingCount'],'ledgerModified':False},'bindingCount':len(rows),'exactExpectedBindingMatches':sum(r['exactExpectedBindingMatch'] for r in rows),'administrativeSupersessions':sum(r['category']=='ADMINISTRATIVE_DOCUMENT_SUPERSEDED' for r in rows),'categoryCounts':dict(counts),'unresolvedNonAdministrativeBindingMismatches':mismatches,'sourcePreservationMismatches':source_defects,'naive13PathsResolved':[{'path':p,'category':next(r['category'] for r in rows if r['path']==p),'exactExpectedBindingMatch':next(r['exactExpectedBindingMatch'] for r in rows if r['path']==p)}for p in original_naive],'interpretation':'252 original expected digests reverified exactly at their actual binding scope. One in-progress administrative dispositions snapshot is explicitly superseded by final487 and remains an expected-hash mismatch; it is not counted as an exact match. No calculator/source implementation difference was found for bound paths between aa7 and finalb7. This report does not rewrite the original253 audit, certify calculators or provide new CI evidence.','qualified':False,'baseline':81,'potential':101,'rows':rows}
assert not mismatches and not source_defects
out=pathlib.Path('/tmp/worker3-performance-253-reconciliation.json');out.write_text(json.dumps(report,indent=2)+'\n');print(json.dumps({k:v for k,v in report.items() if k not in ['rows','naive13PathsResolved']},indent=2));print('outputSHA256',sha(out.read_bytes()))
