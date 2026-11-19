"""Read-only exact-source and receipt comparison for the 11-profile readiness package."""
import argparse
import hashlib
import json
import re
import subprocess
from pathlib import Path

PARENT='32e4a846d12a1efae5569fd8fd401834fbd025bf'
BASE='49ea243b5be7e1ee9f3cd8af7f936ab784402cf7'
DAY4='5ff9d515af3cf4187087452e0e07ad8e607e7690'
DAYS=[
 ('5652d72c3c2b1f62c753658397d2df789aca067d','sole-final-factory-20261119',[326,330,509]),
 ('ffa3e485b903cbf8c7df95e4ee4216a1ac30927f','sole-structured-factory-20261119',[474]),
 ('19823b130982886f2d62a69d30caaf4be151831f','sole-specialized-factory-20261119',[458,252]),
 (DAY4,'sole-verified-delivery-20261119',[162,163,179,254,493]),
]
ADAPTER='src/lib/calculator-factory/private-final/adapter.ts'
WORKBENCH='src/components/sole-civil-time-20261119/workbench.tsx'
LEDGER='docs/publication540-shared/catalog/reconciliation-540.json'
FREEZE='docs/sole-factory-freeze-20261119'

def main():
 p=argparse.ArgumentParser()
 p.add_argument('--repository', required=True)
 p.add_argument('--output',type=Path,required=True)
 args=p.parse_args()
 inputs=Path(__file__).resolve().parent
 profiles=json.loads((inputs/'profiles.json').read_text())
 pr=json.loads((inputs/'pr.json').read_text())
 assert pr['headRefOid']==BASE and pr['state']=='OPEN' and pr['isDraft'] is True and pr['mergedAt'] is None
 refs={ref:sha for sha,ref in map(str.split,(inputs/'live-refs.tsv').read_text().splitlines())}
 assert refs['refs/pull/1538/head']==BASE
 for day,sha in enumerate([x[0] for x in DAYS]+[PARENT],1):
  assert refs[f'refs/heads/sole/final-factory-day{day}-20261119']==sha
 def git(*a):return subprocess.check_output(['git','-C',args.repository,*a])
 def exists(sha,path):return subprocess.run(['git','-C',args.repository,'cat-file','-e',f'{sha}:{path}'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL).returncode==0
 def read(sha,path):return git('show',f'{sha}:{path}')
 def pin(sha,path):
  data=read(sha,path)
  return {'commit':sha,'path':path,'sha256':hashlib.sha256(data).hexdigest(),'bytes':len(data)}
 for older,newer in zip([DAYS[0][0],DAYS[1][0],DAYS[2][0],DAY4],[DAYS[1][0],DAYS[2][0],DAY4,PARENT]):
  assert git('show','-s','--format=%P',newer).decode().split()==[older]
 assert read(BASE,LEDGER)==read(PARENT,LEDGER)
 ledger=json.loads(read(BASE,LEDGER))
 projection=json.loads(read(PARENT,f'{FREEZE}/freeze-projection.json'))
 for entry in read(PARENT,f'{FREEZE}/SHA256SUMS').decode().splitlines():
  sha,path=entry.split()
  assert pin(PARENT,f'{FREEZE}/{path}')['sha256']==sha
 assert projection['summary']['factorySprintAdoption']==11
 assert projection['frozenPRHead']==BASE
 assert {i['id'] for i in projection['rows'] if i['factorySprintAdoption']}=={int(i) for i in profiles}
 stage_names={namespace for _,namespace,_ in DAYS}
 relevant=set()
 admissions=[]
 comparisons=[]
 for index,(sha,namespace,ids) in enumerate(DAYS,1):
  docs=f'docs/{namespace}'
  receipt=json.loads(read(sha,f'{docs}/native-receipt.json'))
  assert receipt['passed'] and receipt['productionWrites'] is False and not receipt['publicationFixture']
  assert not receipt.get('browserErrors')
  pins=json.loads(read(sha,f'{docs}/source-fingerprints.json'))
  for path,item in pins['buildInputs'].items():
   assert pin(sha,path)['sha256']==item['sha256'], path
   assert exists(DAY4,path)
   result=pin(DAY4,path)
   if result['sha256']!=item['sha256']:
    comparisons.append({'day':index,'path':path,'testedSha256':item['sha256'],'day4Sha256':result['sha256']})
   if any('/'+ns+'/' in path for ns in stage_names) or path==ADAPTER:
    relevant.add(path)
  harness=pins['nativeHarness']['path']
  assert pin(sha,harness)['sha256']==pins['nativeHarness']['sha256']
  relevant.add(harness)
  focused='src/lib/calculator-factory/private-final/adapter.test.ts' if index==1 else 'src/lib/calculator-factory/private-final/structured.test.ts' if index==2 else f'src/lib/{namespace}/cohort.test.ts'
  relevant.add(focused)
  delta={record['catalogId']:record for record in json.loads(read(sha,f'{docs}/ledger-evidence-delta.json'))['records']}
  for id in ids:
   row=ledger['rows'][id-1];assert row['masterId']==id
   bound=delta[id]
   c,=(c for c in row['candidates'] if c['registryExactTuple'] and (c['engineId'],c['slug'],c['version'])==(bound['engineId'],bound['slug'],bound['version']))
   assert c['version']==1
   definition,symbol,input_contract,output_contract,numerical,historical,limitation=profiles[str(id)]
   assert read(BASE,definition)==read(sha,definition)==read(DAY4,definition)
   implementation=f'src/lib/{namespace}/cohort.ts'
   prior=projection['rows'][id-1]['authoritativePrivateImplementation']
   assert prior==pin(sha,implementation)
   assert sorted(x['plan'] for x in receipt['rows'] if x['id']==id)==['business','free','pro']
   downloads=[{k:x[k] for k in ('format','bytes','sha256')} for x in receipt['downloads'] if x['id']==id]
   assert sorted(x['format'] for x in downloads)==['csv','json','pdf']
   assert all(re.fullmatch('[0-9a-f]{64}',x['sha256']) and x['bytes']>0 for x in downloads)
   admissions.append({'catalogId':id,'title':row['title'],'registeredCandidateSlug':c['slug'],'identityEvidenceBasis':c['basis'],'identityCandidate':c['identityCandidate'],'canonicalMappingApproved':row['canonicalMappingApproved'],
    'engine':{'id':c['engineId'],'version':1,'definition':pin(BASE,definition),'binding':symbol},'implementation':prior,
    'sourceVersion':f'{namespace}.1/{c["engineId"]}@1','presentation':pin(sha,f'src/components/{namespace}/result.tsx'),
    'inputContract':input_contract,'outputContract':output_contract,'numericalWitness':numerical,'historicalWitness':historical,
    'focusedTest':pin(sha,focused),'focusedReceipt':pin(sha,f'{docs}/focused-tests.log'),
    'nativeReceipt':pin(sha,f'{docs}/native-receipt.json'),'nativeHarness':pin(sha,harness),'buildReceipt':pin(sha,f'{docs}/build.log'),
    'exportReadbackReceiptValues':downloads,'sourcePrecisionLimits':limitation,
    'scopedQualification':'NOT_PROMOTED','blueprintQA':'COMPETENT_FULL_SCOPE_QA_PENDING',
    'business':{'isolated':'OWNED_SCENARIOS_AND_CURRENT_MEMBERSHIP_READER','shared':'EXACT_TUPLE_POLICY_AND_APPROVAL_REQUIRED'},
    'requiredApprovals':['canonical scope and source applicability','numerical and precision decision','independent applicable Blueprint QA','source/replay admission','separately scoped Business capability adoption where applicable']})
 assert len(admissions)==11 and len({r['catalogId'] for r in admissions})==11
 assert set((c['day'],c['path']) for c in comparisons)=={(1,ADAPTER)}
 relevant.add(WORKBENCH)
 changed=git('diff','--name-only',BASE,DAY4,'--','src','tests','scripts','.github','supabase').decode().splitlines()
 adaptation={ADAPTER:'Day 1 originally tested the predecessor; retain the later adapter only after affected parity and browser checks.',
  WORKBENCH:'Reuse only the exact structured workbench dependency, or explicitly extract its compatible shared interface; retain historical civil-time app as separate.',
  'src/lib/sole-structured-factory-20261119/cohort.ts':'Restrict admission to #474; the five reference-only profiles and their imports must remain isolated.',
  'src/lib/calculator-factory/private-final/adapter.test.ts':'Retained cohorts are reference dependencies; keep as historical fixtures or use narrow exact-source imports.',
  'tests/sole-structured-factory-20261119/auth-browser.mjs':'Original six-profile native scope includes five references; use an affected #474 journey for the proposed batch.',
  'src/lib/registered-snapshot-verification.ts':'Propose explicit slug and version dispatch only where generic compatibility needs it; existing fallback and prior bindings stay intact.'}
 files=[]
 for path in sorted(set(changed)|relevant|set(adaptation)|{r['engine']['definition']['path'] for r in admissions}|
                    {'src/calculators/registry.ts','src/lib/calculator-factory/registry.ts','.github/workflows/ci.yml',
                     'src/lib/calculator-factory/workflows.ts','src/app/admin/calculator-factory/actions.ts','src/components/final-calculator-renderer.tsx'}):
  old=pin(BASE,path) if exists(BASE,path) else None
  new=pin(DAY4,path) if exists(DAY4,path) else None
  if path in adaptation:
   kind='REQUIRES_EXPLICIT_INTEGRATION_ADAPTATION'; reason=adaptation[path]
  elif path not in changed:
   assert old and new and old['sha256']==new['sha256']
   kind='MUST_REMAIN_UNCHANGED' if path.startswith(('src/calculators/','.github/')) or path=='src/lib/calculator-factory/registry.ts' else 'EXISTING_EQUIVALENT'
   reason='Exact bytes match the frozen PR; no replacement is needed.'
  elif path in relevant or any('/'+ns+'/' in path for ns in stage_names):
   assert old is None
   kind='ADD_WITHOUT_CONFLICT';reason='Target path absent from frozen PR. Requires later authorized admission and dependency checks.'
  else:
   kind='BLOCKED_BY_SOURCE_OR_AUTHORITY';reason='Preceding isolated work outside the 11-profile batch. Preserve on its original branch.'
  files.append({'path':path,'classification':kind,'frozen':old,'day4':new,'reason':reason})
 assert not git('diff','--name-only',BASE,DAY4,'--','src/calculators','.github','supabase').strip()
 result={'kind':'nonexecuted-integration-readiness','frozenHead':BASE,'evidenceParent':PARENT,
  'ledger':pin(BASE,LEDGER),'freezeProjection':pin(PARENT,f'{FREEZE}/freeze-projection.json'),
  'freezeVerification':pin(PARENT,f'{FREEZE}/verification.log'),'retainedInventory':pin(PARENT,f'{FREEZE}/retained-refs.tsv'),
  'operatorProcedure':pin(BASE,'docs/operational-thirteen-20261110/PROCEDURE.md'),
  'profiles':admissions,'receiptSourceDifferences':comparisons,'files':files,
  'approval':'BLOCKED','integration':'NO_GO','publication':'NO_GO'}
 args.output.write_text(json.dumps(result,indent=2)+'\n')
 print(f'PASS {len(admissions)} exact profiles; {len(files)} classified files; {len(comparisons)} retained receipt source difference')

if __name__=='__main__':main()
