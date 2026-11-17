import copy
import unittest
import verify

class CanonicalPacketIntegrity(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.cells=verify.native_cells()
        rows=verify.load(verify.ROOT/'docs/next-cohort-20261110/acceptance-8.json')['rows']
        cls.original=next(r for r in rows if r['masterId']==379)
        cls.packet=verify.load(verify.BASE/'379-v1-review-packet.json')

    def test_exact_git_receipts_ci_and_old_packets(self):
        self.assertTrue(verify.verify_all())

    def test_rejects_fabricated_authority_or_promotions(self):
        mutations=[lambda p:p.update(canonicalAccepted=True),lambda p:p['authority'].update(actualReviewer='fabricated'),lambda p:p['requiredDecisions'][0].update(status='APPROVED',decision='approved')]
        for mutate in mutations:
            p=copy.deepcopy(self.packet);mutate(p)
            with self.assertRaises(AssertionError):verify.verify_packet(p,self.original,self.cells)

    def test_rejects_wrong_version_formula_unit_and_native_scope(self):
        mutations=[lambda p:p['identity'].update(version=2),lambda p:p['formulaContract'].update(formula='pixels * lengthInches'),lambda p:p['formulaContract'].update(output='printer dots/inch'),lambda p:p['nativeCatalog']['cells'].update(G380='Full approved')]
        for mutate in mutations:
            p=copy.deepcopy(self.packet);mutate(p)
            with self.assertRaises(AssertionError):verify.verify_packet(p,self.original,self.cells)

    def test_rejects_dropped_clause_and_stale_checkpoint(self):
        for mutate in [lambda p:p['clauseAssociations'].pop(),lambda p:p['checkpoint'].update(sourceCommit='0'*40)]:
            p=copy.deepcopy(self.packet);mutate(p)
            with self.assertRaises(AssertionError):verify.verify_packet(p,self.original,self.cells)

if __name__=='__main__':unittest.main()
