from pathlib import Path
import json,re,statistics,subprocess,csv,os
p=Path('/tmp/worker3-full115-critical-b7');events=[json.loads(x) for x in (p/'events.jsonl').read_text().splitlines() if x];samples=[json.loads(x) for x in (p/'processes.jsonl').read_text().splitlines() if x];result=json.loads((p/'result.json').read_text());manifest=json.loads((p/'input-manifest.json').read_text());origin=statistics.median(x['unixMS']-x['timeMS'] for x in samples);begins={x['id']:x for x in events if x['event']=='child-start'};ends={x['id']:x for x in events if x['event']=='child-complete'};fileStarts={x['file']:x for x in events if x['event']=='file-start'};fileEnds={x['file']:x for x in events if x['event']=='file-exit'};hz=os.sysconf('SC_CLK_TCK')
fileRows=[]
for row in manifest['files']:
 name=row['path'];s=fileStarts.get(name);e=fileEnds.get(name);fileRows.append({'file':name,'sha256':row['sha256'],'pid':s.get('pid') if s else None,'startUTC':s.get('utc') if s else None,'startMS':s['unixMS']-origin if s else None,'exitUTC':e.get('utc') if e else None,'exitMS':e['unixMS']-origin if e else None,'wallMS':e['unixMS']-s['unixMS'] if e and s else None,'exitCode':e.get('code') if e else None,'stateAtDeadline':'completed' if e else 'active' if s else 'not-started'})
children=[]
for id,s in begins.items():
 e=ends.get(id);tap=Path(s['stdout']).read_text(errors='replace');summary={}
 for key in ['tests','pass','fail','skipped','cancelled','duration_ms']:
  values=re.findall(r'^# '+key+r' ([0-9.]+)$',tap,re.M)
  if values:summary[key]=float(values[-1]) if key=='duration_ms' else int(values[-1])
 cpu=[]
 for sample in samples:
  ps={r['pid']:r for r in sample['records']};target=s['childPID']
  if target not in ps:continue
  descendants={target};changed=True
  while changed:
   changed=False
   for pid,r in ps.items():
    if r['ppid'] in descendants and pid not in descendants:descendants.add(pid);changed=True
  cpu.append(sum(ps[x]['selfTicks']+ps[x]['childrenTicks'] for x in descendants)*1000/hz)
 children.append({'id':id,'argv':s['argv'],'pid':s['childPID'],'startUTC':s['utc'],'startMS':s['unixMS']-origin,'endUTC':e['utc'] if e else None,'endMS':e['unixMS']-origin if e else None,'wallMS':e['wallMS'] if e else None,'timeout':s['timeout'],'maxBuffer':s['maxBuffer'],'encoding':s['encoding'],'hasSignal':s['hasSignal'],'error':e['error'] if e else None,'stateAtDeadline':'completed' if e else 'active-killed-by-outer150','tapSummary':summary,'partialNotOkCount':len(re.findall(r'^not ok ',tap,re.M)),'sampledSubtreeCPUMSAdvisory':max(cpu) if cpu else None,'sampleCount':len(cpu),'stdout':s['stdout'],'stderr':s['stderr']})
repo=Path('/workspace/calcumint-worker3-recovery');source=subprocess.check_output(['git','show',result['head']+':tests/parallel-source-20261110/current.test.mjs']).decode();fresh=subprocess.check_output(['git','show',result['head']+':tests/next-engineering-20261115/source-fresh-git-mandatory-children.mjs']).decode();block=source.split(' const files=',1)[1].split(';\n const run=',1)[0];plan=[(path,int(n)) for path,n in re.findall(r"\['([^']+)',(\d+)\]",block)];plan.extend((path,int(n)) for path,n in re.findall(r"\['([^']+)',(\d+)\]",fresh));assert len(plan)==41;assert sum(n for _,n in plan)==332
normalize=lambda name:name if name.startswith('tests/') else 'tests/completion-wave-20261113/'+name;byFile={r['argv'][0]:r for r in children if len(r['argv'])==1 and r['id']>=7};mandatory=[]
for path,count in plan:
 path=normalize(path);row=byFile.get(path);mandatory.append({'file':path,'expectedCases':count,'stateAtDeadline':row['stateAtDeadline'] if row else 'not-launched','childId':row['id'] if row else None,'observedPass':row['tapSummary'].get('pass') if row else None})
tap=(p/'cases.tap').read_text(errors='replace');summary={'result':result,'clockOriginUnixMSAdvisory':origin,'files':fileRows,'children':children,'mandatoryPlan':mandatory,'asyncChildrenExpected':47,'asyncChildrenLaunched':len(children),'asyncChildrenCompleted':len(ends),'completedChildErrors':sum(r['error'] is not None for r in ends.values()),'mandatoryChildrenCompleted':sum(r['stateAtDeadline']=='completed' for r in mandatory),'mandatoryChildrenActiveAtDeadline':sum(r['stateAtDeadline']=='active-killed-by-outer150' for r in mandatory),'mandatoryChildrenNotLaunched':sum(r['stateAtDeadline']=='not-launched' for r in mandatory),'mandatoryObservedCompletedPass':sum(r['observedPass'] or 0 for r in mandatory if r['stateAtDeadline']=='completed'),'TAPPrefixPass':len(re.findall(r'^ok \d+',tap,re.M)),'TAPPrefixFail':len(re.findall(r'^not ok \d+',tap,re.M)),'cpuQuota':Path('/sys/fs/cgroup/cpu.max').read_text().strip(),'qualified':False};(p/'critical-path-summary.json').write_text(json.dumps(summary,indent=2)+'\n')
with (p/'file-timeline.csv').open('w',newline='') as f:
 fields=['file','pid','startUTC','startMS','exitUTC','exitMS','wallMS','exitCode','stateAtDeadline'];w=csv.DictWriter(f,fields,extrasaction='ignore');w.writeheader();w.writerows(fileRows)
with (p/'child-timeline.csv').open('w',newline='') as f:
 w=csv.writer(f);w.writerow(['id','argv','pid','startUTC','startMS','endUTC','endMS','wallMS','timeout','stateAtDeadline','tests','pass','fail','skipped','cancelled','sampledCPUms_advisory'])
 for r in children:w.writerow([r['id'],json.dumps(r['argv']),r['pid'],r['startUTC'],r['startMS'],r['endUTC'],r['endMS'],r['wallMS'],r['timeout'],r['stateAtDeadline'],*[r['tapSummary'].get(k) for k in ['tests','pass','fail','skipped','cancelled']],r['sampledSubtreeCPUMSAdvisory']])
with (p/'mandatory-plan.csv').open('w',newline='') as f:w=csv.DictWriter(f,mandatory[0].keys());w.writeheader();w.writerows(mandatory)
print(json.dumps({k:summary[k] for k in ['asyncChildrenExpected','asyncChildrenLaunched','asyncChildrenCompleted','completedChildErrors','mandatoryChildrenCompleted','mandatoryChildrenActiveAtDeadline','mandatoryChildrenNotLaunched','mandatoryObservedCompletedPass','TAPPrefixPass','TAPPrefixFail','cpuQuota']}))
