export type RoundingMode = "half-away-from-zero" | "floor" | "ceil" | "truncate";

export function roundTo(value: number, digits = 2, mode: RoundingMode = "half-away-from-zero"): number {
  if (!Number.isFinite(value)) {
    throw new RangeError("Cannot round a non-finite number");
  }
  if (!Number.isInteger(digits) || digits < 0 || digits > 12) {
    throw new RangeError("digits must be an integer between 0 and 12");
  }

  const factor = 10 ** digits;
  const scaled = value * factor;
  let rounded: number;

  switch (mode) {
    case "floor":
      rounded = Math.floor(scaled);
      break;
    case "ceil":
      rounded = Math.ceil(scaled);
      break;
    case "truncate":
      rounded = Math.trunc(scaled);
      break;
    default: {
      const absolute = Math.abs(scaled);
      const floatingTolerance = Number.EPSILON * Math.max(1, absolute) * 4;
      rounded = Math.sign(scaled) * Math.floor(absolute + 0.5 + floatingTolerance);
    }
  }

  return Object.is(rounded / factor, -0) ? 0 : rounded / factor;
}

export function assertFiniteNumber(value: number, label: string): void {
  if (!Number.isFinite(value)) {
    throw new RangeError(`${label} must be a finite number`);
  }
}
