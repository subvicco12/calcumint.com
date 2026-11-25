import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { expect, it } from 'vitest';
import { physicsBatch3Definitions } from '../../src/calculators/physics/catalog-batch-3';
import { verifyBatch22PhysicsSnapshot } from '../../src/lib/batch22-physics-replay';
import { candidateIdentities, calculateCoulombCandidate, calculateFreeFallCandidate, calculateProjectileCandidate } from './candidates';

const baseline = '8296454dc7244205ef4cf0b6e0b41c38f90af20f';
it.each([
  'src/calculators/physics/catalog-batch-3.ts',
  'src/lib/calculator-factory/experimental/physics-scaled.ts',
  'src/lib/calculator-factory/cohorts/physics.ts',
  'src/lib/calculator-factory/completion/physics.ts',
  'src/lib/calculator-factory/registry.ts',
  'src/lib/batch22-physics-replay.ts',
  'docs/calculator-factory/wave1/physics-evidence.json',
  'data/catalog/scientific-models-2026-10-25/manifest.json',
])('retains exact baseline bytes for %s', file => {
  expect(readFileSync(file).equals(execFileSync('git', ['show', `${baseline}:${file}`], { maxBuffer: 8 * 1024 * 1024 }))).toBe(true);
});
it('introduces no application-source or shared admission changes', () => {
  expect(execFileSync('git', ['diff', '--name-only', baseline, '--', 'src', 'scripts', 'supabase', '.github', 'data', 'package.json', 'package-lock.json']).toString()).toBe('');
});

it.each([
  [323, 'physics.coulomb-force', { charge1: 1e-200, charge2: 1e-200, distance: 1e-100 }, calculateCoulombCandidate],
  [324, 'physics.projectile-motion', { speed: 2 ** 300, angle: Number.MIN_VALUE, gravity: 1 }, calculateProjectileCandidate],
  [325, 'physics.free-fall', { gravity: Number.MIN_VALUE, time: 2 ** 100 }, calculateFreeFallCandidate],
] as const)('%s corrected candidate can never silently replace historical replay', (id, engineId, input, calculate) => {
  const historical = physicsBatch3Definitions.find(row => row.id === engineId)!;
  const output = historical.calculate(input as never, {});
  expect(output.value).toBe(0);
  const snapshot = { calculatorSlug: historical.slug, calculatorVersion: 1, input, output };
  expect(verifyBatch22PhysicsSnapshot(snapshot).engineId).toBe(engineId);
  const corrected = calculate(input).value;
  expect(corrected).toBeGreaterThan(0);
  expect(() => verifyBatch22PhysicsSnapshot({ ...snapshot, output: { ...output, value: corrected } })).toThrow('does not agree');
  const candidate = candidateIdentities[id];
  expect(candidate.id).not.toBe(engineId);
  expect(candidate.version).toBe(1);
  expect(() => verifyBatch22PhysicsSnapshot({ ...snapshot, calculatorSlug: candidate.id })).toThrow('exact immutable version');
  expect(() => verifyBatch22PhysicsSnapshot({ ...snapshot, calculatorVersion: 2 })).toThrow('exact immutable version');
});

it.each([
  [calculateCoulombCandidate, { charge1: 1, charge2: 1, distance: 1 }],
  [calculateProjectileCandidate, { speed: 1, angle: 45, gravity: 1 }],
  [calculateFreeFallCandidate, { gravity: 1, time: 1 }],
] as const)('candidate direct calls enforce strict retained input domains', (calculate, input) => {
  for (const field of Object.keys(input)) {
    for (const invalid of [NaN, Infinity, -Infinity, 1.00001e100, '1', null]) {
      expect(() => calculate({ ...input, [field]: invalid })).toThrow();
    }
  }
  expect(() => calculate({ ...input, undeclared: 1 })).toThrow();
  expect(() => calculate({})).toThrow();
});
it('retains positive denominators, nonnegative time/gravity and degree angle bounds', () => {
  expect(() => calculateCoulombCandidate({ charge1: 1, charge2: 1, distance: 0 })).toThrow();
  expect(() => calculateProjectileCandidate({ speed: 1, angle: 45, gravity: 0 })).toThrow();
  for (const angle of [-Number.MIN_VALUE, 90.00001]) expect(() => calculateProjectileCandidate({ speed: 1, angle, gravity: 1 })).toThrow();
  for (const input of [{ time: -1, gravity: 1 }, { time: 1, gravity: -1 }]) expect(() => calculateFreeFallCandidate(input)).toThrow();
  expect(calculateFreeFallCandidate({ time: 0, gravity: 1e100 }).value).toBe(0);
  expect(calculateCoulombCandidate({ charge1: 0, charge2: 1e100, distance: Number.MIN_VALUE }).value).toBe(0);
});
