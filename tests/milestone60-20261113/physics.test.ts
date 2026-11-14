import { describe, expect, it } from 'vitest';
import { physicsCandidates } from '../../src/lib/calculator-factory/cohorts/physics';
import { physicsCompletionReview } from '../../src/lib/calculator-factory/completion/physics';
import type { PhysicsObservedDomain } from '../../src/lib/calculator-factory/completion/physics-domain';

describe('observed physics domain evidence stays bound to exact candidate schemas', () => {
  for (const candidate of physicsCandidates) {
    const review = physicsCompletionReview.find(row => row.catalogId === candidate.catalogId)!;
    const defaults = Object.fromEntries(candidate.fields.map(field => [field.key, field.defaultValue]));
    for (const [field, domain] of Object.entries(review.observedArithmetic.fields) as [string, PhysicsObservedDomain][]) {
      it(`${candidate.catalogId} ${field} finite endpoints, zero and invalid inputs`, () => {
        const accepts = (value: number) => candidate.engine.inputSchema.safeParse({ ...defaults, [field]: value }).success;
        expect(accepts(domain.minimum)).toBe(!(domain.excludesZero && domain.minimum === 0));
        expect(accepts(domain.maximum)).toBe(true);
        expect(accepts(0)).toBe(!domain.excludesZero);
        for (const invalid of [NaN, Infinity, -Infinity, -1e101, 1e101]) expect(accepts(invalid)).toBe(false);
        expect(domain.unit).toBeNull();
      });
    }
    it(`${candidate.catalogId} retains separate identity and authority`, () => {
      expect(review.observedArithmetic.privateSuccessor).toBe(!candidate.registered);
      expect(review.identity).toEqual({ id: candidate.engineId, slug: candidate.slug, version: candidate.version });
      expect(review.canonicalUnit).toBeNull();
      expect(review.publisherSource).toBeNull();
      expect(review.completion).toBe('BLOCKED_SOURCE_AND_UNIT_CONTRACT');
    });
  }
  it.each([
    [322, { charge: Number.MIN_VALUE, voltage: 1e100 }],
    [325, { time: 1e100, gravity: Number.MIN_VALUE }],
    [327, { angle: Number.MIN_VALUE, time: 1e100 }],
  ])('records historical underflow for %s without substituting a successor', (id, input) => {
    const candidate = physicsCandidates.find(row => row.catalogId === id)!;
    expect(candidate.engine.calculate(input as never, {}).value).toBe(0);
    expect(candidate.registered).toBe(true);
  });
});
