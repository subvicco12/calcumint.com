import unittest,pathlib,importlib.util
import authority as a
from fixtures import fixture_grant
class ConsumptionTests(unittest.TestCase):
 def load(self):
  p=pathlib.Path(__file__).parent/'consumption.py';self.assertTrue(p.is_file(),'Governed v2 receipt review adapter missing')
  s=importlib.util.spec_from_file_location('v2_consumption',p);m=importlib.util.module_from_spec(s);s.loader.exec_module(m);return m
 def test_qualification_receipts_cannot_be_consumed_as_admission(self):
  m=self.load();g=fixture_grant(a);r=a.receipt(g,True)
  with self.assertRaises(ValueError):m.prepare_consumption(g,r,{'state':'RECEIPTED','receipt':r,'grantSha256':a.digest(a.canonical(g).encode())})
 def test_source_receipt_only_produces_review_data_without_activation(self):
  m=self.load();g=fixture_grant(a);g['mode']='source-admission';r=a.receipt(g,False)
  state={'state':'RECEIPTED','receipt':r,'grantSha256':a.digest(a.canonical(g).encode())}
  out=m.prepare_consumption(g,r,state);self.assertFalse(out['activated']);self.assertFalse(out['historicalIndependentApproval']);self.assertTrue(out['separateAuthorizationRequired'])
  for bad in ({**state,'state':'CLAIMED_NO_RECEIPT'},{**state,'grantSha256':'f'*64},{**state,'receipt':None}):
   with self.assertRaises(ValueError):m.prepare_consumption(g,r,bad)
if __name__=='__main__':unittest.main()
