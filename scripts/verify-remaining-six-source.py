"""Offline exact retained-source verification, not publisher-original or applicability approval."""
import pathlib,json,hashlib
ROOT=pathlib.Path('docs/remaining-six')
EXPECTED={'aasb-15': '249db9127aa8df6fd1265ee48fb445a8601f8f1fee691ed3a8b4f092e74e3384', 'aasb-amend': 'fd594bca2837fe47bb980f6f5dd57ace9c3171dfb624e0a20a8660b1c2f4cc31', 'cfpb-18': '2b2bb40028573188aa6a5d6650b509bdde9843b4e8735ce9dbe1ae85f1df2056', 'cfpb-4': '959990d96570d9c49f398a4c45c52b775812f92de3e42cd2bff0c74a04d6f55c', 'cfpb-j': 'c89ec173fe498ec20cb2e8c37f88ccbd0b6220ce0c8327537bf3211e04632fe7', 'chase-offer': 'b128081bf84fd81233cb0ce0889d11f63bda10ed7f07edbff24e8989bdb12fbd', 'dol-23': 'be3326b63ca4e46f911bba1e3dfffd5f8ef25fbb137b9f9f6c22b5480bc217f5', 'etsy-fees': '51591526cb4db7def9130327bfd48f3043059b52bb9fd6465813754d05151873', 'etsy-payments': '25dd6e3eab8bd82b95002199fde97e5c6ee19a45efa91f8a3c13521712655633', 'etsy-refund': '1193673df8cfed1e748ef1b786d18a770875fc39254d4c2c485e18027774e059', 'merrill-heloc': '879436d4b87cf8ca6eddf1a213e1755580217952da819a3e71276252f55a2f91'}
binding=json.loads((ROOT/'source-binding.json').read_text())
assert len(binding['records'])==len(EXPECTED)==11 and {r['sourceId'] for r in binding['records']}==set(EXPECTED)
assert binding['observationDate']=='2026-10-30'
for r in binding['records']:
 name=r['sourceId'];assert r['responseFile']=='source/'+name+'.json' and r['markdownFile']=='source/'+name+'.md'
 raw=(ROOT/r['responseFile']).read_bytes();assert hashlib.sha256(raw).hexdigest()==r['responseSHA256']==EXPECTED[name]
 data=json.loads(raw);assert not data.get('isError');body=data['structuredContent'];meta=body['metadata']
 assert meta['statusCode']==r['statusCode']==200 and r['sourceURL']==meta.get('sourceURL',meta.get('url'))
 text=(ROOT/r['markdownFile']).read_bytes();assert text==body['markdown'].encode('utf-8')
 assert hashlib.sha256(text).hexdigest()==r['markdownSHA256']
checks={'cfpb-j':['unpaid balance of the amount financed','carry all available decimals','rounded to 2 decimals'],
'chase-offer':['LGC61498','within 60 days','account may not be eligible'],
'merrill-heloc':['Interest Only Option','amount of accrued interest, plus any unpaid fees'],
'dol-23':['Revised October 2019','one-half','168 hours'],
'etsy-fees':['transaction fee'], 'etsy-payments':['refund'], 'etsy-refund':['seller fees'],
'aasb-15':['right of return','refund liability','recovery'], 'aasb-amend':['1 July 2026','Aus5.3']}
for name,clauses in checks.items():
 text=(ROOT/'source'/(name+'.md')).read_text()
 if name=='chase-offer':text+=' '+next(r['sourceURL'] for r in binding['records'] if r['sourceId']==name)
 for clause in clauses:assert clause.lower() in text.lower(),(name,clause)
print('PASS11pinned returned-source hashes,11normalized text hashes/status/URL bindings and selected clauses; no original publisher bytes or real-account eligibility claimed')
