import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, mkdirSync, mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';

const file = 'tests/milestone100-20261114/source-preflight-stage8.mjs';
const baseline = '419d56c17ca72dae58132aa00c7424b07477aa6c';
const bytes = execFileSync('git', ['show', `${baseline}:${file}`]);
assert(bytes.equals(readFileSync(file)), 'The Worker3-owned source must remain unchanged');
const original = /const successor=(\[capture\.sourceStage10Current26,[\s\S]*?\]\.find\(stage=>stage\?\.guardPaths\.includes\(path\)\))/.exec(bytes.toString())?.[1];
assert(original, 'Exact source selector required');
const corrected = original.replace('[capture.sourceStage10Current26,', '[capture.sourceStage10ReceiptFixture,capture.sourceStage10Current26,');
const selector = expression => new Function('capture', 'path', 'return ' + expression);
const legacySelect = selector(original), proposedSelect = selector(corrected);
const capture = JSON.parse(readFileSync('docs/next-engineering-20261115/source/guard-capture-receipt-fixture.json'));
const sha = x => createHash('sha256').update(x).digest('hex');

test('reproduces the exact hosted guard-reference mismatch without a full source proof', () => {
  const path = 'scripts/fetch-source-lineage.mjs';
  const row = capture.currentSources.find(row => row.path === path);
  assert.equal(row.ref, '174c42d16f0eaad9ced52069a17c239d73337b4d');
  assert.equal(legacySelect(capture, path).guardRef, '1f4b9885c7f483c5ec2282e50d72a1fefe3e4a19');
  assert.notEqual(row.ref, legacySelect(capture, path).guardRef);
});
test('proposed selector joins every affected path to its actual exact Git record', () => {
  for (const path of ['scripts/fetch-source-lineage.mjs', 'tests/source-lineage-bootstrap.test.mjs']) {
    const row = capture.currentSources.find(row => row.path === path);
    const successor = proposedSelect(capture, path);
    assert.equal(row.ref, successor?.guardRef ?? capture.sourceStage8V45.guardRef);
    const blob = execFileSync('git', ['rev-parse', `${row.ref}:${row.path}`]).toString().trim();
    const current = execFileSync('git', ['cat-file', 'blob', blob]);
    assert.equal(blob, row.blob); assert.equal(current.length, row.bytes); assert.equal(sha(current), row.sha256);
    assert(current.equals(readFileSync(path)));
  }
});
test('new selector neither nominates an unlisted path nor accepts a wrong reference', () => {
  assert.equal(proposedSelect(capture, 'not/a/declared/path'), undefined);
  const altered = structuredClone(capture); altered.sourceStage10ReceiptFixture.guardRef = '0'.repeat(40);
  const path = 'scripts/fetch-source-lineage.mjs';
  assert.throws(() => assert.equal(capture.currentSources.find(row => row.path === path).ref, proposedSelect(altered, path).guardRef));
});
test('legacy fallback is identical when the receipt successor does not cover a path', () => {
  const altered = structuredClone(capture); altered.sourceStage10ReceiptFixture.guardPaths = [];
  for (const path of ['scripts/fetch-source-lineage.mjs', 'tests/source-lineage-bootstrap.test.mjs']) {
    assert.deepEqual(proposedSelect(altered, path), legacySelect(altered, path));
  }
});
test('the literal handoff patch applies to a disposable baseline copy and changes only the tested selector', () => {
  const directory = mkdtempSync(join(tmpdir(), 'worker2-selector-patch-'));
  const patch = resolve('docs/worker2-ci-acceleration-20261116/publication-selector.patch');
  try {
    const target = join(directory, file); mkdirSync(dirname(target), { recursive: true }); writeFileSync(target, bytes);
    execFileSync('git', ['apply', '--check', patch], { cwd: directory });
    execFileSync('git', ['apply', patch], { cwd: directory });
    assert.equal(readFileSync(target, 'utf8'), bytes.toString().replace('const successor=' + original, 'const successor=' + corrected));
  } finally { rmSync(directory, { recursive: true, force: true }); }
});
