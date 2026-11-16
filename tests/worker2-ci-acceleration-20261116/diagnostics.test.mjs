import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { analyzeHostedUnit } from './hosted-analysis.mjs';

test('hosted analysis counts only outer files rather than double-counting nested TAP durations', () => {
  const result = analyzeHostedUnit('\x1b[32m✓\x1b[39m src/a.test.ts (2 tests) 10ms\n duration_ms: 9000\n❯ src/b.test.tsx (1 test | 1 failed) 20ms\nThe operation was canceled.');
  assert.equal(result.observedCompletedOuterFiles, 2); assert.equal(result.passed, 1); assert.equal(result.failed, 1);
  assert.equal(result.summedOuterBodyMilliseconds, 30); assert.equal(result.cancellationObserved, true);
  assert.equal(result.fullSuiteCompletionEstablished, false);
});
test('subprocess profiler preserves binary results, errors and duplicate execution', () => {
  const directory = mkdtempSync(join(tmpdir(), 'worker2-profiler-'));
  try {
    const script = `const cp=require('node:child_process'),assert=require('node:assert/strict');
for(let i=0;i<2;i++)assert.equal(cp.execFileSync('git',['--version']).subarray(0,11).toString(),'git version');
assert.throws(()=>cp.execFileSync('git',['--worker2-invalid-argument'],{stdio:['ignore','pipe','pipe']}));`;
    execFileSync(process.execPath, ['--require', resolve('tests/worker2-ci-acceleration-20261116/profile-subprocesses.cjs'), '-e', script],
      { env: { ...process.env, WORKER2_PROFILE_DIRECTORY: directory }, stdio: ['ignore', 'pipe', 'pipe'] });
    const receipt = JSON.parse(readFileSync(join(directory, readdirSync(directory)[0])));
    assert.equal(receipt.rows.find(x => x.args[0] === '--version').calls, 2);
    assert.equal(receipt.rows.find(x => x.args[0] === '--worker2-invalid-argument').failures, 1);
  } finally { rmSync(directory, { recursive: true, force: true }); }
});
