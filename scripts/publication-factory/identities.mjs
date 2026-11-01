// Offline projection of existing evidence. No runtime, network or publication APIs.
import {readFile, writeFile, mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';

const base = 'docs/calculator-first/';
export const paths = {
  readiness: base + 'publication-readiness-540.json',
  registry: base + 'registry-snapshot.json',
  hosted: base + 'hosted-rows.json',
  routes: base + 'browser-route-observations.json',
  unpublished: base + 'unpublished-route-observations.json',
  authority: 'docs/full-product-batch16/authority-requests-43.json',
  current: 'docs/full-product-batch22/publication-readiness-540.json',
  original: 'docs/authority485/research-input/resolution-register-43.json',
  qualified: 'docs/authority485/research-input/retained-qualified-requirements-11.json',
};
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const unknownIds = [222,277,308,367,380,403,482,483,490,492,511,525,538,540];
const authorityIds = [9,19,20,23,34,48,87,92,95,97,98,112,120,121,122,123,124,128,129,130,131,132,135,136,137,173,198,199,204,404,405,406,407,408,409,410,442,485,502,522,526,527,530];
const groups = [[222,308],[277,511],[367,483],[380,482],[403,525],[490,538],[492,540]];
const sorted = ids => [...ids].sort((a,b) => a-b);
const unique = (rows, key, label) => {
  const map = new Map();
  for (const [index,row] of rows.entries()) {
    const value = row[key];
    assert(value !== undefined && !map.has(value), `${label}: duplicate/missing ${key} ${value}`);
    map.set(value,{row,index});
  }
  return map;
};
export function resolvePointer(documents, pointer) {
  assert.equal(typeof pointer,'string','Missing evidence pointer');
  const [file,fragment = ''] = pointer.split('#');
  assert(Object.hasOwn(documents,file),`Missing evidence file ${file}`);
  assert(fragment === '' || fragment.startsWith('/'),`Invalid pointer ${pointer}`);
  let value = documents[file];
  for (const token of fragment ? fragment.slice(1).split('/') : []) {
    const key = token.replaceAll('~1','/').replaceAll('~0','~');
    assert(value !== null && typeof value === 'object' && Object.hasOwn(value,key),`Unresolved pointer ${pointer}`);
    value = value[key];
  }
  return value;
}
function references(value) {
  if (typeof value === 'string') return value.startsWith('docs/') && value.includes('#/') ? [value] : [];
  if (!value || typeof value !== 'object') return [];
  return Object.values(value).flatMap(references);
}
export async function loadEvidence() {
  const documents = {}, hashes = {};
  const queue = Object.values(paths);
  while (queue.length) {
    const file = queue.shift();
    if (Object.hasOwn(documents,file)) continue;
    assert(file.startsWith('docs/') && !file.includes('..'),`Invalid evidence path ${file}`);
    const bytes = await readFile(file);
    hashes[file] = sha(bytes);
    documents[file] = JSON.parse(bytes);
    // Follow only the declared source hashes and exact pointer files of inputs.
    if (Object.values(paths).includes(file)) {
      queue.push(...Object.keys(documents[file].sourceHashes ?? {}));
      queue.push(...references(documents[file]).map(p => p.split('#')[0]));
    }
  }
  return {documents,hashes};
}
export function projectEvidence({documents,hashes}) {
  const get = key => documents[paths[key]];
  for (const file of Object.values(paths)) {
    assert(documents[file],`Missing input ${file}`);
    for (const [source,expected] of Object.entries(documents[file].sourceHashes ?? {})) {
      assert.equal(hashes[source],expected,`Source hash drift: ${source}`);
    }
  }
  const readiness = get('readiness');
  const all = unique(readiness.rows,'masterId','readiness');
  assert.equal(all.size,540);
  const selected = readiness.rows.filter(r => ['LIVE_VERIFIED','UNKNOWN'].includes(r.disposition));
  assert.equal(selected.filter(r => r.disposition === 'LIVE_VERIFIED').length,136);
  assert.deepEqual(selected.filter(r => r.disposition === 'UNKNOWN').map(r => r.masterId),unknownIds);
  const registry = unique(get('registry').rows,'slug','registry');
  unique(get('registry').rows,'engineId','registry engine');
  const hosted = unique(get('hosted').rows,'slug','hosted');
  unique(get('hosted').rows,'calculator_key','hosted engine');
  const route = unique([...get('routes').rows,...get('unpublished').rows],'slug','route');
  const rows = selected.map(row => {
    assert.equal(row.canonicalAccepted,false);
    assert.equal(row.canonicalMappingApproved,false);
    assert.equal(row.eligibleToPublish,false);
    assert.equal(row.activationAuthorized,false);
    const requirements = resolvePointer(documents,row.requirementEvidencePointer);
    assert.equal(requirements.masterId,row.masterId,'Requirement identity drift');
    const candidates = row.candidates.map(candidate => {
      const local = registry.get(candidate.slug);
      assert(local,`Missing registry ${candidate.slug}`);
      assert.equal(local.row.engineId,candidate.engineId,'Registry engine drift');
      assert.equal(local.row.version,candidate.version,'Registry version drift');
      assert.equal(candidate.proposedUrl,'https://calcumint.com'+local.row.route,'Registry URL drift');
      assert.equal(candidate.canonicalMappingApproved,false);
      assert.equal(candidate.exactCurrentBinding,true);
      const titleMatches = local.row.title.toLowerCase() === row.title.toLowerCase();
      assert.equal(candidate.identityCandidate,titleMatches,'Candidate title identity drift');
      const host = hosted.get(candidate.slug);
      const observed = route.get(candidate.slug);
      if (host) {
        assert.equal(host.row.calculator_key,candidate.engineId,'Hosted engine drift');
        assert.equal(host.row.version,candidate.version,'Hosted version drift');
        assert.equal(host.row.lifecycle,candidate.lifecycle,'Hosted lifecycle drift');
        assert.equal(candidate.hostedIdentityMatches,true);
      } else {
        assert.equal(candidate.lifecycle,'UNPUBLISHED_ABSENT');
        assert.equal(candidate.hostedIdentityMatches,false);
      }
      if (observed) {
        assert.equal(observed.row.url,candidate.proposedUrl,'Observed URL drift');
        assert.equal(observed.row.status,candidate.httpStatus,'Observed HTTP drift');
        if (observed.row.status === 200) {
          assert(host,'200 candidate must have hosted identity');
          assert.equal(observed.row.displayedVersion,candidate.version,'Displayed version drift');
          assert.equal(candidate.observedUrl,observed.row.url);
          assert.equal(candidate.displayedVersion,candidate.version);
          assert.equal(observed.row.canonical,observed.row.url,'Canonical URL drift');
          assert.equal(observed.row.finalUrl,observed.row.url,'Final URL drift');
          assert.equal(observed.row.h1,local.row.title,'Displayed title drift');
          assert.equal(host.row.title,local.row.title,'Hosted title drift');
          assert(observed.row.inputControls > 0,'Missing observed input controls');
        }
      } else {
        assert.equal(candidate.httpStatus,null);
        assert.equal(candidate.observedUrl,null);
        assert.equal(candidate.displayedVersion,null);
      }
      const expectedShared = readiness.rows.filter(r => r.candidates.some(c => c.identityCandidate && c.engineId === candidate.engineId && c.version === candidate.version)).map(r => r.masterId);
      assert.deepEqual(candidate.sharedCatalogIds,expectedShared,'Shared native identity drift');
      const live = candidate.lifecycle === 'published' && candidate.httpStatus === 200 && candidate.sharedCatalogIds.length === 1 && candidate.identityCandidate;
      assert.equal(candidate.liveVerified,live,'Observed binding classification drift');
      return {...candidate,evidence:{candidate:`${paths.readiness}#/rows/${all.get(row.masterId).index}/candidates/${row.candidates.indexOf(candidate)}`,registry:`${paths.registry}#/rows/${local.index}`,hosted:host ? `${paths.hosted}#/rows/${host.index}` : null,route:observed ? `${get('routes').rows.includes(observed.row) ? paths.routes : paths.unpublished}#/rows/${get('routes').rows.includes(observed.row) ? get('routes').rows.indexOf(observed.row) : get('unpublished').rows.indexOf(observed.row)}` : null}};
    });
    if (row.disposition === 'LIVE_VERIFIED') assert.equal(candidates.filter(c => c.liveVerified).length,1);
    else assert(candidates.every(c => c.sharedCatalogIds.length > 1),'Unknown must preserve shared identity blocker');
    return {masterId:row.masterId,title:row.title,disposition:row.disposition,canonicalAccepted:false,canonicalMappingApproved:false,publicationEligibleEstablished:false,requirementEvidencePointer:row.requirementEvidencePointer,candidates};
  });
  const packets = get('authority');
  const original = unique(get('original').rows,'masterId','original authority');
  const qualified = unique(get('qualified').rows,'masterId','qualified');
  unique(packets.rows,'masterId','authority packet');
  assert.deepEqual(sorted(packets.rows.map(r => r.masterId)),authorityIds,'Wrong43 membership');
  assert.deepEqual(sorted([...original.keys()]),authorityIds,'Original43 membership drift');
  assert.deepEqual(sorted(get('current').rows.filter(r => r.publicationDispositionAfter === 'AUTHORITY_BLOCKED').map(r => r.masterId)),authorityIds,'Current43 membership drift');
  const authority = packets.rows.map(row => {
    assert.equal(row.fullProductStatus,'BLOCKED');
    assert.equal(row.canonicalAccepted,false);
    assert.equal(row.releaseHold,true);
    assert.equal(row.historicalDependenciesAreNotAutomaticallyActiveBlockers,true);
    assert.deepEqual(resolvePointer(documents,row.originalRegister),original.get(row.masterId).row,'Wrong original case pointer');
    for (const pointer of references(row)) {
      const target = resolvePointer(documents,pointer);
      if (target && typeof target === 'object' && Object.hasOwn(target,'masterId')) assert.equal(target.masterId,row.masterId,'Evidence case identity drift');
    }
    assert(row.retainedQualifiedReview?.question,'Missing qualified obligation');
    const retained = qualified.get(row.masterId);
    if (retained) {
      assert.equal(row.retainedQualifiedReview.question,retained.row.qualifiedReviewRequirement,'Omitted/altered qualified obligation');
      assert.deepEqual(resolvePointer(documents,row.retainedQualifiedReview.evidence),retained.row,'Wrong qualified case pointer');
    } else {
      assert.equal(row.retainedQualifiedReview.question,'Preserve the exact applicability and retained-review obligations in the original case; absence from the additional retained11 register is not an exemption.','Omitted original qualified obligation');
      assert.equal(row.retainedQualifiedReview.evidence,row.originalRegister);
    }
    assert(row.requestedReturn?.qualifiedReview,'Missing named qualified decision request');
    assert(row.requestedReturn?.publisherProvider,'Missing publisher request');
    assert(row.requestedReturn?.scopeMapping,'Missing exact mapping request');
    return {...row,evidenceStatus:{canonicalDecision:'NOT_ESTABLISHED',qualifiedDecision:'NOT_ESTABLISHED',publisherEvidence:'RETAIN_CASE_SPECIFIC_EXISTING_LIMITS',authorityBlockRetained:true}};
  });
  const sourceHashes = Object.fromEntries(Object.entries(hashes).sort(([a],[b]) => a.localeCompare(b)));
  const common = {schemaVersion:1,kind:'OFFLINE_EXISTING_EVIDENCE_PROJECTION_NOT_APPROVAL',sourceHashes,releaseHold:true,productionWrites:false,canonicalPromotion:false};
  return {
    identity:{...common,summary:{observedLegacyBindings:136,ambiguousIdentities:14,ambiguityGroups:7,newlyApprovedMappings:0},ambiguityGroups:groups.map(ids => ({masterIds:ids,blocker:'SHARED_NATIVE_IDENTITY_REQUIRES_EXPLICIT_CANONICAL_DECISION'})),meaning:'Existing observations only. IDs377/510 retain one published binding and an unpublished alternative; neither observation grants canonical approval.',rows},
    authority:{...common,summary:{authorityBlocks:43,additionalRetainedQualifiedCases:qualified.size,newlyApprovedMappings:0},meaning:'Exact existing packets retained. Current prerequisites, historical dependencies and deferred branches remain distinct. No named qualified approval or publisher-byte authenticity is inferred.',rows:authority},
  };
}
export async function main(check = process.argv.includes('--check')) {
  const result = projectEvidence(await loadEvidence());
  const outputs = {'docs/publication-factory/identity-reconciliation.json':result.identity,'docs/publication-factory/authority-action-packets.json':result.authority};
  if (!check) await mkdir('docs/publication-factory',{recursive:true});
  for (const [file,data] of Object.entries(outputs)) {
    const text = JSON.stringify(data,null,2)+'\n';
    if (check) assert.equal(await readFile(file,'utf8'),text,`Projection drift: ${file}`);
    else await writeFile(file,text);
  }
  console.log(JSON.stringify({identity:result.identity.summary,authority:result.authority.summary}));
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main();
