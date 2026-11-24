"""Bounded libpq transport for workflow-managed loopback disposable services only."""
import ctypes,ctypes.util,json,os,pathlib,sys,re

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
 lib=ctypes.CDLL(ctypes.util.find_library('pq') or 'libpq.so.5');pointer=ctypes.c_void_p;string=ctypes.c_char_p
 def bind(name,restype,args):
  f=getattr(lib,name);f.restype=restype;f.argtypes=args;return f
 connect=bind('PQconnectdbParams',pointer,[ctypes.POINTER(string),ctypes.POINTER(string),ctypes.c_int]);status=bind('PQstatus',ctypes.c_int,[pointer]);finish=bind('PQfinish',None,[pointer]);send=bind('PQsendQuery',ctypes.c_int,[pointer,string]);get=bind('PQgetResult',pointer,[pointer]);clear=bind('PQclear',None,[pointer]);result_status=bind('PQresultStatus',ctypes.c_int,[pointer]);rows=bind('PQntuples',ctypes.c_int,[pointer]);cols=bind('PQnfields',ctypes.c_int,[pointer]);value=bind('PQgetvalue',string,[pointer,ctypes.c_int,ctypes.c_int]);error=bind('PQresultErrorField',string,[pointer,ctypes.c_int])
 p=c['postgres'];params={'host':'127.0.0.1','port':str(p['port']),'dbname':'postgres','user':role,'password':'','connect_timeout':'5','sslmode':'disable','gssencmode':'disable','options':'-c statement_timeout=30000','application_name':'calcumint-disposable-service-fixture'}
 keys=(string*(len(params)+1))(*[k.encode() for k in params],None);values=(string*(len(params)+1))(*[v.encode() for v in params.values()],None)
 connection=connect(keys,values,0);output=[]
 try:
  require(connection and status(connection)==0,'Disposable PostgreSQL connection unavailable')
  require(send(connection,sql.encode())==1,'Disposable PostgreSQL query send refused')
  while True:
   r=get(connection)
   if not r:break
   try:
    state=result_status(r)
    if state==2:
     for i in range(rows(r)):output.append('|'.join((value(r,i,j) or b'').decode() for j in range(cols(r))))
    elif state!=1:raise ValueError('Disposable PostgreSQL refused: SQLSTATE '+(error(r,ord('C')) or b'unknown').decode())
   finally:clear(r)
  return '\n'.join(output)
 finally:
  if connection:finish(connection)
def query(c,role,sql):
 require(role in ('postgres','solo440_executor'),'Unapproved disposable role')
 # The first query is read-only. Wrong/uninitialized services cannot receive DDL.
 raw=_query(c,role,'SELECT row_to_json(x) FROM calcumint_disposable.identity x;')
 identity=json.loads(raw)
 require(identity.get('run_id')==c['runId'] and identity.get('workflow_sha')==c['workflowSha'] and identity.get('service_id')==c['serviceIds']['postgres'],'Disposable service identity differs')
 return _query(c,role,sql)
def main():
 path=pathlib.Path(sys.argv[1]);require(path.is_file() and not path.is_symlink() and path.stat().st_mode&0o077==0,'Private regular config required');c=validate(json.loads(path.read_text()),os.environ)
 print(query(c,sys.argv[2],sys.stdin.read()))
if __name__=='__main__':
 try:main()
 except Exception as e:raise SystemExit(str(e)) from None
