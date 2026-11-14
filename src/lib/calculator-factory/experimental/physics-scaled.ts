import { z } from 'zod';
/** Private arithmetic successor; no registry adoption or canonical physical approval. */
export const physicsScaledRevision = 'private.physics-scaled.20261112.1' as const;
const signed = z.number().finite().min(-1e100).max(1e100);
const positive = z.number().finite().positive().max(1e100);
export const coulombScaledSchema = z.object({ charge1: signed, charge2: signed, distance: positive }).strict();
export const projectileScaledSchema = z.object({ speed: z.number().finite().min(0).max(1e100), angle: z.number().finite().min(0).max(90), gravity: positive }).strict();
function normalized(value: number): [number, number] {
  const exponent = Math.max(-1022, Math.min(1023, Math.floor(Math.log2(value))));
  let mantissa = value / 2 ** exponent;
  let adjusted = exponent;
  while (mantissa < 1) { mantissa *= 2; adjusted--; }
  while (mantissa >= 2) { mantissa /= 2; adjusted++; }
  return [mantissa, adjusted];
}

// Keep binary exponents separate until the complete product/quotient is known.
// No decimal logarithm or exponential reconstruction of the physical formula.
function scaledRatio(numerators: readonly number[], denominators: readonly number[]): number {
  if (numerators.some(x => !Number.isFinite(x)) || denominators.some(x => !Number.isFinite(x) || x === 0)) {
    throw new Error('Finite factors and nonzero denominators required');
  }
  let sign = 1;
  let mantissa = 1;
  let exponent = 0;
  for (const [factors, direction] of [[numerators, 1], [denominators, -1]] as const) {
    for (const factor of factors) {
      if (factor === 0) return 0;
      if (factor < 0) sign *= -1;
      const [part, power] = normalized(Math.abs(factor));
      mantissa = direction === 1 ? mantissa * part : mantissa / part;
      exponent += direction * power;
      const [reduced, adjustment] = normalized(mantissa);
      mantissa = reduced;
      exponent += adjustment;
    }
  }
  const magnitude = exponent > 1023 ? Infinity : exponent < -1075 ? 0
    : exponent < -1022 ? (mantissa * 2 ** (exponent + 1022)) * 2 ** -1022
    : mantissa * 2 ** exponent;
  if (!Number.isFinite(magnitude) || magnitude === 0) throw new Error('Calculated result is outside the supported finite range');
  return sign * magnitude;
}

export function calculateCoulombScaled(input: unknown) {
  const x = coulombScaledSchema.parse(input);
  return { value: scaledRatio([8.9875517923e9, x.charge1, x.charge2], [x.distance, x.distance]) };
}
export function calculateProjectileScaled(input: unknown) {
  const x = projectileScaledSchema.parse(input);
  return { value: scaledRatio([x.speed, x.speed, Math.sin(2 * x.angle * Math.PI / 180)], [x.gravity]) };
}
