import assert from 'node:assert/strict';
import { readFileSync, mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';
import { performance } from 'node:perf_hooks';
import { createHash } from 'node:crypto';
import { transform } from 'esbuild';
import { cases } from './standalone-assertions.mjs';

const root = process.cwd(), file = 'src/lib/five-full-contract-evidence.test.ts';
const original = readFileSync(file);
assert(original.equals(execFileSync('git', ['show', `419d56c17ca72dae58132aa00c7424b07477aa6c:${file}`])));
// Transpile the unmodified test body, redirecting only its test-framework import.
// Actual dependencies execute from their original URLs, preserving import.meta roots.
const source = original.toString().replace(/from\s*(['"])([^'"]+)\1/g, (whole, quote, name) => {
  if (name === 'vitest') return 'from ' + JSON.stringify(new URL('./standalone-assertions.mjs', import.meta.url).href);
  if (name.startsWith('.')) return 'from ' + JSON.stringify(pathToFileURL(resolve(root, 'src/lib', name)).href);
  return whole;
});
const generated = await transform(source, { loader: 'ts', format: 'esm', target: 'es2022' });
const directory = mkdtempSync(join(tmpdir(), 'worker2-original-proof-'));
const results = [];
try {
  const modulePath = join(directory, 'probe.mjs'); writeFileSync(modulePath, generated.code);
  globalThis.__WORKER2_PROFILE_PHASE = 'collection';
  const began = performance.now(); await import(pathToFileURL(modulePath));
  results.push({ phase: 'collection', milliseconds: performance.now() - began });
  for (const [phase, title] of [
    ['api', 'retains genuine five API execution source and requires reviewed current runtime successors separately'],
    ['ui', 'retains visible-interface and paragraph-PDF accessibility proof without asserting formal conformance'],
  ]) {
    const row = cases.find(row => row.title === title); assert(row, 'Exact original test required');
    globalThis.__WORKER2_PROFILE_PHASE = phase;
    const start = performance.now(); row.run();
    results.push({ phase, milliseconds: performance.now() - start, assertionsPassed: true });
  }
  console.log(JSON.stringify({ kind: 'ADVISORY_ORIGINAL_BODY_PROFILE_NOT_VITEST_ACCEPTANCE', runtime: process.version,
    originalSourceSHA256: createHash('sha256').update(original).digest('hex'), results,
    defaultProofsAndNegativeGuardsUnchanged: true, releaseHold: true }, null, 2));
} finally { delete globalThis.__WORKER2_PROFILE_PHASE; rmSync(directory, { recursive: true, force: true }); }
