import { describe, expect, it } from 'vitest';
import { physicsCandidates } from './physics';
import { capacitanceCalculator, freeFallCalculator, angularVelocityCalculator } from '../../../calculators/physics/catalog-batch-3';
describe('private physics cohort', () => {
 it('preserves v1 engine identities for 322, 325, 327', () => {
  expect(physicsCandidates[0].engine).toBe(capacitanceCalculator);
  expect(physicsCandidates[3].engine).toBe(freeFallCalculator);
  expect(physicsCandidates[4].engine).toBe(angularVelocityCalculator);
 });
 it.each(physicsCandidates)('keeps catalog $catalogId explicitly blocked', candidate => {
  expect(candidate.unit).toBeNull();
  expect(candidate.blockers.length).toBeGreaterThan(0);
  expect(candidate.primaryKey).toBe('value');
 });
 it('produces source-supported v1 scalar results', () => {
  expect(capacitanceCalculator.calculate({ charge: -6, voltage: 3 }, {}).value).toBe(-2);
  expect(freeFallCalculator.calculate({ time: 3, gravity: 2 }, {}).value).toBe(9);
  expect(angularVelocityCalculator.calculate({ angle: -9, time: 3 }, {}).value).toBe(-3);
 });
});

it('uses distinct immutable draft identities with historical lineage', () => {
 for (const row of [physicsCandidates[1], physicsCandidates[2]]) {
  expect(row.engineId).toMatch(/^private\.physics-scaled\./);
  expect(row.engine.id).toBe(row.engineId);
  expect(row.version).toBe(1);
  expect(row.privateRevision).toBe('private.physics-scaled.20261112.1');
  expect(row.engine.reviewStatus).toBe('draft');
  expect(row.registered).toBe(false);
  expect(row.historicalEngine.version).toBe(1);
  expect(row.historicalEngine.id).not.toBe(row.engine.id);
 }
});
it('exposes all real input keys and literal source defaults', () => {
 expect(physicsCandidates.map(row => row.fields.map(field => [field.key, field.defaultValue]))).toEqual([
  [['charge', 10], ['voltage', 5]], [['charge1', 1e-6], ['charge2', 1e-6], ['distance', 1]],
  [['speed', 10], ['angle', 45], ['gravity', 10]], [['time', 2], ['gravity', 9.8]], [['angle', 6], ['time', 2]],
 ]);
});
