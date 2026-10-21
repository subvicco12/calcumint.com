import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { ACCOUNT_SCHEMA_PREFLIGHT_SQL, assessAccountSchemaPreflight, runAccountSchemaPreflight } from './account-schema-preflight.mjs';

const expected = JSON.parse(readFileSync(new URL('./account-schema-contract.json',import.meta.url),'utf8'));
const complete = {
  preferences_table_present: true, country_code_present: true, display_name_present: true,
  metadata_accessible: true, contract: expected
};

test('preflight query is read-only and targets authoritative PostgreSQL catalogs', () => {
  assert.match(ACCOUNT_SCHEMA_PREFLIGHT_SQL, /pg_catalog\.pg_attribute/);
  assert.match(ACCOUNT_SCHEMA_PREFLIGHT_SQL, /country_code/);
  assert.doesNotMatch(ACCOUNT_SCHEMA_PREFLIGHT_SQL, /\b(ALTER|DELETE|DROP|CREATE|TRUNCATE)\s+(TABLE|POLICY|ROLE)\b/i);
});
test('complete contract and recorded migration pass', () => {
  assert.deepEqual(assessAccountSchemaPreflight(complete, 'recorded'), { ready: true, blockers: [] });
});
test('verified equivalent deployment requires explicit evidence', () => {
  assert.equal(assessAccountSchemaPreflight(complete, 'verified-equivalent').ready, true);
  assert.equal(assessAccountSchemaPreflight(complete, 'unknown').ready, false);
});
test('legacy presence-only rows fail closed even with recorded history', () => {
  assert.equal(assessAccountSchemaPreflight({preferences_table_present:true,country_code_present:true,display_name_present:true},'recorded').ready,false);
});
test('missing country_code and history each remain explicit blockers', () => {
  const result = assessAccountSchemaPreflight({ ...complete, country_code_present: false }, 'unknown');
  assert.ok(result.blockers.some(x => x.includes('country_code')));
  assert.ok(result.blockers.some(x => x.includes('history')));
});
test('missing or malformed metadata never establishes readiness', () => {
  for(const row of [null,{},[],{...complete,metadata_accessible:'true'},{...complete,contract:null}]) {
    assert.equal(assessAccountSchemaPreflight(row,'recorded').ready,false);
  }
  for(const key of ['preferences_table_present','country_code_present','display_name_present','metadata_accessible']) {
    assert.equal(assessAccountSchemaPreflight({...complete,[key]:null},'recorded').ready,false);
  }
});
for(const section of Object.keys(expected)) {
  test(`rejects missing or altered ${section} contract`,()=>{
    assert.equal(assessAccountSchemaPreflight({...complete,contract:{...expected,[section]:null}},'recorded').ready,false);
    assert.equal(assessAccountSchemaPreflight({...complete,contract:{...expected,[section]:[...expected[section],{unexpected:true}]}},'recorded').ready,false);
  });
}
test('query permission or transport failures fail closed without raw diagnostics',async()=>{
  for(const error of [new Error('permission denied: synthetic-private-detail'),new Error('network unavailable')]) {
    const result=await runAccountSchemaPreflight(async()=>{throw error;},'recorded');
    assert.equal(result.ready,false);
    assert.deepEqual(result.blockers,['account contract metadata query failed or was denied']);
  }
  assert.equal((await runAccountSchemaPreflight(async()=>undefined,'recorded')).ready,false);
  assert.equal((await runAccountSchemaPreflight(async()=>complete,'recorded')).ready,true);
});
