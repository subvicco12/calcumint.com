import test from 'node:test';
import assert from 'node:assert/strict';
import { compareMigrationFingerprints, MIGRATION_FINGERPRINT_EVIDENCE, stripLineComments } from './migration-fingerprints.mjs';

test('recorded ledger fingerprints have valid SHA-256 syntax', () => {
  for (const entry of MIGRATION_FINGERPRINT_EVIDENCE) assert.match(entry.sha256,/^[0-9a-f]{64}$/);
});
test('comparison classifies each repository file without claiming schema equivalence', async () => {
  const rows = await compareMigrationFingerprints();
  assert.equal(rows.length, 4);
  for (const row of rows) console.log('Migration fingerprint:', row.name, row.status, row.repositorySha256, row.commentStrippedSha256, row.ledgerSha256);
  for (const row of rows) assert.ok(['EXACT_MATCH','COMMENT_STRIPPED_MATCH','UNRESOLVED_DIFFERENCE'].includes(row.status));
});

test('comment removal strips comment lines without altering SQL statements', () => {
  assert.equal(stripLineComments('-- explanation\nselect 1;\n  -- detail\nselect 2;'), 'select 1;\nselect 2;');
});
