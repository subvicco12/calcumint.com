# Owner-authorized DRAFT Math and Conversion batch

RELEASE HOLD. The current owner instruction authorizes implementation only when identity is unambiguous, the deterministic contract is complete, and independent golden tests are possible. It does not approve public mappings, specialist decisions, certification or publication.

Baseline: main `caffafe639350ca0c2c2cf33ae1f099294f5af54`; local cumulative candidate `7f31398fa640f193a1bf199596f7024a1bc58028`. PR heads #1441–#1451 were checked once and their rollups were SUCCESS. This branch preserves their existing cumulative work; the new batch touches no billing, auth, migration, SIP or historical engine files.

| Master | Name | DRAFT engine |
|---|---|---|
|205|Basic Calculator|`src/calculators/core/draft-master-205.ts`|
|232|Big Number Calculator|`src/calculators/core/draft-master-232.ts`|
|233|Random Number Generator|`src/calculators/core/draft-master-233.ts`|
|435|Fuel Economy Converter|`src/calculators/conversion/draft-master-435.ts`|
|441|Digital Resolution Converter|`src/calculators/conversion/draft-master-441.ts`|

Each engine has a colocated test and independent fixtures in `src/calculators/verification/fixtures/draft-master-*-goldens.*`. Exact-decimal helpers are draft-only; registered engines do not import them. Basic and conversion arithmetic uses rational BigInt intermediates and one final 34-significant-digit half-even rounding. Big Number preserves signed exact integers and truncating quotient/remainder. PCG uses explicit seed, stream, version, inclusive integer bounds and bounded rejection; it is not cryptographic randomness.

The private `draft-math-conversion` adapter reuses the Final renderer, immutable snapshots, CSV and JSON. Exact values stay strings; numeric-only analytics are deliberately unavailable. Tests cover all plans through the same engine result. No route or discovery registration is added. Master 435 is distinct from automotive master 459; master 441 is the researched CSS density contract, not pixel-count or print-size inference.

## Evidence and remaining gates

- 132 focused tests pass, including 25 ordered conversion pairs, signed ties, 4096-digit integers, official PCG seed42/stream54 vectors, direct-call rejection, exact exports, immutable capture and all-plan renderer parity.
- Typecheck and affected TypeScript lint pass. Certification guard tests: 15 pass; no status changes.
- Independent review added 23 decimal boundary tests and checked exact-rational conversion and PCG metadata.
- A cumulative local webpack build is recorded at the integration checkpoint; exact-head Actions remains the authoritative automated PR evidence.
- No real-device/viewport claim is made by static renderer tests. Existing shared layout is reused.

Existing 540-row registry classification stays 291 single candidates, 245 unlinked, four multiple candidates; the registry stays 574 definitions. Five explicit DRAFT implementation overlays do not manufacture registry linkage or public approval. Across both independent planned batches, ten entries qualify under the conditional authorization; the separate applied-quantity batch is not included in this branch until integrated.

Exclusions: 207/426 require reused-identity decisions; 206 needs a concrete pinned numerical dependency/reference policy; 254 has a reproduced convergence failure and remains blocked. Finance, clinical and other specialist-dependent proposals remain excluded. All 1,636 external authority requests remain UNKNOWN.

Next: review these five new definitions and numerical policies, integrate the independently tested applied-quantity batch, then consider registration only under separate authorization. Certification, publication and production deployment remain prohibited.
