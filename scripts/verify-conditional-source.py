"""Verify delivered source bytes and selected clauses offline; never asserts eligibility."""
import hashlib,json,pathlib,zipfile
root=pathlib.Path('docs/conditional-ten');binding=json.loads((root/'source-binding.json').read_text())
archive=pathlib.Path('docs/partial16-ci-recovery/input/source-resolution-16.zip').read_bytes()
assert hashlib.sha256(archive).hexdigest()==binding['archiveSHA256']=='d49d5a60737546dc8208ff5d1cbfb68740b3e153da3ca56501a7966f290fc1c3'
expected={'ira-captures/reused-source-3.md','ira-captures/reused-source-4.md','uk-capture-0.json','uk-capture-1.json','uk-capture-2.json','uk-extra-0.json'}
assert len(binding['files'])==6 and {r['archiveMember'] for r in binding['files']}==expected
assert all(r['file']=='source/'+pathlib.PurePosixPath(r['archiveMember']).name for r in binding['files'])
import io
with zipfile.ZipFile(io.BytesIO(archive)) as z:
 assert z.testzip() is None
 for record in binding['files']:
  raw=(root/record['file']).read_bytes()
  assert raw==z.read(record['archiveMember'])
  assert hashlib.sha256(raw).hexdigest()==record['sha256']
checks={
 'reused-source-3.md':['Worksheet 1-2','79,000','89,000','150,000','7,000','next highest multiple of $10','less than $200','Subtract line 7 from line 5 or line 6, whichever is smaller'],
 'reused-source-4.md':['account balance at the end of 2025','birthday in 2026','24.6','75 | 24.6'],
 'uk-capture-0.json':['19%','25%','3/200','50,000','250,000','2026'],
 'uk-capture-1.json':['3/200','187,500','55,000'],
 'uk-capture-2.json':['associated'],
 'uk-extra-0.json':['No rounding should take place on form CT600 itself, or in any arithmetic that precedes']}
for name,clauses in checks.items():
 text=(root/'source'/name).read_text()
 if name.endswith('.json'):text=json.loads(text)['markdown']
 for clause in clauses:assert clause.lower() in text.lower(),(name,clause)
print('PASS six delivered source hashes and selected clauses; no publisher-byte authentication or applicability approval inferred')
