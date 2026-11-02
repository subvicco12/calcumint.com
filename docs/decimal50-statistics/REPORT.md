# Decimal50 statistics worker and private UI continuation

Baseline: draft PR #1520, `af94b00cee5e8ef53e2b6ecdf1501c6b45cbaee5`, with parent `7cdffeed3d5a8789689aa5495277e28b780227dc`. Exact remote head and ancestry verified. The first baseline check found CI #41500002652 IN_PROGRESS. The final bounded check established FAILURE: four verification workers passed; full-product failed on the historical six-packet hash check, and aggregate validation correctly failed. No hosted-green baseline was claimed. The exact demonstrated defect is repaired below. All continuation work is isolated and experimental; no certification or release authority is inferred.

## Exact-head CI repair

The old six-packet generator binds `calculator-interactive.tsx` at SHA-256 `ba2586177d83fff4df3655027e8ccb6224ee0a8a5728e4469e6b2e6953312917`; #1520's intentional input-boundary successor has SHA-256 `3ebe8c6bf522dcc8dda9c11bc903655befe384a9f180e2c9dfaf859ff493f03a`. Comparing old packet output against current source therefore failed. The old generator, original 90 pending decisions and all historical packet bytes remain untouched.

A new historical checker pins the exact capture `c1c7371ac4f284ff7b6371a90fb3296c632396f9`, verifies both current historical outputs byte-for-byte, verifies all 21 frozen source bindings, then runs the original generator on an isolated materialization of those exact blobs. Twenty unchanged current bound sources must still equal the capture; the sole intentionally revised caller must equal exact #1520 `af94b00...`, never arbitrary current bytes. Missing captures, mutations and symlinks fail closed. Eight regression tests pass, independently rerun. CI fetches both exact objects explicitly for shallow checkouts.

Only the historical packet command is replaced. Current-source numerical validation and both six-calculator browser campaigns remain mandatory; all five CI workers and aggregate success guards are preserved. The verified historical packet is not represented as current canonical scope or approval. This repairs the previous increment's missed historical check without normalizing hashes or fabricating new evidence.

## Completed engineering subscopes

For both catalog #282 Standard Deviation and #283 Variance:

- A dedicated module Worker runs the unchanged Decimal50 core. Each job uses a fresh worker; supersession, cancellation, disposal, errors and deadline settlement terminate it. Old callbacks cannot replace a newer result. There is no main-thread computation fallback.
- Input/message shape, dense arrays, row count, per-token and aggregate character budgets are validated before posting. Descriptors/accessors, sparse/extra array entries, prototype keys, malformed rows and mismatched job/catalog/contract/algorithm/source bindings fail closed.
- Default hard safety deadline is 5,000ms, configurable only within 1–10,000ms. This operational ceiling is distinct from the contract's still-unproven 500ms warm p95 target; it does not establish performance certification.
- The private UI starts with an empty dataset and no population/sample selection. It provides explicit raw observations or value,frequency rows, unit metadata, strict line grammar, user-confirmed missing omission, examples, Calculate/Cancel and recoverable linked/focused errors.
- Exact input strings and the existing result/contract/source/numerical provenance survive execution, display, scenarios and JSON. Standard Deviation and Variance keep their separate primary results and original/squared units. Every plan computes the same core.
- Previous valid outputs are marked stale after edits/errors. New input and import edits invalidate old jobs. Async export/replay rechecks entitlement after awaiting work; downgrade cannot leak a delayed export. Catalog changes dispose the previous session.
- Pro/Business central capabilities enable session-only A/B capture/restore and JSON export/replay. No account save or persistence is claimed. Replay checks digest and exact binding, recomputes in a worker and compares the complete artifact before restoration. Tamper and rehashed forged output remain rejected by the existing recomputation path.

The reviewed defect in draft reconstruction is corrected: a valid imported artifact may carry row.missing flags or null metadata that this narrow editor cannot reproduce. Such a snapshot is rejected explicitly as not losslessly representable, instead of being shown as Current with different visible inputs. Its prior draft/result remains unchanged and export is disabled while the error is present. Same-editor exports round-trip normally. No new missing-marker language was invented.

## Private access and safety

Run `node scripts/statistics-preview.mjs`, then open the printed loopback URL. Username is `reviewer`; a per-run random password is written only to the printed owner-protected temporary file, not printed as a password or committed. Use `?id=282&plan=pro` or `?id=283&plan=business` for isolated capability review. Plan selection is a synthetic fixture context, not authenticated commercial entitlement proof.

Every page, source and worker request requires reviewer Basic authentication, exact local Host/Origin and GET/HEAD. Public assets/environment loading are disabled; sensitive files are denied; private/no-store headers remain. No Next/public calculator route, registry, lifecycle, database or original DRAFT was added or changed. The preview's port-0 bug was reproduced under concurrent tests and corrected: Vite's default-port behavior is bypassed by explicit ephemeral loopback allocation. A regression verifies concurrent independent servers and rejects credential reuse between them.

## Acceptance evidence

Final local checks: 7,431 unit tests passed (4 existing skips), 45 launch checks, 15 certification guards, 57 CI guards and 8 historical-repair tests. Final typecheck and webpack build exited 0. A test-only oracle typing error found at the earlier build stage was corrected; its 40 cases, scoped lint, typecheck and build were rerun rather than reporting the failed full-command attempt as successful.

- New mandatory worker-oracle suite executes the actual worker module for all 20 retained Python Fraction/100–200-digit reference fixtures on each of #282/#283: 40 cases, 560 raw metric comparisons at relative 1e-40 for nonzero values and exact zero. The original numerical fixtures/core were reused unchanged. This handler test is not itself browser isolation; the browser suite separately tests real Workers.
- Deterministic worker lifecycle/protocol tests cover supersession/stale callbacks, cancellation/disposal, deadlines, startup/post/decode errors, exact binding, resource limits and invalid data shapes. UI tests cover explicit modes, missing data, cancellation/stale import suppression, capability transitions, exact export and lossless replay refusal.
- Actual Chromium passes 12 calculator × plan × viewport combinations: #282/#283, Free/Pro/Business, 320/1440px. It verifies empty explicit mode, error focus, sample [1,2,3] variance/SD 1, unit distinction, current/stale state, session capture/restore, exported JSON bytes and digest-tamper rejection where enabled, explicit omission and population frequency N=10,000,000 with variance .01 and SD .1.
- A posted 10,000-row job is cancelled before completion; the native Worker lifecycle audit records a terminate call for every created worker (created==terminated), then a fresh job returns variance 1. The large stress text was loaded through the native DOM setter/input event after Chromium's trusted bulk insert command stalled. This is not a trusted bulk-paste receipt. Ordinary matrix text entry uses trusted CDP input; physical-device/assistive/paste acceptance remains open.
- Snapshot producer/reader resource limits, immutable math/version/source records and all existing numerical guards are retained. The untouched 44-candidate queue remains independently runnable and is not coupled to these modules.

`validation.json` records final commands/results and failed attempts. The first browser harness had selector/readiness errors; real Worker startup then correctly hit its deadline because page-only injected auth did not cover worker imports. Native challenged Basic authentication fixed the harness without bypassing any auth or deadline. The first full run exposed concurrent default-port collisions; the final full run follows the port fix. Failed attempts are not approvals or passing QA.

## Requirement dispositions

`requirements.json` binds exact source feature IDs to the newly verified subscopes. Worker lifecycle/bounded messages, strict editor-mode/input handling and session JSON/scenario operations are implemented subscopes. ST-INPUT/FREQ/UNITS/TIER and SH-02/04/05/08/09/10/11/12/13/14 remain partial at full-product level. A successful preview does not establish complete import, UX, workflow, source or numerical acceptance.

Still missing: full histogram/rational bins and contribution visualization, sensitivity, reverse/transform analysis, complete CSV/PDF/report-byte and assistive acceptance, authenticated ownership/history/scenario persistence, full workflow comparison, benchmark/SLO evidence and allocated registered successor/canonical routing. The preview displays audit metrics and counts, not all full-contract dataset/contribution views. Full scientific/domain/source and accountable reviewer decisions remain required; no N/A or formal pass was manufactured.

## Preservation and release

All 540 identities, 424 acceptance records, 14 original DRAFTs, 43 authority blockers, immutable v1 definitions/history and 194 protected sources remain unchanged. Existing full-six package/source bindings and the 44-candidate queue verify unchanged. No production SQL, migration activation, certification, lifecycle writes, publication, merge or deployment occurred.

Newly canonical-accepted calculators: 0. Newly publication-eligible calculators: 0. Newly live calculators: 0. RELEASE HOLD remains active. The draft successor's exact SHA and single hosted CI observation are reported with delivery; local validation is never presented as hosted success.
