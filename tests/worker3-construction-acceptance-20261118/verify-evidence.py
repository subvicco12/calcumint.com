"""Verify archived acceptance receipts/bytes, without database, browser or approval."""
import hashlib
import json
from pathlib import Path
import sys

root = Path.cwd()
evidence = Path(sys.argv[1])
report = json.loads((evidence / 'receipt.json').read_text())
ids = [347, 351, 352, 353, 357, 358, 359, 360, 361]
assert report['passed'] is True
assert report['productionWrites'] is False and report['releaseHold'] is True
assert report['canonicalApproval'] is False and report['publicationFixture'] is False
assert report['representativeComplete'] is True
assert len(report['rows']) == 27
for catalog_id in ids:
    rows = [row for row in report['rows'] if row['catalogId'] == catalog_id]
    assert {row['plan'] for row in rows} == {'free', 'pro', 'business'}
    for row in rows:
        for key in ['mathematicalParity', 'idempotentHistory', 'mobileAndAX',
                    'foreignHistoryReadAndWriteDenied', 'ownedHistoryRestore',
                    'keyboardErrorRecovery']:
            assert row[key] is True, (catalog_id, row['plan'], key)
        assert row['width'] == 320 and row['minimumTargetHeight'] >= 44
    pro = next(row for row in rows if row['plan'] == 'pro')
    assert pro['nativeReplayAndTamperRefusal'] and pro['foreignHistoryActionDenied']
    downloads = [row for row in report['downloads'] if row['catalogId'] == catalog_id]
    assert {row['format'] for row in downloads} == {'json', 'csv', 'pdf'}
    assert all(row['nativeCompleted'] for row in downloads)
    assert (evidence / f'{catalog_id}-mobile.png').read_bytes().startswith(b'\x89PNG')
    assert json.loads((evidence / f'{catalog_id}-ax.json').read_text())['nodes']
    negatives = [row for row in report['negativeControls'] if row['catalogId'] == catalog_id]
    assert len(negatives) == 1 and all(negatives[0][key] for key in [
        'currentMemberReader', 'revokedMembershipRlsReadDenied',
        'revokedMembershipActionDenied', 'constructionDeliveryStillBlocked'])
assert {row['catalogId'] for row in report['historical']} == {351, 352, 353, 357, 358}
for row in report['downloads'] + report['historical']:
    file = evidence / row.get('file', row.get('recordedDownload'))
    assert hashlib.sha256(file.read_bytes()).hexdigest() == row['sha256']
for name, expected in report['sourceBindings'].items():
    assert hashlib.sha256((root / name).read_bytes()).hexdigest() == expected, name
print('PASS: nine identities,27 account journeys,27 downloads,nine revocations,five historical records; release hold active.')
