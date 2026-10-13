import { z } from "zod";
import { slopeCalculator } from "./catalog-completion";
import { calculateLegacySlopeCompatibility } from "./slope-legacy-compatibility";

/**
 * Owner-approved Slope snapshot contract. Isolated from the active registry,
 * public routes, persistence writes, and scenario re-evaluation.
 */
const versionedSlopeSnapshotSchema = z.object({
  calculatorSlug: z.literal("slope-calculator"),
  calculatorVersion: z.union([z.literal(1), z.literal(2)]),
  input: z.unknown(),
}).strict();

export function readVersionedSlopeSnapshot(value: unknown) {
  const snapshot = versionedSlopeSnapshotSchema.parse(value);
  if (snapshot.calculatorVersion === 1) {
    const legacy = calculateLegacySlopeCompatibility(snapshot.input);
    return {
      calculatorSlug: snapshot.calculatorSlug,
      calculatorVersion: 1 as const,
      input: legacy.legacyInput,
      output: legacy.legacyOutput,
      provenance: "historical-rise-run" as const,
    };
  }
  const input = slopeCalculator.inputSchema.parse(snapshot.input);
  return {
    calculatorSlug: snapshot.calculatorSlug,
    calculatorVersion: 2 as const,
    input: { ...input },
    output: slopeCalculator.calculate(input, {}),
    provenance: "coordinate-points" as const,
  };
}
