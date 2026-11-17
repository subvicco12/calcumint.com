import { describe, expect, it } from 'vitest';
import {
  capacitanceCalculator as capacitance,
  coulombForceCalculator as coulomb,
  projectileMotionCalculator as projectile,
  freeFallCalculator as fall,
  angularVelocityCalculator as angular,
} from './catalog-batch-3';

// Analytical witnesses for existing version 1 contracts, not approved canonical scope.
// Expected literals are independent of golden fixtures and renderer/export code.
const context = { now: new Date('2026-11-12T00:00:00Z') };
const witnesses = [
  { calculator: capacitance, cases: [
    [{ charge: 0, voltage: 2 }, 0],
    [{ charge: -6, voltage: 3 }, -2],
    [{ charge: -6, voltage: -3 }, 2],
    [{ charge: 0.125, voltage: 0.5 }, 0.25],
    [{ charge: 1e100, voltage: 1e100 }, 1],
  ] },
  { calculator: coulomb, cases: [
    [{ charge1: 0, charge2: 1, distance: 2 }, 0],
    [{ charge1: 1e-6, charge2: -2e-6, distance: 2 }, -0.00449377589615],
    [{ charge1: -2e-6, charge2: 1e-6, distance: 2 }, -0.00449377589615],
    [{ charge1: -1e-6, charge2: -2e-6, distance: 2 }, 0.00449377589615],
    [{ charge1: 1e-6, charge2: 2e-6, distance: 4 }, 0.0011234439740375],
  ] },
  { calculator: projectile, cases: [
    [{ speed: 0, angle: 45, gravity: 10 }, 0],
    [{ speed: 20, angle: 0, gravity: 10 }, 0],
    [{ speed: 20, angle: 30, gravity: 10 }, 34.64101615137754],
    [{ speed: 20, angle: 60, gravity: 10 }, 34.64101615137754],
    [{ speed: 20, angle: 45, gravity: 20 }, 20],
  ] },
  { calculator: fall, cases: [
    [{ time: 0, gravity: 9.8 }, 0],
    [{ time: 2, gravity: 0 }, 0],
    [{ time: 0.5, gravity: 8 }, 1],
    [{ time: 4, gravity: 8 }, 64],
    [{ time: 2, gravity: 16 }, 32],
  ] },
  { calculator: angular, cases: [
    [{ angle: 0, time: 2 }, 0],
    [{ angle: -10, time: 4 }, -2.5],
    [{ angle: 0.5, time: 2 }, 0.25],
    [{ angle: 6, time: 4 }, 1.5],
    [{ angle: 1e100, time: 1e100 }, 1],
  ] },
] as const;

describe('physics five independent analytical witnesses', () => {
  for (const { calculator, cases } of witnesses) {
    for (const [input, expected] of cases) {
      it(`${calculator.slug}: ${JSON.stringify(input)}`, () => {
        const calculate = calculator.calculate as (input: unknown, ctx: typeof context) => { value: number; steps: readonly string[] };
        const output = calculate(input, context);
        expect(Number.isFinite(output.value)).toBe(true);
        // Relative check also catches tiny nonzero outputs; zero has no broad absolute tolerance.
        if (expected === 0) expect(output.value).toBe(0);
        else expect(Math.abs((output.value - expected) / expected)).toBeLessThan(1e-14);
        expect(output.steps).toEqual([calculator.title.replace(' Calculator', '') + ' = ' + output.value]);
      });
    }
  }
  for (const calculator of [capacitance, coulomb, projectile, fall, angular]) {
    for (const field of Object.keys(calculator.examples[0].input)) {
      for (const value of [NaN, Infinity, -Infinity, 1.000001e100]) {
        it(`${calculator.slug} directly rejects ${field}=${value}`, () => {
          const calculate = calculator.calculate as (input: unknown, ctx: typeof context) => unknown;
          expect(() => calculate({ ...calculator.examples[0].input, [field]: value }, context)).toThrow('Physics inputs are outside the supported domain');
        });
      }
    }
  }
});
