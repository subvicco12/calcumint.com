import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import test from 'node:test';

// Exercise the actual checker's literal, rather than a separately maintained regex.
const source = readFileSync(new URL('./verify.mjs', import.meta.url), 'utf8');
const match = source.match(/assert\.doesNotMatch\(bytes\.toString\(\),(\/[^\n]+?\/),'Credential in evidence: '/);
assert.ok(match, 'Actual artifact credential assertion must remain present');
const guard = runInNewContext(match[1]);
const dummyTokens = ['cm_test_' + 'x'.repeat(32), 'cm_live_' + 'x'.repeat(32),
  'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkdW1teSJ9.dummySignature'];

test('actual evidence checker rejects dummy API keys and JWTs in ordinary log text', () => {
  for (const token of dummyTokens) {
    assert.equal(guard.test(`log value=${token}\n`), true);
    assert.throws(() => assert.doesNotMatch(`log value=${token}\n`, guard));
  }
  assert.doesNotMatch('PASS exact source bindings; no credentials', guard);
});

test('double-escaped counterfactual fails the same token witnesses', () => {
  const broken = runInNewContext(match[1].replaceAll('\\', '\\\\'));
  for (const token of dummyTokens) assert.equal(broken.test(`log value=${token}\n`), false);
});
