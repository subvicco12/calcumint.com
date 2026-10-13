import { z } from "zod";
import { slopeCalculator } from "./catalog-completion";
import { createCalculationSnapshot } from "../../lib/calculation-snapshot";

/**
 * Read-only, version-aware historical Slope snapshot decoder.
 * Preserves recorded output; never recomputes or writes historical data.
 * Not wired to public routes, the registry, or scenario re-evaluation.
 */
const versionedSlopeSnapshotSchema = z.object({
  calculatorSlug: z.literal("slope-calculator"),
  calculatorVersion: z.union([z.literal(1), z.literal(2)]),
  input: z.record(z.string(), z.unknown()),
  output: z.record(z.string(), z.unknown()),
}).strict();

const legacyInputSchema = z.object({
  rise: z.number().finite(),
  run: z.number().finite().refine((value) => value !== 0, "Run must not be zero"),
}).strict();
const legacyOutputSchema = z.object({ result: z.number().finite() }).strict();
const coordinateOutputSchema = z.object({
  value: z.number().finite(),
  dx: z.number().finite(),
  dy: z.number().finite(),
  steps: z.array(z.string()),
}).strict();

export function readVersionedSlopeSnapshot(value: unknown) {
  const snapshot = versionedSlopeSnapshotSchema.parse(value);
  if (snapshot.calculatorVersion === 1) {
    const input = legacyInputSchema.parse(snapshot.input);
    const output = legacyOutputSchema.parse(snapshot.output);
    return {
      ...createCalculationSnapshot({
        calculatorSlug: snapshot.calculatorSlug,
        calculatorVersion: 1,
        input,
        output,
      }),
      provenance: "historical-rise-run" as const,
    };
  }
  const input = slopeCalculator.inputSchema.parse(snapshot.input);
  const output = coordinateOutputSchema.parse(snapshot.output);
  return {
    ...createCalculationSnapshot({
      calculatorSlug: snapshot.calculatorSlug,
      calculatorVersion: 2,
      input,
      output,
    }),
    provenance: "coordinate-points" as const,
  };
}
