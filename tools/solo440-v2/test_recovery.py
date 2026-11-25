import contextlib,importlib.util,io,json,os,pathlib,tempfile,unittest
from unittest.mock import patch
from urllib.error import HTTPError,URLError
import provider

ROOT=pathlib.Path(__file__).parent
class RecoveryTests(unittest.TestCase):
 def test_failure_receipt_is_written_before_exit(self):
  with tempfile.TemporaryDirectory() as d:
   out=pathlib.Path(d)/'provider.json'
   with patch('sys.argv',['provider.py','--recovery-verify-only','--output',str(out)]),patch.object(provider.Provider,'execution_readback',side_effect=provider.ProviderRefusal('github-environment',403,'http-refusal')):
    with self.assertRaises(SystemExit):provider.main()
   receipt=json.loads(out.read_text())
   self.assertEqual(receipt['diagnostic'],{'category':'github-environment','httpStatus':403,'reason':'http-refusal'})
   self.assertFalse(receipt['admitted']);self.assertFalse(receipt['activated'])
 def test_recovery_workflow_cannot_reuse_frozen_ref_or_attempt_two(self):
  env={'GITHUB_REPOSITORY':provider.a.REPO,'GITHUB_SHA':'e'*40,'GITHUB_WORKFLOW_SHA':'e'*40,'TRUSTED_WORKFLOW_SHA':'e'*40,'GITHUB_REF':provider.RECOVERY_REF,'GITHUB_REF_PROTECTED':'true','GITHUB_ACTOR':'subvicco12','GITHUB_RUN_ID':'42','GITHUB_RUN_ATTEMPT':'1','GITHUB_EVENT_NAME':'workflow_dispatch','GITHUB_WORKFLOW_REF':provider.a.REPO+'/'+provider.RECOVERY_WORKFLOW+'@'+provider.RECOVERY_REF}
  run={'id':42,'run_attempt':1,'head_sha':'e'*40,'event':'workflow_dispatch','head_branch':provider.RECOVERY_REF.removeprefix('refs/heads/'),'actor':{'login':'subvicco12'},'repository':{'full_name':provider.a.REPO},'path':provider.RECOVERY_WORKFLOW}
  provider.verify_run(env,run,provider.RECOVERY_WORKFLOW)
  for key,value in [('GITHUB_REF',provider.EXECUTION_REF),('GITHUB_RUN_ATTEMPT','2'),('GITHUB_SHA','f'*40),('GITHUB_REF_PROTECTED','false'),('GITHUB_ACTOR','other')]:
   with self.subTest(key=key),self.assertRaises(ValueError):provider.verify_run({**env,key:value},run,provider.RECOVERY_WORKFLOW)
 def test_fixed_category_mapping_for_github_and_google_requests(self):
  p=provider.Provider({'GITHUB_TOKEN':'synthetic','BOOTSTRAP_DRIVE_TOKEN':'synthetic'})
  with patch.object(provider,'get_json',return_value={'id':provider.a.ADOPTION}) as get:
   p.github('actions/runs/42','github-run');self.assertEqual(get.call_args.kwargs['category'],'github-run')
   p.comment(provider.a.ADOPTION);self.assertEqual(get.call_args.kwargs['category'],'google-adoption-comment')
   get.return_value={'id':'synthetic-grant'}
   p.comment('synthetic-grant');self.assertEqual(get.call_args.kwargs['category'],'google-authority-comment')
 def test_http_failure_is_category_and_status_only(self):
  secret='private-token-and-provider-body'
  for category,url in [('github-run','https://api.github.com/repos/x/actions/runs/1'),('google-userinfo','https://www.googleapis.com/oauth2/v3/userinfo')]:
   error=HTTPError(url+'?secret='+secret,403,secret,{'Authorization':secret},io.BytesIO(secret.encode()))
   with patch.object(provider,'build_opener') as opener:
    opener.return_value.open.side_effect=error
    with self.assertRaises(provider.ProviderRefusal) as caught:provider.get_json(url,secret,category=category)
   self.assertEqual(caught.exception.diagnostic,{'category':category,'httpStatus':403,'reason':'http-refusal'})
   self.assertNotIn(secret,str(caught.exception))
 def test_unknown_category_refused_before_network(self):
  with patch.object(provider,'build_opener') as opener:
   with self.assertRaises(ValueError):provider.get_json('https://api.github.com/x','secret',category='untrusted-personal-data')
   opener.assert_not_called()
 def test_outage_diagnostic_does_not_include_url_or_exception(self):
  with patch.object(provider,'build_opener') as opener:
   opener.return_value.open.side_effect=URLError('secret-url-and-token')
   with self.assertRaises(provider.ProviderRefusal) as caught:provider.get_json('https://api.github.com/x','secret',category='github-run')
  self.assertEqual(caught.exception.diagnostic,{'category':'github-run','httpStatus':None,'reason':'transport-refusal'})
 def setup_module(self):
  spec=importlib.util.spec_from_file_location('mass_setup',ROOT/'mass426_setup.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m);return m
 def test_missing_pdf_tool_reports_before_browser(self):
  m=self.setup_module()
  with tempfile.TemporaryDirectory() as d,patch.dict(os.environ,{'PATH':d}):
   with self.assertRaises(m.SetupRefusal) as c:m.resolve_tools()
   self.assertEqual(c.exception.category,'pdftotext-missing')
 def test_supported_browser_resolution_and_missing_browser_refusal(self):
  m=self.setup_module()
  with tempfile.TemporaryDirectory() as d,patch.dict(os.environ,{'PATH':d}):
   for name in ['pdftotext','google-chrome-stable']:
    p=pathlib.Path(d)/name;p.write_text('#!/bin/sh\necho fixture-tool-version\n');p.chmod(0o755)
   tools=m.resolve_tools();self.assertEqual(tools['chromium']['path'],str(pathlib.Path(d)/'google-chrome-stable'))
   self.assertEqual(len(tools['chromium']['sha256']),64)
   (pathlib.Path(d)/'google-chrome-stable').unlink()
   with self.assertRaises(m.SetupRefusal) as c:m.resolve_tools()
   self.assertEqual(c.exception.category,'chromium-missing')
 def test_setup_failure_receipt_never_serializes_environment(self):
  m=self.setup_module()
  with tempfile.TemporaryDirectory() as d,patch.dict(os.environ,{'PATH':d,'BOOTSTRAP_DRIVE_TOKEN':'never-copy-this'}):
   out=pathlib.Path(d)/'receipt.json';self.assertEqual(m.check(out),1)
   receipt=json.loads(out.read_text());self.assertEqual(receipt['category'],'pdftotext-missing')
   self.assertFalse(receipt['passed']);self.assertNotIn('never-copy-this',out.read_text())

if __name__=='__main__':unittest.main()
