"""Read original evidence only; never regenerate tests, exports, or application state."""
import csv
import hashlib
import io
import json
from pathlib import Path, PurePosixPath
import stat
import subprocess
import sys
import zipfile

ROOT = Path(__file__).resolve().parents[2]
SOURCE = '75040e7463093c5e9094016ef91cb64987d3df63'
TESTED = '3ddc5ee49d659fc9e7150ffdb1ff790ca085726e'
INTAKE = '441ee8a095ad9ffabe3e9dbde67766317c6a0aab'
MANIFEST_SHA = 'f08144fd563940e047ba1813cd54475ba79051f0aedc24a4b9444c7d0bce7e44'
sha = lambda b: hashlib.sha256(b).hexdigest()


def git(*args):
    return subprocess.check_output(['git', '-C', str(ROOT), *args])


def checked(data, descriptor):
    assert len(data) == descriptor['bytes']
    assert sha(data) == descriptor['sha256']


manifest_path, archive_path, output_path = map(Path, sys.argv[1:])
manifest_bytes = manifest_path.read_bytes()
assert len(manifest_bytes) == 15924 and sha(manifest_bytes) == MANIFEST_SHA
m = json.loads(manifest_bytes)
assert m['repository'] == 'subvicco12/calcumint.com'
assert m['commit'] == SOURCE and m['testedCodeCommit'] == TESTED
archive_bytes = archive_path.read_bytes()
checked(archive_bytes, m['archive'])
z = zipfile.ZipFile(io.BytesIO(archive_bytes))
assert z.testzip() is None
names = z.namelist()
assert len(names) == len(set(names)) == 58
for member in z.infolist():
    path = PurePosixPath(member.filename)
    assert not path.is_absolute() and '..' not in path.parts
    assert not member.is_dir() and not stat.S_ISLNK(member.external_attr >> 16)
assert sum(member.file_size for member in z.infolist()) < 32 * 1024 * 1024
internal_bytes = z.read('MANIFEST.json')
checked(internal_bytes, m['archive']['internalManifest'])
internal = json.loads(internal_bytes)
assert internal['head'] == SOURCE and internal['testedCode'] == TESTED
assert internal['qualification'] == 'NOT_PROMOTED' and internal['releaseHold'] is True
assert set(names) == set(internal['payloads']) | {'MANIFEST.json'}
assert len(internal['payloads']) == 57
for name, descriptor in internal['payloads'].items():
    checked(z.read(name), descriptor)

acceptance = json.loads(git('show', SOURCE + ':docs/worker1-construction-20261116/acceptance.json'))
assert len(m['rawEvidence']) == len(acceptance['evidence']) == 14
assert {r['originalPath'] for r in m['rawEvidence']} == set(acceptance['evidence'])
for row in m['rawEvidence']:
    assert {k: row[k] for k in ['bytes', 'sha256']} == acceptance['evidence'][row['originalPath']]
    checked(z.read(row['archiveEntry']), row)
for name in [n for n in names if n.startswith('docs/')]:
    assert z.read(name) == git('show', SOURCE + ':docs/worker1-construction-20261116/' + name[5:])

source_proof = json.loads(z.read(m['commitRelationship']['proof']['archiveEntry']))
checked(z.read(m['commitRelationship']['proof']['archiveEntry']), m['commitRelationship']['proof'])
assert source_proof['verifiedHead'] == SOURCE and source_proof['codeRef'] == TESTED
policy = json.loads(z.read('docs/source-policy.json'))
assert source_proof['sourceCaptureSHA256'] == policy['captureSHA256']
assert sha(z.read('docs/source-successor.json')) == policy['captureSHA256']
assert not git('diff', TESTED, SOURCE, '--', 'src')
assert not git('diff', SOURCE, INTAKE, '--', 'src')
assert git('merge-base', TESTED, SOURCE).decode().strip() == TESTED
for r in json.loads(z.read('evidence/changed-files.json'))['files']:
    blob = git('show', SOURCE + ':' + r['path'])
    checked(blob, r)
    assert git('rev-parse', SOURCE + ':' + r['path']).decode().strip() == r['blob']

fingerprints = json.loads(z.read(m['compiledFingerprintManifest']['archiveEntry']))
assert len(fingerprints) == 2099
assert m['compiledFingerprintManifest']['includedInRawEvidenceCount'] is True
checked(z.read(m['compiledFingerprintManifest']['archiveEntry']), m['compiledFingerprintManifest'])
requests = ''.join(SOURCE + ':' + path + '\n' for path in fingerprints).encode()
batch = subprocess.run(['git', '-C', str(ROOT), 'cat-file', '--batch'], input=requests, capture_output=True, check=True).stdout
position = 0
for path, row in fingerprints.items():
    end = batch.index(b'\n', position)
    header = batch[position:end].split()
    assert len(header) == 3 and header[1] == b'blob', path
    size = int(header[2]); position = end + 1
    blob = batch[position:position + size]; position += size + 1
    assert batch[position - 1:position] == b'\n'
    assert sha(blob) == row['originalSHA256'] == row['builtSHA256'], path
    assert row['explicitLowerPublicationFixture'] is False, path
assert position == len(batch)

auth = json.loads(z.read('evidence/authenticated/receipt.json'))
assert auth == json.loads(z.read('docs/isolated-authentication.json'))
assert len(auth['rows']) == 30 and auth['passed'] is True
assert auth['productionWrites'] is False and auth['publicationFixture'] is False
exports = {(r['catalogId'], r['format']): r for r in m['downloadedExports']}
assert len(exports) == len(m['downloadedExports']) == len(auth['downloads']) == 30
contracts = json.loads((ROOT / 'docs/coordinator-construction-20261116/business-delivery-proposal.json').read_text())['tuples']
assert {(c['catalogId'], f) for c in contracts for f in ['json', 'csv', 'pdf']} == set(exports)
for r in auth['downloads']:
    e = exports[(r['id'], r['format'])]
    assert e['originalDownloadPath'] == r['file']
    assert e['bytes'] == r['bytes'] and e['sha256'] == r['sha256']
    checked(z.read(e['archiveEntry']), e)
for c in contracts:
    catalog_id = c['catalogId']
    packet = json.loads(z.read(exports[(catalog_id, 'json')]['archiveEntry']))
    identity = packet['identity']
    assert identity == {'catalogId': catalog_id, 'engineId': c['engineId'], 'calculatorSlug': c['slug'], 'calculatorVersion': 1, 'sourceVersion': 'worker1-construction-20261116.1/' + c['engineId'] + '@1'}
    assert packet['snapshot']['calculatorSlug'] == c['slug'] and packet['snapshot']['calculatorVersion'] == 1
    csv_rows = list(csv.reader(io.StringIO(z.read(exports[(catalog_id, 'csv')]['archiveEntry']).decode())))
    assert csv_rows[0] == ['section', 'field', 'value']
    fields = {(r[0], r[1]): r[2] for r in csv_rows[1:]}
    assert json.loads(fields[('input', 'identity')]) == identity
    assert fields[('output', 'outputUnit')] == c['unit']
    assert json.loads(fields[('input', 'input')]) == packet['snapshot']['input']
    pdf = z.read(exports[(catalog_id, 'pdf')]['archiveEntry'])
    assert pdf.startswith(b'%PDF-')
    pdf_text = subprocess.run(['pdftotext', '-', '-'], input=pdf, capture_output=True, check=True).stdout.decode()
    title = next(r['title'] for r in acceptance['rows'] if r['catalogId'] == catalog_id)
    assert title in pdf_text and c['unit'] in pdf_text

tests = json.loads(z.read('evidence/reserved-final.json'))
assert tests['success'] is True and tests['numPassedTests'] == 51 and tests['numFailedTests'] == 0
held = json.loads(git('show', INTAKE + ':docs/coordinator-construction-20261116/shared-joins-proposal.json'))
for r in held['bindings']:
    assert sha((ROOT / r['path']).read_bytes()) == r['predecessorSHA256']
assert len(held['bindings']) == 8 and held['state'] == 'HELD_NOT_ACTIVATED'
result = {'kind': 'ORIGINAL_CONSTRUCTION_RAW_ARTIFACT_ACCESS_VERIFICATION', 'sourceCommit': SOURCE, 'testedCodeCommit': TESTED, 'reconciledIntakeCommit': INTAKE, 'manifest': {'driveFileId': '1c_ZFL6fBvIKneKvOmAcAAA9R5KlHvG9i', 'bytes': len(manifest_bytes), 'sha256': sha(manifest_bytes), 'identicalAuthenticatedReadbacks': 2, 'priorOwnerSuppliedDigest': False}, 'archive': {'driveFileId': m['archive']['fileId'], 'url': m['archive']['url'], 'bytes': len(archive_bytes), 'sha256': sha(archive_bytes), 'internalManifestSHA256': sha(internal_bytes), 'members': len(names), 'verifiedPayloads': len(internal['payloads']), 'crc': 'PASS'}, 'rawFilesMatchedToCommittedAcceptance': 14, 'compiledFingerprintEntriesMatchedToSourceCommit': 2099, 'authoringAndBuiltFingerprintDigestsEqual': True, 'originalExportsMatchedToAuthenticatedReceipt': 30, 'originalPdfCsvJsonContentsRead': 30, 'authenticatedJourneyReceiptRows': 30, 'originalTargetedTestReceiptPasses': 51, 'testsRerun': False, 'exportsRegenerated': False, 'sourceBodiesRebuilt': False, 'rawArtifactEvidenceAccessBlocker': 'CLOSED', 'heldSharedPaths': 8, 'sharedActivation': False, 'constructionPromotions': 0, 'hostedCI': 'NOT_LAUNCHED', 'prModified': False, 'releaseHold': True}
output_path.write_text(json.dumps(result, indent=2) + '\n')
print(json.dumps(result))
