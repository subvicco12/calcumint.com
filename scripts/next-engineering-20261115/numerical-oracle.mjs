#!/usr/bin/env node
// Reproducer: node scripts/next-engineering-20261115/numerical-oracle.mjs
import {build} from 'esbuild';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {readFileSync, writeFileSync, mkdirSync, mkdtempSync, rmSync, readdirSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {resolve, dirname, relative} from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {gzipSync} from 'node:zlib';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const output = resolve(root, 'docs/next-engineering-20261115/statistics-b/numerical');
const specFile = resolve(output, 'SPEC.json');
const spec = JSON.parse(readFileSync(specFile, 'utf8'));
if (spec.grid.minimum !== -4 || spec.grid.maximum !== 4 || spec.grid.spacing !== '0.001' || spec.grid.pointCount !== 8001) {
  throw Error('Reproducer requires the predeclared -4..4 grid at spacing 0.001');
}
const python = process.env.NUMERICAL_ORACLE_PYTHON || 'python3';
const oracleScript = resolve(root, 'scripts/next-engineering-20261115/numerical-oracle.py');
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const engineFiles = ['src/calculators/statistics/catalog-batch-2.ts', 'src/calculators/statistics/catalog-batch-3.ts'];
const before = Object.fromEntries(engineFiles.map(file => [file, hash(readFileSync(resolve(root, file)))]));
const temporary = mkdtempSync(resolve(tmpdir(), 'calcumint-numerical-oracle-'));
const execFileAsync = promisify(execFile);
async function runPython(mode, data) {
  const inputFile = resolve(temporary, mode + '-input.json');
  writeFileSync(inputFile, JSON.stringify(data));
  const child = await execFileAsync(python, [oracleScript, mode, output, inputFile], {
    encoding: 'utf8', maxBuffer: 128 * 1024 * 1024,
  });
  return JSON.parse(child.stdout);
}
try {
  mkdirSync(output, {recursive: true});
  const bundle = resolve(temporary, 'immutable-engines.cjs');
  await build({
    stdin: {contents: "export {confidenceIntervalCalculator,sampleSizeCalculator} from './src/calculators/statistics/catalog-batch-2.ts'; export {normalDistributionCalculator} from './src/calculators/statistics/catalog-batch-3.ts';", resolveDir: root, loader: 'ts'},
    bundle: true, platform: 'node', format: 'cjs', outfile: bundle, logLevel: 'silent',
  });
  const engines = createRequire(import.meta.url)(bundle);
  const calculate = (engine, input) => ({engineId: engine.id, engineVersion: engine.version,
    input, output: engine.calculate(engine.inputSchema.parse(input), {})});
  const critical = spec.confidenceLevels.map(level => calculate(engines.confidenceIntervalCalculator,
    {estimate: 0, standardError: 1, confidenceLevel: Number(level)}));
  const witnesses = await runPython('prepare', {spec, critical});
  const normal = [];
  for (let integer = -4000; integer <= 4000; integer++) {
    normal.push(calculate(engines.normalDistributionCalculator, {x: integer / 1000, mean: 0, standardDeviation: 1}));
  }
  for (const [mean, standardDeviation] of spec.locationScaleCases.meansAndScales) {
    for (const targetZ of spec.locationScaleCases.targetZ) {
      normal.push(calculate(engines.normalDistributionCalculator, {x: mean + targetZ * standardDeviation, mean, standardDeviation}));
    }
  }
  const sampleSize = witnesses.map(input => calculate(engines.sampleSizeCalculator, input));
  const observations = {spec, critical, normal, sampleSize};
  writeFileSync(resolve(output, 'engine-observations.json.gz'), gzipSync(JSON.stringify(observations)+'\n'));
  const summary = await runPython('analyze', observations);
  const after = Object.fromEntries(engineFiles.map(file => [file, hash(readFileSync(resolve(root, file)))]));
  if (JSON.stringify(before) !== JSON.stringify(after)) throw Error('Immutable engine source changed during run');
  const artifacts = readdirSync(output).filter(name => name !== 'HASHES.json').sort();
  const hashes = Object.fromEntries(artifacts.map(file => [file, hash(readFileSync(resolve(output, file)))]));
  const scriptFiles = ['scripts/next-engineering-20261115/numerical-oracle.mjs', 'scripts/next-engineering-20261115/numerical-oracle.py'];
  const scriptHashes = Object.fromEntries(scriptFiles.map(file => [file, hash(readFileSync(resolve(root, file)))]));
  writeFileSync(resolve(output, 'HASHES.json'), JSON.stringify({algorithm: 'SHA256', immutableEngineSources: before,
    sourceStableDuringRun: true, reproducerScripts: scriptHashes, artifacts: hashes,
    runtime: {node: process.version, esbuild: createRequire(import.meta.url)('esbuild').version},
    command: 'node scripts/next-engineering-20261115/numerical-oracle.mjs',
    artifactDirectory: relative(root, output)}, null, 2)+'\n');
  console.log(JSON.stringify(summary, null, 2));
} finally {
  rmSync(temporary, {recursive: true, force: true});
}
