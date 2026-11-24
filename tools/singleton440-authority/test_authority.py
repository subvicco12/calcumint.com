import copy, importlib.util, json, pathlib, tempfile, unittest

ROOT=pathlib.Path(__file__).parent

class AuthorityTests(unittest.TestCase):
    def load(self):
        target=ROOT/'authority.py'
        self.assertTrue(target.is_file(), 'fixed two-path executor implementation missing')
        spec=importlib.util.spec_from_file_location('singleton_authority',target)
        m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m);return m

    def fixture(self,m):
        ctx={'TRUSTED_WORKFLOW_SHA':'e'*40,'GITHUB_SHA':'e'*40,'GITHUB_WORKFLOW_SHA':'e'*40,
             'GITHUB_REPOSITORY':m.REPO,'GITHUB_EVENT_NAME':'workflow_dispatch','GITHUB_REF':m.REF,
             'GITHUB_REF_PROTECTED':'true','GITHUB_WORKFLOW_REF':f'{m.REPO}/{m.WORKFLOW}@{m.REF}',
             'BOOTSTRAP_ENVIRONMENT':m.ENVIRONMENT,'GITHUB_RUN_ID':'123456','GITHUB_RUN_ATTEMPT':'1',
             'GITHUB_ACTOR':'subvicco12','SINGLETON440_REVIEWER':'independent-reviewer'}
        a={'candidate':m.CANDIDATE,'tree':m.TREE,'executor':'e'*40,'policyCommit':m.POLICY_COMMIT,
           'policyBlob':m.POLICY_BLOB,'packageSha256':m.PACKAGE,'sourceArchiveSha256':m.ARCHIVE,
           'action':'admit-source-only','activate':False,'runId':'123456','runAttempt':'1',
           'operator':'subvicco12','reviewer':'independent-reviewer','reviewId':42,
           'issuedAt':1000,'expiresAt':1600,'nonce':'a'*32}
        owner={'user':{'emailAddress':'subvicco12@gmail.com','displayName':m.OWNER}}
        comment={'id':'new-440-comment','deleted':False,'author':{'me':True,'displayName':m.OWNER},
                 'content':m.APPROVAL_PREFIX+'\n'+m.canonical(a)}
        review={'id':42,'state':'APPROVED','commit_id':'e'*40,'user':{'login':'independent-reviewer'},
                'body':m.REVIEW_PREFIX+'\n'+m.canonical(m.review_binding(a))}
        return ctx,a,owner,comment,review

    def test_exact_owner_and_independent_review_are_required(self):
        m=self.load();c,a,o,x,v=self.fixture(m)
        self.assertEqual(m.verify_authorization(c,a,o,x,v,1200),m.digest(m.canonical(a).encode()))

    def test_wrong_context_ref_event_actor_or_workflow_is_refused(self):
        m=self.load();c,a,o,x,v=self.fixture(m)
        for key,value in [('GITHUB_REF','refs/heads/main'),('GITHUB_REF_PROTECTED','false'),
                          ('GITHUB_SHA','f'*40),('GITHUB_EVENT_NAME','push'),('GITHUB_ACTOR','other')]:
            bad={**c,key:value}
            with self.subTest(key=key),self.assertRaises(ValueError):m.verify_authorization(bad,a,o,x,v,1200)

    def test_unrelated_candidate_policy_package_or_activation_is_refused(self):
        m=self.load();c,a,o,x,v=self.fixture(m)
        for key,value in [('candidate','f'*40),('tree','f'*40),('policyCommit','f'*40),
                          ('policyBlob','f'*40),('packageSha256','f'*64),('activate',True)]:
            bad={**a,key:value};z={**x,'content':m.APPROVAL_PREFIX+'\n'+m.canonical(bad)}
            with self.subTest(key=key),self.assertRaises(ValueError):m.verify_authorization(c,bad,o,z,v,1200)

    def test_unauthorized_owner_or_missing_independent_review_is_refused(self):
        m=self.load();c,a,o,x,v=self.fixture(m)
        for bad in [{**x,'deleted':True},{**x,'author':{'me':False,'displayName':m.OWNER}},
                    {**x,'content':'APPROVE frozen A7'}]:
            with self.assertRaises(ValueError):m.verify_authorization(c,a,o,bad,v,1200)
        for bad in [{**v,'state':'COMMENTED'},{**v,'commit_id':'f'*40},{**v,'user':{'login':'subvicco12'}},
                    {**v,'body':'generic approval'}]:
            with self.assertRaises(ValueError):m.verify_authorization(c,a,o,x,bad,1200)

    def test_stale_future_wrong_run_attempt_and_extra_authority_are_refused(self):
        m=self.load();c,a,o,x,v=self.fixture(m)
        for bad in [{**a,'expiresAt':1100},{**a,'issuedAt':1300},{**a,'runId':'different'},
                    {**a,'runAttempt':'2'},{**a,'allowAnySource':True}]:
            z={**x,'content':m.APPROVAL_PREFIX+'\n'+m.canonical(bad)}
            with self.assertRaises(ValueError):m.verify_authorization(c,bad,o,z,v,1200)

    def test_frozen_package_and_two_path_allowlist_are_verified(self):
        m=self.load();p=m.verify_package(ROOT)
        self.assertEqual(p['candidate'],m.CANDIDATE);self.assertEqual(len(p['paths']),2)

    def test_modified_package_or_archive_is_refused(self):
        m=self.load()
        import shutil
        for name in ['nomination.json','policy.json','capture.json','source-data.tar.gz','exact-stage.mjs']:
            with tempfile.TemporaryDirectory() as tmp:
                q=pathlib.Path(tmp)
                for p in ROOT.iterdir():
                    if p.is_file():shutil.copy(p,q/p.name)
                with (q/name).open('ab') as f:f.write(b' ')
                with self.subTest(name=name),self.assertRaises(ValueError):m.verify_package(q)

    def test_replay_state_and_symlink_state_are_refused(self):
        m=self.load()
        with tempfile.TemporaryDirectory() as tmp:
            p=pathlib.Path(tmp);m.consume(p,'a'*64)
            with self.assertRaises(FileExistsError):m.consume(p,'a'*64)
            (p/'link').symlink_to(p/'a')
            with self.assertRaises(ValueError):m.consume(p/'link','b'*64)

    def test_simulated_receipt_cannot_claim_live_admission_or_activation(self):
        m=self.load();c,a,o,x,v=self.fixture(m)
        receipt=m.make_receipt(c,a,'d'*64,simulation=True)
        self.assertFalse(receipt['body']['admitted']);self.assertFalse(receipt['body']['activated'])
        m.verify_receipt(receipt,c,a,simulation=True)
        bad=copy.deepcopy(receipt);bad['body']['activated']=True
        with self.assertRaises(ValueError):m.verify_receipt(bad,c,a,simulation=True)

    def test_recomputed_bad_receipt_still_cannot_change_tuple(self):
        m=self.load();c,a,o,x,v=self.fixture(m);r=m.make_receipt(c,a,'d'*64,simulation=True)
        r['body']['candidate']='f'*40;r['sha256']=m.digest(m.canonical(r['body']).encode())
        with self.assertRaises(ValueError):m.verify_receipt(r,c,a,simulation=True)

    def test_live_entry_point_refuses_without_hosted_authority(self):
        import subprocess,os
        result=subprocess.run([os.sys.executable,'-I',str(ROOT/'execute.py')],env={'PATH':'/usr/bin:/bin'},capture_output=True,text=True,timeout=10)
        self.assertNotEqual(result.returncode,0)
        self.assertIn('Source admission refused',result.stderr)

    def test_source_only_receipt_has_no_activation(self):
        m=self.load();c,a,o,x,v=self.fixture(m)
        r=m.make_receipt(c,a,'d'*64,simulation=False)
        self.assertTrue(r['body']['admitted']);self.assertFalse(r['body']['activated'])
        m.verify_receipt(r,c,a,simulation=False)
        with self.assertRaises(ValueError):m.verify_receipt(r,c,a,simulation=True)

    def test_missing_pinned_runtime_refuses_before_provider_access(self):
        import unittest.mock,os
        m=self.load();c,a,o,x,v=self.fixture(m)
        spec=importlib.util.spec_from_file_location('fixed_execution',ROOT/'execute.py')
        execute=importlib.util.module_from_spec(spec);spec.loader.exec_module(execute)
        with unittest.mock.patch.dict(os.environ,c,clear=True),unittest.mock.patch.object(execute,'fetch',side_effect=AssertionError('unexpected provider call')):
            with self.assertRaises(ValueError):execute.main()

if __name__=='__main__':unittest.main()
