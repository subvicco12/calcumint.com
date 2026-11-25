"""Write a private, run-bound config for provider-managed disposable services."""
import json,os,pathlib,re,sys
fields=['POSTGRES_SERVICE_ID','GOTRUE_SERVICE_ID','POSTGREST_SERVICE_ID']
assert all(re.fullmatch('[0-9a-f]{64}',os.environ.get(k,'')) for k in fields)
assert re.fullmatch('[1-9][0-9]*',os.environ['GITHUB_RUN_ID'])
assert re.fullmatch('[0-9a-f]{40}',os.environ['GITHUB_WORKFLOW_SHA'])
config={'kind':'CALCUMINT_DISPOSABLE_SERVICES_V1','repository':'subvicco12/calcumint.com','runId':os.environ['GITHUB_RUN_ID'],'attempt':1,'workflowSha':os.environ['GITHUB_WORKFLOW_SHA'],'postgres':{'host':'127.0.0.1','port':int(os.environ['POSTGRES_PORT']),'database':'postgres'},'authUrl':'http://127.0.0.1:'+str(int(os.environ['GOTRUE_PORT'])),'restUrl':'http://127.0.0.1:'+str(int(os.environ['POSTGREST_PORT'])),'jwtSecret':os.environ['DISPOSABLE_JWT_SECRET'],'serviceIds':dict(zip(['postgres','gotrue','postgrest'],[os.environ[k] for k in fields]))}
assert os.environ['GITHUB_RUN_ATTEMPT']=='1'
path=pathlib.Path(sys.argv[1]);fd=os.open(path,os.O_WRONLY|os.O_CREAT|os.O_EXCL|os.O_NOFOLLOW,0o600)
with os.fdopen(fd,'w') as f:json.dump(config,f)
