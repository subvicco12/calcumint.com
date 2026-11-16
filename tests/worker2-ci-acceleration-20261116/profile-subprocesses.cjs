'use strict';
/* eslint-disable @typescript-eslint/no-require-imports -- Node --require preload must run before ESM source imports. */
// Diagnostic observation only. No output/proof/state cache and no changed argv.
const cp = require('node:child_process');
const { syncBuiltinESMExports } = require('node:module');
const { performance } = require('node:perf_hooks');
const { writeFileSync } = require('node:fs');
const { join } = require('node:path');
const original = cp.execFileSync;
const rows = new Map();
cp.execFileSync = function (command, args, ...rest) {
  const start = performance.now();
  let failed = false;
  try { return Reflect.apply(original, this, [command, args, ...rest]); }
  catch (error) { failed = true; throw error; }
  finally {
    const phase = globalThis.__WORKER2_PROFILE_PHASE || 'startup';
    const key = JSON.stringify([phase, command, args]);
    const row = rows.get(key) || { phase, command, args, calls: 0, failures: 0, milliseconds: 0 };
    row.calls++; row.failures += Number(failed); row.milliseconds += performance.now() - start;
    rows.set(key, row);
  }
};
syncBuiltinESMExports();
process.once('exit', () => {
  if (!process.env.WORKER2_PROFILE_DIRECTORY) return;
  const file = join(process.env.WORKER2_PROFILE_DIRECTORY, `subprocess-${process.pid}.json`);
  writeFileSync(file, JSON.stringify({ pid: process.pid, runtime: process.version,
    sourceHead: process.env.WORKER2_PROFILE_SOURCE_HEAD, diagnosticOnly: true,
    rows: [...rows.values()] }, null, 2) + '\n');
});
