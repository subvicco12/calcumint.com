import copy
import unittest
import verify
class ThirteenPacketChecks(unittest.TestCase):
    def setUp(self):
        self.index=verify.load(verify.BASE/'index.json');self.register=verify.load(verify.BASE/'decision-register.json')
    def test_exact_git_native_catalog_receipts_and_preservation(self):self.assertTrue(verify.verify_all())
    def test_missing_packet_and_wrong_website_version_reject(self):
        for mutation in [lambda i:i['packets'].pop(),lambda i:next(r for r in i['packets'] if r['masterId']==383).update(version=1)]:
            i=copy.deepcopy(self.index);mutation(i)
            with self.assertRaises(AssertionError):verify.verify_documents(i,self.register)
    def test_fabricated_decision_and_promotion_reject(self):
        for field in ['decision','reviewer','decidedAt']:
            r=copy.deepcopy(self.register);r['decisions'][0][field]='invented'
            with self.assertRaises(AssertionError):verify.verify_documents(self.index,r)
        i=copy.deepcopy(self.index);i['canonicalAcceptedCount']=1
        with self.assertRaises(AssertionError):verify.verify_documents(i,self.register)
    def test_normalization_cannot_drop_obligations_or_invent_old_dimensions(self):
        for mutation in [lambda r:r['decisions'].pop(),lambda r:r['decisions'][0].update(originalDecisionDimensions=['invented-approved-dimension'])]:
            r=copy.deepcopy(self.register);mutation(r)
            with self.assertRaises(AssertionError):verify.verify_documents(self.index,r)
if __name__=='__main__':unittest.main()
