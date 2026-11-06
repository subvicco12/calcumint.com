"""Bounded read-only evidence for the selected20 only. Never release authority."""
import argparse, concurrent.futures, datetime, hashlib, importlib.util, json, os, pathlib, subprocess, sys
spec=importlib.util.spec_from_file_location('publication_probe', 'tests/publication-fourday/routes/probe.py')
probe=importlib.util.module_from_spec(spec);spec.loader.exec_module(probe)
SOURCE=pathlib.Path('docs/shortest-publication-20/selected-20.json')
def targets():
    rows=json.loads(SOURCE.read_text())['rows']
    result=[{'kind':'unpublished-candidate','url':r['candidateUrl'],'catalogId':r['catalogId'],'engineId':r['engineId'],'expectedVersion':r['version']} for r in rows]
    if len(result)!=20 or len({r['url'] for r in result})!=20:raise ValueError('Exact20 unique URLs required')
    for r in result:
        if not r['url'].startswith('https://calcumint.com/calculators/') or '?' in r['url'] or '#' in r['url']:raise ValueError('Invalid public target')
    return result+[{'kind':'sitemap','url':'https://calcumint.com/sitemap.xml'},{'kind':'discovery','url':'https://calcumint.com/calculators'}]
def unknown(ts,reason):
    return {'captureStatus':'UNKNOWN','reason':reason,'rows':[dict(t,method='GET',status=None,visibilityDisposition='UNKNOWN') for t in ts], 'releaseHold':True,'publicationEligibility':'NOT_ESTABLISHED'}
def child(ts):
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:rows=list(pool.map(lambda t:probe.probe(t,3),ts))
    candidates=[r for r in rows if r['kind']=='unpublished-candidate']
    return {'captureStatus':'OBSERVED_WITH_EXPLICIT_UNKNOWNS','capturedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'rows':rows,'summary':probe.candidate_counts(candidates),'releaseHold':True,'publicationEligibility':'NOT_ESTABLISHED'}
def valid(data,ts):
    if not isinstance(data,dict) or data.get('captureStatus')!='OBSERVED_WITH_EXPLICIT_UNKNOWNS' or data.get('releaseHold') is not True or data.get('publicationEligibility')!='NOT_ESTABLISHED':return False
    rows=data.get('rows');expected={t['url']:t for t in ts}
    if not isinstance(rows,list) or len(rows)!=len(ts) or any(not isinstance(r,dict) for r in rows):return False
    if len({r.get('url') for r in rows})!=len(ts):return False
    for row in rows:
        target=expected.get(row.get('url'))
        if not target or any(row.get(k)!=v for k,v in target.items()) or row.get('method')!='GET':return False
        if row.get('evidenceScope')!=probe.EVIDENCE_SCOPE or row.get('inputControlConvention')!=probe.CONTROL_CONVENTION:return False
        if target['kind']=='unpublished-candidate' and row.get('canonicalIdentityApproval')!='NOT_ESTABLISHED_BY_ROUTE_PROBE':return False
        if 'status' not in row:return False
        status=row.get('status')
        if status is not None and (type(status) is not int or not 100<=status<=599):return False
        if target['kind']=='unpublished-candidate' and any(row.get(k)!=v for k,v in probe.candidate_visibility(status).items()):return False
    return data.get('summary')==probe.candidate_counts(rows)
def capture(output,runner=subprocess.run):
    ts=targets();data=unknown(ts,'Capture has not completed')
    output.parent.mkdir(parents=True,exist_ok=True)
    output.write_text(json.dumps(data,indent=2)+'\n')
    try:
        result=runner([sys.executable,__file__,'--child'],capture_output=True,text=True,timeout=60,check=False)
        candidate=json.loads(result.stdout) if result.returncode==0 else None
        data=candidate if valid(candidate,ts) else unknown(ts,'Invalid or failed child capture')
    except (subprocess.TimeoutExpired,ValueError,TypeError,OSError):data=unknown(ts,'Child timeout or unreadable capture')
    data['selectionSHA256']=hashlib.sha256(SOURCE.read_bytes()).hexdigest()
    data['executionHeadSHA']=os.environ.get('AUDIT_HEAD_SHA','UNKNOWN')
    output.write_text(json.dumps(data,indent=2)+'\n');return data
if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--child',action='store_true');parser.add_argument('--output',type=pathlib.Path);args=parser.parse_args()
    if args.child:print(json.dumps(child(targets())))
    else:
        if args.output is None:parser.error('--output required')
        root=pathlib.Path(os.environ.get('RUNNER_TEMP','/tmp')).resolve();out=args.output.resolve()
        if not out.is_relative_to(root):parser.error('Output must be inside runner temporary directory')
        capture(out)
