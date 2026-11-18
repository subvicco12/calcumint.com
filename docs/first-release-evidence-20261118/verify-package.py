"""Offline integrity verification only. Does not grant release authority."""
import hashlib
import json
from pathlib import Path
import sys

package = Path(__file__).resolve().parent
source = Path(sys.argv[1]) if len(sys.argv) > 1 else Path('/workspace/calcumint-first-release-evidence')
load = lambda name: json.loads((package / name).read_text())
digest = lambda path: hashlib.sha256(path.read_bytes()).hexdigest()
identity = load('release-identity.json')
assert identity['publicationRecommendation'] == 'NO_GO'
assert identity['releaseHold'] is True and identity['productionWrites'] is False
checkout = load('exact-checkout-manifest.json')
assert checkout['applicationCommit'] == identity['applicationCommit']
assert checkout['workingTreeClean'] is True
assert len(checkout['files']) == checkout['trackedFiles'] == 8778
for binding in checkout['files']:
    assert digest(source / binding['path']) == binding['sha256'], binding['path']
assert digest(package / 'receipts/bipm-parsed-pdf.md') == load('source-provenance.json')['retainedHistoricalBodySHA256']
first = load('receipts/focused-vitest.json')
assert first['numPassedTests'] == 467 and first['numFailedTests'] == 0
failed = [r for r in first['testResults'] if r['status'] == 'failed']
assert len(failed) == 1 and 'pdftotext EPERM' in failed[0]['message']
for name, count in [('export-retry-vitest.json', 40), ('delivery-vitest.json', 138)]:
    result = load('receipts/' + name)
    assert result['success'] is True and result['numPassedTests'] == count
for name in ['receipts/authenticated-next/receipt.json', 'receipts/ui440/report.json', 'receipts/exact440-replay.json']:
    assert load(name)['passed'] is True
assert len(load('receipts/ui440/report.json')['journeys']) == 4
numerics = load('receipts/numerics/numerical-receipt.json')
assert numerics['passed'] is True and len(numerics['vectors']) == 634 and len(numerics['refusals']) == 6
assert numerics['newCanonicalAccepted'] is False and numerics['newPublicationEligible'] is False
assert 'PASS exact six signatures' in (package / 'receipts/held-rpcs-integrity.log').read_text()
checks = {row['name']: row['conclusion'] for row in load('receipts/exact-head-checks.json')['checks']}
assert checks == {'checks': 'success', 'build': 'success', 'publication-factory': 'success', 'full-product': 'failure', 'source-acceptance': 'cancelled', 'validate': 'failure'}
if (package / 'MANIFEST-SHA256.json').exists():
    for name, expected in load('MANIFEST-SHA256.json')['files'].items():
        assert digest(package / name) == expected, name
print('PASS: exact checkout and package receipts verified. Publication NO_GO; release hold active.')
