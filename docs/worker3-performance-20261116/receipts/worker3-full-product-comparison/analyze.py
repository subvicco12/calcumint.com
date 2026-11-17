from pathlib import Path
from datetime import datetime
import re,json,csv,statistics,hashlib
p=Path('/tmp/worker3-full-product-comparison');inputs={'f490':Path('/tmp/worker3-f490-hosted-full.log'),'7eb':Path('/tmp/worker3-7eb-hosted-full.log')};metadata={'f490':json.loads(Path('/tmp/worker3-f490-ci-final.json').read_text()),'7eb':json.loads(Path('/tmp/worker3-7eb-ci-final.json').read_text())};data={};stepMaps={}
for label,file in inputs.items():
 rows=[]
 for line in file.read_text(errors='replace').splitlines():
  fields=line.split('\t',2)
  if len(fields)!=3 or fields[0]!='full-product':continue
  m=re.search(r'(\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d+Z)\s?(.*)',fields[2])
  if m:rows.append({'step':fields[1],'utc':m[1],'t':datetime.fromisoformat(m[1].replace('Z','+00:00')).timestamp(),'message':re.sub(r'\x1b\[[0-9;]*m','',m[2])})
 groups=[]
 for r in rows:
  if not groups or groups[-1]['step']!=r['step']:groups.append({'step':r['step'],'rows':[]})
  groups[-1]['rows'].append(r)
 job=next(x for x in metadata[label]['jobs'] if x['name']=='full-product');statuses={x['name']:x['conclusion'] for x in job['steps']};origin=rows[0]['t']
 for i,g in enumerate(groups):
  first,last=g['rows'][0],g['rows'][-1];end=groups[i+1]['rows'][0]['t'] if i+1<len(groups) else last['t'];g.update({'firstUTC':first['utc'],'lastUTC':last['utc'],'startSec':first['t']-origin,'logActivitySec':last['t']-first['t'],'windowSec':end-first['t'],'lines':len(g['rows']),'conclusion':statuses.get(g['step']),'tapSummary':[r['message'] for r in g['rows'] if re.match(r'^# (tests|pass|fail|skipped|cancelled|duration_ms) ',r['message'])],'commands':[r['message'] for r in g['rows'] if r['message'].startswith(('node ','git ','node_modules/'))]})
 stepMaps[label]={g['step']:g for g in groups};data[label]={'head':metadata[label]['headSha'],'job':{k:v for k,v in job.items() if k!='steps'},'firstLogUTC':rows[0]['utc'],'groups':groups}
comparisons=[]
for name,g in stepMaps['f490'].items():
 h=stepMaps['7eb'].get(name);comparisons.append({'step':name,'f490WindowSec':g['windowSec'],'7ebWindowSec':h['windowSec'] if h else None,'deltaSec':h['windowSec']-g['windowSec'] if h else None,'ratio':h['windowSec']/g['windowSec'] if h and g['windowSec'] else None,'f490Status':g['conclusion'],'7ebStatus':h['conclusion'] if h else 'not-logged','f490Lines':g['lines'],'7ebLines':h['lines'] if h else 0,'sameLoggedCommands':g['commands']==h['commands'] if h else None,'f490TAP':g['tapSummary'],'7ebTAP':h['tapSummary'] if h else []})
with(p/'step-comparison.csv').open('w',newline='') as f:
 fields=['step','f490WindowSec','7ebWindowSec','deltaSec','ratio','f490Status','7ebStatus','f490Lines','7ebLines','sameLoggedCommands'];w=csv.DictWriter(f,fields,extrasaction='ignore');w.writeheader();w.writerows(comparisons)
step='Owner-authorized isolated P0 implementation';cases={}
for label in inputs:
 rows=stepMaps[label][step]['rows'];a=[]
 for i,r in enumerate(rows):
  m=re.match(r'^\s*(ok|not ok) (\d+) - (.+)$',r['message'])
  if not m:continue
  for nxt in rows[i+1:i+5]:
   d=re.match(r'^\s*duration_ms:\s*([\d.]+)',nxt['message'])
   if d:a.append({'name':m[3],'durationMS':float(d[1])});break
 assert len(a)==205 and len({x['name'] for x in a})==205;cases[label]={x['name']:x['durationMS'] for x in a}
matched=[{'name':name,'f490MS':cases['f490'][name],'7ebMS':cases['7eb'][name],'deltaMS':cases['7eb'][name]-cases['f490'][name]} for name in cases['f490']];matched.sort(key=lambda x:x['deltaMS'],reverse=True)
with(p/'p0-case-comparison.csv').open('w',newline='') as f:w=csv.DictWriter(f,matched[0].keys());w.writeheader();w.writerows(matched)
journeys={};step='Batch21 calculator wave exact evidence and browser acceptance'
for label in inputs:
 out=[]
 for r in stepMaps[label][step]['rows']:
  try:j=json.loads(r['message'])
  except:continue
  if isinstance(j,dict) and 'slug'in j and 'width'in j:out.append({'t':r['t'],'utc':r['utc'],'value':j})
 journeys[label]=out
old,new=journeys['f490'],journeys['7eb'];assert all(x['value']==y['value'] for x,y in zip(old,new));batch={}
for label,out in journeys.items():
 intervals=[b['t']-a['t'] for a,b in zip(out,out[1:])];first=stepMaps[label][step]['rows'][0]['t'];batch[label]={'markers':len(out),'firstMarkerAfterStepSec':out[0]['t']-first,'lastMarkerAfterStepSec':out[-1]['t']-first,'sameFirst210SpanSec':out[min(len(new),len(out))-1]['t']-out[0]['t'],'medianIntervalSec':statistics.median(intervals),'meanIntervalSec':statistics.mean(intervals),'finalSummaryPresent':any('"journeys":318' in r['message'] for r in stepMaps[label][step]['rows'])}
setup={label:stepMaps[label]['Private full-product functional acceptance']['startSec'] for label in inputs};batchStart={label:stepMaps[label][step]['startSec'] for label in inputs};other=matched[5:]
summary={'sourceInputs':{label:{'path':str(file),'sha256':hashlib.sha256(file.read_bytes()).hexdigest()} for label,file in inputs.items()},'method':'Log window =first line of a step tofirst line of thenext logged step; includes smallinter-step overhead. logActivitySec separatelyboundsfirst-to-lastactivity. Cancelled windows arepartial, notcompletion times.','heads':{x:data[x]['head'] for x in data},'setupBeforeFirstFunctionalSec':setup,'startOfBatch21ElapsedSec':batchStart,'sourcePrepWindowSec':{x:stepMaps[x]['Fetch exact financial and caller source revisions']['windowSec'] for x in data},'steps':comparisons,'p0Same205CaseNamesAllPass':True,'p0TopFiveGitBoundDeltas':matched[:5],'p0Remaining200MaxPositiveIncreaseMS':max(x['deltaMS'] for x in other),'p0Remaining200MaxAbsoluteDeltaMS':max(abs(x['deltaMS']) for x in other),'p0SuiteMS':{'f490':174741.718315,'7eb':235038.490267},'batch21':batch,'batch21SameProgressPrefix':True,'cloneAttribution':'No gitclone command orclone timing appears in either full-productlog. Directfetch/availabilitysetup increase isquantified; repeateddownstreamclonecost cannot be measured fromthese logs.','environment':{'runnerImageBoth':'ubuntu-26.04 20261111.196.1','NodeBoth':'22.23.4','ChromeBoth':'156.0.8078.47','f490Region':'southcentralus','7ebRegion':'westcentralus','CPUAndLoadObserved':False},'qualified':False};(p/'summary.json').write_text(json.dumps(summary,indent=2)+'\n');(p/'parsed-steps.json').write_text(json.dumps(data,indent=2)+'\n');print(json.dumps({k:summary[k] for k in ['setupBeforeFirstFunctionalSec','startOfBatch21ElapsedSec','sourcePrepWindowSec','p0Remaining200MaxPositiveIncreaseMS','p0Remaining200MaxAbsoluteDeltaMS','batch21']}))
