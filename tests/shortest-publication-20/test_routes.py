import importlib.util,json,pathlib,subprocess,tempfile,unittest
spec=importlib.util.spec_from_file_location('shortest_routes','scripts/shortest-publication-routes.py');module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)
class CaptureTests(unittest.TestCase):
 def test_exact20_sameorigin_targets(self):
  ts=module.targets();self.assertEqual(len(ts),22);self.assertEqual(len({r['url'] for r in ts}),22);self.assertEqual(sum(t['kind']=='unpublished-candidate' for t in ts),20)
 def test_invalid_or_timeout_never_manufactures_success(self):
  for runner in [lambda *a,**k:subprocess.CompletedProcess(a[0],0,'{}',''),lambda *a,**k:(_ for _ in ()).throw(subprocess.TimeoutExpired('probe',60))]:
   with tempfile.TemporaryDirectory() as d:
    result=module.capture(pathlib.Path(d)/'result.json',runner);self.assertEqual(result['captureStatus'],'UNKNOWN');self.assertEqual(len(result['rows']),22);self.assertEqual(result['publicationEligibility'],'NOT_ESTABLISHED')
 def test_changed_identity_or_visibility_claim_is_rejected(self):
  ts=module.targets();rows=[dict(t,method='GET',status=404,evidenceScope=module.probe.EVIDENCE_SCOPE,inputControlConvention=module.probe.CONTROL_CONVENTION,canonicalIdentityApproval='NOT_ESTABLISHED_BY_ROUTE_PROBE',**(module.probe.candidate_visibility(404) if t['kind']=='unpublished-candidate' else {})) for t in ts]
  data={'captureStatus':'OBSERVED_WITH_EXPLICIT_UNKNOWNS','rows':rows,'summary':module.probe.candidate_counts(rows),'releaseHold':True,'publicationEligibility':'NOT_ESTABLISHED'};self.assertTrue(module.valid(data,ts));rows[0]['catalogId']=1;self.assertFalse(module.valid(data,ts));rows[0]['catalogId']=ts[0]['catalogId'];rows[0]['publicationEligibility']='APPROVED';self.assertFalse(module.valid(data,ts))

 def test_missing_status_from_child_is_unknown_not_parent_crash(self):
  ts=module.targets();rows=[dict(t,method='GET',status=None,evidenceScope=module.probe.EVIDENCE_SCOPE,inputControlConvention=module.probe.CONTROL_CONVENTION,canonicalIdentityApproval='NOT_ESTABLISHED_BY_ROUTE_PROBE',**(module.probe.candidate_visibility(None) if t['kind']=='unpublished-candidate' else {})) for t in ts]
  data={'captureStatus':'OBSERVED_WITH_EXPLICIT_UNKNOWNS','rows':rows,'summary':module.probe.candidate_counts(rows),'releaseHold':True,'publicationEligibility':'NOT_ESTABLISHED'};del rows[0]['status']
  self.assertFalse(module.valid(data,ts))
  with tempfile.TemporaryDirectory() as d:
   result=module.capture(pathlib.Path(d)/'result.json',lambda *a,**k:subprocess.CompletedProcess(a[0],0,json.dumps(data),''));self.assertEqual(result['captureStatus'],'UNKNOWN')
