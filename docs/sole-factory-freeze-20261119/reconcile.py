"""Regenerate the Day 5 evidence projection from immutable Git objects."""
from __future__ import annotations

import argparse
import collections
import hashlib
import json
import subprocess
from pathlib import Path

PARENT = '5ff9d515af3cf4187087452e0e07ad8e607e7690'
FROZEN = '49ea243b5be7e1ee9f3cd8af7f936ab784402cf7'
LEDGER = 'docs/publication540-shared/catalog/reconciliation-540.json'
REQUIREMENTS = 'docs/full-product-batch16/requirements-540.json'
QUEUE = 'docs/sole-final-factory-20261119/adoption-queue.json'
REFERENCE_PROFILES = {240, 244, 245, 450, 534}
AUTHORITY_DIR = 'docs/worker3-food-quantity-20261119'
FACTORY_DELTA_REF = {
    'sole-final-factory-20261119': 'sole/final-factory-day1-20261119',
    'sole-structured-factory-20261119': 'sole/final-factory-day2-20261119',
    'sole-specialized-factory-20261119': 'sole/final-factory-day3-20261119',
    'sole-verified-delivery-20261119': 'sole/final-factory-day4-20261119',
}

def main():
    args = argparse.ArgumentParser(description=__doc__)
    args.add_argument('--repository', required=True)
    args.add_argument('--input-dir', type=Path, default=Path(__file__).resolve().parent)
    args.add_argument('--output-dir', type=Path, default=Path(__file__).resolve().parent)
    opts = args.parse_args()
    def git(*parts):
        return subprocess.check_output(['git', '-C', opts.repository, *parts])
    def blob(commit, path):
        return git('show', f'{commit}:{path}')
    def pin(commit, path, data):
        return {'commit': commit, 'path': path, 'sha256': hashlib.sha256(data).hexdigest(), 'bytes': len(data)}
    def read(commit, path):
        return json.loads(blob(commit, path))
    refs = dict((ref, sha) for sha, ref in map(str.split, (opts.input_dir / 'retained-refs.tsv').read_text().splitlines()))
    assert refs['refs/pull/1538/head'] == FROZEN
    assert refs['refs/heads/sole/final-factory-day4-20261119'] == PARENT
    for sha in set(refs.values()):
        assert git('cat-file', '-t', sha).strip() == b'commit'
    assert blob(FROZEN, LEDGER) == blob(PARENT, LEDGER)
    ledger_data = blob(PARENT, LEDGER)
    catalog = json.loads(ledger_data)
    assert [row['masterId'] for row in catalog['rows']] == list(range(1, 541))
    registry_path='src/lib/calculator-factory/registry.ts'
    assert blob(FROZEN,registry_path) == blob(PARENT,registry_path)
    source_requirements = {row['masterId']: row for row in read(PARENT, REQUIREMENTS)['rows']}
    evidence = collections.defaultdict(list)
    attachments = []
    factory_ids = set()
    paths = git('ls-tree', '-r', '--name-only', PARENT, 'docs').decode().splitlines()
    for path in paths:
        if not path.startswith('docs/sole-') or not path.endswith('/ledger-evidence-delta.json'):
            continue
        namespace = path.split('/')[1]
        ref = 'refs/heads/' + FACTORY_DELTA_REF.get(namespace, namespace.replace('sole-', 'sole/', 1))
        sha = refs[ref]
        payload = blob(sha, path)
        assert payload == blob(PARENT,path)
        delta = json.loads(payload)
        assert delta['qualificationPromotions'] == 0
        attachments.append(pin(sha,path,payload))
        for record in delta['records']:
            identity = record['catalogId']
            pointer = dict(record['implementation'])
            if pointer['commit'] == 'SELF':
                pointer['commit'] = sha
            artifact = blob(pointer['commit'],pointer['path'])
            receipt = record['nativeAcceptance']
            receipt_commit = sha if receipt['commit']=='SELF' else receipt['commit']
            item = {'kind':'exact-private-delta','implementation':pin(pointer['commit'],pointer['path'],artifact),
                    'acceptance':pin(receipt_commit,receipt['path'],blob(receipt_commit,receipt['path']))}
            evidence[identity].append(item)
            if namespace in FACTORY_DELTA_REF:
                factory_ids.add(identity)
    roster_commit=refs['refs/heads/engineering/worker3-food-quantity-20261119']
    roster_path=f'{AUTHORITY_DIR}/exclusions.json'
    roster=read(roster_commit,roster_path)
    scoped=set(roster['scopedIds'])
    worker_isolated=set(roster['isolatedIds'])
    assert len(scoped)==111 and len(worker_isolated)==57
    receipt_refs=[]
    receipt_consumed=set()
    native_by_id=collections.defaultdict(list)
    for ref,sha in refs.items():
        branch=ref.rsplit('/',1)[-1]
        if not (branch.startswith('worker') or '/sole/' in ref or '/worker1/' in ref):
            continue
        namespace='sole-'+branch if '/sole/' in ref else branch
        if '/sole/final-factory-day' in ref:
            namespace=next(key for key,value in FACTORY_DELTA_REF.items() if ref.endswith('/'+value))
        selected={
            'physics-mechanics-20261118':['docs/worker1-mechanics-20261118/receipt.json','docs/worker1-mechanics-20261118/remediation-browser-receipt.json'],
            'physics-waves-circuits-20261118':['docs/worker1-waves-circuits-20261118/native-receipt.json'],
            'calendar-20261119':['docs/worker1-calendar-20261119/native-receipt.json'],
            'food-ratios-20261119':['docs/worker1-food-ratios-20261119/native-receipt.json'],
        }.get(branch,[f'docs/{namespace}/native-receipt.json',f'docs/{namespace}/accepted/receipt.json',f'tests/{namespace}/native/receipt.json'])
        available=set(git('ls-tree','-r','--name-only',sha,'docs','tests').decode().splitlines())
        for path in selected:
            if path not in available:
                continue
            payload=blob(sha,path)
            marker=(path,hashlib.sha256(payload).hexdigest())
            if marker in receipt_consumed:
                continue
            receipt_consumed.add(marker)
            doc=json.loads(payload)
            rows=doc.get('rows',[])
            item=pin(sha,path,payload)
            receipt_refs.append({**item,'passed':doc.get('passed'),'journeys':len(rows),'exportReadbacks':len(doc.get('downloads',[]))})
            if doc.get('passed') is not True or doc.get('productionWrites') is not False:
                continue
            plans=collections.defaultdict(set)
            for row in rows:
                key=row.get('id',row.get('catalogId'))
                if type(key) is int and 1<=key<=540:
                    plans[key].add(row.get('plan'))
            for identity,coverage in plans.items():
                if coverage >= {'free','pro','business'}:
                    reference_only='day2-20261119' in ref and identity in REFERENCE_PROFILES
                    selected_duplicate='food-ratios' in ref and identity in {504,505}
                    native_by_id[identity].append({**item,'referenceOnly':reference_only,'independentDuplicate':selected_duplicate})
    for id in (504,505):
        assert {e['implementation']['commit'] for e in evidence[id]} == {roster_commit}
    observation=json.loads((opts.input_dir/'frozen-registry-observation.json').read_text())
    assert observation['commit']==FROZEN
    for path,digest in observation['sourceSha256'].items():
        assert hashlib.sha256(blob(FROZEN,path)).hexdigest()==digest,path
    integrated={row['catalogId']:row for row in observation['factory']}
    assert len(integrated)==len(observation['factory'])==111
    frozen_registry=read(PARENT,QUEUE)
    candidate_map={row['id']:row for row in frozen_registry['rows']}
    rows=[]
    for row in catalog['rows']:
        id=row['masterId']
        proposals=row['candidates']
        scoped_items=evidence[id]
        selected={x['implementation']['commit']+':'+x['implementation']['path'] for x in scoped_items}
        assert len(selected)<=1, (id,selected)
        pinned_native=native_by_id[id]
        native_exact=any(not x['referenceOnly'] and not x['independentDuplicate'] for x in pinned_native)
        acceptance_status='PINNED_NATIVE_THREE_PLAN_RECEIPT' if native_exact else 'PINNED_DELTA_ONLY' if scoped_items else 'RETAINED_WORKER_ROSTER_ONLY' if id in worker_isolated else 'UNESTABLISHED'
        requirements=source_requirements[id]['requirements']
        missing=[{'id':x['requirementId'],'status':x['status']} for x in requirements if x['status']!='VERIFIED']
        # Publication observations are retained historical facts for candidate tuples.
        rows.append({'id':id,'title':row['title'],'domain':row['domain'],'sourcePointer':row['catalogSourcePointer'],
            'registeredCandidates':[{'engineId':c['engineId'],'version':c['version'],'slug':c['slug'],'exact':c['registryExactTuple'],
              'reviewLabel':c['codeReviewStatus'],'historicalLifecycle':c['lifecycle'],'historicalRouteObserved':c['liveVerified']} for c in proposals],
            'sourceLocations':candidate_map[id]['sourceLocations'],
            'implementationEvidence':row['implementationEvidenceLabel'],
            'authoritativePrivateImplementation':scoped_items[0]['implementation'] if scoped_items else None,
            'frozenSharedFactoryBinding':integrated.get(id),
            'canonicalMappingApproved':row['canonicalMappingApproved'],
            'fullCanonicalImplementationEstablished':row['fullCanonicalImplementationEstablished'],
            'factorySprintAdoption':id in factory_ids,
            'workflowEvidenceScope':'PRIVATE_FINAL_HISTORY_SCENARIOS_REPLAY_BATCH_EXPORTS' if scoped_items else 'SEE_RETAINED_PER_ID_EVIDENCE',
            'exactIdEvidence':scoped_items,'nativeReceipts':pinned_native,'isolatedAcceptance':acceptance_status,
            'scopedQualification':'RETAINED_111' if id in scoped else 'NOT_PROMOTED',
            'businessDelivery':'EXACT_CAPABILITY_APPLICABILITY_AND_ADOPTION_PENDING' if scoped_items else 'SEE_RETAINED_CONTRACT_AND_POLICY',
            'authorityBlockers':row['blockers'],'sourcePrecisionQA':missing,
            'demonstratedLegacyDefects':row['demonstratedLegacyDefects']})
    registered={ (c['engineId'],c['slug'],c['version']):c for row in catalog['rows'] for c in row['candidates'] if c['registryExactTuple']}
    hosted={c['hostedExactTuple']['id']:c['hostedExactTuple'] for row in catalog['rows'] for c in row['candidates'] if c.get('hostedExactTuple')}
    summary={
        'canonicalRows':len(rows),'baselineImplementationEvidence':dict(collections.Counter(x['implementationEvidence'] for x in rows)),
        'canonicalFullImplementationEstablished':sum(bool(row['fullCanonicalImplementationEstablished']) for row in rows),
        'canonicalMappingsApproved':sum(bool(row['canonicalMappingApproved']) for row in rows),
        'hasExactPrivateDelta':len([x for x in rows if x['exactIdEvidence']]),
        'factorySprintAdoption':len(factory_ids),'scopedQualifiedRetained':len(scoped),'isolatedWorkerRoster':len(worker_isolated),
        'workerRosterOverlapWithScoped':len(worker_isolated&scoped),
        'isolatedEvidenceStatus':dict(collections.Counter(x['isolatedAcceptance'] for x in rows)),
        'nativeEvidenceOutsideRetainedScoped':sum(x['isolatedAcceptance']=='PINNED_NATIVE_THREE_PLAN_RECEIPT' and x['id'] not in scoped for x in rows),
        'historicalHostedEngineTuples':catalog['summary']['hostedSnapshotPublishedTuples'],
        'historicalCatalogCandidateAssociations':catalog['summary']['catalogIdsWithHostedCandidate'],
        'retainedCandidateRegistryCodeLabels':dict(collections.Counter(c['codeReviewStatus'] for c in registered.values())),
        'historicalLinkedHostedCertificationValues':dict(collections.Counter(str(c.get('certification')) for c in hosted.values())),
        'newScopedQualified':0,'newCertifications':0,'newPublications':0,
        'canonicalPublicationEligibleEstablished':catalog['summary']['fullyPublicationEligibleEstablished'],
        'frozenSharedFactoryProfiles':len(integrated),'scopedAndFrozenSharedFactoryOverlap':len(scoped & integrated.keys()),
        'sourceRefsVerified':len(refs),'immutableEvidenceDeltasAttached':len(attachments),
    }
    assert summary['factorySprintAdoption']==11
    assert sum(summary['isolatedEvidenceStatus'].values())==540
    output={'kind':'read-only-freeze-projection','canonicalLedger':pin(PARENT,LEDGER,ledger_data),'frozenPRHead':FROZEN,'isolatedParent':PARENT,
        'frozenPrivateFactoryRegistryPin':pin(FROZEN,registry_path,blob(FROZEN,registry_path)),
        'historicalRequirementPin':pin(PARENT,REQUIREMENTS,blob(PARENT,REQUIREMENTS)),
        'roster':pin(roster_commit,roster_path,blob(roster_commit,roster_path)),
        'summary':summary,'exactIdDeltaPins':attachments,'branchReceiptPins':receipt_refs,
        'authority43':[row['id'] for row in rows if 'RETAINED_AUTHORITY43' in row['authorityBlockers']],
        'demonstratedDefects':[{'id':row['id'],'defects':row['demonstratedLegacyDefects']} for row in rows if row['demonstratedLegacyDefects']],
        'rows':rows,'releaseHold':True,'centralIntegration':'NO_GO','publication':'NO_GO'}
    assert len(output['authority43'])==43
    opts.output_dir.mkdir(parents=True,exist_ok=True)
    (opts.output_dir/'freeze-projection.json').write_text(json.dumps(output,indent=2)+'\n')
    print(json.dumps(summary,indent=2))

if __name__=='__main__':
    main()
