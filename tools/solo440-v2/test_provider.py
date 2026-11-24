import unittest,importlib.util,pathlib
import authority as a
ROOT=pathlib.Path(__file__).parent
class ProviderTests(unittest.TestCase):
 def module(self):
  self.assertTrue((ROOT/'provider.py').is_file(),'Provider authentication adapter missing')
  s=importlib.util.spec_from_file_location('provider_v2',ROOT/'provider.py');m=importlib.util.module_from_spec(s);s.loader.exec_module(m);return m
 def test_owner_subject_and_verified_email_required(self):
  m=self.module();good={'sub':a.OWNER_ID,'name':a.OWNER,'email':'subvicco12@gmail.com','email_verified':True}
  self.assertEqual(m.normalize_owner(good)['id'],a.OWNER_ID)
  for key,value in [('sub','other'),('email_verified',False),('email','wrong@example.com')]:
   with self.subTest(key=key),self.assertRaises(ValueError):m.normalize_owner({**good,key:value})
 def test_provider_origins_and_redirects_are_closed(self):
  m=self.module()
  for url in ['http://api.github.com/repos/x','https://evil.example/','https://api.github.com@evil.example/x']:
   with self.assertRaises(ValueError):m.allowed_url(url)
  with self.assertRaises(ValueError):m.NoRedirect().redirect_request(None,None,None,None,None,None)
 def test_exact_hosted_run_binding(self):
  m=self.module();env={'GITHUB_REPOSITORY':a.REPO,'GITHUB_SHA':'e'*40,'GITHUB_WORKFLOW_SHA':'e'*40,'TRUSTED_WORKFLOW_SHA':'e'*40,'GITHUB_REF':m.EXECUTION_REF,'GITHUB_REF_PROTECTED':'true','GITHUB_ACTOR':'subvicco12','GITHUB_RUN_ID':'42','GITHUB_RUN_ATTEMPT':'1','GITHUB_EVENT_NAME':'workflow_dispatch','GITHUB_WORKFLOW_REF':a.REPO+'/'+m.QUALIFICATION_WORKFLOW+'@'+m.EXECUTION_REF}
  run={'id':42,'run_attempt':1,'head_sha':'e'*40,'event':'workflow_dispatch','head_branch':m.EXECUTION_REF.removeprefix('refs/heads/'),'actor':{'login':'subvicco12'},'repository':{'full_name':a.REPO},'path':m.QUALIFICATION_WORKFLOW}
  m.verify_run(env,run,m.QUALIFICATION_WORKFLOW)
  for key,value in [('head_sha','f'*40),('run_attempt',2),('event','push'),('path','.github/workflows/unrelated.yml')]:
   with self.subTest(key=key),self.assertRaises(ValueError):m.verify_run(env,{**run,key:value},m.QUALIFICATION_WORKFLOW)
 def test_frozen_rules_and_new_execution_branch_remain_protected(self):
  m=self.module();rules=[{'id':27851420,'enforcement':'active','conditions':{'ref_name':{'include':['refs/heads/engineering/trusted-bootstrap-20261122']}}},{'id':27907165,'enforcement':'active','conditions':{'ref_name':{'include':['refs/heads/engineering/trusted-bootstrap-runtime-20261123']}}}]
  m.verify_protection(rules,{'protected':True,'commit':{'sha':'e'*40}},'e'*40)
  with self.assertRaises(ValueError):m.verify_protection(rules,{'protected':False,'commit':{'sha':'e'*40}},'e'*40)
  with self.assertRaises(ValueError):m.verify_protection([rules[0],rules[0]],{'protected':True,'commit':{'sha':'e'*40}},'e'*40)
  rules[0]['enforcement']='disabled'
  with self.assertRaises(ValueError):m.verify_protection(rules,{'protected':True,'commit':{'sha':'e'*40}},'e'*40)
if __name__=='__main__':unittest.main()
