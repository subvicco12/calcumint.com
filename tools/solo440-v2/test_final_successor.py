import datetime,pathlib,unittest
import provider,dispatch_window
ROOT=pathlib.Path(__file__).parent
class FinalSuccessorTests(unittest.TestCase):
 def test_final_binding_is_separate_and_fail_closed(self):
  m=provider;ref=m.FINAL_REF;workflow=m.FINAL_WORKFLOW
  env={'GITHUB_REPOSITORY':m.a.REPO,'GITHUB_SHA':'e'*40,'GITHUB_WORKFLOW_SHA':'e'*40,'TRUSTED_WORKFLOW_SHA':'e'*40,'GITHUB_REF':ref,'GITHUB_REF_PROTECTED':'true','GITHUB_ACTOR':'subvicco12','GITHUB_RUN_ID':'42','GITHUB_RUN_ATTEMPT':'1','GITHUB_EVENT_NAME':'workflow_dispatch','GITHUB_WORKFLOW_REF':m.a.REPO+'/'+workflow+'@'+ref}
  run={'id':42,'run_attempt':1,'head_sha':'e'*40,'event':'workflow_dispatch','head_branch':ref.removeprefix('refs/heads/'),'actor':{'login':'subvicco12'},'repository':{'full_name':m.a.REPO},'path':workflow}
  m.verify_run(env,run,workflow)
  for key,value in [('GITHUB_REF',m.RECOVERY_REF),('GITHUB_REF',m.EXECUTION_REF),('GITHUB_RUN_ATTEMPT','2'),('GITHUB_SHA','f'*40),('GITHUB_ACTOR','other'),('GITHUB_REF_PROTECTED','false')]:
   with self.subTest(key=key,value=value),self.assertRaises(ValueError):m.verify_run({**env,key:value},run,workflow)
  self.assertEqual(m.execution_ref(m.RECOVERY_WORKFLOW),m.RECOVERY_REF)
  self.assertEqual(m.execution_ref(m.SOURCE_WORKFLOW),m.EXECUTION_REF)
 def test_dispatch_age_and_skew_boundaries(self):
  created='2026-11-25T00:00:00Z';stamp=datetime.datetime.fromisoformat(created.replace('Z','+00:00')).timestamp()
  for age in [-120,0,600]:self.assertEqual(dispatch_window.verify_age(created,stamp+age),age)
  for age in [-121,601]:
   with self.assertRaises(ValueError):dispatch_window.verify_age(created,stamp+age)
 def test_runner_preserves_all_existing_assertions_and_one_install(self):
  original=(ROOT/'vendor/mass426-run-unprivileged.sh').read_text()
  actual=(ROOT/'run-mass426-successor.sh').read_text()
  begin=actual.index('# Use the approved installation');end=actual.index('node tests/worker2-energy-mobility-20261119/recovered-mass.local.mjs',begin)
  self.assertEqual(actual[:begin]+actual[end:],original)
  self.assertEqual(actual.count('npm ci --ignore-scripts --no-audit --no-fund'),1)
if __name__=='__main__':unittest.main()
