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
