"""Offline exact-tuple reconciliation; never authorizes canonical mappings or writes production."""
import collections
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'docs/publication540-shared/catalog'
SOURCES = {
    'base': 'docs/publication-fourday-20261105/catalog/normalized-540-base.json',
    'hosted': 'docs/publication-fourday-20261105/production/catalog.json',
    'registry': 'docs/calculator-first/registry-snapshot.json',
    'batches': 'docs/publication-fourday-20261105/catalog/actionable-batches.json',
    'routesHistorical': 'docs/calculator-first/browser-route-observations.json',
    'routesNov5': 'docs/publication-fourday-20261105/routes/observations.json',
    'identityAmbiguities': 'docs/publication-factory/identity-reconciliation.json',
    'ledger': 'docs/full-product-batch16/requirements-540.json',
    'routesCurrentCI': 'docs/publication540-shared/catalog/routes-ci42394728062.json',
}


def reconcile(base, hosted, registry):
    tuples = {(r['calculator_key'], r['version']): r for r in hosted['catalog']}
    registered = {(r['engineId'], r['version']) for r in registry['rows']}
    rows = []
    for i, row in enumerate(base['rows']):
        candidates = []
        for candidate in row['candidateBindings']:
            key = (candidate['engineId'], candidate['version'])
            candidates.append(dict(candidate, hostedExactTuple=tuples.get(key),
                                   registryExactTuple=key in registered,
                                   bindingApproved=False))
        rows.append({
            'masterId': row['masterId'], 'title': row['title'], 'domain': row['domain'],
            'implementationEvidenceLabel': row['implementationClass'],
            'fullCanonicalImplementationEstablished': False,
            'fullCanonicalImplementationStatus': 'UNESTABLISHED_NOT_PROVEN_MISSING',
            'canonicalMappingApproved': False, 'publicationEligibleEstablished': False,
            'catalogSourcePointer': SOURCES['base'] + '#/rows/' + str(i),
            'requirementCounts': row['requirementCounts'], 'evidencePointers': row['evidencePointers'],
            'candidates': candidates, 'privateCandidates': row['privateCandidates'],
            'hostedCandidateMatchCount': sum(c['hostedExactTuple'] is not None for c in candidates),
            'absentCandidateTupleCount': sum(c['hostedExactTuple'] is None for c in candidates),
            'sharedCandidate': any(len(c.get('sharedCatalogIds', [])) > 1 for c in candidates),
            'blockers': row['decisionFlags'], 'partial16SourceCase': row['partial16SourceCase'],
            'closure44EvidencePresent': row['closure44EvidencePresent'],
            'demonstratedLegacyDefects': row['demonstratedLegacyDefects'],
        })
    assert sorted(r['masterId'] for r in rows) == list(range(1, 541))
    return rows, tuples, registered


def main():
    data = {k: json.loads((ROOT / p).read_text()) for k, p in SOURCES.items()}
    rows, hosted, registered = reconcile(data['base'], data['hosted'], data['registry'])
    route_by_tuple = {(r['engineId'], r['expectedVersion']): r for r in data['routesCurrentCI']['rows'] if r.get('kind') == 'engine'}
    assert data['routesCurrentCI']['productionSnapshotSha256'] == hashlib.sha256((ROOT / SOURCES['hosted']).read_bytes()).hexdigest()
    assert set(route_by_tuple) == set(hosted)
    for row in rows:
        for candidate in row['candidates']:
            candidate['currentCIRouteObservation'] = route_by_tuple.get((candidate['engineId'], candidate['version']))
    summary = {
        'catalogRows': len(rows), 'hostedSnapshotRows': len(hosted),
        'hostedSnapshotPublishedTuples': sum(r['lifecycle'] == 'published' for r in hosted.values()),
        'hostedSnapshotObservedAt': data['hosted']['observed_at'],
        'freshHostedMetadata': 'UNKNOWN_CONNECTOR_PERMISSION_DENIED_2026_11_07',
        'catalogIdsWithHostedCandidate': sum(r['hostedCandidateMatchCount'] > 0 for r in rows),
        'catalogIdsWithoutHostedCandidate': sum(r['hostedCandidateMatchCount'] == 0 for r in rows),
        'candidateAssociationRows': sum(len(r['candidates']) for r in rows),
        'sharedCandidateCatalogIds': sum(r['sharedCandidate'] for r in rows),
        'implementationEvidenceLabels': dict(collections.Counter(r['implementationEvidenceLabel'] for r in rows)),
        'registeredEngineTuples': len(registered), 'registeredTuplesAbsentFromHostedSnapshot': len(registered - hosted.keys()),
        'approvedCanonicalMappingsEstablished': 0, 'fullyPublicationEligibleEstablished': 0,
        'missingFullImplementationsProvenByExistingLabel': 0,
        'missingFullImplementationsMeaning': 'No affirmative missing label; 540 full implementations remain unestablished. PRIVATE_COMPLETE is bounded engineering evidence, not a complete canonical product.',
        'requirementStatusCounts': dict(collections.Counter(s for r in data['ledger']['rows'] for s in [q['status'] for q in r['requirements']])),
        'historicalNov1RouteHttp200': sum(r.get('status') == 200 for r in data['routesHistorical']['rows']),
        'nov5RouteTransportUnknown': sum(r.get('transportFailure', False) for r in data['routesNov5']['rows'] if r.get('kind') == 'engine'),
        'currentCIRoutesCapturedAt': data['routesCurrentCI']['capturedAt'],
        'currentCIRouteSummary': data['routesCurrentCI']['summary'],
        'currentPublicRendering': '209 exact hosted-snapshot tuples verified server-rendered surface in Nov7 CI; browser behavior, numerical correctness and canonical adoption not established by GET',
    }
    result = {'kind': 'ALL540_EXACT_TUPLE_RECONCILIATION_NO_CANONICAL_PROMOTION',
              'baseline': 'f0d974b9e0a95415a4ef96a6e40ca0386e634eb9',
              'productionWrites': False, 'summary': summary,
              'sourceHashes': {p: hashlib.sha256((ROOT / p).read_bytes()).hexdigest() for p in SOURCES.values()},
              'rows': rows,
              'firstFeasibleBatches': {k: data['batches'][k] for k in ['existingPublic44', 'conditionalNew17', 'largestRegisteredAbsentGroup']},
              'ambiguityGroups': data['identityAmbiguities']['ambiguityGroups']}
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / 'reconciliation-540.json').write_text(json.dumps(result, indent=2) + '\n')
    print(json.dumps(summary, indent=2))


if __name__ == '__main__':
    main()
