"""Actual disposable multi-container qualification. Never addresses production."""
import pathlib,subprocess,json,time,concurrent.futures,sys,os
sys.dont_write_bytecode=True
ROOT=pathlib.Path(__file__).resolve().parent
assert (ROOT/'store.sql').is_file(),'Durable PostgreSQL claim implementation missing'
import authority as a
from fixtures import fixture_grant
# No Docker socket access. An existing approved launcher must be explicitly supplied.
CLIENT=json.loads(os.environ.get('SOLO440_TEST_CLIENT','[]'))
ADMIN=json.loads(os.environ.get('SOLO440_TEST_ADMIN_CLIENT','[]'))
RESTART=json.loads(os.environ.get('SOLO440_TEST_RESTART','[]'))
if not all(type(v) is list and v and all(type(x) is str for x in v) for v in (CLIENT,ADMIN,RESTART)):
 raise SystemExit('BLOCKED: approved disposable PostgreSQL client/admin/restart launchers are not configured; no Docker fallback')
results=[]
def client(sql,role='solo440_executor'):
 p=subprocess.run(ADMIN if role=='postgres' else CLIENT,input=sql,text=True,capture_output=True,timeout=30)
 if p.returncode:raise RuntimeError('Approved disposable PostgreSQL client refused')
 return json.loads(p.stdout) if p.stdout.strip() else None
def check(name,f):
 started=time.monotonic();f();results.append({'case':name,'pass':True,'seconds':round(time.monotonic()-started,3)})
def refused(f):
 try:f()
 except (RuntimeError,ValueError,OSError):return
 raise AssertionError('Forbidden operation accepted')
client((ROOT/'store.sql').read_text(),role='postgres')
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
def lost_ack():
 grant=fixture_grant(a)
 def uncertain(sql):client(sql);raise OSError('simulated lost commit acknowledgment after actual server commit')
 refused(lambda:a.Store(uncertain).claim(grant))
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
 def uncertain(sql):client(sql);raise OSError('simulated lost receipt commit acknowledgment')
 refused(lambda:a.Store(uncertain).finalize(grant,r))
 row=store.reconcile(grant);assert row['state']=='RECEIPTED' and row['receipt']==r
 a.verify_receipt(row['receipt'],grant,qualification=True)
 refused(lambda:store.finalize(grant,r))
check('lost-receipt-ack-recovers-identical-stored-receipt',receipt_ack)
def negatives():
 for updates in ({'attempt':2},{'attempt':True},{'candidate':'f'*40},{'activation':True},{'expiresAt':int(time.time())-1},{'issuedAt':int(time.time())+10},{'expiresAt':int(time.time())+601},{'amendmentSha256':'f'*64},{'policySha256':'f'*64},{'policyCommit':'f'*40},{'nominationSha256':'f'*64}):
  bad={**fixture_grant(a),**updates}
  refused(lambda:client('SELECT solo440.claim('+a.sql_text(a.canonical(bad))+');'))
check('server-enforces-scope-expiry-attempt-and-amendment',negatives)
check('executor-role-cannot-mutate-claims',lambda:refused(lambda:client('DELETE FROM solo440.claims;')))
def bad_receipt():
 grant=fixture_grant(a);store.claim(grant);r=a.receipt(grant,qualification=True);r['body']['activated']=True;r['sha256']=a.digest(a.canonical(r['body']).encode())
 refused(lambda:client('SELECT solo440.finish('+a.sql_text(a.canonical(grant))+','+a.sql_text(a.canonical(r))+');'))
 assert store.reconcile(grant)['state']=='CLAIMED_NO_RECEIPT'
check('recomputed-activation-receipt-refused-by-store',bad_receipt)
def restart():
 # Approved launcher must stop its disposable store, prove one query refuses, then restart.
 subprocess.run(RESTART+['stop'],check=True,capture_output=True,timeout=30)
 refused(lambda:store.claim(fixture_grant(a)))
 subprocess.run(RESTART+['start'],check=True,capture_output=True,timeout=30)
 assert a.Store(client).reconcile(g)['state']=='CLAIMED_NO_RECEIPT'
 refused(lambda:a.Store(client).claim(g))
check('actual-storage-outage-fails-closed-and-restart-retains-claims',restart)
print(json.dumps({'executionBoundary':'approved disposable launchers; cross-host identity needs provider receipts','productionAccess':False,'sourceAdmissionPerformed':False,'activationPerformed':False,'results':results},indent=2))
