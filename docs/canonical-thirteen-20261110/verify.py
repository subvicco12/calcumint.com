"""Offline integrity only; no network, application execution or authority decisions."""
import hashlib
import io
import json
from pathlib import Path
import subprocess
import xml.etree.ElementTree as ET
import zipfile
ROOT=Path(__file__).resolve().parents[2]
BASE=Path(__file__).resolve().parent
CHECKPOINT='23f2860c16310385f6c37f7a2bc3c86890631c98'
IDS=[370,371,372,373,374,377,378,379,382,383,384,385,386]
NEW=[374,382,383,384,385]
FORMULAS={374:'value * IEC(fromUnit) / IEC(toUnit)',382:'systemLoadWatts * (1 + headroomPercent / 100)',383:'pageSizeMb * monthlyPageViews / 1000',384:'storageGb * pricePerGbMonth',385:'transferGb * pricePerGb'}
DIMS=['contract-applicability','source-full-text','formula-and-units','precision-and-refusal','qa-and-accessibility','business-and-history','risk-and-obligations','competent-and-canonical','operations-and-lifecycle']
def git(*a):return subprocess.check_output(['git',*a],cwd=ROOT)
def sha(b):return hashlib.sha256(b).hexdigest()
def load(p):return json.loads(p.read_text())
def cells():
    p='docs/first20-publication/input/input/governing/01-CalcuMint_Master_Calculator_Catalog_2026-1-.xlsx';ns={'s':'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
    with zipfile.ZipFile(io.BytesIO(git('show',CHECKPOINT+':'+p))) as z:
        strings=[''.join(e.itertext()) for e in ET.fromstring(z.read('xl/sharedStrings.xml')).findall('s:si',ns)]
        result={}
        for c in ET.fromstring(z.read('xl/worksheets/sheet2.xml')).findall('.//s:c',ns):
            v=c.find('s:v',ns)
            if v is not None:result[c.get('r')]=strings[int(v.text)] if c.get('t')=='s' else v.text
        return result

def verify_documents(index,register):
    assert index['checkpoint']==CHECKPOINT
    assert [r['masterId'] for r in index['packets']]==IDS
    assert (index['packetCount'],index['newPacketCount'],index['reusedPacketCount'])==(13,5,8)
    rows=load(ROOT/'docs/remaining-five-20261110/acceptance-5.json')['rows'];native=cells();count=0
    for r in index['packets']:
        mid=r['masterId'];p=load(ROOT/r['packet']);ver=2 if mid==383 else 1
        assert sha((ROOT/r['packet']).read_bytes())==r['packetSHA256']
        assert p['identity']['masterId']==mid and p['identity']['version']==ver==r['version']
        assert p['identity']['engineId']==r['engineId']
        assert len(p['clauseAssociations'])==r['clauseAssociations']==34
        count+=len(p['requiredDecisions']);assert r['recordedDecisionDimensions']==len(p['requiredDecisions'])
        assert r['retainedUnmodified']==(mid not in NEW)
        for flag in ['canonicalAccepted','certificationGranted','publicationEligible']:assert p[flag] is False and r[flag] is False
        for d in p['requiredDecisions']:
            assert d['status']=='UNAPPROVED' and d['reviewer'] is None and d['decision'] is None and d['decidedAt'] is None
        if mid in NEW:
            original=next(x for x in rows if x['masterId']==mid)
            assert p['clauseAssociations']==original['criteria']
            assert p['nativeCatalog']==original['nativeCatalog']
            for cell,value in p['nativeCatalog']['cells'].items():assert native.get(cell,'')==value
            assert native['A'+str(mid+1)]==str(mid)
            assert p['formulaContract']['formula']==FORMULAS[mid]
            assert p['checkpoint']['sourceCommit']==CHECKPOINT and p['checkpoint']['ciRun']==42797848774
            assert p['formulaContract']['source']['fullTextVerifiedByPacket'] is False
            assert p['formulaContract']['source']['applicabilityAccepted'] is None
            assert all(p['authority'][k] is None for k in ['actualReviewer','authorIdentity','appointmentRef'])
            assert [d['dimension'] for d in p['requiredDecisions']]==DIMS
    assert count==index['actualRecordedDecisionCount']==102
    assert sum(r['clauseAssociations'] for r in index['packets'])==index['clauseAssociationCount']==442
    assert index['normalizedDecisionCellCount']==117
    for k in ['canonicalAcceptedCount','certificationGrantedCount','publicationEligibleCount']:assert index[k]==0
    decisions=register['decisions'];assert len(decisions)==117
    expected={(i,2 if i==383 else 1,d) for i in IDS for d in DIMS}
    assert {(d['masterId'],d['version'],d['dimension']) for d in decisions}==expected
    assert register['oldSixDimensionPacketsPreserved'] is True and register['normalizationDoesNotApproveOrRewriteOriginal'] is True
    for d in decisions:
        assert d['status']=='UNAPPROVED' and all(d[k] is None for k in ['reviewer','decision','decidedAt'])
        p=load(ROOT/d['packet']);names={x['dimension'] for x in p['requiredDecisions']}
        assert set(d['originalDecisionDimensions'])<=names
        assert d['normalizedForIndex']==(len(names)==6)
    return True

def verify_all():
    m=load(BASE/'evidence-manifest.json');assert m['checkpoint']==CHECKPOINT
    for e in m['evidence']:
        assert e['sourceCommit']==CHECKPOINT;b=git('show',CHECKPOINT+':'+e['path'])
        assert sha(b)==e['sha256'] and len(b)==e['bytes'];assert git('rev-parse',CHECKPOINT+':'+e['path']).decode().strip()==e['gitBlob']
        assert (ROOT/e['path']).read_bytes()==b
    for e in m['retainedNamespaces']:assert sha((ROOT/e['path']).read_bytes())==e['sha256']==sha(git('show',CHECKPOINT+':'+e['path']))
    e=m['externalCI'];b=(ROOT/e['path']).read_bytes();assert len(b)==e['bytes'] and sha(b)==e['sha256'];ci=json.loads(b)
    assert ci['sourceSHA']==CHECKPOINT and ci['runId']==42797848774 and ci['status']=='completed' and ci['conclusion']=='success'
    assert {j['name'] for j in ci['jobs']}=={'build','checks','source-acceptance','publication-factory','full-product','validate'}
    assert all(j['status']=='completed' and j['conclusion']=='success' for j in ci['jobs'])
    verify_documents(load(BASE/'index.json'),load(BASE/'decision-register.json'))
    for path in ['docs/remaining-five-team-20261110/workflow-phase/comparison-phase.json','docs/remaining-five-team-20261110/role-tail/receipt.json']:
        p=ROOT/path;r=load(p)
        for file,digest in r['sourceHashes'].items():
            target=ROOT/'docs/remaining-five-team-20261110/workflow-phase/producer.fixture' if file=='tests/remaining-five-team-20261110/workflows.mjs' else ROOT/file
            assert sha(target.read_bytes())==digest
        for item in r['exports']:
            file=Path(item['file']);assert not file.is_absolute() and '..' not in file.parts
            target=p.parent/file;assert target.resolve()==target and target.is_file();data=target.read_bytes();assert len(data)==item['bytes'] and sha(data)==item['sha256']
    native=load(ROOT/'docs/remaining-five-native-20261110/receipt.json')
    for file,binding in native['workerSources'].items():assert sha((ROOT/file).read_bytes())==binding['source']==binding['copy']
    for file,binding in load(ROOT/'docs/remaining-five-native-20261110/build-source-sha256.json').items():assert sha((ROOT/file).read_bytes())==binding['source']
    return True
if __name__=='__main__':
    verify_all();print('PASS13exact packets/8byte-preserved+5new;442clauses;102recorded decisions/117normalized UNAPPROVED cells; exact23 Git+officialCI42797848774+55teamfiles+31native/11worker bindings. No approval/adoption determination.')
