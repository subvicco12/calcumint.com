import { launchDefinitions } from "../../calculators/launch-portfolio";
import { runCalculator } from "../../calculators/engine";

/** Candidate bindings copied from supplied register, not canonical approvals. */
export const wave1Bindings = [
  {
    "masterId": 209,
    "slug": "percentage-increase-calculator",
    "engineId": "launch-percentage-increase-calculator",
    "version": 1
  },
  {
    "masterId": 210,
    "slug": "percentage-decrease-calculator",
    "engineId": "launch-percentage-decrease-calculator",
    "version": 1
  },
  {
    "masterId": 218,
    "slug": "square-calculator",
    "engineId": "launch-square-calculator",
    "version": 1
  },
  {
    "masterId": 219,
    "slug": "cube-calculator",
    "engineId": "launch-cube-calculator",
    "version": 1
  },
  {
    "masterId": 220,
    "slug": "square-root-calculator",
    "engineId": "launch-square-root-calculator",
    "version": 1
  },
  {
    "masterId": 221,
    "slug": "cube-root-calculator",
    "engineId": "launch-cube-root-calculator",
    "version": 1
  },
  {
    "masterId": 225,
    "slug": "reciprocal-calculator",
    "engineId": "launch-reciprocal-calculator",
    "version": 1
  },
  {
    "masterId": 255,
    "slug": "hypotenuse-calculator",
    "engineId": "launch-hypotenuse-calculator",
    "version": 1
  },
  {
    "masterId": 256,
    "slug": "triangle-area-calculator",
    "engineId": "launch-triangle-area-calculator",
    "version": 1
  },
  {
    "masterId": 259,
    "slug": "rectangle-area-calculator",
    "engineId": "launch-rectangle-area-calculator",
    "version": 1
  },
  {
    "masterId": 260,
    "slug": "rectangle-perimeter-calculator",
    "engineId": "launch-rectangle-perimeter-calculator",
    "version": 1
  },
  {
    "masterId": 261,
    "slug": "square-area-calculator",
    "engineId": "launch-square-area-calculator",
    "version": 1
  },
  {
    "masterId": 262,
    "slug": "square-perimeter-calculator",
    "engineId": "launch-square-perimeter-calculator",
    "version": 1
  },
  {
    "masterId": 265,
    "slug": "circle-diameter-calculator",
    "engineId": "launch-circle-diameter-calculator",
    "version": 1
  },
  {
    "masterId": 266,
    "slug": "parallelogram-area-calculator",
    "engineId": "launch-parallelogram-area-calculator",
    "version": 1
  },
  {
    "masterId": 267,
    "slug": "trapezoid-area-calculator",
    "engineId": "launch-trapezoid-area-calculator",
    "version": 1
  },
  {
    "masterId": 273,
    "slug": "rectangular-prism-volume-calculator",
    "engineId": "launch-rectangular-prism-volume-calculator",
    "version": 1
  },
  {
    "masterId": 278,
    "slug": "pythagorean-theorem-calculator",
    "engineId": "launch-pythagorean-theorem-calculator",
    "version": 1
  },
  {
    "masterId": 279,
    "slug": "degrees-to-radians-calculator",
    "engineId": "launch-degrees-to-radians-calculator",
    "version": 1
  },
  {
    "masterId": 280,
    "slug": "radians-to-degrees-calculator",
    "engineId": "launch-radians-to-degrees-calculator",
    "version": 1
  }
] as const;
export type Wave1Witness = { id: string; masterId: number; kind: "numerical" | "boundary" | "rejection"; input: Record<string, unknown>; expected: number | null; derivation: string };
export const wave1Witnesses: readonly Wave1Witness[] = [
  {
    "id": "209-numerical",
    "masterId": 209,
    "kind": "numerical",
    "input": {
      "value": 64,
      "percent": 37.5
    },
    "expected": 88,
    "derivation": "64 + 64*3/8 = 88"
  },
  {
    "id": "209-boundary",
    "masterId": 209,
    "kind": "boundary",
    "input": {
      "value": 0,
      "percent": 0
    },
    "expected": 0,
    "derivation": "Zero accepted by actual schema"
  },
  {
    "id": "209-rejection",
    "masterId": 209,
    "kind": "rejection",
    "input": {
      "value": 1,
      "percent": -1
    },
    "expected": null,
    "derivation": "Actual schema rejects negative nonnegative field, prohibited zero, or numeric string without coercion"
  },
  {
    "id": "210-numerical",
    "masterId": 210,
    "kind": "numerical",
    "input": {
      "value": 64,
      "percent": 137.5
    },
    "expected": -24,
    "derivation": "64 - 64*11/8 = -24; decreases above 100 remain in implemented domain"
  },
  {
    "id": "210-boundary",
    "masterId": 210,
    "kind": "boundary",
    "input": {
      "value": 0,
      "percent": 0
    },
    "expected": 0,
    "derivation": "Zero accepted by actual schema"
  },
  {
    "id": "210-rejection",
    "masterId": 210,
    "kind": "rejection",
    "input": {
      "value": 1,
      "percent": -1
    },
    "expected": null,
    "derivation": "Actual schema rejects negative nonnegative field, prohibited zero, or numeric string without coercion"
  },
  {
    "id": "218-numerical",
    "masterId": 218,
    "kind": "numerical",
    "input": {
      "x": -1.25
    },
    "expected": 1.5625,
    "derivation": "(-5/4)^2 = 25/16"
  },
  {
    "id": "218-boundary",
    "masterId": 218,
    "kind": "boundary",
    "input": {
      "x": 0
    },
    "expected": 0,
    "derivation": "Zero accepted by actual schema"
  },
  {
    "id": "218-rejection",
    "masterId": 218,
    "kind": "rejection",
    "input": {
      "x": "1"
    },
    "expected": null,
    "derivation": "Actual schema rejects negative nonnegative field, prohibited zero, or numeric string without coercion"
  },
  {
    "id": "219-numerical",
    "masterId": 219,
    "kind": "numerical",
    "input": {
      "x": -1.5
    },
    "expected": -3.375,
    "derivation": "(-3/2)^3 = -27/8"
  },
  {
    "id": "219-boundary",
    "masterId": 219,
    "kind": "boundary",
    "input": {
      "x": 0
    },
    "expected": 0,
    "derivation": "Zero accepted by actual schema"
  },
  {
    "id": "219-rejection",
    "masterId": 219,
    "kind": "rejection",
    "input": {
      "x": "1"
    },
    "expected": null,
    "derivation": "Actual schema rejects negative nonnegative field, prohibited zero, or numeric string without coercion"
  },
  {
    "id": "220-numerical",
    "masterId": 220,
    "kind": "numerical",
    "input": {
      "x": 2.25
    },
    "expected": 1.5,
    "derivation": "(3/2)^2 = 9/4; principal root 3/2"
  },
  {
    "id": "220-boundary",
    "masterId": 220,
    "kind": "boundary",
    "input": {
      "x": 0
    },
    "expected": 0,
    "derivation": "Zero accepted by actual schema"
  },
  {
    "id": "220-rejection",
    "masterId": 220,
    "kind": "rejection",
    "input": {
      "x": -1
    },
    "expected": null,
    "derivation": "Actual schema rejects negative nonnegative field, prohibited zero, or numeric string without coercion"
  },
  {
    "id": "221-numerical",
    "masterId": 221,
    "kind": "numerical",
    "input": {
      "x": -15.625
    },
    "expected": -2.5,
    "derivation": "(-5/2)^3 = -125/8"
  },
  {
    "id": "221-boundary",
    "masterId": 221,
    "kind": "boundary",
    "input": {
      "x": 0
    },
    "expected": 0,
    "derivation": "Zero accepted by actual schema"
  },
  {
    "id": "221-rejection",
    "masterId": 221,
    "kind": "rejection",
    "input": {
      "x": "1"
    },
    "expected": null,
    "derivation": "Actual schema rejects negative nonnegative field, prohibited zero, or numeric string without coercion"
  },
  {
    "id": "225-numerical",
    "masterId": 225,
    "kind": "numerical",
    "input": {
      "x": -8
    },
    "expected": -0.125,
    "derivation": "1/(-8) = -1/8"
  },
  {
    "id": "225-boundary",
    "masterId": 225,
    "kind": "boundary",
    "input": {
      "x": 1
    },
    "expected": 1,
    "derivation": "Zero excluded; unit reciprocal is exact domain anchor, no finite minimum magnitude exists"
  },
  {
    "id": "225-rejection",
    "masterId": 225,
    "kind": "rejection",
    "input": {
      "x": 0
    },
    "expected": null,
    "derivation": "Actual schema rejects negative nonnegative field, prohibited zero, or numeric string without coercion"
  },
  {
    "id": "255-numerical",
    "masterId": 255,
    "kind": "numerical",
    "input": {
      "a": 5,
      "b": 12
    },
    "expected": 13,
    "derivation": "5^2+12^2 = 169 = 13^2"
  },
  {
    "id": "255-boundary",
    "masterId": 255,
    "kind": "boundary",
    "input": {
      "a": 0,
      "b": 0
    },
    "expected": 0,
    "derivation": "Zero accepted by actual schema"
  },
  {
    "id": "255-rejection",
    "masterId": 255,
    "kind": "rejection",
    "input": {
      "a": -1,
      "b": 2
    },
    "expected": null,
    "derivation": "Actual schema rejects negative nonnegative field, prohibited zero, or numeric string without coercion"
  },
  {
    "id": "256-numerical",
    "masterId": 256,
    "kind": "numerical",
    "input": {
      "base": 7.5,
      "height": 2.4
    },
    "expected": 9,
    "derivation": "(15/2)*(12/5)/2 = 9"
  },
  {
    "id": "256-boundary",
    "masterId": 256,
    "kind": "boundary",
    "input": {
      "base": 0,
      "height": 3
    },
    "expected": 0,
    "derivation": "Zero accepted by actual schema"
  },
  {
    "id": "256-rejection",
    "masterId": 256,
    "kind": "rejection",
    "input": {
      "base": -1,
      "height": 3
    },
    "expected": null,
    "derivation": "Actual schema rejects negative nonnegative field, prohibited zero, or numeric string without coercion"
  },
  {
    "id": "259-numerical",
    "masterId": 259,
    "kind": "numerical",
    "input": {
      "length": 3.5,
      "width": 2.25
    },
    "expected": 7.875,
    "derivation": "(7/2)*(9/4) = 63/8"
  },
  {
    "id": "259-boundary",
    "masterId": 259,
    "kind": "boundary",
    "input": {
      "length": 0,
      "width": 3
    },
    "expected": 0,
    "derivation": "Zero accepted by actual schema"
  },
  {
    "id": "259-rejection",
    "masterId": 259,
    "kind": "rejection",
    "input": {
      "length": -1,
      "width": 3
    },
    "expected": null,
    "derivation": "Actual schema rejects negative nonnegative field, prohibited zero, or numeric string without coercion"
  },
  {
    "id": "260-numerical",
    "masterId": 260,
    "kind": "numerical",
    "input": {
      "length": 3.5,
      "width": 2.25
    },
    "expected": 11.5,
    "derivation": "2*(7/2+9/4) = 23/2"
  },
  {
    "id": "260-boundary",
    "masterId": 260,
    "kind": "boundary",
    "input": {
      "length": 0,
      "width": 0
    },
    "expected": 0,
    "derivation": "Zero accepted by actual schema"
  },
  {
    "id": "260-rejection",
    "masterId": 260,
    "kind": "rejection",
    "input": {
      "length": -1,
      "width": 3
    },
    "expected": null,
    "derivation": "Actual schema rejects negative nonnegative field, prohibited zero, or numeric string without coercion"
  },
  {
    "id": "261-numerical",
    "masterId": 261,
    "kind": "numerical",
    "input": {
      "side": 1.25
    },
    "expected": 1.5625,
    "derivation": "(5/4)^2 = 25/16"
  },
  {
    "id": "261-boundary",
    "masterId": 261,
    "kind": "boundary",
    "input": {
      "side": 0
    },
    "expected": 0,
    "derivation": "Zero accepted by actual schema"
  },
  {
    "id": "261-rejection",
    "masterId": 261,
    "kind": "rejection",
    "input": {
      "side": -1
    },
    "expected": null,
    "derivation": "Actual schema rejects negative nonnegative field, prohibited zero, or numeric string without coercion"
  },
  {
    "id": "262-numerical",
    "masterId": 262,
    "kind": "numerical",
    "input": {
      "side": 2.125
    },
    "expected": 8.5,
    "derivation": "4*(17/8) = 17/2"
  },
  {
    "id": "262-boundary",
    "masterId": 262,
    "kind": "boundary",
    "input": {
      "side": 0
    },
    "expected": 0,
    "derivation": "Zero accepted by actual schema"
  },
  {
    "id": "262-rejection",
    "masterId": 262,
    "kind": "rejection",
    "input": {
      "side": -1
    },
    "expected": null,
    "derivation": "Actual schema rejects negative nonnegative field, prohibited zero, or numeric string without coercion"
  },
  {
    "id": "265-numerical",
    "masterId": 265,
    "kind": "numerical",
    "input": {
      "radius": 2.125
    },
    "expected": 4.25,
    "derivation": "2*(17/8) = 17/4"
  },
  {
    "id": "265-boundary",
    "masterId": 265,
    "kind": "boundary",
    "input": {
      "radius": 0
    },
    "expected": 0,
    "derivation": "Zero accepted by actual schema"
  },
  {
    "id": "265-rejection",
    "masterId": 265,
    "kind": "rejection",
    "input": {
      "radius": -1
    },
    "expected": null,
    "derivation": "Actual schema rejects negative nonnegative field, prohibited zero, or numeric string without coercion"
  },
  {
    "id": "266-numerical",
    "masterId": 266,
    "kind": "numerical",
    "input": {
      "base": 2.5,
      "height": 1.75
    },
    "expected": 4.375,
    "derivation": "(5/2)*(7/4) = 35/8"
  },
  {
    "id": "266-boundary",
    "masterId": 266,
    "kind": "boundary",
    "input": {
      "base": 0,
      "height": 3
    },
    "expected": 0,
    "derivation": "Zero accepted by actual schema"
  },
  {
    "id": "266-rejection",
    "masterId": 266,
    "kind": "rejection",
    "input": {
      "base": -1,
      "height": 3
    },
    "expected": null,
    "derivation": "Actual schema rejects negative nonnegative field, prohibited zero, or numeric string without coercion"
  },
  {
    "id": "267-numerical",
    "masterId": 267,
    "kind": "numerical",
    "input": {
      "a": 2.5,
      "b": 4.5,
      "height": 3.25
    },
    "expected": 11.375,
    "derivation": "(5/2+9/2)*(13/4)/2 = 91/8"
  },
  {
    "id": "267-boundary",
    "masterId": 267,
    "kind": "boundary",
    "input": {
      "a": 0,
      "b": 0,
      "height": 3
    },
    "expected": 0,
    "derivation": "Zero accepted by actual schema"
  },
  {
    "id": "267-rejection",
    "masterId": 267,
    "kind": "rejection",
    "input": {
      "a": -1,
      "b": 2,
      "height": 3
    },
    "expected": null,
    "derivation": "Actual schema rejects negative nonnegative field, prohibited zero, or numeric string without coercion"
  },
  {
    "id": "273-numerical",
    "masterId": 273,
    "kind": "numerical",
    "input": {
      "length": 1.5,
      "width": 2.5,
      "height": 3.5
    },
    "expected": 13.125,
    "derivation": "(3/2)*(5/2)*(7/2) = 105/8"
  },
  {
    "id": "273-boundary",
    "masterId": 273,
    "kind": "boundary",
    "input": {
      "length": 0,
      "width": 2,
      "height": 3
    },
    "expected": 0,
    "derivation": "Zero accepted by actual schema"
  },
  {
    "id": "273-rejection",
    "masterId": 273,
    "kind": "rejection",
    "input": {
      "length": -1,
      "width": 2,
      "height": 3
    },
    "expected": null,
    "derivation": "Actual schema rejects negative nonnegative field, prohibited zero, or numeric string without coercion"
  },
  {
    "id": "278-numerical",
    "masterId": 278,
    "kind": "numerical",
    "input": {
      "a": 8,
      "b": 15
    },
    "expected": 17,
    "derivation": "8^2+15^2 = 289 = 17^2"
  },
  {
    "id": "278-boundary",
    "masterId": 278,
    "kind": "boundary",
    "input": {
      "a": 0,
      "b": 0
    },
    "expected": 0,
    "derivation": "Zero accepted by actual schema"
  },
  {
    "id": "278-rejection",
    "masterId": 278,
    "kind": "rejection",
    "input": {
      "a": -1,
      "b": 2
    },
    "expected": null,
    "derivation": "Actual schema rejects negative nonnegative field, prohibited zero, or numeric string without coercion"
  },
  {
    "id": "279-numerical",
    "masterId": 279,
    "kind": "numerical",
    "input": {
      "degrees": 270
    },
    "expected": 4.71238898038469,
    "derivation": "3*pi/2 using independently rounded decimal pi reference"
  },
  {
    "id": "279-boundary",
    "masterId": 279,
    "kind": "boundary",
    "input": {
      "degrees": 0
    },
    "expected": 0,
    "derivation": "Zero accepted by actual schema"
  },
  {
    "id": "279-rejection",
    "masterId": 279,
    "kind": "rejection",
    "input": {
      "degrees": "1"
    },
    "expected": null,
    "derivation": "Actual schema rejects negative nonnegative field, prohibited zero, or numeric string without coercion"
  },
  {
    "id": "280-numerical",
    "masterId": 280,
    "kind": "numerical",
    "input": {
      "radians": 1.5707963267948966
    },
    "expected": 90,
    "derivation": "rounded pi/2 radians corresponds to 90 degrees"
  },
  {
    "id": "280-boundary",
    "masterId": 280,
    "kind": "boundary",
    "input": {
      "radians": 0
    },
    "expected": 0,
    "derivation": "Zero accepted by actual schema"
  },
  {
    "id": "280-rejection",
    "masterId": 280,
    "kind": "rejection",
    "input": {
      "radians": "1"
    },
    "expected": null,
    "derivation": "Actual schema rejects negative nonnegative field, prohibited zero, or numeric string without coercion"
  }
];
export function getWave1Definition(masterId: number) {
  const binding = wave1Bindings.find(row => row.masterId === masterId);
  const definition = binding && launchDefinitions.find(row => row.id === binding.engineId && row.version === binding.version && row.slug === binding.slug);
  if (!definition) throw new Error(`Missing exact wave1 binding ${masterId}`);
  return definition;
}
function deepFreeze<T>(value: T): T {
  if (value && typeof value === "object") { Object.values(value).forEach(deepFreeze); Object.freeze(value); }
  return value;
}
export function evaluateWave1Witness(witness: Wave1Witness) {
  const definition = getWave1Definition(witness.masterId);
  const input = deepFreeze(structuredClone(witness.input));
  const before = JSON.stringify(input);
  try {
    const run = runCalculator(definition, input);
    const replay = runCalculator(definition, deepFreeze(JSON.parse(JSON.stringify(run.input))));
    const result = run.output.result;
    // Plan labels are application concerns, absent from CalculatorContext. These
    // are identical engine invocations, never authenticated entitlement evidence.
    const planCompute = ["free", "pro", "business"].map(plan => ({ plan, artifact: runCalculator(definition, input) }));
    const tolerance = Math.max(Number.MIN_VALUE, Math.abs(witness.expected ?? 0) * 2e-15);
    return { id: witness.id, masterId: witness.masterId, accepted: true, result,
      numericalPass: witness.expected !== null && Math.abs(result - witness.expected) <= tolerance,
      immutable: before === JSON.stringify(input), replayParity: JSON.stringify(run) === JSON.stringify(replay),
      planComputeParity: planCompute.every(row => JSON.stringify(row.artifact) === JSON.stringify(run)), artifact: run };
  } catch (error) {
    return { id: witness.id, masterId: witness.masterId, accepted: false,
      rejectionPass: witness.kind === "rejection", immutable: before === JSON.stringify(input),
      error: error instanceof Error ? error.message : String(error) };
  }
}
export function evaluateWave1Witnesses() { return wave1Witnesses.map(evaluateWave1Witness); }

/** Probes retain actual input bounds; underflow is recorded, never called exact. */
export const wave1IeeeProbes = [
  { masterId: 218, input: {x: Number.MIN_VALUE}, mathematicalNonzero: true },
  { masterId: 219, input: {x: Number.MIN_VALUE}, mathematicalNonzero: true },
  { masterId: 259, input: {length: Number.MIN_VALUE, width: 0.5}, mathematicalNonzero: true },
  { masterId: 225, input: {x: Number.MIN_VALUE}, mathematicalNonzero: true },
  { masterId: 218, input: {x: Number.MAX_VALUE}, mathematicalNonzero: true },
] as const;
export function evaluateWave1IeeeProbes() {
  return wave1IeeeProbes.map(probe => {
    try { const result = runCalculator(getWave1Definition(probe.masterId), probe.input).output.result;
      return { ...probe, accepted: true, result, underflowToZero: result === 0 && probe.mathematicalNonzero };
    } catch (error) { return { ...probe, accepted: false, error: error instanceof Error ? error.message : String(error) }; }
  });
}
