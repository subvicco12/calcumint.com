"""Validate the offline 90-case evidence register; never changes product state.
Run from repository root: python scripts/verify-catalog-policy-register.py
"""
import collections
import csv
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REGISTER = ROOT / 'data/catalog/scope-policy-decisions-2026-10-25/decision-register.json'


def digest(path):
    return hashlib.sha256((ROOT / path).read_bytes()).hexdigest()


def verify():
    register = json.loads(REGISTER.read_text())
    prior = []
    for name in ('financial-decisions.json', 'nonfinancial-decisions.json'):
        prior += json.loads((ROOT / 'data/catalog/reconciliation-2026-10-25' / name).read_text())
    expected = {r['masterId']: r for r in prior if r['classification'] == 'SCOPE_DECISION_REQUIRED'}
    rows = register['rows']
    assert len(rows) == len(expected) == 90
    assert {r['masterId'] for r in rows} == set(expected)
    assert len({r['masterId'] for r in rows}) == 90
    assert [r['masterId'] for r in rows] == sorted(expected)
    master = {int(r['master_id']): r for r in csv.DictReader((ROOT / 'data/catalog/master-catalog-2026.csv').open())}
    assert len(master) == 540
    all_evidence = register['inputEvidence'] + [e for r in rows for e in r['sourceEvidence']]
    for evidence in all_evidence:
        assert digest(evidence['path']) == evidence['sha256'], evidence['path']
    assert register['rejectedMappingsPreserved'] == [r for r in prior if r['classification'] == 'UNSUPPORTED_MAPPING']
    assert {r['masterId'] for r in register['rejectedMappingsPreserved']} == {9, 442}
    assert register['releaseHold'] is True
    counts = collections.Counter(r['classification'] for r in rows)
    assert dict(sorted(counts.items())) == register['summary']['classifications']
    assert sum(r['status'] == 'ENGINEERING_SCOPE_RESOLVED' for r in rows) == register['summary']['resolvedEngineeringScopeCount'] == 1
    assert register['summary']['unresolvedAuthorityBoundCount'] == 89
    assert register['summary']['newlyDemonstratedMissingEngineContracts'] == 0
    groups = collections.defaultdict(list)
    for row in rows:
        i = row['masterId']
        assert row['title'] == master[i]['title'] and row['domain'] == master[i]['domain']
        assert row['baselineDecision'] == expected[i]
        loc = row['baselineRecordLocator']
        original = json.loads((ROOT / loc['path']).read_text())[int(loc['jsonPointer'].removeprefix('/'))]
        assert original == expected[i]
        assert hashlib.sha256(json.dumps(original, sort_keys=True, separators=(',', ':')).encode()).hexdigest() == loc['recordSha256']
        for name in ('recommendedFormula', 'recommendedDomainPolicy', 'remainingChoice', 'nextAction'):
            assert isinstance(row[name], str) and row[name].strip()
        assert row['resolution']['ownerApproval'] is None
        assert row['resolution']['specialistSignature'] is None
        assert row['resolution']['canonicalMappingApproval'] == 'UNKNOWN'
        assert row['decisionAuthority']['specialistPublicationGatesWaived'] is False
        assert row['certificationAuthorized'] is False and row['publicationAuthorized'] is False
        assert row['implementationGap']['newEngineContractConfirmed'] is False
        if row['classification'] == 'ENGINEERING_RESOLVABLE':
            assert i == 507 and row['status'] == 'ENGINEERING_SCOPE_RESOLVED'
            assert row['resolution']['existingEngineProposal'] == {'id': 'travel.trip-cost', 'slug': 'trip-cost-calculator', 'version': 1}
            assert row['implementationGap']['status'] == 'EXISTING_ENGINE_NO_NEW_CONTRACT'
        elif row['classification'] == 'OWNER_SELECTABLE':
            assert row['status'] == 'AWAITING_OWNER_SELECTION'
            assert row['decisionAuthority']['scope'] == 'PRODUCT_OWNER'
        else:
            assert row['classification'] == 'SPECIALIST_REQUIRED'
            assert row['status'] == 'AWAITING_SPECIALIST_SCOPE'
            assert row['decisionAuthority']['requiredSpecialistGroups']
        for group in row['decisionAuthority']['requiredSpecialistGroups']:
            groups[group].append(i)
    assert dict(sorted(groups.items())) == register['specialistReviewGroups']
    print('PASS: 90 exact IDs, 540-catalog identity integrity, evidence hashes, prior records, two rejected mappings, authority boundaries and specialist groups.')
    print(json.dumps(register['summary'], indent=2))


if __name__ == '__main__':
    verify()
