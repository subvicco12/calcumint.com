"""Disposable fresh-process durability reference; not cross-host storage qualification."""
import sys,pathlib,json,subprocess,tempfile,time,concurrent.futures,os
sys.dont_write_bytecode=True
ROOT=pathlib.Path(__file__).resolve().parent
sys.path.insert(0,str(ROOT))
import authority as a
from execute import QualificationStore,execute_qualification
from fixtures import fixture_grant
from test_execution import ExecutionTests

def worker(op,db,grant):
 g=json.loads(pathlib.Path(grant).read_text());s=QualificationStore(db)
 try:
  if op in ('claim','lost-claim-ack'):r=s.claim(g)
  elif op in ('finish','lost-receipt-ack'):r=s.finalize(g,a.receipt(g,True))
  else:raise ValueError('Unsupported fixture operation')
  if op.startswith('lost-'):os._exit(75)
  print(json.dumps({'pid':os.getpid(),'result':r}));return 0
 except Exception as e:
  print(json.dumps({'pid':os.getpid(),'refused':type(e).__name__}));return 2
if len(sys.argv)>1:raise SystemExit(worker(*sys.argv[1:]))
results=[]
def record(name,f):
 start=time.monotonic();detail=f();results.append({'case':name,'pass':True,'seconds':round(time.monotonic()-start,3),'detail':detail})
with tempfile.TemporaryDirectory(prefix='solo440-v2-') as tmp:
 tmp=pathlib.Path(tmp);db=tmp/'durable.sqlite';s=QualificationStore(db);s.initialize()
 def grantfile(g):
  p=tmp/(g['nonce']+'.json');p.write_text(a.canonical(g));return p
 def call(op,g):return subprocess.run([sys.executable,'-I',str(__file__),op,str(db),str(grantfile(g))],capture_output=True,text=True,timeout=15,env={'PATH':'/usr/bin:/bin'})
 def concurrency():
  g=fixture_grant(a);path=grantfile(g)
  def attempt(_):return subprocess.run([sys.executable,'-I',str(__file__),'claim',str(db),str(path)],capture_output=True,text=True,timeout=15,env={'PATH':'/usr/bin:/bin'})
  with concurrent.futures.ThreadPoolExecutor(max_workers=12) as p:out=list(p.map(attempt,range(12)))
  assert sum(x.returncode==0 for x in out)==1
  pids=[json.loads(x.stdout)['pid'] for x in out];assert len(set(pids))==12
  assert call('claim',g).returncode==2
  assert call('claim',{**g,'nonce':'f'*32}).returncode==2
  assert call('claim',{**g,'runId':str(int(g['runId'])+1)}).returncode==2
  return {'freshProcessIds':pids,'accepted':1,'refused':11,'freshProcessReplayRefused':True,'replacementRefused':True,'crossRunNonceReuseRefused':True}
 record('atomic-local-reference-twelve-fresh-processes',concurrency)
 def lostclaim():
  g=fixture_grant(a);p=call('lost-claim-ack',g);assert p.returncode==75
  row=QualificationStore(db).reconcile(g);assert row['state']=='CLAIMED_NO_RECEIPT' and row['grantSha256']==a.digest(a.canonical(g).encode())
  assert call('claim',g).returncode==2
  return {'workerExit':75,'authoritativeState':row['state'],'replayRefused':True}
 record('actual-process-exit-after-claim-commit-before-ack',lostclaim)
 def lostreceipt():
  g=fixture_grant(a);s.claim(g);assert call('lost-receipt-ack',g).returncode==75
  row=QualificationStore(db).reconcile(g);r=a.receipt(g,True);assert row['state']=='RECEIPTED' and row['receipt']==r
  assert call('finish',g).returncode==2
  return {'authoritativeState':row['state'],'exactReceiptRecovered':True,'secondFinalizationRefused':True}
 record('actual-process-exit-after-receipt-commit-before-ack',lostreceipt)
 def outage():
  g=fixture_grant(a);saved=tmp/'unavailable.sqlite';db.rename(saved)
  assert call('claim',g).returncode==2 and not db.exists()
  saved.rename(db)
  assert QualificationStore(db).reconcile(g)['state']=='ABSENT'
  return {'noLocalStateRecreation':True,'authoritativeReconciliationRequired':True}
 record('missing-authority-storage-fails-closed',outage)
 def journey():
  from test_execution import ExecutionTests
  import execute
  g,proof=ExecutionTests().fixture(execute)
  r=execute_qualification(g,lambda:proof,s,lambda:None)
  assert r['body']['qualification'] and not r['body']['admitted'] and not r['body']['activated'] and not r['body']['independentApproval']
  return {'state':s.reconcile(g)['state'],'admitted':False,'activated':False,'providerProof':'SYNTHETIC TEST ONLY'}
 record('synthetic-owner-acceptance-executor-reference-journey',journey)
print(json.dumps({'schema':'solo440-v2-local-reference-qualification','crossHostQualified':False,'postgresQualified':False,'sourceAdmissionPerformed':False,'activationPerformed':False,'results':results},indent=2))
