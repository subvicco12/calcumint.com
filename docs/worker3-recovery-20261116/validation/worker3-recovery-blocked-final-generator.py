#!/usr/bin/env python3
"""Emit documentation for an observed failed frozen candidate. Run only after root results notice."""
import argparse,copy,hashlib,json,pathlib,re,subprocess,sys
P=argparse.ArgumentParser();P.add_argument('--repo',required=True);P.add_argument('--config',required=True);P.add_argument('--validate-only',action='store_true');a=P.parse_args();R=pathlib.Path(a.repo).resolve();C=json.loads(pathlib.Path(a.config).read_text());D=R/'docs/worker3-recovery-20261116';F='aa7b496a3b8bb4847a5d989d3c1e537f88296f9e';APP='50240fb1d59a1f8d298718f85e58bd55b4b990c2';ORIG='419d56c17ca72dae58132aa00c7424b07477aa6c'
def git(*xs):return subprocess.check_output(['git','-C',str(R),*xs],text=True).strip()
def blob(ref,p):return subprocess.check_output(['git','-C',str(R),'show',ref+':'+p])
def sha(b):return hashlib.sha256(b).hexdigest()
def read(p):return json.loads(pathlib.Path(p).read_text())
def need(ok,msg):
 if not ok:raise SystemExit('BLOCKED_FINAL refused: '+msg)
def bind(p):
 p=pathlib.Path(p);return {'path':str(p.relative_to(R)) if p.is_relative_to(R) else str(p),'bytes':p.stat().st_size,'sha256':sha(p.read_bytes())}
def put(n,x):(D/n).write_text(json.dumps(x,indent=2,ensure_ascii=False)+'\n')
need(C.get('rootQualificationDecision')=='KEEP_IMPLEMENTED_NOT_QUALIFIED','explicit root decision keeps all 20 unqualified')
need(C['mode']=='BLOCKED_FINAL' and C['rootFreezeConfirmed'] is True and C.get('rootResultsNoticeConfirmed') is True,'explicit root freeze and terminal-results notice required')
need(C['observedImplementationHead']==C['exactHostedHead']==git('rev-parse','HEAD')==F and C['qualifiedTestedHead'] is None,'exact root-provided observed/headaa7 and null qualified head')
need(git('branch','--show-current')==C['evidenceBranch'],'evidence branch')
need(git('remote','get-url','origin')=='https://github.com/subvicco12/calcumint.com.git','repository origin')
for scope in ['.github','supabase/migrations','docs/milestone100-20261114/requirements-540.json']:
 need(not git('diff','--name-only',ORIG,F,'--',scope),'protected diff '+scope)
need((R/'.github/workflows/ci.yml').read_bytes()==blob(F,'.github/workflows/ci.yml')==blob(APP,'.github/workflows/ci.yml'),'exact unchanged workflow bytes')
for p in ['docs/next-engineering-20261115/candidate-dispositions.json','docs/milestone100-20261114/requirements-540.json']:
 need((R/p).read_bytes()==blob(F,p)==blob(ORIG,p),'original/final bytes '+p)
base=read(R/'docs/next-engineering-20261115/candidate-dispositions.json');ledger=read(R/'docs/milestone100-20261114/requirements-540.json');ids=[*range(284,292),300,329,*range(333,343)]
need(sorted(r['catalogId'] for r in base['rows'])==ids,'exact20 IDs')
for r in base['rows']:
 i=r['catalogId'];p=r['engineBinding']['path'];need(sha((R/p).read_bytes())==r['engineBinding']['sha256'] and (R/p).read_bytes()==blob(F,p),'engine'+str(i))
 need(r['identity']['version']==1 and r['identity']['sourceVersion']=='factory-wave1-20261112.1/'+r['identity']['engineId']+'@1/private.next-engineering.20261115.1','version/sourceVersion'+str(i))
 lr=next(x for x in ledger['rows'] if x['masterId']==i);need(sha(json.dumps(lr,separators=(',',':'),ensure_ascii=False).encode())==r['ledgerBinding']['rowSha256'],'ledger row'+str(i))
 for e in r['localEvidence']:need(sha((R/e['path']).read_bytes())==e['sha256'],'publisher '+e['path'])
src=read(R/'docs/next-engineering-20261115/source/stage10-current32.json');paths={r['path'] for r in src['rows']};need(src['codeRef']==APP and len(paths)==32,'current32 capture')
need(set(git('diff','--name-only','3ccdd6d026ca0ec51063ff4501901ac92e8ace6a',F,'--','src').splitlines())==paths,'exact32 src diff')
for r in src['rows']:
 p=r['path'];v=r['current'];need((R/p).read_bytes()==blob(APP,p)==blob(F,p) and sha((R/p).read_bytes())==v['sha256'] and len((R/p).read_bytes())==v['bytes'] and git('rev-parse',F+':'+p)==v['blob'],'source32 blob/bytes/SHA '+p)
ci=C['ci'];need(ci['runId']==43819119226 and ci['runAttempt']==1 and ci['workflowId']==357576907,'run/workflow identities')
run=read(ci['runMetadataPath']);rawjobs=read(ci['jobsMetadataPath']);jobs=rawjobs['jobs'] if isinstance(rawjobs,dict) else rawjobs;wf=read(ci['workflowMetadataPath'])
need(run['id']==ci['runId'] and run['run_attempt']==1 and run['workflow_id']==357576907 and run['path']=='.github/workflows/ci.yml' and run['event']=='workflow_dispatch' and run['repository']['full_name']=='subvicco12/calcumint.com' and run['head_sha']==F and run['head_branch']==C['candidateBranch'],'actual run identity')
need(run['status']=='completed' and run['conclusion'] is not None,'terminal run')
need(wf['id']==357576907 and wf['path']=='.github/workflows/ci.yml','workflow metadata')
names={'checks','build','full-product','source-acceptance','publication-factory','validate'}
need(len(jobs)==6 and len({j['id'] for j in jobs})==6 and {j['name'] for j in jobs}==names,'exact six unique jobs')
for j in jobs:need(j['run_id']==run['id'] and j['head_sha']==F and j['run_attempt']==1 and j['status']=='completed' and j['conclusion'] is not None,'job identity/terminal '+j['name'])
need(set(ci['logs'])==names and all(pathlib.Path(p).is_file() for p in ci['logs'].values()),'all six actual logs')
# Root supplies genuine reviewed actual receipts, with provenance/content retained. Reuse is source-bound.
for name in ['delivery','business']:
 q=C['observedGates'][name];p=pathlib.Path(q['path']);need(p.is_file() and sha(p.read_bytes())==q['sha256'],'actual '+name+' receipt hash')
 need(q['sourceCaptureHead']==APP and q['passed'] is True,'actual source-bound '+name+' gate')
bm=read(D/'business-refresh/dependency-map-125.json');need(len(bm)==125 and all(sha((R/p).read_bytes())==s for p,s in bm.items()),'125 Business files')
need(C['observedGates']['delivery']['passedTests']==131,'actual delivery131')
dr=read(C['observedGates']['delivery']['path']);need(dr['base']==ORIG and dr['followup']['red']['exitCode']==1 and dr['followup']['green']['exitCode']==0 and dr['followup']['green']['result']=='131 passed including20 actual result/source/unit behavior and69 original fullresponse/export hashes' and dr['followup']['eslint']['exitCode']==0 and dr['eslint']['processExitCode']==0 and dr['diffCheck']['exitCode']==0,'delivery actual red/green131/lint/diff content')
for name in ['red','green','eslint']:
 p=pathlib.Path(dr['followup'][name]['log']);need(p.is_file(),'delivery followup '+name+' log')
greenText=pathlib.Path(dr['followup']['green']['log']).read_text();need(re.search(r'131\s+passed',greenText) is not None,'131 passed in actual followup log')
br=read(C['observedGates']['business']['path']);need(br['passed'] is True and br['productionWrites'] is False and br['sqlActivated'] is False and br['integratedRecovery'] is True and len(br['integratedSourceHashes'])==125,'genuine Business receipt content')
need(C['observedGates']['business']['dependencyCount']==125,'actual Business125')
for name,q in C['remoteProofs'].items():
 if name=='candidate':
  p=pathlib.Path(q['path']);need(p.is_file() and sha(p.read_bytes())==q['sha256'] and q['remoteHead']==F,'candidate frozen remote proof')
  need(re.search(r'(?m)^'+F+r'\s+refs/heads/'+re.escape(C['candidateBranch'])+r'\s*$',p.read_text()) is not None,'actual captured ls-remote exact candidate branch line')
need(C['failedReasons'] and all(isinstance(x,str) and x for x in C['failedReasons']),'explicit material failed reasons')
if a.validate_only:print('BLOCKED_FINAL validated; no files changed');sys.exit(0)
# Copy references only after checks, preserve /tmp provenance and add repository-relative destinations.
if not a.validate_only:
 Q=D/'final-observation-receipts';Q.mkdir(exist_ok=True)
 for name,q in C['observedGates'].items():
  if q.get('path') and pathlib.Path(q['path']).is_file():
   dest=Q/(name+'-'+pathlib.Path(q['path']).name);dest.write_bytes(pathlib.Path(q['path']).read_bytes());q['copiedRepositoryPath']=str(dest.relative_to(R))
 for name,q in C['remoteProofs'].items():
  if q.get('path') and pathlib.Path(q['path']).is_file():
   dest=Q/(name+'-'+pathlib.Path(q['path']).name);dest.write_bytes(pathlib.Path(q['path']).read_bytes());q['copiedRepositoryPath']=str(dest.relative_to(R))
 for name in ['red','green','eslint']:
  p=pathlib.Path(dr['followup'][name]['log']);(Q/p.name).write_bytes(p.read_bytes())
# Reuse static default generator only after all final-observation checks. Its default never qualifies.
subprocess.run([sys.executable,'/tmp/worker3-recovery-evidence-generator.py','--repo',str(R)],check=True)
x=read(D/'dispositions.json');need(x['newConfirmedEngineering']==0 and x['engineeringTotal']==81,'default unqualified result')
need(set(x['blockedGates'])<={'explicitFrozenHeadProvided'},'genuine static/default binding failure: '+str(x['blockedGates']))
x['historicalUnobservedGates']={'blockedGates':copy.deepcopy(x['blockedGates']),'gates':copy.deepcopy(x['gates']),'note':'Default generator observation preserved before final actual run and source-bound reuse are reconciled.'}
x.update({'mode':'BLOCKED_FINAL','testedHead':F,'observedImplementationHead':F,'exactHostedHead':F,'qualifiedTestedHead':None,'hostedConclusion':run['conclusion'],'hostedRunId':run['id'],'hostedRunAttempt':1,'blockedReasons':C['failedReasons'],'qualificationGranted':False})
for r in x['rows']:
 r.update({'testedHead':F,'observedImplementationHead':F,'exactHostedHead':F,'qualifiedTestedHead':None,'disposition':'IMPLEMENTED_NOT_QUALIFIED','sharedGatesPassed':False})
 r['deliveryGate'].update({'passed':True,'passedTests':131,'proofType':'Reused genuine affected delivery verification; identical application src at final head','sourceCaptureHead':APP,'receipt':C['observedGates']['delivery']})
 r['businessGate'].update({'passed':True,'dependencyCount':125,'proofType':'Genuine disposable refresh reused under exact 125-file source binding','receipt':C['observedGates']['business']})
 r['finalPerIdReviewBinding']={'review':'validation/worker3-final-per-id-contract-review.json','bindingProof':'validation/final-aa7-per-id-review-bindings.json','bindingCount':253,'mismatches':0,'reviewedSourceHead':'4e52927bdd8c5d7f3bbce1f5f7d9bac0a4faf2f7','finalObservedHead':F,'status':'SCOPED_MODEL_CONDITIONS_REVIEWED_NO_ADDITIONAL_CANDIDATE_BLOCKER; shared failures prevent qualification'}
 r['historicalUnobservedSharedGates']=copy.deepcopy(r.get('sharedQualification',{}))
 r['sharedQualification']={'passed':False,'failedReasons':C['failedReasons'],'qualifiedTestedHead':None}
x['blockedGates']=['sharedTimingAndHostedCI'];x['gates'].pop('explicitFrozenHeadProvided',None)
x['gates']['actualFinalHostedCI']={'passed':run['conclusion']=='success' and all(j['conclusion']=='success' for j in jobs),'actualRunConclusion':run['conclusion'],'jobs':[{k:j[k] for k in ['id','name','run_id','run_attempt','head_sha','status','conclusion']} for j in jobs]}
put('dispositions.json',x)
K=D/'final-ci';K.mkdir(exist_ok=True)
for n,p in {'run.json':ci['runMetadataPath'],'jobs.json':ci['jobsMetadataPath'],'workflow.json':ci['workflowMetadataPath'],**{n+'.log':p for n,p in ci['logs'].items()}}.items():(K/n).write_bytes(pathlib.Path(p).read_bytes())
put('final-observed-config.json',C);put('final-observed-checkpoint.json',{'kind':'BLOCKED_FINAL_FROZEN_CANDIDATE','observedImplementationHead':F,'exactHostedHead':F,'qualifiedTestedHead':None,'engineeringBaseline':81,'newConfirmedEngineering':0,'disposition':'IMPLEMENTED_NOT_QUALIFIED','runId':run['id'],'runAttempt':1,'conclusion':run['conclusion'],'jobs':x['gates']['actualFinalHostedCI']['jobs'],'failedReasons':C['failedReasons'],'remoteProofs':C['remoteProofs'],'finalSourceCommits':C['finalSourceCommits']})
h=D/'HANDOFF.md';body=h.read_text().split('\n## Final frozen observed candidate')[0];body=body.replace('The confirmed engineering baseline is **81**.', 'Recovery newly qualified **0 calculators**; the confirmed engineering baseline remains **81**. Passing delivery, Business and source repairs are separately evidenced; shared timing and mandatory CI failures prevent qualification.');h.write_text(body)
with h.open('a') as f:f.write('\n## Final frozen observed candidate\n\nImplementation and hosted head: `'+F+'`. Qualified tested head: **null**. [Final mandatory CI '+str(run['id'])+']('+run['html_url']+'), attempt 1, completed with **'+run['conclusion']+'**. All 20 calculators remain IMPLEMENTED_NOT_QUALIFIED; engineering total remains 81. Delivery 131-test evidence and genuine Business 125-file refresh remain separately passing under unchanged source bindings; shared timing and CI failures remain material.\n\n'+ '\n'.join('- '+s for s in C['failedReasons'])+'\n')
# Readable per-ID handoff is sourced from the emitted exact dispositions JSON.
finalRows=read(D/'dispositions.json')['rows']
with h.open('a') as f:
 f.write('\nFour final CI jobs passed: checks, build, full-product and publication-factory. Source-acceptance was cancelled; validate failed. Complete run/job identities and all six logs are in `final-ci/`. A cancelled source job is not a completed passing source qualification. The exact final hosted API result is 5441 ms against 5000 ms, UI is 4792 ms against 5000 ms, and native is 6185 ms with no five-second native-case limit. Earlier head 77 hosted API 3739 ms passed; earlier head 4e API 5222 ms failed. Those remain historical and do not replace the final observed result.\n\n### Per-calculator dispositions\n\nShared sourceVersion template: `factory-wave1-20261112.1/<engineId>@1/private.next-engineering.20261115.1`. Full per-ID immutable bindings, scope limitations and receipts are in `dispositions.json`.\n\n| ID | engineId@version | Disposition | Remaining material gates |\n| --- | --- | --- | --- |\n')
 for r in finalRows:
  f.write('| '+str(r['catalogId'])+' | `'+r['identity']['engineId']+'@'+str(r['identity']['version'])+'` | '+r['disposition']+' | Exact-head shared timing and mandatory CI; individual qualification withheld |\n')
 f.write('\nFinal per-ID review verified 253 bindings with zero mismatches under the documented scope conditions; the historical reviewed head and final-head file bindings are retained separately. This does not override shared failures.\n\nThe [complete recovery commit manifest](validation/worker3-complete-aa7-recovery-commit-manifest.json) records all 45 commits from original CODE to frozen implementation, with parents, subjects and exact changed files against each first parent, including merges. All 45 commit rows are also retained in `final-observed-config.json` and `final-observed-checkpoint.json`; the earlier eight-commit aaf-to-77 subset is explicit history only. See [per-ID dispositions](dispositions.json) and the [receipt manifest](receipt-manifest.json).\n\n### Source and evidence references\n\n')
 for ref in C.get('sourceReferences',[]):f.write('- '+ref['label']+': `'+ref['sha']+'`'+(' ('+ref['remoteBranch']+')' if ref.get('remoteBranch') else '')+'.\n')
 f.write('\nThe evidence commit SHA is supplied by the coordinator’s later external remote proof; it cannot be embedded as its own commit SHA. PR1538 remains read-only at `8296454dc7244205ef4cf0b6e0b41c38f90af20f`. The future 39-source coordinator union requires separate admission and new exact-head CI.\n')
put('receipt-manifest.json',{'kind':'SHA256_BLOCKED_FINAL_DOCUMENTATION_MANIFEST','observedImplementationHead':F,'exactHostedHead':F,'qualifiedTestedHead':None,'runId':run['id'],'runAttempt':1,'files':[bind(p) for p in sorted(D.rglob('*')) if p.is_file() and p.name!='receipt-manifest.json']})
print('BLOCKED_FINAL generated: all 20 unqualified, 81 + 0; actual CI conclusions preserved')
