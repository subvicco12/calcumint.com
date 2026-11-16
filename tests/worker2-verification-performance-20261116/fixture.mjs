import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve, join } from 'node:path';
import { createHash } from 'node:crypto';
import { performance } from 'node:perf_hooks';

export const sourceRef = '419d56c17ca72dae58132aa00c7424b07477aa6c';
export const sourcePath = 'tests/next-engineering-20261115/source-stage10.mjs';
const sourceBytes = execFileSync('git', ['show', `${sourceRef}:${sourcePath}`]);
assert(sourceBytes.equals(readFileSync(sourcePath)), 'Worker3-owned source must remain untouched');
export const kernelSourceSHA256 = createHash('sha256').update(sourceBytes).digest('hex');
const source = sourceBytes.toString();
const nativeBody = /function native\(input\)\{([\s\S]*?)\n\}/.exec(source)?.[1];
const statusBody = /function nativeStatusHead\(bytes\)\{([\s\S]*?)\n\}/.exec(source)?.[1];
assert(nativeBody && statusBody, 'Exact retained native observation functions required');
const nativeStatusHead = new Function('assert', 'return function(bytes){' + statusBody + '}')(assert);
const reusable = args => ['rev-parse', '--show-toplevel'].every((v, i) => args[i] === v) && args.length === 2
  || args[0] === 'status' && args[1] === '--porcelain=v2'
  || args[0] === 'ls-files';

/** Independent disposable repository; no application source/admission is installed. */
export function fixture() {
  const root = mkdtempSync(join(tmpdir(), 'calcumint-worker2-observations-'));
  const calls = [], memo = new Map(); let capture = false;
  const git = args => {
    const start = performance.now(); let failed = false;
    try { return execFileSync('git', args, { cwd: root, env: { ...process.env, GIT_NO_REPLACE_OBJECTS: '1' }, stdio: ['ignore', 'pipe', 'pipe'] }); }
    catch (error) { failed = true; throw error; }
    finally { if (capture) calls.push({ args: [...args], milliseconds: performance.now() - start, failed }); }
  };
  try {
    git(['init', '-q', '--initial-branch=fixture']);
    mkdirSync(join(root, 'src')); writeFileSync(join(root, 'src/probe.ts'), 'export const value = 1;\n');
    writeFileSync(join(root, '.gitignore'), 'src/ignored.tmp\n');
    git(['add', '.']); git(['-c', 'user.name=Disposable source fixture', '-c', 'user.email=fixture@example.invalid', 'commit', '-qm', 'fixture baseline']);
  } catch (error) { rmSync(root, { recursive: true, force: true }); throw error; }
  const head = git(['rev-parse', 'HEAD']).toString().trim();
  const blob = git(['rev-parse', 'HEAD:src/probe.ts']).toString().trim();
  const blobBytes = git(['cat-file', 'blob', blob]);
  const blobSHA256 = createHash('sha256').update(blobBytes).digest('hex');
  const makeKernel = mode => {
    assert(['fresh', 'reuse'].includes(mode));
    const nativeReader = () => args => {
      // Rejected proposal: reuse the native status/HEAD/index observations at
      // later boundaries. Supplied-provider calls and object checks stay fresh.
      const key = JSON.stringify(args);
      if (mode === 'reuse' && reusable(args)) {
        if (!memo.has(key)) memo.set(key, Buffer.from(git(args)));
        return Buffer.from(memo.get(key));
      }
      return git(args);
    };
    return new Function('assert', 'resolve', 'nativeReader', 'nativeStatusHead', 'policy', 'headArgs',
      'return function(input){' + nativeBody + '}')(assert, resolve, nativeReader, nativeStatusHead, { codeRef: head }, ['rev-parse', '--verify', 'HEAD^{commit}']);
  };
  function objects(provider = git) {
    const commit = provider(['cat-file', 'commit', head]);
    assert.equal(createHash('sha1').update(Buffer.from(`commit ${commit.length}\0`)).update(commit).digest('hex'), head, 'Commit content address differs');
    const bytes = provider(['cat-file', 'blob', blob]);
    assert.equal(bytes.length, blobBytes.length, 'Blob length differs');
    assert.equal(createHash('sha256').update(bytes).digest('hex'), blobSHA256, 'Blob digest differs');
  }
  return { root, head, blob, git, calls, makeKernel, objects,
    input: provider => ({ root, git: provider || git }),
    profile: run => { calls.length = 0; capture = true; const start = performance.now(); try { run(); return { milliseconds: performance.now() - start, calls: calls.map(x => ({ ...x })), gitMilliseconds: calls.reduce((n, x) => n + x.milliseconds, 0) }; } finally { capture = false; } },
    close: () => rmSync(root, { recursive: true, force: true }) };
}
