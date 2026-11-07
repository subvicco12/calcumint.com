import importlib.util
import json
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
spec = importlib.util.spec_from_file_location('reconcile_catalog', ROOT / 'scripts/publication540-shared/reconcile_catalog.py')
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


class ExactTupleTests(unittest.TestCase):
    def test_new_version_does_not_inherit_published_or_registry_state(self):
        row = json.loads((ROOT / module.SOURCES['base']).read_text())['rows'][0]
        base = {'rows': [dict(row, masterId=n, candidateBindings=[dict(row['candidateBindings'][0], engineId='shared', version=2)]) for n in range(1, 541)]}
        hosted = {'catalog': [{'calculator_key': 'shared', 'version': 1}]}
        rows, _, _ = module.reconcile(base, hosted, {'rows': [{'engineId': 'shared', 'version': 1}]})
        self.assertTrue(all(r['hostedCandidateMatchCount'] == 0 for r in rows))
        self.assertTrue(all(not r['candidates'][0]['registryExactTuple'] for r in rows))
        self.assertTrue(all(not r['canonicalMappingApproved'] for r in rows))

    def test_complete_evidence_partition_and_route_tuple_binding(self):
        data = json.loads((ROOT / 'docs/publication540-shared/catalog/reconciliation-540.json').read_text())
        self.assertEqual(list(range(1, 541)), [r['masterId'] for r in data['rows']])
        self.assertEqual(14293, sum(data['summary']['requirementStatusCounts'].values()))
        self.assertEqual(187, sum(r['hostedCandidateMatchCount'] > 0 for r in data['rows']))
        for row in data['rows']:
            for c in row['candidates']:
                route = c['currentCIRouteObservation']
                if route:
                    self.assertEqual((c['engineId'], c['version']), (route['engineId'], route['expectedVersion']))
                    self.assertTrue(route['renderVerified'])
        self.assertEqual(17, data['summary']['currentCIRouteSummary']['candidateFailClosedObserved'])


if __name__ == '__main__':
    unittest.main()
