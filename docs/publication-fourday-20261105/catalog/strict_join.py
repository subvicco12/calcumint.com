import json,hashlib,collections
from pathlib import Path
out=Path(__file__).parent
p='docs/publication-fourday-20261105/production/catalog.json'; production=json.load(open(p)); base=json.load(open(out/'normalized-540-base.json')); qualifiedPath='docs/authority485/research-input/retained-qualified-requirements-11.json';qualified=json.load(open(qualifiedPath)); source16=json.load(open('docs/partial16-ci-recovery/source-audit.json'))
bytuple={(r['calculator_key'],r['version']):r for r in production['catalog']}
q={r['masterId']:(i,r) for i,r in enumerate(qualified['rows'])}
for r in base['rows']:
 r['secondaryEngineeringPriorityClass']=r.pop('provisionalClassBeforeFreshProductionJoin'); r['strictClass']='E'; r['strictClassReason']='CANONICAL_MAPPING_AND_FULL_CONTRACT_OWNER_ADOPTION_UNRESOLVED'; r['decisionFlags'].append('CANONICAL_ID_VERSION_AND_FULL_CONTRACT_ADOPTION_REQUIRED')
 matches=[]
 for c in r['candidateBindings']:
  k=(c.get('engineId'),c.get('version')); m=bytuple.get(k)
  if m:matches.append({'matchBasis':'ENGINE_VERSION_CANDIDATE_ONLY_NOT_APPROVED_CANONICAL_ID','productionRow':m,'freshPublicUrlVerification':'UNKNOWN_NOT_CAPTURED_IN_DB_CATALOG','candidateUrl':c.get('proposedUrl')})
 r['freshProductionCandidateMatches']=matches;r['currentProductionVerification']='CANDIDATE_DB_MATCH_ONLY_PUBLIC_URL_UNKNOWN' if matches else 'NO_EXACT_CANDIDATE_TUPLE_IN_CAPTURE';r['currentAuthoritativeQaEvidence']='MATCHED_PRODUCTION_CANDIDATE_PRESENT_GLOBAL_AGGREGATE_QA_NOT_PER_ID_ACCEPTANCE' if matches else 'UNKNOWN_NO_MATCHED_PRODUCTION_GOVERNANCE';r['strictAStatus']='NOT_ESTABLISHED_APPROVED_CANONICAL_MAPPING_AND_FRESH_URL_REQUIRED';r['strictBStatus']='NOT_ESTABLISHED_FULL_EXACT_VERSION_CERTIFICATION_REQUIRED'
 if r['masterId'] in q:r['retainedQualifiedReview']=q[r['masterId']][1];r['evidencePointers']['retainedQualified11']=qualifiedPath+'#/rows/'+str(q[r['masterId']][0])
base['kind']='STRICT_CANONICAL_PARTITION_WITH_SEPARATE_ENGINEERING_PRIORITY_VIEW';base['summary']['strictCounts']={'A':0,'B':0,'C':0,'D':0,'E':540,'F':0};base['summary']['secondaryEngineeringPriorityCounts']=base['summary'].pop('provisionalCounts');base['summary']['freshProductionJoinPending']=False;base['summary']['freshPublicUrlVerification']='UNKNOWN';base['summary']['strictAZeroMeaning']='No exact approved canonical ID plus fresh URL established; actual published/public total is not zero';base['summary']['productionRows']=len(production['catalog']);base['summary']['productionCanonicalMetadataPopulated']=sum(r['canonical'] is not None for r in production['catalog']);base['summary']['productionCertificationMetadataPopulated']=sum(r['certification'] is not None for r in production['catalog']);base['summary']['strictEReasonCounts']={'497_engineering_records_full_contract_review_required':497,'43_retained_authority_cases':43};base['strictClassIds']={k:list(range(1,541)) if k=='E' else [] for k in 'ABCDEF'};base['secondaryEngineeringPriorityClassIds']=base.pop('provisionalClassIds');base['sourceHashes'][p]=hashlib.sha256(Path(p).read_bytes()).hexdigest();base['sourceHashes'][qualifiedPath]=hashlib.sha256(Path(qualifiedPath).read_bytes()).hexdigest();base['productionObservationAt']=production['observed_at'];base['summary']['globalProductionQaCounts']=production['qa_counts'];base['summary']['globalProductionQaMeaning']='Aggregate checks for209 production engine records, not per-canonical-ID acceptance and not transferred to unmatched candidates'
(out/'normalized-540-base.json').write_text(json.dumps(base,indent=2)+'\n')
(out/'source16-qualified-reconciliation.json').write_text(json.dumps({'source16':source16,'qualified11':qualified,'meaning':'16 source-resolution cases remain within43 retained authority blockers;11 qualified records are additional retained review evidence, not approvals; all540 still require canonical/full-contract adoption.'},indent=2)+'\n')
print(base['summary']['strictCounts']);print('candidate matched IDs',sum(bool(r['freshProductionCandidateMatches']) for r in base['rows']))
queuePath=out/'decision-queue.json';queue=json.load(open(queuePath));queue['scope']='56 targeted decision packets only; all540 need canonical/full-contract adoption; see normalized strictClassIds.E'
for r in queue['rows']:
 if 'primaryClassBeforeFreshJoin' in r:r['secondaryEngineeringPriorityClass']=r.pop('primaryClassBeforeFreshJoin')
 r['strictClass']='E'
queuePath.write_text(json.dumps(queue,indent=2)+'\n')
