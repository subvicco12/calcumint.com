import assert from 'node:assert/strict';
import test from 'node:test';
import { ACCOUNT_SCHEMA_PREFLIGHT_SQL, assessAccountSchemaPreflight } from './account-schema-preflight.mjs';

const complete = {
  preferences_table_present: true,
  country_code_present: true,
  display_name_present: true
};

test('preflight query is read-only and targets authoritative catalogs', () => {
  assert.match(ACCOUNT_SCHEMA_PREFLIGHT_SQL, /information_schema\.columns/);
  assert.match(ACCOUNT_SCHEMA_PREFLIGHT_SQL, /country_code/);
  assert.doesNotMatch(ACCOUNT_SCHEMA_PREFLIGHT_SQL, /\b(ALTER|UPDATE|DELETE|INSERT|DROP|CREATE|TRUNCATE)\b/i);
});
test('complete schema and recorded migration pass', () => {
  assert.deepEqual(assessAccountSchemaPreflight(complete, 'recorded'), { ready: true, blockers: [] });
});
test('verified equivalent deployment requires explicit evidence', () => {
  assert.equal(assessAccountSchemaPreflight(complete, 'verified-equivalent').ready, true);
  assert.equal(assessAccountSchemaPreflight(complete, 'unknown').ready, false);
});
test('production-shaped missing country_code fails closed', () => {
  const result = assessAccountSchemaPreflight({ ...complete, country_code_present: false }, 'unknown');
  assert.equal(result.ready, false);
  assert.ok(result.blockers.some(x => x.includes('country_code')));
  assert.ok(result.blockers.some(x => x.includes('history')));
});
test('missing table or display_name fails closed', () => {
  assert.equal(assessAccountSchemaPreflight({ ...complete, preferences_table_present: false }, 'recorded').ready, false);
  assert.equal(assessAccountSchemaPreflight({ ...complete, display_name_present: false }, 'recorded').ready, false);
  assert.equal(assessAccountSchemaPreflight(null, null).ready, false);
});
