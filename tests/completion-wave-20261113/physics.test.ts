import { describe, expect, it } from 'vitest';
import { physicsPresentation, physicsRetainedWorkflowApplies } from '../../src/lib/completion-wave-20261113/physics';

const identities = [
 [322, { id: 'physics.capacitance', slug: 'capacitance-calculator', version: 1 }],
 [325, { id: 'physics.free-fall', slug: 'free-fall-calculator', version: 1 }],
 [327, { id: 'physics.angular-velocity', slug: 'angular-velocity-calculator', version: 1 }],
] as const;
describe('physics retained workflow identity applicability', () => {
 it.each(identities)('applies only to retained identity for %s', (id, identity) => {
  expect(physicsRetainedWorkflowApplies(id, identity)).toBe(true);
  expect(physicsRetainedWorkflowApplies(id, { ...identity, version: 2 })).toBe(false);
  expect(physicsRetainedWorkflowApplies(id, { ...identity, slug: 'other' })).toBe(false);
  expect(physicsRetainedWorkflowApplies(id, { ...identity, privateRevision: 'other' })).toBe(false);
 });
 it.each([323, 324])('never transfers historical workflow to private successor %s', id => {
  expect(physicsRetainedWorkflowApplies(id, { id: id === 323 ? 'private.physics-scaled.coulomb-force' : 'private.physics-scaled.projectile-range', slug: id === 323 ? 'private-physics-scaled-coulomb-force' : 'private-physics-scaled-projectile-range', version: 1, privateRevision: 'private.physics-scaled.20261112.1' })).toBe(false);
 });
});
describe('actual-engine scalar and sampled graph presentation', () => {
 it.each([
  [322, { charge: -6, voltage: 3 }, 'charge', [-6, 0, 6], [-2, 0, 2]],
  [325, { time: 3, gravity: 2 }, 'time', [0, 1, 3], [0, 1, 9]],
  [327, { angle: -9, time: 3 }, 'angle', [-9, 0, 9], [-3, 0, 3]],
  [323, { charge1: 1, charge2: -1, distance: 1 }, 'distance', [1, 2], [-8.9875517923e9, -2.246887948075e9]],
  [324, { speed: 10, angle: 45, gravity: 10 }, 'speed', [0, 10, 20], [0, 10, 40]],
 ] as const)('calculates %s samples with explicit scalar units unset', (id, input, axis, samples, expected) => {
  const result = physicsPresentation(id, input, { field: axis, samples });
  expect(result.graph.points.map(p => p.value)).toEqual(expected);
  expect(result.value).toBe(expected[samples.indexOf(input[axis as keyof typeof input] as never)]);
  expect(result.units).toBeNull();
  expect(result.releaseHold).toBe(true);
  expect(result.steps.operands).toEqual(input);
  expect(result.steps.engineSteps.length).toBeGreaterThan(0);
  expect(result.graph.kind).toBe('discrete-engine-samples');
 });
 it('retains private underflow recovery and historical endpoint behavior', () => {
  const coulomb = physicsPresentation(323, { charge1: 1e-200, charge2: 1e-200, distance: 1e-100 }, { field: 'distance', samples: [1e-100] });
  expect(coulomb.value / 8.9875517923e-191).toBeCloseTo(1, 14);
  expect(coulomb.identity.privateRevision).toBe('private.physics-scaled.20261112.1');
  expect(coulomb.retainedWorkflowApplicable).toBe(false);
  const projectile = physicsPresentation(324, { speed: 1e-200, angle: 45, gravity: 1e-300 }, { field: 'angle', samples: [45] });
  expect(projectile.value / 1e-100).toBeCloseTo(1, 14);
  expect(physicsPresentation(324, { speed: 10, angle: 90, gravity: 10 }, { field: 'angle', samples: [90] }).value).toBeGreaterThan(0);
 });
 it.each([
  [322, { charge: 1, voltage: 0 }, 'charge', [1]],
  [323, { charge1: 1, charge2: 1, distance: 0 }, 'distance', [1]],
  [324, { speed: 1, angle: 91, gravity: 1 }, 'angle', [45]],
  [325, { time: -1, gravity: 1 }, 'time', [1]],
  [327, { angle: 1, time: 0 }, 'angle', [1]],
  [322, { charge: 1, voltage: 1, extra: 3 }, 'charge', [1]],
  [322, { charge: 1, voltage: 1 }, 'unknown', [1]],
  [322, { charge: 1, voltage: 1 }, 'voltage', [0]],
  [322, { charge: 1, voltage: 1 }, 'charge', [Infinity]],
  [322, { charge: 1, voltage: 1 }, 'charge', []],
  [323, { charge1: 1, charge2: 1, distance: Number.MIN_VALUE }, 'charge1', [1]],
  [324, { speed: Number.MIN_VALUE, angle: 45, gravity: 1 }, 'angle', [45]],
 ] as const)('refuses invalid scalar or graph domain %s %j', (id, input, field, samples) => {
  expect(() => physicsPresentation(id, input, { field, samples })).toThrow();
 });
 it('rejects sparse graph samples rather than returning unevaluated holes', () => {
  expect(() => physicsPresentation(322, { charge: 1, voltage: 1 }, { field: 'charge', samples: Array(2) })).toThrow();
 });
 it('rejects unknown catalog IDs and excessive samples', () => {
  expect(() => physicsPresentation(326, {}, { field: 'time', samples: [1] })).toThrow();
  expect(() => physicsPresentation(322, { charge: 1, voltage: 1 }, { field: 'charge', samples: Array(102).fill(1) })).toThrow();
 });
 it('preserves representable subnormals and inherited v1 underflow without silently changing engines', () => {
  expect(physicsPresentation(322, { charge: Number.MIN_VALUE, voltage: 1 }, { field: 'charge', samples: [Number.MIN_VALUE] }).value).toBe(Number.MIN_VALUE);
  expect(physicsPresentation(327, { angle: Number.MIN_VALUE, time: 1 }, { field: 'angle', samples: [Number.MIN_VALUE] }).value).toBe(Number.MIN_VALUE);
  expect(physicsPresentation(324, { speed: 1e-200, angle: 45, gravity: 1e-80 }, { field: 'angle', samples: [45] }).value).toBe(1e-320);
  expect(physicsPresentation(325, { time: 1, gravity: Number.MIN_VALUE }, { field: 'time', samples: [1] }).value).toBe(0);
 });
 it('preserves zero-gravity and signed arithmetic scope without assigning units', () => {
  expect(physicsPresentation(325, { time: 2, gravity: 0 }, { field: 'time', samples: [0, 2] }).value).toBe(0);
  expect(physicsPresentation(322, { charge: -6, voltage: -3 }, { field: 'charge', samples: [-6] }).value).toBe(2);
 });
});
