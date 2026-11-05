import json,hashlib,collections
from pathlib import Path
out=Path(__file__).parent
paths={'publication':'docs/calculator-first/publication-readiness-540.json','batch22':'docs/full-product-batch22/publication-readiness-540.json','blueprint':'docs/blueprint-reconciliation/blueprint-to-540.json','requirements':'docs/full-product-batch16/requirements-540.json','implementation':'docs/software-closure/requirements-540.json','closure44':'docs/calculator-first-20261105/engineering-closure.json','authority43':'docs/full-product-batch16/authority-requests-43.json','source16':'docs/partial16-ci-recovery/source-audit.json','calculus':'docs/canonical-calculus/engineering-overlay-540.json','six':'docs/post1518-publication-qa/six-owner-reviewer-decisions.json'}
data={k:json.load(open(v)) for k,v in paths.items()}
indexes={k:{r.get('masterId',r.get('catalogId')):(i,r) for i,r in d.get('rows',[]).__iter__()} for k,d in []}
indexes={k:{r.get('masterId',r.get('catalogId')):(i,r) for i,r in enumerate(d.get('rows',[]))} for k,d in data.items()}
def ptr(k,n):return paths[k]+'#/rows/'+str(indexes[k][n][0])
authority=set(indexes['authority43']); explicit={214,217,224,268,246,247,248}|set(indexes['six']); defects={247,248}
rows=[]
for n in range(1,541):
 p=indexes['publication'][n][1]; b=indexes['blueprint'][n][1]; req=indexes['requirements'][n][1]; imp=indexes['implementation'][n][1]
 c='D' if n in defects else 'E' if n in authority|explicit else 'F' if imp['implementationClass'] in ['MISSING_ENGINE','COMPONENT_ONLY'] else 'C'
 rows.append({'masterId':n,'title':p['title'],'domain':b['domain'],'provisionalClassBeforeFreshProductionJoin':c,'historicalPublicationDisposition':p['disposition'],'historicalLiveObserved':p['disposition']=='LIVE_VERIFIED','implementationClass':imp['implementationClass'],'fullyCertifiedEligibleEstablished':False,'canonicalMappingApproved':p['canonicalMappingApproved'],'canonicalAccepted':p['canonicalAccepted'],'currentProductionVerification':'UNKNOWN_PENDING_FRESH_JOIN','currentAuthoritativeQaEvidence':'UNKNOWN_PENDING_FRESH_JOIN','candidateBindings':p.get('candidates',[]),'privateCandidates':p.get('privateCandidates',[]),'requirementCounts':dict(collections.Counter(r['status'] for r in req['requirements'])),'declaredFixtureIssues':b['declaredFixtureIssues'],'demonstratedLegacyDefects':b['demonstratedDefects'],'sourceAndReviewRestrictions':b['sourceAndReviewRestrictions'],'decisionFlags':([ 'RETAINED_AUTHORITY43' ] if n in authority else [])+(['EXPLICIT_CONTRACT_OR_ADOPTION_DECISION'] if n in explicit else []),'partial16SourceCase':n in data['source16']['exact16Ids'],'closure44EvidencePresent':n in indexes['closure44'],'boundedEngineeringEvidenceDoesNotEstablishFullContract':True,'evidencePointers':{k:ptr(k,n) for k in ['publication','batch22','blueprint','requirements','implementation','closure44','authority43','calculus','six'] if n in indexes[k]}})
classes={c:[r['masterId'] for r in rows if r['provisionalClassBeforeFreshProductionJoin']==c] for c in 'ABCDEF'}
result={'kind':'READ_ONLY_EXISTING_EVIDENCE_NORMALIZATION_PENDING_FRESH_PRODUCTION_JOIN','baseline':'0d2b8cf89e0d7c38c6d69255781f5c4f26cc2d84','productionWrites':False,'sourceHashes':{v:hashlib.sha256(Path(v).read_bytes()).hexdigest() for v in paths.values()},'summary':{'identities':len(rows),'provisionalCounts':{k:len(v) for k,v in classes.items()},'historicallyObservedLiveIds':[r['masterId'] for r in rows if r['historicalLiveObserved']],'fullyCertifiedEligibleEstablished':0,'freshProductionJoinPending':True},'provisionalClassIds':classes,'rows':rows}
(out/'normalized-540-base.json').write_text(json.dumps(result,indent=2)+'\n')
queue=[]
for n in sorted(authority|explicit):
 q={'masterId':n,'title':rows[n-1]['title'],'primaryClassBeforeFreshJoin':rows[n-1]['provisionalClassBeforeFreshProductionJoin'],'evidencePointers':rows[n-1]['evidencePointers']}
 if n in authority:q['retainedAuthorityRequest']=indexes['authority43'][n][1]
 if n in indexes['six']:q['retainedSixDecisionPacket']=indexes['six'][n][1]
 if n in {214,217,224,268}:q['decisionAlternatives']={214:['Approve existing EPSILON-adjusted v1 policy within explicit limits','Approve a specified immutable successor rounding/tie policy'],217:['Adopt math weighted-average full dataset/weight contract','Resolve Range/health identity separately and preserve clinical screening'],224:['Specify exact supported runtime/version and strict equality','Approve independently justified precision/tolerance and immutable successor policy'],268:['Adopt regular n/side polygon contract','Require arbitrary-vertex polygon implementation under separate adopted contract']}[n]
 if n in {246,247,248}:q['decisionAlternatives']=['Adopt explicitly bounded rational/polynomial private successor after competent review; preserve legacy identity/history','Require broader CAS/transcendental contract and implement missing supported-domain behavior before acceptance']
 queue.append(q)
(out/'decision-queue.json').write_text(json.dumps({'kind':'PENDING_DECISIONS_NOT_AUTHORIZATION','rows':queue},indent=2)+'\n')
print(result['summary']['provisionalCounts']);print('decision queue',len(queue));print('source16',data['source16']['exact16Ids'])

# Apply authoritative production metadata join and strict canonical partition.
exec((out/"strict_join.py").read_text())

exec((out/"actionable.py").read_text())
