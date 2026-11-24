"""Actual disposable multi-container qualification. Never addresses production."""
import pathlib,subprocess,json,time,concurrent.futures,sys,os
sys.dont_write_bytecode=True
ROOT=pathlib.Path(__file__).resolve().parent
assert (ROOT/'store.sql').is_file(),'Durable PostgreSQL claim implementation missing'
sys.path.insert(0,str(ROOT))
import authority as a
from fixtures import fixture_grant
# Workflow-managed disposable PostgreSQL only; no arbitrary launcher or Docker fallback.
CONFIG=pathlib.Path(os.environ.get('SOLO440_SERVICE_CONFIG',''))
if not CONFIG.is_file():raise SystemExit('BLOCKED: exact workflow-managed PostgreSQL config missing')
config=json.loads(CONFIG.read_text())
if config.get('kind')!='CALCUMINT_DISPOSABLE_POSTGRES_V1':raise SystemExit('Wrong disposable service kind')
results=[]
client_env={'PATH':os.environ.get('PATH','/usr/bin:/bin'),'GITHUB_RUN_ID':os.environ.get('GITHUB_RUN_ID',''),'GITHUB_WORKFLOW_SHA':os.environ.get('GITHUB_WORKFLOW_SHA','')}
def client(sql,role='solo440_executor'):
 p=subprocess.run([sys.executable,'-I',str(ROOT/'disposable-sql.py'),str(CONFIG),role],input=sql,text=True,capture_output=True,timeout=30,env=client_env)
 if p.returncode:raise RuntimeError(p.stderr.strip())
 return json.loads(p.stdout) if p.stdout.strip() else None
def check(name,f):
 started=time.monotonic();f();results.append({'case':name,'pass':True,'seconds':round(time.monotonic()-started,3)})
def refused(f):
 try:f()
 except (RuntimeError,ValueError,OSError):return
 raise AssertionError('Forbidden operation accepted')
client((ROOT/'store.sql').read_text(),role='postgres')
client('GRANT USAGE ON SCHEMA calcumint_disposable TO solo440_executor; GRANT SELECT ON calcumint_disposable.identity TO solo440_executor;',role='postgres')
store=a.Store(client)
g=fixture_grant(a)
check('exact-atomic-claim',lambda: (store.claim(g)['state']=='CLAIMED_NO_RECEIPT') or (_ for _ in ()).throw(AssertionError()))
check('replay-on-fresh-client-container',lambda:refused(lambda:store.claim(g)))
check('replacement-grant-same-run-attempt',lambda:refused(lambda:store.claim({**g,'nonce':'f'*32})))
check('nonce-reuse-different-run',lambda:refused(lambda:store.claim({**g,'runId':str(int(g['runId'])+1)})))
def concurrency():
 grant=fixture_grant(a)
 def claim(_):
  try:store.claim(grant);return True
  except RuntimeError:return False
 with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:out=list(pool.map(claim,range(12)))
 assert sum(out)==1,out
check('twelve-fresh-client-invocations-exactly-one-claim',concurrency)
def dropped_ack(sql):
 p=subprocess.run([sys.executable,'-I',str(ROOT/'disposable-sql.py'),str(CONFIG),'solo440_executor','--discard-commit-ack'],input=sql,text=True,capture_output=True,timeout=30,env=client_env)
 assert p.returncode==75,'Worker did not terminate after the actual database commit'
def lost_ack():
 grant=fixture_grant(a)
 dropped_ack('SELECT solo440.claim('+a.sql_text(a.canonical(grant))+');')
 row=store.reconcile(grant);assert row['state']=='CLAIMED_NO_RECEIPT' and row['grantSha256']==a.digest(a.canonical(grant).encode())
 refused(lambda:store.claim(grant));refused(lambda:store.claim({**grant,'nonce':'0'*32}))
check('lost-commit-ack-authoritative-reconciliation',lost_ack)
def interruption():
 grant=fixture_grant(a);store.claim(grant)
 assert a.Store(client).reconcile(grant)['state']=='CLAIMED_NO_RECEIPT'
 refused(lambda:a.Store(client).claim(grant))
check('interruption-before-receipt-remains-closed',interruption)
def receipt_ack():
 grant=fixture_grant(a);store.claim(grant);r=a.receipt(grant,qualification=True)
 dropped_ack('SELECT solo440.finish('+a.sql_text(a.canonical(grant))+','+a.sql_text(a.canonical(r))+');')
 row=store.reconcile(grant);assert row['state']=='RECEIPTED' and row['receipt']==r
 a.verify_receipt(row['receipt'],grant,qualification=True)
 refused(lambda:store.finalize(grant,r))
check('lost-receipt-ack-recovers-identical-stored-receipt',receipt_ack)
def negatives():
 for updates in ({'attempt':2},{'attempt':True},{'candidate':'f'*40},{'activation':True},{'expiresAt':int(time.time())-1},{'issuedAt':int(time.time())+10},{'expiresAt':'OVERLONG'},{'amendmentSha256':'f'*64},{'policySha256':'f'*64},{'policyCommit':'f'*40},{'nominationSha256':'f'*64}):
  bad={**fixture_grant(a),**updates}
  if bad['expiresAt']=='OVERLONG':bad['expiresAt']=bad['issuedAt']+601
  refused(lambda:client('SELECT solo440.claim('+a.sql_text(a.canonical(bad))+');'))
check('server-enforces-scope-expiry-attempt-and-amendment',negatives)
check('executor-role-cannot-mutate-claims',lambda:refused(lambda:client('DELETE FROM solo440.claims;')))
def bad_receipt():
 grant=fixture_grant(a);store.claim(grant);r=a.receipt(grant,qualification=True);r['body']['activated']=True;r['sha256']=a.digest(a.canonical(r['body']).encode())
 refused(lambda:client('SELECT solo440.finish('+a.sql_text(a.canonical(grant))+','+a.sql_text(a.canonical(r))+');'))
 assert store.reconcile(grant)['state']=='CLAIMED_NO_RECEIPT'
check('recomputed-activation-receipt-refused-by-store',bad_receipt)
def partition():
 grant=fixture_grant(a)
 # A separate network namespace makes the actual database unreachable to this client.
 # No database shutdown, Docker command, local substitute or successful receipt is used.
 cmd=['sudo','-n','unshare','--net','--','env',*['%s=%s'%(k,v) for k,v in client_env.items()],sys.executable,'-I',str(ROOT/'disposable-sql.py'),str(CONFIG),'solo440_executor']
 p=subprocess.run(cmd,input='SELECT solo440.claim('+a.sql_text(a.canonical(grant))+');',text=True,capture_output=True,timeout=30)
 assert p.returncode!=0 and 'Disposable PostgreSQL connection unavailable' in p.stderr, 'Actual network-partition probe did not reach the expected storage refusal'
 assert store.reconcile(grant)['state']=='ABSENT'
 assert store.reconcile(g)['state']=='CLAIMED_NO_RECEIPT'
check('actual-client-network-partition-fails-closed',partition)
print(json.dumps({'executionBoundary':'workflow-managed PostgreSQL; fresh libpq clients; cross-host identity NOT established','postgresVersion':client('SELECT current_setting(\'server_version_num\')::integer;',role='postgres'),'runId':config['runId'],'serviceId':config['serviceIds']['postgres'],'crossHostQualified':False,'productionAccess':False,'sourceAdmissionPerformed':False,'activationPerformed':False,'results':results},indent=2))
