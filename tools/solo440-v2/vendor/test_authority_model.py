import tempfile
import unittest
from concurrent.futures import ThreadPoolExecutor
from dataclasses import replace
from pathlib import Path

from authority_model import FixtureContext, FixtureGrant, claim_fixture, initialize_fixture


class AuthorityTests(unittest.TestCase):
    def setUp(self):
        directory = tempfile.TemporaryDirectory()
        self.addCleanup(directory.cleanup)
        self.db = Path(directory.name) / "fixture.sqlite"
        initialize_fixture(self.db)
        self.context = FixtureContext("12", "a"*64, "b"*64, "c"*64, True, True, True, True, True)
        self.grant = FixtureGrant("12", 1, "d"*32, 100, 700, "a"*64, "b"*64, "c"*64)

    def test_every_gate_is_required(self):
        for gate in ("owner_authenticated", "applicability_confirmed", "adopted",
                     "exact_source_verified", "owner_methodology_accepted"):
            with self.subTest(gate=gate):
                self.assertIsNone(claim_fixture(self.db, self.grant, replace(self.context, **{gate: False}), 100))

    def test_exact_scope_and_types(self):
        for field, value in (("candidate", "wrong"), ("tree", "wrong"), ("archive", "wrong"),
                             ("nomination", "wrong"), ("amendment", "wrong"), ("evidence", "e"*64),
                             ("policy", "e"*64), ("executor", "e"*64), ("run", "13"),
                             ("attempt", 2), ("attempt", True), ("activate", True),
                             ("action", "publish"), ("schema", "older"), ("nonce", "wrong")):
            with self.subTest(field=field, value=value):
                self.assertIsNone(claim_fixture(self.db, replace(self.grant, **{field: value}), self.context, 100))

    def test_expiry_and_future(self):
        for now in (99, 700, True):
            self.assertIsNone(claim_fixture(self.db, self.grant, self.context, now))
        self.assertIsNone(claim_fixture(self.db, replace(self.grant, expires=701), self.context, 100))

    def test_parallel_workers_and_no_live_receipt(self):
        with ThreadPoolExecutor(max_workers=8) as workers:
            results = list(workers.map(lambda _: claim_fixture(self.db, self.grant, self.context, 100), range(16)))
        receipts = [result for result in results if result is not None]
        self.assertEqual(len(receipts), 1)
        self.assertTrue(receipts[0]["simulation"])
        self.assertFalse(receipts[0]["admitted"])
        self.assertFalse(receipts[0]["activated"])

    def test_repeat_and_replacement_after_lost_receipt(self):
        claim_fixture(self.db, self.grant, self.context, 100)
        self.assertIsNone(claim_fixture(self.db, self.grant, self.context, 100))
        self.assertIsNone(claim_fixture(self.db, replace(self.grant, nonce="e"*32), self.context, 100))
        self.assertIsNone(claim_fixture(self.db, replace(self.grant, run="13"), replace(self.context, run="13"), 100))

    def test_missing_store_fails_closed(self):
        self.db.unlink()
        self.assertIsNone(claim_fixture(self.db, self.grant, self.context, 100))
        self.assertFalse(self.db.exists())


if __name__ == "__main__":
    unittest.main()
