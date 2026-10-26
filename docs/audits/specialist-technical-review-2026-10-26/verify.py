"""Offline evidence integrity and independent arithmetic; no engine or clinical acceptance."""
import copy
import csv
from decimal import Decimal as D, localcontext
import hashlib
import json
from pathlib import Path
import subprocess
import unittest
import tempfile
import sys

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
BASE = '3aaca30a04b922ae4acb6bcbf2976b7835b8eea8'
REVISED = {86,96,173,198,199,204,527}
SUPPORTED = {134,409,530}
GAPS = {87,92,112,405,408,502}
def read(p): return json.loads((HERE/p).read_text())
def digest(p): return hashlib.sha256(p.read_bytes()).hexdigest()
def validate(register):
    old = {r['masterId']: r for r in read('upstream/register.json')['cases']}
    authority = {r['masterId']:r for r in read('upstream/authority-register.json')['rows'] if r['status']=='AWAITING_SPECIALIST_SCOPE'}
    rows = register['cases']
    assert len(rows)==70 and len({r['masterId'] for r in rows})==70
    assert {r['masterId'] for r in rows}==set(authority)==set(old)
    catalog = {int(r['master_id']):r for r in csv.DictReader((ROOT/'data/catalog/master-catalog-2026.csv').read_text().splitlines())}
    assert len(catalog)==540
    assert register['qualifiedApprovalCount']==0 and register['qualifiedPending']==70
    assert register['releaseHold'] is True
    for r in rows:
        i=r['masterId']; original=old[i]
        assert (r['title'],r['domain'])==(catalog[i]['title'],catalog[i]['domain'])
        assert r['originalReviewerGroups']==authority[i]['decisionAuthority']['requiredSpecialistGroups']
        assert r['qualifiedApprovalStatus']=='QUALIFIED_APPROVAL_PENDING'
        assert r['qualifiedReviewer'] is None and r['qualifiedDecisionEvidence'] is None
        assert r['selectedMethodology'] is None
        assert not r['certificationAuthorized'] and not r['publicationAuthorized']
        assert r['demonstratedImplementationDefects']==[]
        assert r['classification']==original['classification']
        assert r['versionBinding']==original['versionBinding']
        if i in REVISED:
            assert r['engineeringClosureStatus']=='PROPOSAL_CORRECTED_QUALIFIED_PENDING'
            assert r['priorCandidateMethodology']==original['candidateMethodology']
            assert r['priorContractReview']==original['contractReview']
            assert r['candidateMethodology']==r['proposalRevision']['equation']==r['contractReview']['equation']
            assert r['proposalRevision']['status']=='CORRECTED_PROPOSAL_ONLY_PENDING_QUALIFIED_REVIEW'
            assert r['outstandingDecisions']==r['proposalRevision']['questions']
        else:
            for field in original: assert r[field]==original[field],(i,field)
    assert {r['masterId'] for r in rows if r['classification']=='TECHNICALLY_SUPPORTED'}==SUPPORTED
    assert {r['masterId'] for r in rows if r['classification']=='EVIDENCE_INSUFFICIENT'}==GAPS
    policy={r['masterId'] for r in rows if r['classification']=='POLICY_UNRESOLVED'}
    questions=read('specialist-questions.json')
    assert len(policy)==54==questions['caseCount']==len(questions['cases'])
    assert {r['masterId'] for r in questions['cases']}==policy
    for q in questions['cases']:
        assert q['status']=='PENDING' and q['questions']
        assert q['questions']==next(r for r in rows if r['masterId']==q['masterId'])['specialistDecisionQuestions']
        assert all(f"#{q['masterId']} " in a['question'] for a in q['questions'])
    assert {r['masterId'] for r in read('evidence-gaps.json')}==GAPS
    assert {r['masterId'] for r in read('proposal-revisions.json')}==REVISED

class Evidence(unittest.TestCase):
    def test_70_identity_authority_and_holds(self): validate(read('technical-register.json'))
    def test_upstream_and_protected_hashes(self):
        p=read('package-verification.json')
        authentic=subprocess.check_output(['git','show',p['sourceRegisterCommit']+':data/catalog/scope-policy-decisions-2026-10-25/decision-register.json'],cwd=ROOT)
        self.assertEqual(authentic,(HERE/'upstream/authority-register.json').read_bytes())
        self.assertEqual(p['archiveMembers'],137); self.assertEqual(p['manifestMembersVerified'],136)
        for f,h in p['retainedFiles'].items(): self.assertEqual(digest(HERE/'upstream'/f),h)
        for f,h in p['protectedHashes'].items(): self.assertEqual(digest(ROOT/f),h)
        self.assertEqual(sum(1 for _ in csv.DictReader((ROOT/'docs/audits/final-acceptance-p0-2026-10-21/acceptance-ledger.csv').read_text().splitlines())),424)
    def test_authentic_source_blobs(self):
        for x in read('package-verification.json')['exactSourceChecks']:
            b=subprocess.check_output(['git','show',BASE+':'+x['path']],cwd=ROOT)
            self.assertEqual(hashlib.sha256(b).hexdigest(),x['repositorySHA256'])
            self.assertEqual(hashlib.sha256(b+b'\n').hexdigest(),x['reportedSnapshotSHA256'])
            self.assertEqual(subprocess.check_output(['git','rev-parse',BASE+':'+x['path']],cwd=ROOT).decode().strip(),x['githubBlobSha'])
    def test_original_70_witnesses(self):
        # Retained scripts are hash-checked before execution, standard-library only.
        hashes=read('package-verification.json')['retainedFiles']
        for f,h in hashes.items(): self.assertEqual(digest(HERE/'upstream'/f),h)
        with tempfile.TemporaryDirectory(prefix='calcumint-review-') as tmp:
            tmp=Path(tmp)
            (tmp/'specialist70').mkdir()
            (tmp/'specialist70-execution/finance-evidence').mkdir(parents=True)
            (tmp/'specialist70/approval-register.json').write_bytes((HERE/'upstream/witnesses/input-approval-register.json').read_bytes())
            for name in ['finance','clinical','tax']:
                result=subprocess.run([sys.executable,str(HERE/'upstream/witnesses'/f'{name}.py')],cwd=tmp,capture_output=True,text=True)
                self.assertEqual(result.returncode,0,result.stderr)
                if name=='tax': tax=json.loads(result.stdout)
            finance=json.loads((tmp/'specialist70-execution/finance-evidence/numerical-results.json').read_text())
            clinical=json.loads((tmp/'specialist70-execution/clinical-numerical-results.json').read_text())['checks']
            self.assertEqual((len(finance),len(tax['cases']),len(clinical)),(32,25,13))
            self.assertEqual({int(i) for i in finance}|{r['masterId'] for r in tax['cases']}|{int(i) for i in clinical},set(read('package-verification.json')['exact70Ids']))
            self.assertTrue(all(c['result']=='PASS' for c in finance.values()))
            self.assertTrue(all(c['pass_'] for c in tax['cases']))
            self.assertTrue(all(c['result'] in ['MATCH','MATCH_WITHIN_BINARY_FLOAT_TOLERANCE'] for c in clinical.values()))
    def test_seven_negative_integrity_probes(self):
        original=read('technical-register.json')
        mutations=[lambda r:r['cases'].append(copy.deepcopy(r['cases'][0])),
                   lambda r:r['cases'].pop(),
                   lambda r:r['cases'][0].update(title='different'),
                   lambda r:r['cases'][0].update(qualifiedApprovalStatus='APPROVED'),
                   lambda r:r['cases'][0].update(qualifiedReviewer='invented'),
                   lambda r:r['cases'][0].update(candidateMethodology='new formula'),
                   lambda r:next(c for c in r['cases'] if c['masterId']==409).update(numericalVerification={})]
        for mutate in mutations:
            r=copy.deepcopy(original); mutate(r)
            with self.assertRaises(AssertionError): validate(r)
    def test_86_exact_zero_not_shortfall(self):
        balance=D(200); zero=shortfall=None
        for t in range(1,4):
            available=balance
            if available<100 and shortfall is None: shortfall=t
            balance=available-min(available,D(100))
            if balance==0 and zero is None: zero=t
        self.assertEqual((zero,shortfall),(2,3))
    def test_96_total_and_vested(self):
        employee,employer=D(1000),D(100)
        self.assertEqual(employee+employer,D(1100))
        self.assertEqual(employee+D('.5')*employer,D(1050))
        self.assertEqual(employee+D(1)*employer,D(1100))
    def test_173_conditional_cost_and_discount(self):
        with localcontext() as c:
            c.prec=50
            correct=(D('.5')*100-20)/D('1.1')
            self.assertEqual(correct,D(300)/11)
            self.assertNotEqual(correct,D('.5')*(100-20)/D('1.1'))
            self.assertEqual(D('.5')*100-20,30)
            self.assertEqual(sum([],D(0))-D(20),-20)
    def test_198_gross_net_equivalence(self):
        self.assertEqual(D(100)-12-20+2-40,D(30))
        self.assertEqual((D(100)-20)-(12-2)-40,D(30))
    def test_199_explicit_seller_refund(self):
        self.assertEqual(D(100)-20-12-40,D(28))
        self.assertEqual(D(100)-12-40,D(48))
    def test_204_no_duplicate_retained_fee(self):
        base=D(100)*(50-33)
        self.assertEqual(base-100*D('.1')*(50+5-20),D(1350))
        self.assertEqual(base-100*D('.1')*(50+5+3-20),D(1320))
    def test_527_dependency_only_not_normative_adjustment(self):
        scores=[D(n) for n in range(1,21)]; adjusted=scores[:]; adjusted[8]=D(0)
        self.assertEqual(sum(sorted(adjusted)[:8])/8,D('3.5'))
        self.assertEqual(sum(sorted(scores)[:8])/8,D('4.5'))
        self.assertEqual(D(113)/130*(85-72),D('11.3'))
    def test_three_preserved_bounded_cases(self):
        with localcontext() as c:
            c.prec=50
            self.assertEqual(D(100)*2000/10000,D(20))
            gfr=D(142)*D('.9938')**50
            self.assertLess(abs(gfr-D('104.0490129932253')),D('1e-12'))
            absolute=D('6.9652')+D('.0091')*180-D('.0257')*50+D('.5955')-D('.2240')*15-D('.0115')*130
            self.assertEqual(absolute,D('3.0587'))
            self.assertLess(abs(1000*absolute/(180*D('.45359237'))-D('37.46266229693806')),D('1e-12'))

if __name__=='__main__': unittest.main(verbosity=2)
