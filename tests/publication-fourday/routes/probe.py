"""Read-only public evidence: GET only, four workers, 12s timeout, 2MB cap.
Run from repository root; no credentials, forms, database APIs, or origin writes.
"""
import argparse
import concurrent.futures
import datetime
import hashlib
import json
import pathlib
import re
import urllib.error
import urllib.request
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from urllib.parse import urlsplit

EVIDENCE_SCOPE = 'SERVER_RENDERED_HTML_SURFACE_ONLY'
CONTROL_CONVENTION = 'calculator-ui descendants excluding account/scenario ancestors and hidden controls'
BASE = 'https://calcumint.com'
OUT = pathlib.Path('docs/publication-fourday-20261105/routes')

class SameOrigin(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        if urlsplit(newurl).scheme != 'https' or urlsplit(newurl).netloc != 'calcumint.com':
            raise ValueError('Unexpected redirect origin')
        return super().redirect_request(req, fp, code, msg, headers, newurl)

class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.text, self.headings, self.links = [], [], []
        self.h1, self.skip, self.controls, self.canonical = False, 0, 0, None
        self.ancestors = []
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag in ('script', 'style'): self.skip += 1
        if tag == 'h1': self.h1 = True
        if tag == 'link' and 'canonical' in a.get('rel', '').split(): self.canonical = a.get('href')
        if tag == 'a' and a.get('href'): self.links.append(a['href'])
        classes = a.get('class', '').split()
        in_ui = 'calculator-ui' in classes or any('calculator-ui' in c for _, c in self.ancestors)
        excluded = any('account' in c or 'scenario' in c for c in classes) or any(any('account' in c or 'scenario' in c for c in cs) for _, cs in self.ancestors)
        if tag in ('input', 'select', 'textarea') and in_ui and not excluded and a.get('type', '').lower() != 'hidden': self.controls += 1
        if tag not in ('area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'):
            self.ancestors.append((tag, classes))
    def handle_endtag(self, tag):
        for i in range(len(self.ancestors) - 1, -1, -1):
            if self.ancestors[i][0] == tag:
                del self.ancestors[i:]
                break
        if tag in ('script', 'style'): self.skip = max(0, self.skip - 1)
        if tag == 'h1': self.h1 = False
    def handle_data(self, data):
        if not self.skip:
            self.text.append(data)
            if self.h1: self.headings.append(data)

def inspect(body, expected=None):
    p = Page(); p.feed(body.decode('utf-8'))
    text = ' '.join(p.text)
    version = re.search(r'Technical calculation version:\s*(\d+)', text)
    markers = {x: x in text for x in ('How this calculator works', 'Formula', 'Worked example', 'Methodology & sources')}
    return {'h1': ''.join(p.headings).strip(), 'canonical': p.canonical,
            'inputControls': p.controls, 'inputControlConvention': CONTROL_CONVENTION, 'evidenceScope': EVIDENCE_SCOPE, 'displayedVersion': int(version.group(1)) if version else None,
            'contentMarkers': markers, 'calculatorLinks': sorted(set(x for x in p.links if x.startswith('/calculators/')))}

def probe(target, request_timeout=12):
    url = target['url']
    assert url.startswith(BASE + '/') and urlsplit(url).netloc == 'calcumint.com'
    result = dict(target, capturedAt=datetime.datetime.now(datetime.timezone.utc).isoformat(), method='GET', status=None, evidenceScope=EVIDENCE_SCOPE, inputControlConvention=CONTROL_CONVENTION)
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'CalcuMint-readonly-publication-audit/1.0'})
        with urllib.request.build_opener(SameOrigin()).open(req, timeout=request_timeout) as response:
            body = response.read(2_000_001)
            if len(body) > 2_000_000: raise ValueError('Response exceeds evidence limit')
            result.update(status=response.status, finalUrl=response.url, bodySha256=hashlib.sha256(body).hexdigest())
            if target['kind'] == 'sitemap':
                result['urls'] = sorted(set(e.text for e in ET.fromstring(body).iter() if e.tag.endswith('}loc') and e.text))
            else:
                result.update(inspect(body))
    except urllib.error.HTTPError as error:
        result.update(status=error.code, error='Origin HTTP error')
    except Exception as error:
        result.update(error=type(error).__name__ + ': ' + str(error)[:180], transportFailure=True)
    if target['kind'] == 'engine':
        result['renderVerified'] = bool(result.get('status') == 200 and result.get('finalUrl') == url and result.get('canonical') == url and result.get('displayedVersion') == target['expectedVersion'] and result.get('h1') == target['expectedTitle'] and result.get('inputControls', 0) > 0 and all(result.get('contentMarkers', {}).values()) and bool(result.get('contentMarkers')))
        result['canonicalIdentityApproval'] = 'NOT_ESTABLISHED_BY_ROUTE_PROBE'
    if target['kind'] == 'unpublished-candidate':
        result.update(candidate_visibility(result.get('status')))
        result['canonicalIdentityApproval'] = 'NOT_ESTABLISHED_BY_ROUTE_PROBE'
    return result

def candidate_visibility(status):
    return {'failClosedObserved': status in (404, 410),
            'visibilityDisposition': 'FAIL_CLOSED_OBSERVED' if status in (404, 410) else 'NEEDS_REVIEW' if status == 200 else 'UNKNOWN',
            'publicationEligibility': 'NOT_ESTABLISHED'}

def candidate_counts(results):
    candidates = [r for r in results if r['kind'] == 'unpublished-candidate']
    return {'unpublishedCandidateRoutes': len(candidates),
            'candidateFailClosedObserved': sum(r['status'] in (404,410) for r in candidates),
            'candidateHttp200NeedsReview': sum(r['status'] == 200 for r in candidates),
            'candidateVisibilityUnknown': sum(r['status'] not in (200,404,410) for r in candidates)}

def load_targets():
    source = pathlib.Path('docs/publication-fourday-20261105/production/catalog.json')
    production = json.loads(source.read_text())
    prior = {r['slug']: r for r in json.loads(pathlib.Path('docs/calculator-first/hosted-rows.json').read_text())['rows']}
    rows = production['catalog']; assert len({r['slug'] for r in rows}) == len(rows)
    targets = [{'url': BASE + '/sitemap.xml', 'kind': 'sitemap'}, {'url': BASE + '/calculators', 'kind': 'discovery'}]
    for row in rows:
        old = prior.get(row['slug'])
        assert old and (old['calculator_key'], old['version']) == (row['calculator_key'], row['version']), 'Unknown route binding'
        assert all(re.fullmatch('[a-z0-9]+(?:-[a-z0-9]+)*', old[x]) for x in ('category','slug'))
        targets.append({'kind': 'engine', 'url': BASE + '/calculators/' + old['category'] + '/' + row['slug'], 'engineId': row['calculator_key'], 'slug': row['slug'], 'expectedVersion': row['version'], 'expectedTitle': old['title'], 'lifecycle': row['lifecycle'], 'routeBasis': 'prior hosted category; current production slug/key/version exact match'})
    published = {(r['calculator_key'], r['version']) for r in rows}
    candidates = json.loads(pathlib.Path('docs/full-product-batch21/candidates-17.json').read_text())['rows']
    assert len(candidates) == 17 and len({(r['engineId'],r['version']) for r in candidates}) == 17
    for candidate in candidates:
        if (candidate['engineId'],candidate['version']) in published: continue
        url = candidate['url']
        assert re.fullmatch(r'https://calcumint[.]com/calculators/[a-z0-9-]+/[a-z0-9-]+', url)
        assert url.endswith('/' + candidate['slug'])
        targets.append({'kind':'unpublished-candidate', 'url':url, 'engineId':candidate['engineId'], 'slug':candidate['slug'], 'expectedVersion':candidate['version'], 'routeBasis':'recorded 17 engine/version candidates; absent from current production tuples; no canonical ID approval'})
    assert len({t['url'] for t in targets}) == len(targets)
    return source, production, rows, targets

def bounded_timeout(value):
    seconds = int(value)
    if not 1 <= seconds <= 12: raise argparse.ArgumentTypeError('timeout must be 1..12 seconds')
    return seconds

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output', type=pathlib.Path, default=OUT/'observations.json')
    parser.add_argument('--request-timeout', type=bounded_timeout, default=12)
    args = parser.parse_args()
    source, production, rows, targets = load_targets()
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        results = list(pool.map(lambda target: probe(target, args.request_timeout), targets))
    engines = [r for r in results if r['kind'] == 'engine']
    summary = {'productionRows': len(rows), 'uniqueEngineRoutes': len(engines), 'engineHttp200': sum(r['status']==200 for r in engines), 'engineRenderVerified': sum(r['renderVerified'] for r in engines), 'engineOriginFailures': sum(r['status'] is not None and r['status']!=200 for r in engines), 'engineTransportUnknown': sum(r['status'] is None for r in engines), 'canonicalIdentityApproval': 'NOT_ESTABLISHED', 'releaseHold': True}
    summary.update(candidate_counts(results))
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps({'capturedAt': datetime.datetime.now(datetime.timezone.utc).isoformat(), 'productionSource': str(source), 'productionObservedAt': production.get('observed_at'), 'requestTimeoutSeconds': args.request_timeout, 'policy': 'GET only; four workers; bounded request timeout; 2MB response cap; no credentials; no form submissions; route availability cannot authorize canonical mapping or publication', 'summary': summary, 'rows': results}, indent=2)+'\n')
    print(json.dumps(summary))

if __name__ == '__main__': main()
