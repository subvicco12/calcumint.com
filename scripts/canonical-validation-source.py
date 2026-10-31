#!/usr/bin/env python3
"""Offline source binding. A technical capture is not publisher/applicability approval."""
import hashlib,json,argparse,re
from pathlib import Path
r=Path(__file__).resolve().parents[1]
paths=sorted([p for p in (r/'src/calculators').rglob('*.ts') if '.test.' not in p.name]+[r/p for p in ['src/lib/calculation-snapshot.ts','package-lock.json','docs/cloud-batch08/selected-contract-evidence.json','docs/blueprint-reconciliation/input/master-blueprint.docx','docs/blueprint-reconciliation/blueprint-to-540.json']])
# Bind literal JSON imports as data dependencies, excluding only the self-referential binding itself.
extra=set()
for p in paths:
 if p.suffix=='.ts':
  for name in re.findall(r"(?:from\s*|import\s*)['\"]([^'\"]+\.json)['\"]",p.read_text()):
   target=(r/'src'/name[2:] if name.startswith('@/') else p.parent/name).resolve()
   if not target.is_relative_to(r):raise SystemExit('Import escapes repository')
   if target!=r/'docs/canonical-validation/source-binding.json':extra.add(target)
paths=sorted(set(paths)|extra)
records=[{'path':str(p.relative_to(r)),'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in paths]
value={'schemaVersion':1,'baselineSHA':'a54f94cea4df160882a96308b661f6d6c12da837','technicalSourceTreeSHA256':hashlib.sha256(json.dumps(records,sort_keys=True,separators=(',',':')).encode()).hexdigest(),'boundFileCount':len(records),'excludedSelfReference':'docs/canonical-validation/source-binding.json','meaning':'Exact local technical source capture; not authenticated publisher bytes, canonical mapping or qualified applicability approval.','canonicalAccepted':False,'releaseHold':True}
p=r/'docs/canonical-validation/source-binding.json';data=json.dumps(value,indent=2)+'\n'
a=argparse.ArgumentParser();a.add_argument('--check',action='store_true');args=a.parse_args()
if args.check:
 if p.read_text()!=data:raise SystemExit('Current technical source binding differs')
else:p.write_text(data)
print('PASS exact technical source binding; no authority/canonical acceptance inferred')
