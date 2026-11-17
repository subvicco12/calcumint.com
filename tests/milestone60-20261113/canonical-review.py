"""Verify exact packet identity, retained criteria and no inferred authorization."""
import hashlib,json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
def read(p):return json.loads((ROOT/p).read_text())
def check_ref(r):
 p=Path(r['path']);p=p if p.is_absolute() else ROOT/p
 assert hashlib.sha256(p.read_bytes()).hexdigest()==r['sha256'],r['path']
index=read('docs/milestone60-20261113/review/index.json')
assert len(index['packets'])==12
for r in index['packets']:
 check_ref(r);d=read(r['path']);check_ref(d['basePacket']);check_ref(d['currentEvidenceAddendum']);check_ref(d['qualificationProjection'])
 b=read(d['basePacket']['path'])
 assert d['identity']==b['identity'] and d['technicalRequirements']==b['technicalRequirements']
 assert d['qualification']['head']=='2d5d105892134f8af46fc2a02edd5932c431b845'
 assert d['qualification']['conclusion']=='success'
 assert all(v is None for v in d['requiredDecisions'].values())
 assert not any(d[k] for k in ['canonicalAccepted','certificationGranted','publicationEligible'])
 assert d['releaseHold']
g=read('docs/milestone60-20261113/review/per-id-gates.json');check_ref(g['source'])
assert len(g['rows'])==540 and len({r['catalogId'] for r in g['rows']})==540
assert sum(r['engineeringOverlay']['state'] in ['PREVIOUSLY_CONFIRMED_SCOPED','CONFIRMED_SCOPED_ENGINEERING_AT_EXACT_HEAD'] for r in g['rows'])==41
assert all(not any(r[k] for k in ['canonicalAccepted','certificationGranted','publicationEligible']) for r in g['rows'])
a=read('docs/milestone60-20261113/review/first-publication-and-appointment.json')
assert a['preferredCandidate']==440 and a['newReviewerDiscoveryPerformed'] is False
assert all(v is None for v in a['appointmentAction']['fields'].values())
print('Canonical review reuse: 12 exact unsigned packets, 540 unchanged gates, qualified appointment action verified.')
