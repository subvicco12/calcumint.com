#!/usr/bin/env python3
"""Offline source binding. A technical capture is not publisher/applicability approval."""
import hashlib,json,argparse,re
from pathlib import Path
r=Path(__file__).resolve().parents[1]
# Revision2 has closed membership too: future independent revisions are additive.
records=json.loads((r/'docs/validation-scale/v2-source-files.json').read_text())
expected=json.loads((r/'docs/validation-scale/source-binding.json').read_text())
if hashlib.sha256(json.dumps(records,sort_keys=True,separators=(',',':')).encode()).hexdigest()!=expected['technicalSourceTreeSHA256']:raise SystemExit('Frozen v2 membership preimage differs')
paths=[r/x['path'] for x in records]
for x,p in zip(records,paths):
 if not p.resolve().is_relative_to(r) or hashlib.sha256(p.read_bytes()).hexdigest()!=x['sha256']:raise SystemExit('Frozen v2 dependency differs: '+x['path'])
value={'schemaVersion':1,'baselineSHA':'448533b858e80d4eb90b2146e9dd8c5ba7d91fdb','technicalSourceTreeSHA256':hashlib.sha256(json.dumps(records,sort_keys=True,separators=(',',':')).encode()).hexdigest(),'boundFileCount':len(records),'excludedSelfReference':'docs/validation-scale/source-binding.json','meaning':'Exact local technical source capture; not authenticated publisher bytes, canonical mapping or qualified applicability approval.','canonicalAccepted':False,'releaseHold':True}
p=r/'docs/validation-scale/source-binding.json';data=json.dumps(value,indent=2)+'\n'
a=argparse.ArgumentParser();a.add_argument('--check',action='store_true');args=a.parse_args()
if args.check:
 if p.read_text()!=data:raise SystemExit('Current technical source binding differs')
else:p.write_text(data)
print('PASS exact technical source binding; no authority/canonical acceptance inferred')
