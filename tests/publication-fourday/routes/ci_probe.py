"""Capture bounded read-only CI evidence. Exit zero means artifact capture, never acceptance."""
import argparse
import datetime
import hashlib
import json
import os
import pathlib
import subprocess
import sys
import tempfile

import probe


def unknown(reason, targets):
    rows = [dict(t, method='GET', status=None, renderVerified=False,
                 acceptance='UNKNOWN', error=reason,
                 canonicalIdentityApproval='NOT_ESTABLISHED_BY_ROUTE_PROBE') for t in targets]
    return {'capturedAt': datetime.datetime.now(datetime.timezone.utc).isoformat(),
            'captureStatus': 'UNKNOWN', 'reason': reason, 'releaseHold': True,
            'canonicalIdentityApproval': 'NOT_ESTABLISHED', 'rows': rows}


def validate(data, targets):
    """Reject missing, substituted, or authority-escalating child output."""
    if not isinstance(data, dict): return False
    summary = data.get('summary', {})
    if not isinstance(summary, dict): return False
    if summary.get('releaseHold') is not True or summary.get('canonicalIdentityApproval') != 'NOT_ESTABLISHED': return False
    rows = data.get('rows')
    if not isinstance(rows, list) or len(rows) != len(targets): return False
    expected = {t['url']: t for t in targets}
    if len({r.get('url') for r in rows if isinstance(r, dict)}) != len(targets): return False
    for row in rows:
        if not isinstance(row, dict) or row.get('url') not in expected or row.get('method') != 'GET': return False
        if row.get('evidenceScope') != probe.EVIDENCE_SCOPE or row.get('inputControlConvention') != probe.CONTROL_CONVENTION: return False
        target = expected[row['url']]
        if any(row.get(k) != v for k, v in target.items()): return False
        status = row.get('status')
        if status is not None and (type(status) is not int or not 100 <= status <= 599): return False
        if target['kind'] == 'unpublished-candidate':
            if row.get('canonicalIdentityApproval') != 'NOT_ESTABLISHED_BY_ROUTE_PROBE': return False
            if any(row.get(k) != v for k,v in probe.candidate_visibility(status).items()): return False
        if target['kind'] == 'engine':
            if row.get('canonicalIdentityApproval') != 'NOT_ESTABLISHED_BY_ROUTE_PROBE': return False
            if type(row.get('renderVerified')) is not bool: return False
            if row['renderVerified'] and not (status == 200 and row.get('finalUrl') == row['url'] and row.get('canonical') == row['url'] and row.get('displayedVersion') == target['expectedVersion'] and row.get('h1') == target['expectedTitle'] and row.get('inputControls', 0) > 0 and row.get('contentMarkers') and all(row['contentMarkers'].get(k) is True for k in ('How this calculator works', 'Formula', 'Worked example', 'Methodology & sources'))): return False
    engines = [r for r in rows if r['kind'] == 'engine']
    counts = {'productionRows': len(engines), 'uniqueEngineRoutes': len(engines),
              'engineHttp200': sum(r['status'] == 200 for r in engines),
              'engineRenderVerified': sum(r['renderVerified'] for r in engines),
              'engineOriginFailures': sum(r['status'] is not None and r['status'] != 200 for r in engines),
              'engineTransportUnknown': sum(r['status'] is None for r in engines)}
    counts.update(probe.candidate_counts(rows))
    return all(type(summary.get(k)) is int and summary[k] == v for k, v in counts.items())


def capture(output, targets, runner=subprocess.run):
    def write(data):
        data['executionContext'] = {
            'headSha': os.environ.get('AUDIT_HEAD_SHA'),
            'checkoutSha': os.environ.get('GITHUB_SHA'),
            'repository': os.environ.get('GITHUB_REPOSITORY'),
        }
        source = pathlib.Path('docs/publication-fourday-20261105/production/catalog.json')
        data['productionSnapshotSha256'] = hashlib.sha256(source.read_bytes()).hexdigest() if source.is_file() else None
        output.write_text(json.dumps(data, indent=2) + '\n')
    output.parent.mkdir(parents=True, exist_ok=True)
    write(unknown('Capture has not completed', targets))
    with tempfile.TemporaryDirectory(prefix='route-child-', dir=output.parent) as folder:
        child = pathlib.Path(folder)/'observations.json'
        command = [sys.executable, str(pathlib.Path(__file__).with_name('probe.py')), '--output', str(child), '--request-timeout', '3']
        try:
            result = runner(command, timeout=220, check=False, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            if result.returncode != 0:
                write(unknown('Child producer exited nonzero', targets)); return
            try:
                if not child.is_file() or child.stat().st_size > 4_000_000: raise ValueError('missing/oversize output')
                data = json.loads(child.read_text())
                if not validate(data, targets): raise ValueError('invalid output')
            except (OSError, ValueError, TypeError, KeyError, AttributeError):
                write(unknown('Child producer output missing or invalid', targets)); return
            data['captureStatus'] = 'EVIDENCE_CAPTURED'
            data['captureMeaning'] = 'Producer completion is not acceptance or canonical approval; inspect each observation.'
            write(data)
        except subprocess.TimeoutExpired:
            write(unknown('Child producer exceeded 220-second hard timeout and was killed', targets))
        except OSError:
            write(unknown('Child producer could not start', targets))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output', type=pathlib.Path, required=True)
    args = parser.parse_args()
    root = pathlib.Path(os.environ['RUNNER_TEMP']).resolve()
    output = args.output.resolve()
    if not output.is_relative_to(root) or output == root:
        parser.error('--output must be a file inside RUNNER_TEMP')
    _, _, _, targets = probe.load_targets()
    capture(output, targets)

if __name__ == '__main__': main()
