"""Offline tests of bounded child capture and evidence validation."""
import json
import pathlib
import subprocess
import sys
import tempfile
import unittest
from types import SimpleNamespace
from unittest.mock import patch

sys.path.insert(0, str(pathlib.Path(__file__).parent))
import ci_probe

TARGETS = [{'url': 'https://calcumint.com/calculators', 'kind': 'discovery'}]

def valid():
    return {'summary': {'releaseHold': True, 'canonicalIdentityApproval': 'NOT_ESTABLISHED',
        **dict.fromkeys(('productionRows','uniqueEngineRoutes','engineHttp200','engineRenderVerified','engineOriginFailures','engineTransportUnknown','unpublishedCandidateRoutes','candidateFailClosedObserved','candidateHttp200NeedsReview','candidateVisibilityUnknown'), 0)},
        'rows': [dict(TARGETS[0], method='GET', status=None, error='Transport unavailable', evidenceScope=ci_probe.probe.EVIDENCE_SCOPE, inputControlConvention=ci_probe.probe.CONTROL_CONVENTION)]}

class CaptureTests(unittest.TestCase):
    def run_capture(self, runner):
        with tempfile.TemporaryDirectory() as folder:
            output = pathlib.Path(folder)/'result.json'
            ci_probe.capture(output, TARGETS, runner)
            return json.loads(output.read_text())
    def test_timeout_writes_unknown_and_enforces_deadline(self):
        def runner(command, **kwargs):
            self.assertEqual(kwargs['timeout'], 220)
            self.assertEqual(command[-2:], ['--request-timeout','3'])
            raise subprocess.TimeoutExpired(command, 220)
        result = self.run_capture(runner)
        self.assertEqual(result['captureStatus'], 'UNKNOWN')
        self.assertIsNone(result['rows'][0]['status'])
        self.assertTrue(result['releaseHold'])
        self.assertEqual(set(result['executionContext']), {'headSha', 'checkoutSha', 'repository'})
        self.assertEqual(len(result['productionSnapshotSha256']), 64)
    def test_nonzero_and_missing_output_never_accept(self):
        for code in (1, 0):
            result = self.run_capture(lambda *a, **k: SimpleNamespace(returncode=code))
            self.assertEqual(result['captureStatus'], 'UNKNOWN')
    def test_valid_transport_unknown_is_evidence_not_acceptance(self):
        def runner(command, **kwargs):
            pathlib.Path(command[command.index('--output')+1]).write_text(json.dumps(valid()))
            return SimpleNamespace(returncode=0)
        with patch.dict(ci_probe.os.environ, {'AUDIT_HEAD_SHA': 'head', 'GITHUB_SHA': 'checkout', 'GITHUB_REPOSITORY': 'owner/repo', 'GITHUB_TOKEN': 'must-not-appear'}, clear=True):
            result = self.run_capture(runner)
        self.assertEqual(result['executionContext'], {'headSha': 'head', 'checkoutSha': 'checkout', 'repository': 'owner/repo'})
        self.assertNotIn('must-not-appear', json.dumps(result))
        self.assertEqual(result['captureStatus'], 'EVIDENCE_CAPTURED')
        self.assertTrue(result['summary']['releaseHold'])
        self.assertIsNone(result['rows'][0]['status'])
    def test_rejects_substituted_or_claimed_approval_output(self):
        for change in ('origin','approval','count'):
            data=valid()
            if change=='origin': data['rows'][0]['url']='https://other.example/'
            if change=='approval': data['summary']['canonicalIdentityApproval']='APPROVED'
            if change=='count': data['summary']['engineHttp200']=1
            self.assertFalse(ci_probe.validate(data,TARGETS))
    def test_candidate_unknown_failclosed_and_http200_require_no_eligibility(self):
        target = {'kind':'unpublished-candidate','url':'https://calcumint.com/calculators/math/example','engineId':'math.example','slug':'example','expectedVersion':1}
        for status in (None,404,410,200):
            row = dict(target, method='GET', status=status, evidenceScope=ci_probe.probe.EVIDENCE_SCOPE, inputControlConvention=ci_probe.probe.CONTROL_CONVENTION, canonicalIdentityApproval='NOT_ESTABLISHED_BY_ROUTE_PROBE', **ci_probe.probe.candidate_visibility(status))
            data=valid(); data['rows']=[row]; data['summary'].update(ci_probe.probe.candidate_counts([row]))
            self.assertTrue(ci_probe.validate(data,[target]))
            self.assertEqual(row['failClosedObserved'],status in (404,410))
            self.assertEqual(row['visibilityDisposition'],'NEEDS_REVIEW' if status==200 else 'FAIL_CLOSED_OBSERVED' if status in (404,410) else 'UNKNOWN')
            self.assertEqual(row['publicationEligibility'],'NOT_ESTABLISHED')
            data['summary']['candidateFailClosedObserved'] += 1
            self.assertFalse(ci_probe.validate(data,[target]))

    def test_real_shape_and_timeout_bounds(self):
        fixture=pathlib.Path('docs/publication-fourday-20261105/routes/observations.json')
        data=json.loads(fixture.read_text())
        _,_,_,targets=ci_probe.probe.load_targets()
        self.assertFalse(ci_probe.validate(data,targets)) # historical output lacks new scope/candidate evidence
        for value in ('0','13'):
            with self.assertRaises(Exception): ci_probe.probe.bounded_timeout(value)

if __name__=='__main__': unittest.main()
