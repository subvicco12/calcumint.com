"""Bounded psql transport for workflow-managed loopback disposable services only."""
import json,os,pathlib,sys,re,subprocess

def require(condition,message):
 if not condition:raise ValueError(message)
def validate(c,env):
 require(c.get('kind') in ('CALCUMINT_DISPOSABLE_SERVICES_V1','CALCUMINT_DISPOSABLE_POSTGRES_V1'),'Not a disposable service config')
 require(type(c.get('runId')) is str and re.fullmatch('[1-9][0-9]*',c['runId']) is not None and type(c.get('workflowSha')) is str and re.fullmatch('[0-9a-f]{40}',c['workflowSha']) is not None,'Run/source identity malformed')
 require(c.get('runId')==env.get('GITHUB_RUN_ID') and c.get('workflowSha')==env.get('GITHUB_WORKFLOW_SHA'),'Run/source config differs')
 require(type(c.get('attempt')) is int and c['attempt']==1,'Attempt one required')
 p=c.get('postgres',{});require(p.get('host')=='127.0.0.1' and p.get('database')=='postgres' and type(p.get('port')) is int and 0<p['port']<65536,'External database selector refused')
 return c
def _query(c,role,sql):
 require(role in ('postgres','solo440_executor'),'Unapproved disposable role')
 require(type(sql) is str and len(sql.encode())<=8*1024*1024,'SQL input exceeds fixture limit')
 # Preserve the existing fixture's exact psql -X -qAt/ON_ERROR_STOP semantics,
 # including statement boundaries, transaction behavior, notices and output format.
 env={'PATH':os.environ.get('PATH','/usr/bin:/bin'),'HOME':'/nonexistent','PGCONNECT_TIMEOUT':'5','PGOPTIONS':'-c statement_timeout=30000','PGSSLMODE':'disable','PGGSSENCMODE':'disable','PGCLIENTENCODING':'UTF8'}
 result=subprocess.run(['psql','-X','-qAt','-v','ON_ERROR_STOP=1','-v','VERBOSITY=sqlstate','-h','127.0.0.1','-p',str(c['postgres']['port']),'-U',role,'-d','postgres'],input=sql,text=True,capture_output=True,timeout=30,env=env)
 if result.returncode:
  if 'could not connect' in result.stderr or 'connection to server' in result.stderr:raise ValueError('Disposable PostgreSQL connection unavailable')
  state=re.search(r'ERROR:\s+([0-9A-Z]{5})\b',result.stderr)
  raise ValueError('Disposable PostgreSQL query refused'+(' SQLSTATE '+state.group(1) if state else ''))
 return result.stdout.strip()
def query(c,role,sql):
 require(role in ('postgres','solo440_executor'),'Unapproved disposable role')
 # The first query is read-only. Wrong/uninitialized services cannot receive DDL.
 raw=_query(c,role,'SELECT row_to_json(x) FROM calcumint_disposable.identity x;')
 identity=json.loads(raw)
 require(identity.get('run_id')==c['runId'] and identity.get('workflow_sha')==c['workflowSha'] and identity.get('service_id')==c['serviceIds']['postgres'],'Disposable service identity differs')
 return _query(c,role,sql)
def main():
 path=pathlib.Path(sys.argv[1]);require(path.is_file() and not path.is_symlink() and path.stat().st_mode&0o077==0,'Private regular config required');c=validate(json.loads(path.read_text()),os.environ)
 result=query(c,sys.argv[2],sys.stdin.read())
 if len(sys.argv)==4:
  require(sys.argv[3]=='--discard-commit-ack' and c['kind']=='CALCUMINT_DISPOSABLE_POSTGRES_V1','Fault injection is qualification-only')
  os._exit(75)
 print(result)
if __name__=='__main__':
 try:main()
 except Exception as e:raise SystemExit(str(e)) from None
