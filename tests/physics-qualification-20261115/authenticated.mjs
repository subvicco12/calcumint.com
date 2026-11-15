import assert from 'node:assert/strict';
import { randomUUID, createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';
import { build } from 'esbuild';
import { createClient } from '@supabase/supabase-js';
import { startGoTrueFixture } from '../gotrue-runtime/fixture.mjs';
import { initializeFullSchema } from '../gotrue-full-schema/schema.mjs';

const root = process.cwd();
const artifacts = path.resolve(process.env.PHYSICS_QUALIFICATION_ARTIFACTS || '/workspace/physics-qualification-receipts/authenticated');
await mkdir(artifacts, { recursive: true });
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const outfile = path.join(artifacts, 'engines.mjs');
const compiled = await build({ stdin: { contents: `
export { physicsBatch3Definitions } from './src/calculators/physics/catalog-batch-3';
export { verifyBatch22PhysicsSnapshot } from './src/lib/batch22-physics-replay';
export { serializeCalculationJson } from './src/lib/calculation-snapshot';
export { serializeCalculationSnapshotCsv, serializeCalculationPdf } from './src/lib/calculation-export';
`, resolveDir: root, loader: 'ts' }, outfile, bundle: true, platform: 'node', format: 'esm',
  alias: { '@': path.join(root, 'src') }, metafile: true, logLevel: 'silent',
  banner: { js: "import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);" } });
const engine = await import(pathToFileURL(outfile));
const sources = {};
for (const p of Object.keys(compiled.metafile.inputs).filter(p => !p.startsWith('node_modules/') && p !== '<stdin>')) sources[p] = sha(await readFile(p));
for (const p of ['tests/physics-qualification-20261115/authenticated.mjs', 'tests/gotrue-runtime/fixture.mjs', 'tests/gotrue-full-schema/schema.mjs']) sources[p] = sha(await readFile(p));
const report = { sourceCommit: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(), sources,
  runtime: process.version, passed: false, observations: [], artifacts: [], releaseHold: true, productionWrites: false,
  limitations: ['Disposable genuine GoTrue/PostgREST/Postgres with repository full candidate schema and locally adopted guarded bundles; no hosted schema equivalence.',
    'Direct RPC and native serializer checks; no browser, Next action, public API, billing or production delivery acceptance.',
    'Historical v1 identities only, including 323/324; private successors receive no workflow acceptance.',
    'Fixture-only paid-plan assignment; SQL stores server-trusted snapshots and does not independently recompute mathematics.'] };
const ok = async query => { const r = await query; assert.equal(r.error, null, JSON.stringify(r.error)); return r.data; };
const denied = async query => { const r = await query; assert(r.error, 'Expected refusal'); };
let db;
try {
  db = await startGoTrueFixture({ initializeSchema: initializeFullSchema });
  report.fixture = db.provenance;
  const client = () => createClient(db.url, db.anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const signup = async plan => {
    const sdk = client();
    const auth = await ok(sdk.auth.signUp({ email: randomUUID() + '@example.invalid', password: 'Local-' + randomUUID() }));
    assert(auth.session && auth.user);
    await db.sql(`UPDATE public.profiles SET plan='${plan}' WHERE id='${auth.user.id}';`);
    return { sdk, id: auth.user.id };
  };
  const foreign = await signup('business');
  const users = { free: await signup('free'), pro: await signup('pro'), business: await signup('business') };
  const anon = client();
  for (const [id, slug] of [[322, 'capacitance'], [323, 'coulomb-force'], [324, 'projectile-motion'], [325, 'free-fall'], [327, 'angular-velocity']]) {
    const definition = engine.physicsBatch3Definitions.find(row => row.id === 'physics.' + slug);
    assert(definition);
    // Nondefault retained underflow witnesses prevent default-example-only delivery claims.
    const input = id === 323 ? { charge1: 1e-200, charge2: 1e-200, distance: 1e-100 }
      : id === 324 ? { speed: 1e-200, angle: 45, gravity: 1e-300 }
      : id === 325 ? { gravity: Number.MIN_VALUE, time: 2 ** 100 } : definition.examples[0].input;
    const snapshot = { calculatorSlug: definition.slug, calculatorVersion: 1, input, output: definition.calculate(input, {}) };
    engine.verifyBatch22PhysicsSnapshot(snapshot);
    for (const [extension, bytes] of [['json', engine.serializeCalculationJson(snapshot)],
      ['csv', engine.serializeCalculationSnapshotCsv(snapshot)], ['pdf', engine.serializeCalculationPdf(snapshot)]]) {
      const file = `${id}-historical-v1.${extension}`;
      await writeFile(path.join(artifacts, file), bytes);
      const actual = await readFile(path.join(artifacts, file));
      assert(actual.length > 0);
      if (extension === 'json') engine.verifyBatch22PhysicsSnapshot(JSON.parse(actual.toString()));
      if (extension === 'csv') assert(actual.toString().includes(definition.slug));
      if (extension === 'pdf') assert(actual.subarray(0, 5).toString() === '%PDF-');
      report.artifacts.push({ file, bytes: actual.length, sha256: sha(actual) });
    }
    for (const [plan, user] of Object.entries(users)) {
      const requestId = randomUUID();
      const args = { p_request_id: requestId, p_calculator_slug: snapshot.calculatorSlug, p_calculator_version: 1,
        p_input_data: input, p_output_data: snapshot.output, p_expected_owner_id: user.id };
      assert.equal(await ok(user.sdk.rpc('save_calculation_history_atomic', args)), requestId);
      assert.equal(await ok(user.sdk.rpc('save_calculation_history_atomic', args)), requestId);
      const row = await ok(user.sdk.from('calculation_history').select('*').eq('id', requestId).single());
      const restored = { calculatorSlug: row.calculator_slug, calculatorVersion: row.calculator_version, input: row.input_data, output: row.output_data };
      assert.deepEqual(restored, snapshot);
      engine.verifyBatch22PhysicsSnapshot(restored);
      await denied(user.sdk.rpc('save_calculation_history_atomic', { ...args, p_output_data: { tampered: true } }));
      await denied(foreign.sdk.rpc('save_calculation_history_atomic', args));
      await denied(anon.rpc('save_calculation_history_atomic', { ...args, p_request_id: randomUUID() }));
      assert.deepEqual(await ok(foreign.sdk.from('calculation_history').select('id').eq('id', requestId)), []);
      assert.deepEqual(await ok(foreign.sdk.from('calculation_history').update({ output_data: { tampered: true } }).eq('id', requestId).select('id')), []);
      assert.deepEqual(await ok(foreign.sdk.from('calculation_history').delete().eq('id', requestId).select('id')), []);
      let scenario = false;
      if (plan === 'free') {
        await denied(user.sdk.from('calculation_projects').insert({ user_id: user.id, name: 'Denied Free project' }));
      } else {
        const project = await ok(user.sdk.from('calculation_projects').insert({ user_id: user.id, name: `Physics ${id}` }).select('id').single());
        const scenarioId = randomUUID();
        const scenarioArgs = { p_request_id: scenarioId, p_project_id: project.id, p_history_id: requestId, p_name: 'Historical v1', p_expected_owner_id: user.id };
        assert.equal(await ok(user.sdk.rpc('save_project_scenario_atomic', scenarioArgs)), scenarioId);
        assert.equal(await ok(user.sdk.rpc('save_project_scenario_atomic', scenarioArgs)), scenarioId);
        const saved = await ok(user.sdk.from('saved_scenarios').select('*').eq('id', scenarioId).single());
        assert.deepEqual(saved.input_data, input); assert.deepEqual(saved.output_data, snapshot.output);
        engine.verifyBatch22PhysicsSnapshot({ calculatorSlug: saved.calculator_slug, calculatorVersion: saved.calculator_version, input: saved.input_data, output: saved.output_data });
        await denied(foreign.sdk.rpc('save_project_scenario_atomic', scenarioArgs));
        assert.deepEqual(await ok(foreign.sdk.from('saved_scenarios').select('id').eq('id', scenarioId)), []);
        scenario = true;
      }
      report.observations.push({ catalogId: id, slug: definition.slug, version: 1, plan, historyId: requestId,
        exactReplay: true, idempotentRetry: true, conflictDenied: true, foreignAndAnonymousDenied: true, scenario, input, output: snapshot.output });
      console.log(`PASS ${id} historical v1 ${plan}: genuine history/RLS/replay${scenario ? '/scenario' : '/Free project denial'}`);
    }
  }
  assert.equal(report.observations.length, 15); assert.equal(report.artifacts.length, 15);
  report.requests = db.requests;
  report.passed = true;
} catch (error) { report.error = String(error.stack || error); process.exitCode = 1; }
finally {
  try { if (db) await db.close(); report.cleanupCompleted = true; }
  catch (error) { report.cleanupError = String(error); report.passed = false; process.exitCode = 1; }
  await writeFile(path.join(artifacts, 'receipt.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({ passed: report.passed, observations: report.observations.length, error: report.error, cleanupCompleted: report.cleanupCompleted }));
}
