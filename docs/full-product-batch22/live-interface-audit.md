# Batch 22 remaining live interfaces

The exact remaining cohort is 43 published interfaces: 209 public minus Batch 20's 13 and Batch 21's 153 public interfaces. Batch 21's six unpublished interfaces are outside this subtraction. No previous journey is repeated. The JSON lists all identity/version/public URL references; URLs are not production acceptance.

The local source fixture uses actual CalculatorInteractive, account actions, presentation, and deterministic engines. Only browser transport and Next Link are synthetic. It does not establish production, authentication, persistence, publication, or certification acceptance.

Verification: 55 unit tests pass, including 11 initially failing capture tests. The 86 browser journeys pass at 360/1440 CSS pixels: 224 blank,224 malformed,448 nonfinite,104 valid-zero observations and 3584 disabled-control checks. All fields recover original results. Labels, keyboard Tab navigation, viewport parity, overflow, browser errors, request allowlisting and absence of persistence writes pass. Native numeric inputs may sanitize trusted malformed/nonfinite keyboard attempts.

All 43 interfaces now mount actual account controls. The 11 previously missing PhysicsBatch 3 workflows use existing CalculatorAccountActions with exact named engine inputs, registered identity/version and raw nullable output. Unit tests establish exact capture/engine agreement, invalid-state suppression, recovery and Free/Pro/Business mathematical parity. Actual JSON exports replay successfully for all 11 at both widths (22 journeys). Root's additive PhysicsBatch 3 verifier supplies explicit replay support; historical verifier contracts and engines are unchanged. These tests establish bounded local workflow behavior, not per-calculator entitlement-policy mandates.

Legacy Result already renders aria-live="polite", including invalid-input text. Absence of role="alert" alone is not an accessibility defect. Empirical screen-reader announcement acceptance remains unverified; no role changes were made.

The fixture remounts each calculator with an explicit identity wait after a single module load. Intermediate repeated-navigation attempts hit transient host ERR_NETWORK_CHANGED errors; the final successful run has no browser errors or disallowed requests. The lane changes only PhysicsBatch 3 Tool workflow wiring in shared application source; no mathematical, certification or publication source changed.
