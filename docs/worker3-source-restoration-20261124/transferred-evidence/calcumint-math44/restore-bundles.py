#!/usr/bin/env python3
"""Import the enumerated exact bundles into a local recovery Git repository."""
from pathlib import Path
import hashlib
import json
import subprocess
import sys

manifest_path = Path(__file__).resolve().with_name('bundle-order.json')
manifest = json.loads(manifest_path.read_text())
repo = Path(sys.argv[1]).resolve()
root = Path(sys.argv[2]).resolve() if len(sys.argv) == 3 else Path(manifest['root'])
def git(*args):
    return subprocess.check_output(['git','-C',str(repo),*args],text=True).strip()

verified = []
for index, entry in enumerate(manifest['orderedBundles'],1):
    path = root / entry['path']
    with path.open('rb') as bundle:
        digest = hashlib.file_digest(bundle,'sha256').hexdigest()
    if digest != entry['sha256']:
        raise SystemExit(f'Digest mismatch: {entry["path"]}')
    git('bundle','verify',str(path))
    for number, identity in enumerate(entry['identities'],1):
        target = f'refs/calcumint-recovery/bundle-{index:02d}-{number:02d}'
        git('fetch','--no-tags','--no-write-fetch-head',str(path),f'{identity["ref"]}:{target}')
        commit = git('rev-parse',f'{target}^{{commit}}')
        tree = git('rev-parse',f'{target}^{{tree}}')
        if (commit,tree) != (identity['commit'],identity['tree']):
            raise SystemExit(f'Git identity mismatch: {entry["path"]} {identity["ref"]}')
        verified.append(dict(bundle=entry['path'],sha256=digest,ref=target,commit=commit,tree=tree))
print(json.dumps(dict(recoveryRepository=str(repo),bundles=len(manifest['orderedBundles']),verified=verified),indent=2))
