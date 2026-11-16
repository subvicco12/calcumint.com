import test from 'node:test';
import assert from 'node:assert/strict';
import { writeFileSync, readFileSync, existsSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';
import { fixture } from './fixture.mjs';

const using = run => { const f = fixture(); try { return run(f); } finally { f.close(); } };
test('honest immutable workspace yields the same HEAD and still checks objects on each call', () => using(f => {
  for (const mode of ['fresh', 'reuse']) {
    const kernel = f.makeKernel(mode);
    const profile = f.profile(() => { for (let i = 0; i < 3; i++) { assert.equal(kernel(f.input()), f.head); f.objects(); } });
    assert.equal(profile.calls.filter(row => row.args[0] === 'cat-file').length, 6);
  }
}));
test('COUNTEREXAMPLE: reused native observations accept a newly ignored source file', () => using(f => {
  const fresh = f.makeKernel('fresh'), reuse = f.makeKernel('reuse');
  assert.equal(reuse(f.input()), f.head);
  writeFileSync(join(f.root, 'src/ignored.tmp'), 'unapproved ignored source\n');
  assert.throws(() => fresh(f.input()), /native dirty or unknown source/);
  assert.equal(reuse(f.input()), f.head, 'Rejected optimization misses current ignored source');
}));
test('COUNTEREXAMPLE: index flags changed by a supplied callback cannot reuse prior native index bytes', () => using(f => {
  const fresh = f.makeKernel('fresh'), reuse = f.makeKernel('reuse'); reuse(f.input());
  const provider = args => {
    if (args[0] === 'status') f.git(['update-index', '--skip-worktree', 'src/probe.ts']);
    if (args[0] === 'rev-parse' && args[1] === '--verify') f.git(['update-index', '--no-skip-worktree', 'src/probe.ts']);
    return f.git(args);
  };
  assert.throws(() => fresh(f.input(provider)), /Unsupported native source index flag/);
  f.git(['update-index', '--no-skip-worktree', 'src/probe.ts']);
  assert.equal(reuse(f.input(provider)), f.head, 'Rejected optimization misses transient skip-worktree flag');
  assert(f.git(['ls-files', '-v', '--', 'src']).toString().startsWith('H '), 'Callback restored flag before closing checks');
}));
test('both modes retain the supplied current-source dirty rejection', () => using(f => {
  const fresh = f.makeKernel('fresh'), reuse = f.makeKernel('reuse'); reuse(f.input());
  writeFileSync(join(f.root, 'src/probe.ts'), 'changed\n');
  assert.throws(() => fresh(f.input()), /native dirty or unknown source/);
  assert.throws(() => reuse(f.input()), /Dirty or unknown current source/);
}));
test('both modes retain final supplied HEAD checks when metadata moves', () => using(f => {
  const fresh = f.makeKernel('fresh'), reuse = f.makeKernel('reuse'); reuse(f.input());
  f.git(['-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid', 'commit', '--allow-empty', '-qm', 'metadata movement']);
  assert.notEqual(f.git(['rev-parse', 'HEAD']).toString().trim(), f.head);
  assert.equal(fresh(f.input()), f.git(['rev-parse', 'HEAD']).toString().trim());
  assert.throws(() => reuse(f.input()), /Native HEAD moved or supplied HEAD differs/);
  // An enclosing stable-proof expectedHead comparison must also reject the
  // fresh result. No assertion is deleted because this observation is fresh.
  assert.throws(() => assert.equal(fresh(f.input()), f.head));
}));
test('actual Git index lock prevents a writer and is never removed by either mode', () => using(f => {
  const reuse = f.makeKernel('reuse'); reuse(f.input());
  const lock = join(f.root, '.git/index.lock'), marker = 'foreign fixture lock: do not remove\n';
  writeFileSync(lock, marker, { flag: 'wx' });
  try {
    for (const kernel of [f.makeKernel('fresh'), reuse]) {
      assert.throws(() => f.git(['update-index', '--skip-worktree', 'src/probe.ts']), error => String(error.stderr).includes('index.lock'));
      assert.equal(kernel(f.input()), f.head); f.objects();
      assert.equal(readFileSync(lock, 'utf8'), marker);
    }
  } finally { assert(existsSync(lock)); unlinkSync(lock); }
}));
test('immutable blob substitution is refused on every call even when observations are reused', () => using(f => {
  for (const mode of ['fresh', 'reuse']) {
    const kernel = f.makeKernel(mode); kernel(f.input()); f.objects();
    const provider = args => {
      const actual = f.git(args);
      return args[0] === 'cat-file' && args[1] === 'blob' ? Buffer.alloc(actual.length, 0) : actual;
    };
    assert.throws(() => f.objects(provider), /Blob digest differs/);
  }
}));
test('a substituted immutable commit never becomes a passing cached verdict', () => using(f => {
  for (const mode of ['fresh', 'reuse']) {
    f.makeKernel(mode)(f.input()); f.objects();
    assert.throws(() => f.objects(args => args[0] === 'cat-file' && args[1] === 'commit' ? Buffer.from('forged') : f.git(args)), /Commit content address differs/);
  }
}));
