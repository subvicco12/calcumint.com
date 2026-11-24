"""Fixed receipt-producing source admission; no activation, source edits or production calls.
Review-only: must not be executed until exact-source owner authorization is granted.
"""
import sys
sys.dont_write_bytecode=True
import importlib.util,json,os,pathlib,re,subprocess,time
from urllib.request import Request,build_opener,HTTPRedirectHandler
ROOT=pathlib.Path(__file__).resolve().parent
spec=importlib.util.spec_from_file_location('fixed_authority',ROOT/'authority.py');a=importlib.util.module_from_spec(spec);spec.loader.exec_module(a)
class NoRedirect(HTTPRedirectHandler):
    def redirect_request(self,*args,**kwargs):raise ValueError('Provider redirect refused')
def fetch(url,token,cap):
    a.require(bool(token),'Missing protected credential')
    request=Request(url,headers={'Authorization':'Bearer '+token,'Accept':'application/json'})
    with build_opener(NoRedirect).open(request,timeout=15) as response:data=response.read(cap+1)
    a.require(len(data)<=cap,'Provider response exceeds limit');return json.loads(data)
def main():
    c=dict(os.environ)
    # Reject wrong execution identity before reading credentials or making requests.
    sha=c.get('TRUSTED_WORKFLOW_SHA','')
    a.require(re.fullmatch('[0-9a-f]{40}',sha) is not None,'Exact executor pin missing')
    for k,v in {'GITHUB_SHA':sha,'GITHUB_WORKFLOW_SHA':sha,'GITHUB_REPOSITORY':a.REPO,'GITHUB_EVENT_NAME':'workflow_dispatch','GITHUB_REF':a.REF,'GITHUB_REF_PROTECTED':'true','GITHUB_WORKFLOW_REF':f'{a.REPO}/{a.WORKFLOW}@{a.REF}','BOOTSTRAP_ENVIRONMENT':a.ENVIRONMENT,'GITHUB_ACTOR':'subvicco12','GITHUB_RUN_ATTEMPT':'1'}.items():a.require(c.get(k)==v,'Untrusted context: '+k)
    a.verify_package(ROOT)
    # Existing reviewed runtime identities; provisioning is unchanged.
    for key,expected in [('BOOTSTRAP_NODE','94efd062ed066c1a0b332e18249859c905e920eeada5df55d24c99b919629a90'),('BOOTSTRAP_GIT','9dae295c1a4ffae4ee772e6205fcf22b26e1bfeeb5ee98f278b5139bda7ca22f')]:
        p=pathlib.Path(c.get(key,''));a.require(p.is_absolute() and p.is_file() and not p.is_symlink() and a.digest(p.read_bytes())==expected,'Pinned runtime differs: '+key)
    env={'PATH':'/usr/bin:/bin','HOME':'/nonexistent','GIT_CONFIG_NOSYSTEM':'1','GIT_CONFIG_GLOBAL':'/dev/null','BOOTSTRAP_GIT':c['BOOTSTRAP_GIT'],'GIT_EXEC_PATH':c.get('GIT_EXEC_PATH','')}
    def git(*args):return subprocess.check_output([c['BOOTSTRAP_GIT'],'-C',str(ROOT),'--no-optional-locks',*args],env=env,timeout=15)
    a.require(git('rev-parse','HEAD').decode().strip()==sha,'Executor checkout differs')
    for name in ('authority.py','execute.py','verify-checkout.mjs'):
        expected=git('show',sha+':tools/singleton440-authority/'+name)
        a.require((ROOT/name).read_bytes()==expected and not (ROOT/name).is_symlink(),'Mutable executor differs: '+name)
    a.require(git('rev-parse',a.POLICY_COMMIT+':tools/singleton440-authority/policy.json').decode().strip()==a.POLICY_BLOB,'Policy object differs')
    subprocess.run([c['BOOTSTRAP_GIT'],'-C',str(ROOT),'merge-base','--is-ancestor',a.POLICY_COMMIT,sha],env=env,check=True,timeout=15)
    document='1KU7fGtv86RQz_n3HCdl9HscTyN2Z7SlXz8U8EF3f3MY'
    comment=c.get('SINGLETON440_OWNER_COMMENT','');a.require(re.fullmatch('[A-Za-z0-9._-]+',comment) is not None,'Exact owner comment missing')
    token=c.get('BOOTSTRAP_DRIVE_TOKEN','')
    owner=fetch('https://www.googleapis.com/drive/v3/about?fields=user',token,10000)
    approval=fetch(f'https://www.googleapis.com/drive/v3/files/{document}/comments/{comment}?fields=id,deleted,author,content',token,30000)
    a.require(approval.get('id')==comment,'Comment readback identity differs')
    prefix=a.APPROVAL_PREFIX+'\n';a.require(approval.get('content','').startswith(prefix),'Exact authorization absent');auth=json.loads(approval['content'][len(prefix):])
    review_id=auth.get('reviewId');a.require(type(review_id) is int and review_id>0,'Review identity malformed')
    # A separate authority-review PR is required. PR1538 is never changed.
    pr=c.get('SINGLETON440_REVIEW_PR','');a.require(pr.isdecimal() and pr!='1538','Independent authority-review PR missing')
    review=fetch(f'https://api.github.com/repos/{a.REPO}/pulls/{pr}/reviews/{review_id}',c.get('GITHUB_TOKEN',''),100000)
    authorization=a.verify_authorization(c,auth,owner,approval,review,int(time.time()))
    checkout=pathlib.Path(c['BOOTSTRAP_CANDIDATE']).resolve(strict=True)
    def verify():subprocess.run([c['BOOTSTRAP_NODE'],str(ROOT/'verify-checkout.mjs'),str(checkout)],env=env,check=True,timeout=65,capture_output=True)
    verify()
    state=pathlib.Path(c['RUNNER_TEMP'])/'singleton440-replay'
    state.mkdir(mode=0o700,exist_ok=True)
    a.consume(state,a.digest((auth['runId']+':'+auth['runAttempt']+':'+auth['nonce']).encode()))
    # Repeat mutable-source and live authorization checks immediately before issuing receipt.
    verify()
    fresh=fetch(f'https://www.googleapis.com/drive/v3/files/{document}/comments/{comment}?fields=id,deleted,author,content',token,30000)
    fresh_review=fetch(f'https://api.github.com/repos/{a.REPO}/pulls/{pr}/reviews/{review_id}',c.get('GITHUB_TOKEN',''),100000)
    a.require(a.verify_authorization(c,auth,owner,fresh,fresh_review,int(time.time()))==authorization,'Authority changed')
    receipt=a.make_receipt(c,auth,authorization,simulation=False);a.verify_receipt(receipt,c,auth,simulation=False)
    # Exact source receipt only. This does not install a consumer or activate a protected source.
    output=state/'admission-receipt.json'
    with output.open('x') as f:json.dump(receipt,f,sort_keys=True);f.write('\n');f.flush();os.fsync(f.fileno())
    print(str(output))
if __name__=='__main__':
    try:main()
    except Exception as error:raise SystemExit('Source admission refused ('+type(error).__name__+')') from None
