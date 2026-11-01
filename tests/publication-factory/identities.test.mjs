import test from 'node:test';
import assert from 'node:assert/strict';
import {loadEvidence, projectEvidence, paths, resolvePointer} from '../../scripts/publication-factory/identities.mjs';
const evidence = await loadEvidence();
const copy = () => structuredClone(evidence);
const mutate = change => {const input = copy(); change(input.documents); return () => projectEvidence(input);};
test('projects exact retained populations without approvals and preserves unpublished alternatives', () => {
  const result = projectEvidence(copy());
  assert.equal(result.identity.rows.length,150);
  assert.equal(result.identity.rows.filter(r => r.disposition === 'LIVE_VERIFIED').length,136);
  assert.equal(result.identity.ambiguityGroups.length,7);
  assert.equal(result.authority.rows.length,43);
  for (const row of result.identity.rows) {
    assert.equal(row.canonicalAccepted,false);
    assert.equal(row.canonicalMappingApproved,false);
    assert.equal(row.publicationEligibleEstablished,false);
    for (const candidate of row.candidates) for (const pointer of Object.values(candidate.evidence)) if (pointer) assert(resolvePointer(evidence.documents,pointer));
  }
  for (const id of [377,510]) {
    const row = result.identity.rows.find(r => r.masterId === id);
    assert.equal(row.disposition,'LIVE_VERIFIED');
    assert.equal(row.candidates.filter(c => c.liveVerified).length,1);
    assert.equal(row.candidates.filter(c => c.lifecycle === 'UNPUBLISHED_ABSENT').length,1);
  }
  assert.deepEqual(result.authority.rows.map(packet => {const row = {...packet}; delete row.evidenceStatus; return row;}),evidence.documents[paths.authority].rows);
});
test('rejects deleted or altered additional retained qualified obligation', () => {
  for (const alteration of ['delete','alter']) assert.throws(mutate(d => {
    const row = d[paths.authority].rows.find(r => r.masterId === 405);
    if (alteration === 'delete') delete row.retainedQualifiedReview;
    else row.retainedQualifiedReview.question = 'No review needed';
  }), /qualified obligation/);
});
test('rejects deletion of original-case qualified obligation outside additional eleven', () => {
  assert.throws(mutate(d => {d[paths.authority].rows[0].retainedQualifiedReview.question = '';}), /qualified obligation/);
});
test('rejects wrong43 membership even when row count remains43', () => {
  assert.throws(mutate(d => {d[paths.authority].rows[0].masterId = 10;}), /Wrong43 membership/);
});
test('rejects broken and valid-but-wrong evidence pointers', () => {
  assert.throws(mutate(d => {d[paths.authority].rows[0].currentEvidencePointer = paths.original+'#/rows/999';}), /Unresolved pointer/);
  assert.throws(mutate(d => {d[paths.authority].rows[0].currentEvidencePointer = paths.original+'#/rows/1';}), /case identity drift/);
});
test('rejects hosted, registry and displayed immutable version drift', () => {
  for (const key of ['hosted','registry','routes']) assert.throws(mutate(d => {
    const slug = d[paths.readiness].rows.find(r => r.disposition === 'LIVE_VERIFIED').candidates.find(c => c.liveVerified).slug;
    const row = d[paths[key]].rows.find(r => r.slug === slug);
    row[key === 'routes' ? 'displayedVersion' : 'version'] += 1;
  }), /version drift/);
});
test('rejects duplicate slugs and contradictory URLs', () => {
  assert.throws(mutate(d => {d[paths.hosted].rows.push(d[paths.hosted].rows[0]);}), /duplicate/);
  assert.throws(mutate(d => {
    const slug = d[paths.readiness].rows.find(r => r.disposition === 'LIVE_VERIFIED').candidates.find(c => c.liveVerified).slug;
    d[paths.routes].rows.find(r => r.slug === slug).url += '-wrong';
  }), /URL drift/);
});
test('rejects source hash drift', () => {
  const input = copy();
  const file = Object.keys(input.documents[paths.authority].sourceHashes)[0];
  input.hashes[file] = '0'.repeat(64);
  assert.throws(() => projectEvidence(input), /Source hash drift/);
});
