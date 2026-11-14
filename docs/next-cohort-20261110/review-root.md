# Independent review of eight-contract companion

Reviewed source commit9e69a4426dfdcb107997c3c3d28c60dbf9ed7298 and metadata successor d996, on2026-11-10. This is finite engineering review, not competent canonical/source approval. No runtime edits, production queries, browser runs or full suite were performed in this review lane. Native/sharing/genuine-auth evidence was still being produced at review time and is not claimed here.

## Material findings sent to implementer

1. **Current primary capture does not use the new input boundary.** `src/components/calculator-interactive.tsx:416` still executes `runTechnology` followed by `validateTechnologyCapture`. The new `validateTechnologyNextCapture` is reached only by companion analysis/batch. For resolution input `{widthPixels:1e-320,heightPixels:1e100}`, the original schema accepts both positive finite dimensions; multiplication yields a normal positive result approximately1e-220; old capture validation checks the result and accepts it. Primary account actions therefore receive a result, while companion analysis and batch reject the subnormal input. This contradicts the newly stated common current-capture boundary. Apply the exact-eight current-input validator before presenting/capturing primary output, with an integration negative and recovery positive. Preserve immutable engine/history readers. This is not a request to prohibit fractional normal pixel dimensions.

2. **Zero-price inverse overstates its accepted domain.** `solveTechnologyNext` returns an inclusive interval `[0,1e100]` and the UI displays every point in it as possible. Its new input validator rejects every positive subnormal quantity, including `Number.MIN_VALUE`, even though those values lie within the interval. State the actual accepted set `{0} ∪ [2^-1022,1e100]` or explicitly qualify the interval as the original mathematical/schema envelope with capture exclusions. Test zero and a minimum-normal positive quantity as accepted, and a positive subnormal quantity as refused. The nonunique inverse and nonzero-target refusal are otherwise appropriate; do not manufacture one unique answer.

These findings require correction/review before this lane supports engineering completion for the new boundary claims. They do not establish a defect in immutable historical replay.

## Other inspected behavior

The exact closed identities are374/377/378/379/382/383v2/384/385. Website current version2 is selected explicitly; no new historical-v1 reader or implicit upgrade was introduced. Original schemas intentionally retain fractional dimensions, supplied headroom0–500percent, and genuine zero quantities/prices where allowed. Storage keeps only offered IEC units.

Goal solving holds the other inputs fixed and forwards the candidate through the original engine. The dedicated website formula avoids an underflowing unit-basis intermediate. Unsupported/nonfinite/subnormal targets and out-of-schema solved quantities are refused; output is not silently clamped. The reviewed tests include normal website extremes and zero-price nonuniqueness. This is finite review, not an exhaustive numerical-domain proof or source-applicability decision.

Batch parsing uses the closed descriptor's exact ordered columns, strict numeric parser and offered enums; bounds100rows/64KiB/4096characters apply before original-engine evaluation. It preserves individual row errors and refuses partial exports. Replay has exact outer/row keys, exact current version, registered-snapshot verification, original entered-row reevaluation and deep equality; it cannot silently turn websitev1 into currentv2 or accept changed output/raw/extra fields. Numerical consistency is accurately labelled unsigned rather than authenticated provenance. Numeric/closed-enum CSV values do not introduce a user-controlled spreadsheet formula channel. Batch is expressly local and does not imply persisted jobs or quota use.

The relationship table supplies explicit units and refused samples alongside the discrete SVG. Target errors use alerts; solved values use status; input-context changes hide stale solutions. Goal/sensitivity/scenario presentation uses central capability predicates; primary math and local batch remain available independently. These client predicates do not claim server authorization for protected history/native/sharing operations. The new caller insertion is restricted to the exact eight IDs and does not alter the old five companion.

## Outstanding evidence gates

The stated45 focused passes and type/lint outcome belong to the implementer's checkpoint; they were not rerun here. Current exact source guards are another lane. Genuine native/API/embed/jobs/shared/history/export acceptance, configured viewport/keyboard/error recovery observations and final exact-source CI remain required before a final engineering checkpoint. Actual reviewer appointment, source/precision/risk/applicability and canonical/certification/publication decisions remain unapproved independently of those engineering results.

## Resolution at6a8f10cb

Independently inspected actual corrective commit `6a8f10cb628b6f2735b184c1ca17c92b947b1b52` and its regression assertions. **Both findings above are resolved in this source.** They remain recorded above as the original9e69 findings, not current open defects.

The primary current-calculation path now conditionally calls `validateTechnologyNextCapture` for the exact registered eight-definition list, before output reaches presentation/account actions; other identities retain their original boundary. Publication20 result checks remain in place. The new integration case enters a subnormal resolution width with a normal product, asserts null account output, an alert and absence of analysis, then restores the worked example and checks2073600. It tests the original discrepancy without changing historical readers or immutable engines.

The zero-price solver now returns the inclusive normal interval `[2**-1022,1e100]` plus `includesZero:true`. The rendered result explicitly says `0 or` the normal interval; it no longer implies that positive subnormal quantities are supported. The library regression checks the normal lower bound and existing impossible-target refusal; the UI regression requires the separate zero alternative. No new numerical authority or unique inverse is manufactured.

The implementer reports original regression RED (1failure/8pass), then27 focused PASS after correction. This lane inspected the code and assertions rather than rerunning the suite. No remaining demonstrated defect in the reviewed companion scope blocks further engineering acceptance; the native/sharing/authentic-interface and final exact-source CI gates stated above still require their own actual evidence. Canonical/source/competent/operational approvals remain separate and ungranted.

## Subsequent379 unit-context finding

The current primary DPI page still uses `technologyConfig.dpi.unit='DPI'` for both the structured headline and `scenarioMetadataForResult` output unit, while its actual inputs are Pixels/Length(inches). The immutable source note explicitly says supplied linear pixel-count-per-inch ratio and denies printer-dot/display-pixel interchange; new native/batch return pixels/inch. This is a demonstrated presentation inconsistency under the already declared scope, independently of pending source applicability approval. It reaches current scenario/export context, not only the page title. The historical ID/title and old source formula wording remain immutable provenance and need not be renamed or replayed differently.

Proposed narrow resolution: one exact current-presentation descriptor for technology.dpi@1, used consistently by primary result, reconciliation/worked-example context and newly generated scenario/export display metadata, with label Linear pixel density and unit pixels/inch. Preserve original numerical engine/version and stored historical metadata/readers. Test current visible and captured units plus original historical replay preservation. This item remains open until that actual correction is reviewed.

No analogous defect is demonstrated merely by383's Monthly transfer in GB versus native GB/month or384's Monthly storage cost in currency units versus native currency units/month: the primary labels explicitly state the monthly period and consistently describe the monthly amount. Do not introduce an unnecessary contract revision from those abbreviations alone.

##379 resolution at3dede6fa

Independently inspected `3dede6fa4c084594c4f35b5b4b17dd469436d208` and current presentation consumers. The exact technology.dpi@1 helper now supplies Linear pixel density/pixels per inch to primary structured result, current reconciliation/worked-example context and new scenario display metadata. The integration assertion checks visible `300 pixels/inch`, captured output metadata, retained version1 and unchanged `{value:300,steps:['DPI = 300']}`. Helper tests preserve the fallback object and exclude other IDs/versions. Stored historical metadata/readers and numerical source remain unchanged. Current genuine six-journey storage/DPI evidence additionally records corrected pixels/inch in new local/recovered scenario JSON. **The379 presentation finding is resolved.** This is not source applicability or canonical acceptance.
