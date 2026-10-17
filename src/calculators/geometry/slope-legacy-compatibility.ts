import { z } from "zod";
import { slopeCalculator } from "./catalog-completion";

/**
 * Explicit legacy rise/run conversion for reviewed migration consumers only.
 * This module is NOT wired into the public registry or scenario re-evaluation.
 * Origin-anchored coordinates are derived; they are not historical points.
 */
const legacySlopeInputSchema = z.object({
  rise: z.number().finite(),
  run: z.number().finite().refine((value) => value !== 0, "Run must not be zero"),
}).strict();

export type LegacySlopeInput = z.infer<typeof legacySlopeInputSchema>;

export function calculateLegacySlopeCompatibility(input: unknown) {
  const legacy = legacySlopeInputSchema.parse(input);
  const coordinates = { x1: 0, y1: 0, x2: legacy.run, y2: legacy.rise };
  const parsed = slopeCalculator.inputSchema.parse(coordinates);
  const output = slopeCalculator.calculate(parsed, {});
  return {
    legacyInput: { ...legacy },
    derivedCoordinates: coordinates,
    legacyOutput: { result: output.value },
    coordinateOutput: output,
    provenance: "derived-origin-anchored" as const,
  };
}
