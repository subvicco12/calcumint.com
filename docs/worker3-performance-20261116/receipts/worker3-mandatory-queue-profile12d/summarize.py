import json,pathlib,os
root=pathlib.Path('/tmp/worker3-mandatory-queue-profile12d');events=list(map(json.loads,(root/'events.jsonl').read_text().splitlines()));samples=list(map(json.loads,(root/'processes.jsonl').read_text().splitlines()));starts={e['id']:e for e in events if e['event']=='start'};ends={e['id']:e for e in events if e['event']=='complete'};hz=os.sysconf('SC_CLK_TCK');rows=[]
for id,s in starts.items():
 e=ends.get(id);cpu=[];max_live=0
 for sample in samples:
  processes={p['pid']:p for p in sample['records']}
  if s['pid'] not in processes:continue
  descendants={s['pid']};changed=True
  while changed:
   changed=False
   for pid,p in processes.items():
    if p['ppid'] in descendants and pid not in descendants:descendants.add(pid);changed=True
  cpu.append(sum(processes[p]['selfTicks']+processes[p]['childrenTicks'] for p in descendants)*1000/hz);max_live=max(max_live,len(descendants))
 row={**s,**{k:v for k,v in (e or {}).items() if k not in ['event','id','label','pid']},'sampleCount':len(cpu),'sampledSubtreeCPUMilliseconds':max(cpu) if cpu else None,'peakSampledProcesses':max_live,'CPUAttribution':'advisory200ms_proc_samples_including_reaped_descendants_not_exact_rusage'}
 if e:
  row['sampledCPUOverWallPercent']=round(max(cpu)/e['wallMS']*100,2) if cpu else None
  out=pathlib.Path(e['stdout']).read_text();lines=out.splitlines();fail=[]
  for i,line in enumerate(lines):
   if line.startswith('not ok '):
    detail=next((x.strip() for x in lines[i+1:i+28] if x.strip().startswith('error:')),None);fail.append({'test':line,'detail':detail})
  row['failedCases']=fail
 rows.append(row)
result=json.loads((root/'result.json').read_text());result['error']={k:v for k,v in result.get('error',{}).items() if k!='message'}
result.update({'childrenStarted':len(starts),'childrenCompleted':len(ends),'childrenSucceeded':sum(not e['error'] for e in ends.values()),'childrenFailed':sum(bool(e['error']) for e in ends.values()),'childCases':{k:sum(e['summary'].get(k,0) for e in ends.values()) for k in ['tests','pass','fail','skipped','cancelled']},'sumChildWallMilliseconds':sum(e['wallMS'] for e in ends.values()),'childDeadlineValues':sorted(set(s.get('timeout') for s in starts.values())),'rows':rows})
(root/'summary.json').write_text(json.dumps(result,indent=2)+'\n')
for row in sorted(rows,key=lambda r:r.get('wallMS',0),reverse=True)[:12]:print(row['id'],pathlib.Path(row['label']).name,round(row['wallMS'],1),row['sampledSubtreeCPUMilliseconds'],row['sampledCPUOverWallPercent'],row['summary'])
print(json.dumps({k:v for k,v in result.items() if k!='rows'}))
