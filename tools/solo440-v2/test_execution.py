import unittest,pathlib,importlib.util,tempfile,copy
import authority as a
from fixtures import fixture_grant,adoption_fixture
ROOT=pathlib.Path(__file__).parent
class ExecutionTests(unittest.TestCase):
 def module(self):
  self.assertTrue((ROOT/'execute.py').is_file(),'Versioned owner-acceptance executor missing')
  s=importlib.util.spec_from_file_location('solo_execute',ROOT/'execute.py');m=importlib.util.module_from_spec(s);s.loader.exec_module(m);return m
 def fixture(self,m):
  g=fixture_grant(a);owner,adoption=adoption_fixture(a)
  def decision(prefix,body):return {'id':'synthetic-'+prefix,'deleted':False,'author':{'me':True,'displayName':a.OWNER},'content':prefix+'\n'+a.canonical(body)}
  product={'candidate':a.CANDIDATE,'tree':a.TREE,'engineBlob':a.ENGINE,'assessment':'SYNTHETIC TEST ONLY: formula, unit factors, supported range, precision, rounding, display and refusals assessed for testing; no competent approval.','decision':'APPROVE','evidenceSha256':g['evidenceSha256'],'scope':'general-purpose-frequency-conversion'}
  applicability={'candidate':a.CANDIDATE,'policySha256':a.POLICY_SHA,'providerRequirements':'SATISFIED','legalRequirements':'NOT_APPLICABLE','specialistRequirements':'NOT_APPLICABLE','governingRequirements':'SATISFIED','basis':'SYNTHETIC TEST ONLY: no provider, legal or specialist attestation is made by this fixture.'}
  g['productDispositionSha256']=a.digest(a.canonical(product).encode());g['applicabilitySha256']=a.digest(a.canonical(applicability).encode())
  proof={'owner':owner,'adoption':adoption,'product':decision(m.PRODUCT_PREFIX,product),'applicability':decision(m.APPLICABILITY_PREFIX,applicability),'grant':decision(m.GRANT_PREFIX,g)}
  return g,proof
 def test_product_and_applicability_cannot_be_replaced_by_adoption(self):
  m=self.module();g,p=self.fixture(m);m.verify_authority(g,p)
  for key in ('product','applicability','grant'):
   bad=copy.deepcopy(p);bad[key]=p['adoption']
   with self.subTest(key=key),self.assertRaises(ValueError):m.verify_authority(g,bad)
 def test_owner_acceptance_does_not_forge_independence(self):
  m=self.module();g,p=self.fixture(m);self.assertEqual(m.verify_authority(g,p),a.digest(a.canonical(g).encode()))
  for key in ('product','applicability','grant'):
   bad=copy.deepcopy(p);bad[key]['author']['me']=False
   with self.assertRaises(ValueError):m.verify_authority(g,bad)
 def test_sqlite_reference_claim_and_receipt_reconciliation(self):
  m=self.module();g,p=self.fixture(m)
  with tempfile.TemporaryDirectory() as tmp:
   store=m.QualificationStore(pathlib.Path(tmp)/'store.sqlite');store.initialize()
   row=store.claim(g);self.assertEqual(row['state'],'CLAIMED_NO_RECEIPT')
   with self.assertRaises(Exception):store.claim({**g,'nonce':'f'*32})
   r=a.receipt(g,True)
   store.finalize(g,r);self.assertEqual(store.reconcile(g)['receipt'],r)
   with self.assertRaises(Exception):store.finalize(g,r)
 def test_interruption_and_source_or_authorization_failure_leave_closed_claim(self):
  m=self.module();g,p=self.fixture(m)
  with tempfile.TemporaryDirectory() as tmp:
   store=m.QualificationStore(pathlib.Path(tmp)/'store.sqlite');store.initialize();counter=[0]
   def verify():
    counter[0]+=1
    if counter[0]==2:raise ValueError('Source changed after claim')
   with self.assertRaises(ValueError):m.execute_qualification(g,lambda:p,store,verify)
   self.assertEqual(store.reconcile(g)['state'],'CLAIMED_NO_RECEIPT')
 def test_qualification_refuses_source_admission_mode(self):
  m=self.module();g,p=self.fixture(m);g['mode']='source-admission'
  with self.assertRaises(ValueError):m.execute_qualification(g,lambda:p,None,lambda:None)
 def test_live_execution_requires_protected_context_and_pinned_runtime(self):
  m=self.module()
  with self.assertRaises(ValueError):m.verify_execution_context({})
  env={'TRUSTED_WORKFLOW_SHA':'e'*40,'GITHUB_SHA':'e'*40,'GITHUB_WORKFLOW_SHA':'e'*40,'GITHUB_REPOSITORY':a.REPO,'GITHUB_EVENT_NAME':'workflow_dispatch','GITHUB_REF':m.EXECUTION_REF,'GITHUB_REF_PROTECTED':'true','GITHUB_WORKFLOW_REF':a.REPO+'/'+m.SOURCE_WORKFLOW+'@'+m.EXECUTION_REF,'GITHUB_RUN_ATTEMPT':'1','GITHUB_ACTOR':'subvicco12','BOOTSTRAP_ENVIRONMENT':'calcumint-source-bootstrap-runtime'}
  with self.assertRaises(ValueError):m.verify_execution_context({'environment':env})
if __name__=='__main__':unittest.main()
