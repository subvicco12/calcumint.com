"""Owner-acceptance executor v2; fixtures and live authority have separate modes.
The caller supplies reviewed, authenticated provider readbacks and exact source verifier.
No callback, grant or receipt can change the fixed policy or confer activation authority.
"""
import json,pathlib,sqlite3,time,subprocess,re
import authority as a
PRODUCT_PREFIX='CALCUMINT440 OWNER PRODUCT DISPOSITION V2'
APPLICABILITY_PREFIX='CALCUMINT440 OWNER APPLICABILITY V2'
GRANT_PREFIX='CALCUMINT440 OWNER SOURCE GRANT V2'
EXECUTION_REF='refs/heads/engineering/solo440-owner-v2-execution'
SOURCE_WORKFLOW='.github/workflows/solo440-owner-v2-source.yml'
def verify_execution_context(context):
 env=context.get('environment',{});sha=env.get('TRUSTED_WORKFLOW_SHA','')
 a.require(type(sha) is str and re.fullmatch('[0-9a-f]{40}',sha) is not None,'Externally pinned executor missing')
 for k,v in {'GITHUB_SHA':sha,'GITHUB_WORKFLOW_SHA':sha,'GITHUB_REPOSITORY':a.REPO,'GITHUB_EVENT_NAME':'workflow_dispatch','GITHUB_REF':EXECUTION_REF,'GITHUB_REF_PROTECTED':'true','GITHUB_WORKFLOW_REF':a.REPO+'/'+SOURCE_WORKFLOW+'@'+EXECUTION_REF,'GITHUB_RUN_ATTEMPT':'1','GITHUB_ACTOR':'subvicco12','BOOTSTRAP_ENVIRONMENT':'calcumint-source-bootstrap-runtime'}.items():a.require(env.get(k)==v,'Protected context differs: '+k)
 for k,expected in [('BOOTSTRAP_NODE','94efd062ed066c1a0b332e18249859c905e920eeada5df55d24c99b919629a90'),('BOOTSTRAP_GIT','9dae295c1a4ffae4ee772e6205fcf22b26e1bfeeb5ee98f278b5139bda7ca22f')]:
  path=pathlib.Path(env.get(k,''));a.require(path.is_absolute() and path.is_file() and not path.is_symlink() and a.digest(path.read_bytes())==expected,'Pinned runtime differs: '+k)
 safe={'PATH':'/usr/bin:/bin','HOME':'/nonexistent','GIT_CONFIG_NOSYSTEM':'1','GIT_CONFIG_GLOBAL':'/dev/null','GIT_EXEC_PATH':env.get('GIT_EXEC_PATH','')}
 def git(*args):return subprocess.check_output([env['BOOTSTRAP_GIT'],'-C',str(a.ROOT),*args],env=safe,timeout=15)
 a.require(git('rev-parse','HEAD').decode().strip()==sha==context.get('executor'),'Executor checkout differs')
 a.require(git('rev-parse','HEAD^{tree}').decode().strip()==context.get('executorTree'),'Executor tree differs')
 a.require(env.get('GITHUB_RUN_ID')==context.get('runId') and context.get('attempt')==1,'Run differs')
 a.require(git('rev-parse',a.POLICY_COMMIT+':tools/solo440-v2/policy.json').decode().strip()==a.POLICY_BLOB,'Policy object differs')
 for filename in ('authority.py','execute.py','store.sql','policy.json','amendment.md','provider.py','disposable-sql.py'):
  path=a.ROOT/filename;a.require(not path.is_symlink() and path.read_bytes()==git('show',sha+':tools/solo440-v2/'+filename),'Mutable executor differs')
 manifest=context.get('evidenceManifestBytes')
 a.require(type(manifest) is bytes and a.digest(manifest)==context.get('evidenceSha256'),'Complete evidence manifest differs')
 a.verify_package()

def decision(comment,prefix):
 a.require(comment.get('deleted') is False and comment.get('author',{}).get('me') is True and comment['author'].get('displayName')==a.OWNER and bool(comment.get('id')),'Authenticated current owner decision missing')
 content=comment.get('content','');a.require(content.startswith(prefix+'\n'),'Wrong owner decision role')
 value=json.loads(content[len(prefix)+1:]);a.require(content==prefix+'\n'+a.canonical(value),'Noncanonical owner decision')
 return value
def verify_authority(g,proof):
 a.verify_package();a.verify_adoption(proof['owner'],proof['adoption']);a.verify_grant(g,int(time.time()))
 product=decision(proof['product'],PRODUCT_PREFIX)
 a.require(set(product)=={'candidate','tree','engineBlob','assessment','decision','evidenceSha256','scope'} and product['candidate']==a.CANDIDATE and product['tree']==a.TREE and product['engineBlob']==a.ENGINE and product['decision']=='APPROVE' and product['evidenceSha256']==g['evidenceSha256'] and product['scope']=='general-purpose-frequency-conversion' and type(product['assessment']) is str and len(product['assessment'])>=80,'Exact competent owner product assessment missing')
 applicability=decision(proof['applicability'],APPLICABILITY_PREFIX)
 a.require(set(applicability)=={'candidate','policySha256','providerRequirements','legalRequirements','specialistRequirements','governingRequirements','basis'} and applicability['candidate']==a.CANDIDATE and applicability['policySha256']==a.POLICY_SHA and type(applicability['basis']) is str and len(applicability['basis'])>=80,'Applicability evidence missing')
 for k in ('providerRequirements','legalRequirements','specialistRequirements','governingRequirements'):a.require(applicability[k] in ('SATISFIED','NOT_APPLICABLE'),'Unresolved applicability keeps gate closed')
 a.require(a.digest(a.canonical(product).encode())==g['productDispositionSha256'] and a.digest(a.canonical(applicability).encode())==g['applicabilitySha256'],'Owner evidence bindings differ')
 a.require(decision(proof['grant'],GRANT_PREFIX)==g,'Exact one-run owner grant missing')
 return a.digest(a.canonical(g).encode())
def execute_qualification(g,read_authority,store,verify_source):
 a.require(g['mode']=='disposable-qualification','Qualification cannot issue live admission')
 return _execute(g,read_authority,store,verify_source,True)
def execute_source_only(g,context,read_authority,store,verify_source):
 # A boolean supplied by an untrusted grant is never accepted as provider evidence.
 # This API is callable only from a separately reviewed provider adapter; no live CLI is registered.
 verify_execution_context(context)
 a.verify_grant(g,int(time.time()),context)
 a.require(g['mode']=='source-admission','Live source receipt mode differs')
 a.require(context.get('storageQualificationSha256') and context.get('providerProtectionEvidenceSha256'),'Independent hosted storage/protection readback not configured')
 for k in ('storageQualificationSha256','providerProtectionEvidenceSha256'):
  a.require(type(context[k]) is str and a.re.fullmatch('[0-9a-f]{64}',context[k]) is not None,'Qualification evidence malformed')
 return _execute(g,read_authority,store,verify_source,False)
def _execute(g,read_authority,store,verify_source,qualification):
 verify_authority(g,read_authority());verify_source()
 claim=store.claim(g)
 a.require(claim['state']=='CLAIMED_NO_RECEIPT' and claim['grantSha256']==a.digest(a.canonical(g).encode()),'Authoritative claim differs')
 # Never retry claim or issue a receipt on uncertain commit acknowledgment.
 verify_source();verify_authority(g,read_authority())
 r=a.receipt(g,qualification);result=store.finalize(g,r)
 a.require(result['state']=='RECEIPTED' and result['receipt']==r,'Receipt commit acknowledgment differs; reconcile authoritative storage')
 return r
class QualificationStore:
 """Disposable SQLite reference only. NOT qualified as a cross-host authority store."""
 def __init__(self,path):self.path=pathlib.Path(path)
 def connection(self):
  a.require(not self.path.is_symlink(),'Redirected qualification database')
  con=sqlite3.connect('file:'+str(self.path.resolve())+'?mode=rw',uri=True,timeout=5)
  con.execute('PRAGMA synchronous=FULL');return con
 def initialize(self):
  a.require(not self.path.exists(),'Existing qualification state cannot be replaced')
  with sqlite3.connect(self.path) as c:c.execute('CREATE TABLE claims(run TEXT PRIMARY KEY,nonce TEXT UNIQUE NOT NULL,digest TEXT UNIQUE NOT NULL,grant TEXT NOT NULL,receipt TEXT)')
 def claim(self,g):
  a.require(g['mode']=='disposable-qualification','Reference store refuses live authority');a.verify_grant(g,int(time.time()))
  sha=a.digest(a.canonical(g).encode())
  with self.connection() as c:c.execute('INSERT INTO claims VALUES(?,?,?,?,NULL)',(g['runId'],g['nonce'],sha,a.canonical(g)))
  return {'state':'CLAIMED_NO_RECEIPT','grantSha256':sha}
 def reconcile(self,g):
  with self.connection() as c:row=c.execute('SELECT digest,receipt FROM claims WHERE run=?',(g['runId'],)).fetchone()
  if not row:return {'state':'ABSENT'}
  return {'state':'RECEIPTED' if row[1] else 'CLAIMED_NO_RECEIPT','grantSha256':row[0],'receipt':json.loads(row[1]) if row[1] else None}
 def finalize(self,g,r):
  a.require(g['mode']=='disposable-qualification','Reference store refuses live authority');a.verify_grant(g,int(time.time()));a.verify_receipt(r,g,True)
  with self.connection() as c:
   c.execute('BEGIN IMMEDIATE')
   changed=c.execute('UPDATE claims SET receipt=? WHERE run=? AND grant=? AND receipt IS NULL',(a.canonical(r),g['runId'],a.canonical(g))).rowcount
   a.require(changed==1,'Claim differs or already receipted')
  return {'state':'RECEIPTED','receipt':r}
if __name__=='__main__':raise SystemExit('No live provider adapter or hosted store is qualified. Use the isolated qualification driver; source admission remains closed.')
