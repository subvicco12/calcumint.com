"""Fixed #440 authority qualification primitives. No admission or activation entry point."""
import hashlib,json,os,pathlib,re,tarfile
REPO='subvicco12/calcumint.com'
REF='refs/heads/engineering/trusted-bootstrap-runtime-20261123'
WORKFLOW='.github/workflows/singleton440-source-admission.yml'
ENVIRONMENT='calcumint-source-bootstrap-runtime'
OWNER='Subrata Singha Roy'
CANDIDATE='1637b2a2bf582ebc6e4f4452ff9f3a3fe082b35e'
TREE='209982b9a81d7bf9f4783228505b5a274563391f'
POLICY_COMMIT='0aef2ad47c61a60f05d5ec407b20cdfe5a5c232f'
POLICY_BLOB='ea7d70089bab1d812cb81f246c088c74e17bddcc'
PACKAGE='aef727afa4234c4e0e7c6db84bfa312e85696ac655513d3cd6b10a2d829af449'
ARCHIVE='6fcfdf70a0e08004e4c7df76a1417b905b166a97cb7f5bba7b2adcf592ca4a72'
APPROVAL_PREFIX='AUTHORIZE EXACT SINGLETON440 SOURCE ADMISSION ONLY'
REVIEW_PREFIX='INDEPENDENT REVIEW EXACT SINGLETON440 AUTHORITY'
def canonical(x):return json.dumps(x,sort_keys=True,separators=(',',':'))
def digest(b):return hashlib.sha256(b).hexdigest()
def require(condition,message):
    if not condition:raise ValueError(message)
def review_binding(a):
    return {k:a[k] for k in ('candidate','tree','executor','policyCommit','policyBlob','packageSha256','sourceArchiveSha256','action','activate','reviewer')}
def verify_authorization(c,a,owner,comment,review,now):
    expected={'candidate':CANDIDATE,'tree':TREE,'executor':c.get('TRUSTED_WORKFLOW_SHA'),'policyCommit':POLICY_COMMIT,'policyBlob':POLICY_BLOB,'packageSha256':PACKAGE,'sourceArchiveSha256':ARCHIVE,'action':'admit-source-only','activate':False,'runId':c.get('GITHUB_RUN_ID'),'runAttempt':'1','operator':'subvicco12','reviewer':c.get('SINGLETON440_REVIEWER')}
    require(set(a)==set(expected)|{'reviewId','issuedAt','expiresAt','nonce'},'Authorization fields differ')
    require(all(type(a[k]) is type(v) and a[k]==v for k,v in expected.items()),'Exact authority tuple differs')
    require(re.fullmatch('[0-9a-f]{40}',a['executor']) is not None,'Executor identity malformed')
    for k,v in {'GITHUB_SHA':a['executor'],'GITHUB_WORKFLOW_SHA':a['executor'],'GITHUB_REPOSITORY':REPO,'GITHUB_EVENT_NAME':'workflow_dispatch','GITHUB_REF':REF,'GITHUB_REF_PROTECTED':'true','GITHUB_WORKFLOW_REF':f'{REPO}/{WORKFLOW}@{REF}','BOOTSTRAP_ENVIRONMENT':ENVIRONMENT,'GITHUB_ACTOR':a['operator'],'GITHUB_RUN_ATTEMPT':'1'}.items():require(c.get(k)==v,'Untrusted execution context: '+k)
    require(type(a['issuedAt']) is int and type(a['expiresAt']) is int and a['issuedAt']<=now<a['expiresAt'] and 0<a['expiresAt']-a['issuedAt']<=600,'Expired or unbounded authority')
    require(isinstance(a['nonce'],str) and re.fullmatch('[0-9a-f]{32}',a['nonce']) is not None,'Nonce malformed')
    require(owner.get('user',{}).get('emailAddress')=='subvicco12@gmail.com' and owner['user'].get('displayName')==OWNER,'Owner identity differs')
    require(comment.get('deleted') is False and comment.get('author',{}).get('me') is True and comment['author'].get('displayName')==OWNER and comment.get('content')==APPROVAL_PREFIX+'\n'+canonical(a),'Exact owner authorization absent')
    require(a['reviewer'] not in ('',a['operator']) and review.get('id')==a['reviewId'] and review.get('state')=='APPROVED' and review.get('commit_id')==a['executor'] and review.get('user',{}).get('login')==a['reviewer'] and review.get('body')==REVIEW_PREFIX+'\n'+canonical(review_binding(a)),'Independent exact review absent')
    return digest(canonical(a).encode())
def verify_package(root):
    root=pathlib.Path(root)
    def read(name):
        p=root/name;require(p.is_file() and not p.is_symlink(),'Package member redirected');return p.read_bytes()
    raw=read('nomination.json');require(digest(raw)==PACKAGE,'Nomination digest differs');p=json.loads(raw)
    require(p['candidate']==CANDIDATE and p['tree']==TREE and p['activationAllowed'] is False and p['releaseHold'] is True,'Nomination scope differs')
    for name,key in [('policy.json','policySha256'),('capture.json','captureSha256'),('exact-stage.mjs','verifierSha256'),('source-data.tar.gz','sourceArchiveSha256')]:require(digest(read(name))==p[key],'Package digest differs: '+name)
    require(p['sourceArchiveSha256']==ARCHIVE and p['paths']==['src/components/publication20-tool.test.tsx','src/components/publication20-tool.tsx'],'Two-path scope differs')
    with tarfile.open(root/'source-data.tar.gz','r:gz') as t:
        members=t.getmembers();require(len(members)==len(p['sourceMembers']) and {x.name for x in members}==set(p['sourceMembers']),'Archive members differ')
        for x in members:require(x.isfile() and digest(t.extractfile(x).read())==p['sourceMembers'][x.name],'Archive source differs')
    return p
def consume(path,key):
    path=pathlib.Path(path);require(path.is_dir() and not path.is_symlink() and re.fullmatch('[0-9a-f]{64}',key) is not None,'Unsafe replay state')
    require(path.resolve()==path.absolute(),'Redirected replay parent')
    directory=os.open(path,os.O_RDONLY|os.O_DIRECTORY|os.O_NOFOLLOW)
    try:fd=os.open(key,os.O_WRONLY|os.O_CREAT|os.O_EXCL|os.O_NOFOLLOW,0o600,dir_fd=directory)
    finally:os.close(directory)
    with os.fdopen(fd,'w') as f:f.write(key);f.flush();os.fsync(f.fileno())
def make_receipt(c,a,authorization,simulation=True):
    require(type(simulation) is bool,'Receipt mode must be explicit')
    body={'candidate':CANDIDATE,'tree':TREE,'executor':a['executor'],'policyCommit':POLICY_COMMIT,'policyBlob':POLICY_BLOB,'packageSha256':PACKAGE,'sourceArchiveSha256':ARCHIVE,'authorizationSha256':authorization,'runId':a['runId'],'runAttempt':a['runAttempt'],'simulation':simulation,'wouldAdmit':True,'admitted':not simulation,'activated':False}
    return {'body':body,'sha256':digest(canonical(body).encode())}
def verify_receipt(r,c,a,simulation=True):
    require(set(r)=={'body','sha256'} and digest(canonical(r['body']).encode())==r['sha256'],'Receipt integrity differs')
    require(isinstance(r['body'].get('authorizationSha256'),str) and re.fullmatch('[0-9a-f]{64}',r['body']['authorizationSha256']) is not None,'Authorization digest malformed')
    require(r==make_receipt(c,a,r['body']['authorizationSha256'],simulation),'Receipt identity differs')
if __name__=='__main__':
    verify_package(pathlib.Path(__file__).parent)
    print('Frozen package verified. No admission or activation performed.')
