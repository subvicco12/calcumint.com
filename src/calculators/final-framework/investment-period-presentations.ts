import { referencePresentations } from "./reference-presentations";
import type { PresentationDefinition } from "./types";

/** Enable only the new certified-prefix projection surfaces; legacy callers stay unchanged. */
export const investmentPeriodPresentations = {
  sip: { ...referencePresentations.sip, supportsSchedule: true },
  compoundInterest: { ...referencePresentations.compoundInterest, supportsSchedule: true }
} as const satisfies Readonly<Record<string, PresentationDefinition>>;
