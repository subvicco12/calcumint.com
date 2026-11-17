"""Offline documentary integrity, never a certification/adoption executor."""
import hashlib
import io
import json
from pathlib import Path
import subprocess
import xml.etree.ElementTree as ET
import zipfile

ROOT = Path(__file__).resolve().parents[2]
BASE = Path(__file__).resolve().parent
CHECKPOINT = '3c9fc6bdcedf053d2315470f8c0ee549d53bd5de'
EXPECTED = {
    377: ('technology.aspect-ratio', 'aspect-ratio-calculator', 'width / height', 'dimensionless numeric width/height ratio'),
    378: ('technology.resolution', 'resolution-calculator', 'widthPixels * heightPixels', 'supplied width-times-height pixel quantity; not physical pixel density'),
    379: ('technology.dpi', 'dpi-calculator', 'pixels / lengthInches', 'linear pixels/inch; no printer-dot/display-pixel interchangeability'),
}
def git(*args):
    return subprocess.check_output(['git', *args], cwd=ROOT)
def sha(data):
    return hashlib.sha256(data).hexdigest()
def load(path):
    return json.loads(path.read_text())
def native_cells():
    path='docs/first20-publication/input/input/governing/01-CalcuMint_Master_Calculator_Catalog_2026-1-.xlsx'
    ns={'s':'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
    with zipfile.ZipFile(io.BytesIO(git('show', CHECKPOINT+':'+path))) as z:
        strings=[''.join(n.itertext()) for n in ET.fromstring(z.read('xl/sharedStrings.xml')).findall('s:si',ns)]
        sheet=ET.fromstring(z.read('xl/worksheets/sheet2.xml'))
        cells={}
        for c in sheet.findall('.//s:c',ns):
            v=c.find('s:v',ns)
            if v is not None:
                cells[c.attrib['r']]=strings[int(v.text)] if c.get('t')=='s' else v.text
        return cells

def verify_packet(p, original, cells):
    ident=p['identity']; mid=ident['masterId']; engine,slug,formula,unit=EXPECTED[mid]
    assert ident==dict(masterId=mid,engineId=engine,slug=slug,version=1)
    assert p['checkpoint']['sourceCommit']==CHECKPOINT
    assert p['checkpoint']['ciRun']==42763819003
    assert p['checkpoint']['ciSHA256']=='1cd472cbeefbef8662cc15f34226bded1af1626c3cdbbd76608865803f2d5a1c'
    assert p['checkpoint']['ciEvidence']=='docs/canonical-three-20261110/exact-head-ci.json'
    assert p['formulaContract']['source']['fullTextVerifiedByPacket'] is False
    assert p['formulaContract']['source']['applicabilityAccepted'] is None
    assert p['formulaContract']['formula']==formula and p['formulaContract']['output']==unit
    assert p['clauseAssociations']==original['criteria'] and len(p['clauseAssociations'])==34
    assert p['nativeCatalog']==original['nativeCatalog']
    for key,value in p['nativeCatalog']['cells'].items():
        assert cells.get(key,'')==value, key
    assert cells['A'+str(mid+1)]==str(mid)
    assert all(p[k] is False for k in ['canonicalAccepted','certificationGranted','publicationEligible'])
    assert all(p['authority'][k] is None for k in ['actualReviewer','authorIdentity','appointmentRef'])
    assert len(p['requiredDecisions'])==9
    for decision in p['requiredDecisions']:
        assert decision['status']=='UNAPPROVED'
        assert all(decision[k] is None for k in ['reviewer','decision','decidedAt','evidenceRef'])
    assert p['precision']['competentAcceptance'] is None
    return True

def verify_all():
    m=load(BASE/'evidence-manifest.json'); assert m['checkpoint']==CHECKPOINT
    for e in m['evidence']:
        assert e['sourceCommit']==CHECKPOINT
        b=git('show',CHECKPOINT+':'+e['path'])
        assert len(b)==e['bytes'] and sha(b)==e['sha256']
        assert git('rev-parse',CHECKPOINT+':'+e['path']).decode().strip()==e['gitBlob']
        assert (ROOT/e['path']).read_bytes()==b
    for e in m['oldFiveFilesPreserved']:
        assert sha((ROOT/e['path']).read_bytes())==e['sha256']==sha(git('show',CHECKPOINT+':'+e['path']))
    for e in m['externalEvidence']:
        b=(ROOT/e['path']).read_bytes(); assert len(b)==e['bytes'] and sha(b)==e['sha256']
    ci=load(BASE/'exact-head-ci.json')
    assert ci['headSha']==CHECKPOINT and ci['runId']==42763819003
    assert ci['status']=='completed' and ci['conclusion']=='success'
    assert {j['name'] for j in ci['jobs']}=={'full-product','checks','publication-factory','source-acceptance','build','validate'}
    assert all(j['status']=='completed' and j['conclusion']=='success' for j in ci['jobs'])
    originals=load(ROOT/'docs/next-cohort-20261110/acceptance-8.json')['rows']; cells=native_cells()
    for mid in EXPECTED:
        verify_packet(load(BASE/f'{mid}-v1-review-packet.json'),next(r for r in originals if r['masterId']==mid),cells)
    # Direct current/retained receipt source hashes are not inferred from a passing count.
    for path in ['docs/next-cohort-ui-current-20261110/browser.json','docs/next-cohort-sharing-20261110/workflows/receipt.json','docs/next-cohort-auth-current-20261110/personal-current-caller/receipt.json']:
        r=load(ROOT/path)
        for file,digest in r['sourceHashes'].items(): assert sha((ROOT/file).read_bytes())==digest
    for file,item in load(ROOT/'docs/next-cohort-auth-current-20261110/build-source-sha256.json').items():
        assert sha((ROOT/file).read_bytes())==item['source']
    for path,key in [('docs/next-cohort-ui-current-20261110/browser.json','downloads'),('docs/next-cohort-sharing-20261110/workflows/receipt.json','exports'),('docs/next-cohort-auth-current-20261110/personal-current-caller/receipt.json','downloads')]:
        receipt_path=ROOT/path
        for item in load(receipt_path)[key]:
            file=Path(item['file'])
            assert not file.is_absolute() and '..' not in file.parts
            target=receipt_path.parent/file
            assert target.resolve()==target and target.is_file()
            data=target.read_bytes()
            assert len(data)==item['bytes'] and sha(data)==item['sha256']
    return True

if __name__=='__main__':
    verify_all()
    print('PASS:3 exact-v1 unsigned packets;102 clause associations; native rows378–380; exact Git/receipt/CI hashes; old five/170 associations unchanged. No approval or adoption determination.')
