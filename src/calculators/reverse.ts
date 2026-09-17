export type GoalSeekOptions = {
  min: number;
  max: number;
  tolerance?: number;
  maxIterations?: number;
  direction?: "increasing" | "decreasing";
};

export type GoalSeekResult = {
  value: number;
  achieved: number;
  target: number;
  error: number;
  iterations: number;
  converged: boolean;
};

function requireFinite(value: number, label: string): number {
  if (!Number.isFinite(value)) throw new Error(`${label} must be finite`);
  return value;
}

/** Deterministic bounded bisection for monotonic calculator reverse-solving. */
export function goalSeek(
  target: number,
  evaluate: (candidate: number) => number,
  options: GoalSeekOptions,
): GoalSeekResult {
  requireFinite(target, "Target");
  let low = requireFinite(options.min, "Minimum bound");
  let high = requireFinite(options.max, "Maximum bound");
  if (high <= low) throw new Error("Maximum bound must exceed minimum bound");
  const tolerance = options.tolerance ?? 1e-8;
  const maxIterations = options.maxIterations ?? 200;
  if (!Number.isFinite(tolerance) || tolerance <= 0) throw new Error("Tolerance must be positive and finite");
  if (!Number.isInteger(maxIterations) || maxIterations < 1 || maxIterations > 10000) throw new Error("maxIterations must be an integer from 1 to 10000");
  const direction = options.direction ?? "increasing";

  const lowValue = requireFinite(evaluate(low), "Lower-bound result");
  const highValue = requireFinite(evaluate(high), "Upper-bound result");
  const minOutput = Math.min(lowValue, highValue);
  const maxOutput = Math.max(lowValue, highValue);
  if (target < minOutput - tolerance || target > maxOutput + tolerance) throw new Error("Target is outside the modeled reverse-solver bounds");

  let candidate = low;
  let achieved = lowValue;
  let error = achieved - target;
  for (let iterations = 1; iterations <= maxIterations; iterations += 1) {
    candidate = (low + high) / 2;
    achieved = requireFinite(evaluate(candidate), "Goal-seek result");
    error = achieved - target;
    if (Math.abs(error) <= tolerance) return { value: candidate, achieved, target, error, iterations, converged: true };

    const moveLow = direction === "increasing" ? achieved < target : achieved > target;
    if (moveLow) low = candidate;
    else high = candidate;

    if (Math.abs(high - low) <= tolerance) return { value: candidate, achieved, target, error, iterations, converged: Math.abs(error) <= tolerance };
  }
  return { value: candidate, achieved, target, error, iterations: maxIterations, converged: false };
}
