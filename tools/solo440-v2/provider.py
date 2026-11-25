"""Fresh, read-only provider adapter for the existing fixed owner-v2 authority.
No source-admission CLI: --verify-only emits qualification/readback facts only.
"""
import argparse,hashlib,json,os,pathlib,re,sys,time
sys.dont_write_bytecode=True
sys.path.insert(0,str(pathlib.Path(__file__).resolve().parent))
import authority as a
import execute as executor
from urllib.request import Request,build_opener,HTTPRedirectHandler
from urllib.parse import urlparse,quote
from urllib.error import HTTPError,URLError
EXECUTION_REF=executor.EXECUTION_REF
QUALIFICATION_WORKFLOW='.github/workflows/solo440-hosted-qualification.yml'
SOURCE_WORKFLOW=executor.SOURCE_WORKFLOW
DOCUMENT='1KU7fGtv86RQz_n3HCdl9HscTyN2Z7SlXz8U8EF3f3MY'
RECOVERY_WORKFLOW='.github/workflows/solo440-hosted-recovery.yml'
RECOVERY_REF='refs/heads/engineering/solo440-owner-v2-recovery-execution'
FINAL_WORKFLOW='.github/workflows/solo440-hosted-final-qualification.yml'
FINAL_REF='refs/heads/engineering/solo440-owner-v2-final-execution'
def execution_ref(workflow):
 return FINAL_REF if workflow==FINAL_WORKFLOW else RECOVERY_REF if workflow==RECOVERY_WORKFLOW else EXECUTION_REF
CATEGORIES=frozenset(('github-run','github-branch','github-frozen-ruleset','github-execution-ruleset','github-environment','github-environment-branches','google-userinfo','google-drive-about','google-adoption-comment','google-authority-comment'))
class ProviderRefusal(ValueError):
 def __init__(self,category,status,reason):
  self.diagnostic={'category':category,'httpStatus':status,'reason':reason}
  super().__init__(a.canonical(self.diagnostic))
class NoRedirect(HTTPRedirectHandler):
 def redirect_request(self,*args,**kwargs):raise ValueError('Provider redirect refused')
def allowed_url(url):
 u=urlparse(url)
 a.require(u.scheme=='https' and not u.username and not u.password and not u.fragment and u.port in (None,443) and u.hostname in ('api.github.com','www.googleapis.com'),'Provider origin refused')
 return url
def get_json(url,token,cap=100000,*,category):
 a.require(category in CATEGORIES,'Unknown provider endpoint category')
 allowed_url(url);a.require(type(token) is str and bool(token),'Missing existing provider credential')
 request=Request(url,headers={'Authorization':'Bearer '+token,'Accept':'application/json','User-Agent':'calcumint-solo440-v2'})
 try:
  with build_opener(NoRedirect).open(request,timeout=15) as r:raw=r.read(cap+1)
 except HTTPError as e:raise ProviderRefusal(category,e.code,'http-refusal') from None
 except (URLError,TimeoutError):raise ProviderRefusal(category,None,'transport-refusal') from None
 a.require(len(raw)<=cap,'Provider read exceeds bound');return json.loads(raw)
def normalize_owner(profile):
 a.require(profile.get('sub')==a.OWNER_ID and profile.get('name')==a.OWNER and profile.get('email')=='subvicco12@gmail.com' and profile.get('email_verified') is True,'Authenticated owner subject differs')
 return {'id':profile['sub'],'name':profile['name'],'email':profile['email']}
def verify_run(env,run,workflow):
 a.require(workflow in (QUALIFICATION_WORKFLOW,SOURCE_WORKFLOW,RECOVERY_WORKFLOW,FINAL_WORKFLOW),'Unapproved workflow')
 ref=execution_ref(workflow)
 sha=env.get('TRUSTED_WORKFLOW_SHA','');a.require(re.fullmatch('[0-9a-f]{40}',sha) is not None,'Protected executor SHA missing')
 for key,value in {'GITHUB_REPOSITORY':a.REPO,'GITHUB_SHA':sha,'GITHUB_WORKFLOW_SHA':sha,'GITHUB_REF':ref,'GITHUB_REF_PROTECTED':'true','GITHUB_ACTOR':'subvicco12','GITHUB_RUN_ATTEMPT':'1','GITHUB_EVENT_NAME':'workflow_dispatch','GITHUB_WORKFLOW_REF':a.REPO+'/'+workflow+'@'+ref}.items():a.require(env.get(key)==value,'Provider environment differs: '+key)
 a.require(str(run.get('id'))==env.get('GITHUB_RUN_ID') and type(run.get('run_attempt')) is int and run['run_attempt']==1 and run.get('head_sha')==sha and run.get('event')=='workflow_dispatch' and run.get('head_branch')==ref.removeprefix('refs/heads/') and run.get('actor',{}).get('login')=='subvicco12' and run.get('repository',{}).get('full_name')==a.REPO and run.get('path','').split('@')[0]==workflow,'Authenticated hosted run differs')
def verify_protection(rules,branch,sha):
 expected={27851420:'refs/heads/engineering/trusted-bootstrap-20261122',27907165:'refs/heads/engineering/trusted-bootstrap-runtime-20261123'}
 a.require(len(rules)==2 and {r.get('id') for r in rules}==set(expected),'Frozen ruleset inventory differs')
 for r in rules:a.require(r.get('id') in expected and r.get('enforcement')=='active' and r.get('conditions',{}).get('ref_name',{}).get('include')==[expected[r['id']]],'Frozen ruleset changed or disabled')
 a.require(branch.get('protected') is True and branch.get('commit',{}).get('sha')==sha,'Execution branch is unprotected or wrong head')
class Provider:
 def __init__(self,environment):self.env=dict(environment)
 def github(self,path,category):return get_json('https://api.github.com/repos/'+a.REPO+'/'+path,self.env.get('GITHUB_TOKEN',''),1000000,category=category)
 def drive(self,path,cap=100000,category='google-authority-comment'):return get_json('https://www.googleapis.com/drive/v3/'+path,self.env.get('BOOTSTRAP_DRIVE_TOKEN',''),cap,category=category)
 def comment(self,identifier):
  a.require(type(identifier) is str and re.fullmatch('[A-Za-z0-9._-]+',identifier) is not None,'Exact comment ID missing')
  c=self.drive('files/'+DOCUMENT+'/comments/'+identifier+'?fields=id,deleted,author,content,createdTime,modifiedTime',category='google-adoption-comment' if identifier==a.ADOPTION else 'google-authority-comment')
  a.require(c.get('id')==identifier,'Comment identity differs');return c
 def identity_and_adoption(self):
  owner=normalize_owner(get_json('https://www.googleapis.com/oauth2/v3/userinfo',self.env.get('BOOTSTRAP_DRIVE_TOKEN',''),10000,category='google-userinfo'))
  about=self.drive('about?fields=user',10000,category='google-drive-about').get('user',{})
  a.require(about.get('emailAddress')==owner['email'] and about.get('displayName')==owner['name'],'Drive and identity subject differ')
  adoption=self.comment(a.ADOPTION);a.verify_adoption(owner,adoption);return owner,adoption
 def execution_readback(self,workflow):
  runid=self.env.get('GITHUB_RUN_ID','');a.require(re.fullmatch('[1-9][0-9]*',runid) is not None,'Run ID malformed')
  ref=execution_ref(workflow)
  run=self.github('actions/runs/'+runid,'github-run');verify_run(self.env,run,workflow)
  branch=self.github('branches/'+quote(ref.removeprefix('refs/heads/'),safe=''),'github-branch')
  rules=[self.github('rulesets/'+str(i),'github-frozen-ruleset') for i in (27851420,27907165)];verify_protection(rules,branch,self.env['TRUSTED_WORKFLOW_SHA'])
  environment=self.github('environments/calcumint-source-bootstrap-runtime','github-environment')
  policies=self.github('environments/calcumint-source-bootstrap-runtime/deployment-branch-policies','github-environment-branches')
  a.require(environment.get('name')=='calcumint-source-bootstrap-runtime' and environment.get('deployment_branch_policy',{}).get('custom_branch_policies') is True and any(p.get('name')==ref.removeprefix('refs/heads/') and p.get('type')=='branch' for p in policies.get('branch_policies',[])),'Approved environment branch allowance missing')
  return {'run':{k:run[k] for k in ('id','head_sha','event','run_attempt','head_branch')},'branchProtected':True,'rulesets':rules,'environment':environment,'allowedBranches':policies}
 def read_authority(self):
  # Every call re-reads the provider; no mutable-source or authority cache.
  self.execution_readback(SOURCE_WORKFLOW);owner,adoption=self.identity_and_adoption()
  return {'owner':owner,'adoption':adoption,'product':self.comment(self.env.get('SOLO440_PRODUCT_COMMENT','')),'applicability':self.comment(self.env.get('SOLO440_APPLICABILITY_COMMENT','')),'grant':self.comment(self.env.get('SOLO440_GRANT_COMMENT',''))}
 def verify_source_grant(self,context):
  proof=self.read_authority();grant=executor.decision(proof['grant'],executor.GRANT_PREFIX)
  a.verify_grant(grant,int(time.time()),context);executor.verify_execution_context(context);executor.verify_authority(grant,proof)
  return grant
 def prepare_source_review(self,context,verify_source):
  grant=self.verify_source_grant(context);verify_source()
  # This adapter does not claim the store or admit any source.
  return {'schema':'calcumint.singleton440.provider-review.v2','candidate':a.CANDIDATE,'grantSha256':a.digest(a.canonical(grant).encode()),'ownerAccepted':True,'admitted':False,'activated':False,'separateExecutionAuthorizationRequired':True}
def main():
 parser=argparse.ArgumentParser();mode=parser.add_mutually_exclusive_group(required=True);mode.add_argument('--verify-only',action='store_true');mode.add_argument('--recovery-verify-only',action='store_true');mode.add_argument('--final-verify-only',action='store_true');parser.add_argument('--output',type=pathlib.Path,required=True);args=parser.parse_args()
 provider=Provider(os.environ)
 try:
  a.verify_package();readback=provider.execution_readback(FINAL_WORKFLOW if args.final_verify_only else RECOVERY_WORKFLOW if args.recovery_verify_only else QUALIFICATION_WORKFLOW);owner,adoption=provider.identity_and_adoption()
 except Exception as error:
  diagnostic=error.diagnostic if isinstance(error,ProviderRefusal) else {'category':'verification-contract','httpStatus':None,'reason':'verification-refusal'}
  args.output.write_text(a.canonical({'schema':'calcumint.singleton440.provider-diagnostic.v1','passed':False,'diagnostic':diagnostic,'admitted':False,'activated':False})+'\n')
  raise SystemExit('Provider verification refused '+a.canonical(diagnostic)) from None
 report={'schema':'calcumint.singleton440.provider-readback.v2','ownerSubject':owner['id'],'adoptionComment':adoption['id'],'amendmentSha256':a.AMENDMENT,'policySha256':a.POLICY_SHA,'readback':readback,'admitted':False,'activated':False,'productApprovalInferred':False,'crossHostStorageQualified':False}
 args.output.write_text(a.canonical(report)+'\n')
if __name__=='__main__':
 try:main()
 except Exception as e:raise SystemExit('Provider verification refused ('+type(e).__name__+')') from None
