import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { physicsCandidates } from '../../src/lib/calculator-factory/cohorts/physics';
import { calculateProjectileScaled } from '../../src/lib/calculator-factory/experimental/physics-scaled';
import { verifyBatch22PhysicsSnapshot } from '../../src/lib/batch22-physics-replay';
import { factoryDeliveryIdentity } from '../../src/lib/native-delivery/factory-delivery-catalog';

const baseline = '3ccdd6d026ca0ec51063ff4501901ac92e8ace6a';
describe('immutable source and identity qualification', () => {
  it.each([
    'src/calculators/physics/catalog-batch-3.ts',
    'src/lib/calculator-factory/experimental/physics-scaled.ts',
    'src/lib/calculator-factory/cohorts/physics.ts',
    'src/lib/calculator-factory/completion/physics.ts',
    'src/lib/batch22-physics-replay.ts',
    'docs/calculator-factory/wave1/physics-evidence.json',
  ])('retains exact baseline bytes: %s', path => {
    expect(readFileSync(path).equals(execFileSync('git', ['show', `${baseline}:${path}`]))).toBe(true);
  });
  it.each(physicsCandidates)('keeps delivery identity separate for $catalogId', row => {
    if (row.registered) expect(factoryDeliveryIdentity(row.catalogId, row.version)?.engineId).toBe(row.engineId);
    else {
      expect(factoryDeliveryIdentity(row.catalogId, row.version)).toBeUndefined();
      expect(() => verifyBatch22PhysicsSnapshot({ calculatorSlug: row.slug, calculatorVersion: row.version,
        input: {}, output: {} })).toThrow('exact immutable version');
    }
  });
});

describe('unresolved numerical boundaries are evidence, not fixes', () => {
  it('325 loses a recoverable exact power-of-two result before time multiplication', () => {
    const row = physicsCandidates.find(row => row.catalogId === 325)!;
    const input = { gravity: Number.MIN_VALUE, time: 2 ** 100 };
    // Exact binary arithmetic: 2^-1 * 2^-1074 * (2^100)^2 = 2^-875.
    expect(2 ** -875).toBeGreaterThan(0);
    expect(row.engine.calculate(input as never, {}).value).toBe(0);
    const snapshot = { calculatorSlug: row.slug, calculatorVersion: 1, input,
      output: { value: 0, steps: ['Free Fall = 0'] } };
    expect(verifyBatch22PhysicsSnapshot(snapshot).engineVersion).toBe(1);
    expect(() => verifyBatch22PhysicsSnapshot({ ...snapshot,
      output: { value: 2 ** -875, steps: [`Free Fall = ${2 ** -875}`] } })).toThrow('does not agree');
  });
  it.each([
    [322, { charge: -Number.MIN_VALUE, voltage: 2 ** 100 }],
    [327, { angle: -Number.MIN_VALUE, time: 2 ** 100 }],
  ])('%s signed quotient rounds below minimum subnormal to negative zero', (id, input) => {
    const row = physicsCandidates.find(row => row.catalogId === id)!;
    expect(Object.is(row.engine.calculate(input as never, {}).value, -0)).toBe(true);
    // Here the exact result is nonzero but unrepresentable; reordering cannot recover it.
    expect(2 ** -1174).toBe(0);
  });
  it('324 private scaling cannot recover an angle already rounded to zero', () => {
    const input = { speed: 2 ** 300, angle: Number.MIN_VALUE, gravity: 1 };
    expect(2 * input.angle * Math.PI / 180).toBe(0);
    expect(calculateProjectileScaled(input).value).toBe(0);
    // Multiplying speed factors later cannot undo angle conversion underflow.
    // Small-angle analytic witness: the positive result lies between these bounds
    // since 3 < pi < 4 and sin(x)/x is indistinguishable from 1 at this scale.
    expect((2 ** -474) / 30).toBeGreaterThan(0);
    expect((2 ** -474) / 30).toBeLessThan((2 ** -474) * 2 / 45);
  });
});
