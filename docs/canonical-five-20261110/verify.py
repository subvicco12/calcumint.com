"""Offline packet integrity only; no network, SQL, approval or adoption executor."""
import hashlib
import json
from pathlib import Path
import subprocess

base = Path(__file__).resolve().parent
checkpoint = '1ec63cd11626df15063546c7e5bfedecec33f6ee'
def git(*args):
    return subprocess.check_output(['git', *args])
manifest = json.loads((base / 'evidence-manifest.json').read_text())
assert manifest['baseline'] == checkpoint
for item in manifest['evidence']:
    assert item['sourceCommit'] == checkpoint
    data = git('show', checkpoint + ':' + item['path'])
    assert len(data) == item['bytes']
    assert hashlib.sha256(data).hexdigest() == item['sha256']
    assert git('rev-parse', checkpoint + ':' + item['path']).decode().strip() == item['gitBlob']
original = json.loads(git('show', checkpoint + ':docs/five-full-contract-20261109/acceptance-5.json'))
for row in original['rows']:
    p = json.loads((base / f"{row['masterId']}-v1-review-packet.json").read_text())
    assert p['checkpoint']['sourceCommit'] == checkpoint
    assert p['identity'] == {k: row[k] for k in ['masterId', 'engineId', 'slug', 'version']}
    assert p['identity']['version'] == 1
    assert p['nativeCatalog'] == row['nativeCatalog']
    assert p['clauseAssociations'] == row['criteria'] and len(p['clauseAssociations']) == 34
    assert all(p[k] is False for k in ['canonicalAccepted', 'certificationGranted', 'publicationEligible'])
    assert p['authority']['actualAppointedReviewer'] is None
    assert p['authority']['appointmentEstablished'] is False
    assert len(p['requiredDecisions']) == 6
    for d in p['requiredDecisions']:
        assert d['status'] == 'UNAPPROVED'
        assert all(d[k] is None for k in ['decision', 'reviewer', 'decidedAt'])
print('PASS: five exact v1 packets, 170 retained associations, unsigned decisions and checkpoint evidence bytes. No approval/adoption determination.')
