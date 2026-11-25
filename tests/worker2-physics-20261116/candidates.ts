import { z } from 'zod';
import { coulombScaledSchema, projectileScaledSchema } from '../../src/lib/calculator-factory/experimental/physics-scaled';
import { roundFactorRatio } from './exact-factors';

/** Unregistered, unadmitted candidate identities. No live source-policy binding. */
export const candidateRevision = 'private.worker2.physics-numerics.20261116.1' as const;
export const candidateIdentities = Object.freeze({
  323: Object.freeze({ id: 'private.worker2.physics.coulomb-exact-ratio', version: 1, revision: candidateRevision }),
  324: Object.freeze({ id: 'private.worker2.physics.projectile-tiny-angle', version: 1, revision: candidateRevision }),
  325: Object.freeze({ id: 'private.worker2.physics.free-fall-exact-product', version: 1, revision: candidateRevision }),
});
const nonnegative = z.number().finite().min(0).max(1e100);
const freeFallSchema = z.object({ gravity: nonnegative, time: nonnegative }).strict();

export function calculateCoulombCandidate(input: unknown) {
  const x = coulombScaledSchema.parse(input);
  // Same binary64 constant as the retained implementation; no physical update.
  return { value: roundFactorRatio([8.9875517923e9, x.charge1, x.charge2], [x.distance, x.distance]) };
}

export function calculateFreeFallCandidate(input: unknown) {
  const x = freeFallSchema.parse(input);
  return { value: roundFactorRatio([0.5, x.gravity, x.time, x.time], []) };
}

export const tinyAngleLimit = 2 ** -500;
export function calculateProjectileCandidate(input: unknown) {
  const x = projectileScaledSchema.parse(input);
  if (x.angle <= tinyAngleLimit) {
    // For r=2*angle*Math.PI/180, 0<=r<2^-504 and
    // 0<=1-sin(r)/r<=r²/6<2^-1008 (r=0 handled by zero factors).
    // This is an explicit bounded approximation, not full-domain trig rounding.
    // Keep every factor separate: forming r first would destroy subnormal angles.
    return { value: roundFactorRatio([x.speed, x.speed, 2, x.angle, Math.PI], [180, x.gravity]) };
  }
  // Retain the binary64 libm operand and the positive90degree endpoint residual.
  const sine = Math.sin(2 * x.angle * Math.PI / 180);
  return { value: roundFactorRatio([x.speed, x.speed, sine], [x.gravity]) };
}
