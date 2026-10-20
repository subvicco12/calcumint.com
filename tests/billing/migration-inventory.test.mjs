import assert from 'node:assert/strict';
import test from 'node:test';
import { inspectMigrationNames, inventoryRepositoryMigrations } from './migration-inventory.mjs';

test('repository inventory identifies known migration ordering ambiguity', async () => {
  const report = await inventoryRepositoryMigrations();
  assert.equal(report.countryMigration, true);
  for (const prefix of ['032','033','034','035']) {
    assert.equal(report.duplicatePrefixes.find(item => item.prefix === prefix)?.files.length, 2);
  }
  assert.match(report.reconciliation, /REVIEW_REQUIRED/);
});
test('missing country migration blocks reconciliation', () => {
  const report = inspectMigrationNames(['001_b3_accounts.sql','002_b4_billing.sql']);
  assert.equal(report.countryMigration, false);
  assert.match(report.reconciliation, /BLOCKED/);
});
test('non-SQL files are ignored and inventory is stable', () => {
  const report = inspectMigrationNames(['032_b.sql','README.md','032_a.sql','009_country_preferences.sql']);
  assert.deepEqual(report.duplicatePrefixes, [{ prefix:'032', files:['032_a.sql','032_b.sql'] }]);
});
