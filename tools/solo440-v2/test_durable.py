import importlib.util,pathlib,unittest,copy
from fixtures import adoption_fixture,fixture_grant
ROOT=pathlib.Path(__file__).parent
class DurableTests(unittest.TestCase):
 def module(self):
  self.assertTrue((ROOT/'authority.py').is_file(),'Versioned durable authority implementation missing')
  s=importlib.util.spec_from_file_location('solo440',ROOT/'authority.py');m=importlib.util.module_from_spec(s);s.loader.exec_module(m);return m
 def test_exact_amendment_policy_and_nomination(self):
  m=self.module();p=m.verify_package();self.assertEqual(p['candidate'],m.CANDIDATE)
 def test_adoption_requires_exact_owner_content_times_and_id(self):
  m=self.module();owner,comment=adoption_fixture(m);m.verify_adoption(owner,comment)
  for field,value in [('id','wrong'),('deleted',True),('content','adopt a different scope'),('modifiedTime','later')]:
   with self.subTest(field=field),self.assertRaises(ValueError):m.verify_adoption(owner,{**comment,field:value})
 def test_grants_reject_wrong_scope_time_type_run_attempt_and_activation(self):
  m=self.module();g=fixture_grant(m);now=g['issuedAt']+1
  m.verify_grant(g,now)
  for field,value in [('candidate','f'*40),('amendmentSha256','f'*64),('policySha256','f'*64),('nominationSha256','f'*64),('attempt',2),('attempt',True),('activation',True),('issuedAt',now+1),('expiresAt',now-1),('runId','bad'),('evidenceSha256','bad'),('nonce','bad'),('basis','independent-review')]:
   with self.subTest(field=field),self.assertRaises(ValueError):m.verify_grant({**g,field:value},now)
  with self.assertRaises(ValueError):m.verify_grant({**g,'expiresAt':g['issuedAt']+601},now)
  with self.assertRaises(ValueError):m.verify_grant({**g,'unlimited':True},now)
 def test_receipt_is_separate_and_old_receipt_shape_refuses(self):
  m=self.module();g=fixture_grant(m);r=m.receipt(g,qualification=True);m.verify_receipt(r,g,qualification=True)
  self.assertFalse(r['body']['admitted']);self.assertFalse(r['body']['activated']);self.assertFalse(r['body']['independentApproval'])
  for field,value in [('candidate','f'*40),('activated',True),('independentApproval',True),('certified',True),('published',True),('schema','calcumint.singleton440.owner-authority.v1')]:
   bad=copy.deepcopy(r);bad['body'][field]=value;bad['sha256']=m.digest(m.canonical(bad['body']).encode())
   with self.subTest(field=field),self.assertRaises(ValueError):m.verify_receipt(bad,g,qualification=True)
 def test_unavailable_store_is_closed_and_no_local_fallback(self):
  m=self.module();g=fixture_grant(m)
  def outage(sql):raise OSError('disposable storage unavailable')
  with self.assertRaises(OSError):m.Store(outage).claim(g)
 def test_frozen_historical_consumer_refuses_v2_receipt(self):
  m=self.module();g=fixture_grant(m);r=m.receipt(g,qualification=True)
  s=importlib.util.spec_from_file_location('historical',ROOT.parent/'singleton440-authority'/'authority.py');old=importlib.util.module_from_spec(s);s.loader.exec_module(old)
  auth={'executor':g['executor'],'runId':g['runId'],'runAttempt':'1'}
  with self.assertRaises((ValueError,KeyError)):old.verify_receipt(r,{},auth,simulation=True)
if __name__=='__main__':unittest.main()
