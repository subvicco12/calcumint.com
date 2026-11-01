# PR1517 CI repair and publication QA evidence

## Outcome

The exact-head CI failure was reproduced and repaired locally. All five required verification jobs remain mandatory. **Newly established publication eligibility: 0. All 1,207 QA requests remain PENDING.** RELEASE HOLD remains active.

Baseline: PR #1517, `9b6b4cfc846b942294cc44350c1338f1c0d1c09c`; parent `c1c7371ac4f284ff7b6371a90fb3296c632396f9`. Hosted run #41329771877 failed. The build, checks and publication-factory jobs succeeded; source-acceptance and full-product failed at cache-contract assertions, and the aggregate correctly failed. The draft successor's exact SHA and hosted CI disposition are reported in Git/PR delivery metadata; original failed-run metadata is retained rather than rewritten.

## CI correction

The previous PR added a fifth verification job but its historical npm-cache guard still expected four exact cache blocks. The real workflow had five: the normal comparison failed, while a mutation removing one valid cache could accidentally restore the old count and evade that count-only guard. Both failures were reproduced with the exact baseline test.

The guard now derives verification jobs from the actual workflow, requires the protected checks/build/full-product/source-acceptance/publication-factory set and every other declared verification job in the aggregate, and checks one exact lockfile-keyed npm-download cache and fresh npm-ci contract per job. Unknown declaration syntax fails closed. A future correctly cached/gated job fixture is accepted without editing an ordinal count; missing/ungated/unsupported jobs are rejected.

Aggregate validation requires an exact conjunction of one success check per workflow-derived result binding and always-run behavior. Actual Bash execution tests all-success plus each non-success status (failure, cancellation, skip, timeout, empty, unknown) for every job. Deleted guards are rejected. This proves the conjunction for arbitrary combinations without expanding the obsolete four-axis Cartesian test into 16,807 subprocesses. Historical comparison still preserves original command bytes and the named job budgets; no test/security/certification step is disabled or waived.

Focused workflow regressions: **56 pass**. All five jobs and their budgets remain unchanged; a short QA-evidence check is added inside the existing publication-factory job, not a sixth job. Its existing browser campaign remains mandatory. Mandatory local `npm run test:production` passes: **7,213 tests, four existing skips**, launch 45, certification 15, lint zero errors/29 existing warnings, typecheck and `next build --webpack`. New QA proof tests pass separately. No calculator engine, historical reader, application behavior or schema was changed in this repair.

## Input verification and provenance

The attached ZIP SHA256 is `447a7fb8998923c16af4e86a5927a085e4cd3d9dba4c8a14b649b8af353b867c`. ZIP CRC, all 208 root-manifest files and the exact archive file set were verified locally. All 36 supplied baseline input files were compared byte-for-byte to the committed PR1517 tree and matched. This verifies package/source integrity, not publisher authenticity or qualified approval.

A selected immutable subset is retained in `input/`, with the original complete manifest. CI verifies that subset and every supplied QA evidence pointer against the existing unchanged repository artifacts. The full original ZIP is not duplicated in Git. `package-integrity.json` distinguishes full local archive verification from retained-subset CI verification. No broad inventory, source capture or historical mathematical campaign was restarted.

All six updated version-bound packets are retained: #276 geometry.slope v2; #283 statistics.variance v1; #282 statistics.standard-deviation v1; #275 geometry.volume v1; #251 advanced-math.function-plotter-2d v1; #235 advanced-math.graphing v1. Their source-established facts and edition distinctions are reused as provided; they are not sent back for owner reconfirmation. Original owner choices, reviewer competence, pending approvals and missing full-scope proofs remain intact. None belongs to the 76-profile campaign, and no campaign evidence is transferred to them.

## New, bounded proof for the 228 priority requests

- **76 performance records:** actual first execution after module import plus 30 serial warm executions of the exact profile's first known fixture, with raw samples, median and nearest-rank p95. The first artifact/input hashes match the existing per-ID receipts. This is a local Node validation/export-pipeline observation, not cold startup, worst-case input, browser/network/concurrency or production-SLO acceptance. Eight exact loan profiles also execute their already-declared 1,200-month bound at zero rate: actual schemas accept the inputs, payment is 1 and the schedule has 1,200 rows. One first execution and five warm calls per stress fixture are recorded. This is a declared-term stress case for those eight only, not a claim about every worst-case dimension. No budget or PASS threshold is invented.
- **76 entitlement supplements:** actual central policy/capability declarations and one shared actual private history-save closure evaluated at 19/20/99/100 existing records across Free/Pro/Business. Twelve local cases show the Free limit and separate private resource cap; denied writes retain original bytes. Controlled React hooks/in-memory storage are explicitly not browser interaction, 76 authenticated tests, tenant isolation or server authorization. Those proofs remain missing.
- **76 SEO blocker records:** actual local registered-engine lookups find none of these private engine/version tuples. Canonical URLs remain null. The local registry also contains nonpublic definitions; this establishes no fresh hosted state. This is negative binding evidence, not canonical metadata/content/structured-data/indexability acceptance, and not N/A.

The original 152 mathematical-witness and 152 browser receipts are reused. New timing observations do not become new numerical goldens or whole-criterion approvals. The standalone queue builder verifies all supplemental invariants and source hashes; it cannot silently consume weakened proof flags. Supplemental metadata cannot select files outside repository evidence roots.

## Exact dispositions and reviewer queue

| Request group | Count | Disposition |
|---|---:|---|
| Entitlement/performance/SEO | 228 | New narrow proof supplements; full criterion still incomplete |
| Existing partial engine/security/scenario/responsive/accessibility evidence | 380 | Original partial evidence/gaps retained for adjudication |
| Reverse/visualization/schedule/sensitivity | 304 | Applicability-sensitive; no invented implementation or N/A |
| Mathematical review | 76 | Competent reviewer decisions pending |
| YMYL specialist review | 67 | Qualified decisions pending |
| Source evidence/applicability | 76 | Original obligations pending |
| Methodology/owner choices | 76 | Original decisions pending |
| Total | 1,207 | All PENDING; no approvals |

`qa-closure.json` provides 76 per-ID summaries, exact request tuples, immutable source-record pointers, new proof subscopes and prioritized reviewer groups. Original dispositions, evidence, gaps, risk and scope are checked before projection; substitutions, omissions, promotions and invented N/A are rejected. Full original rows remain in the retained register rather than being duplicated. The 304 requests are not assumed to represent 304 missing features: only an accountable exact requirement/applicability decision can establish what must be implemented. No such decision was manufactured.

Next reviewer work: adjudicate only the proven subscope of the 380 records; inspect the 228 additions and request authentic entitlement, representative performance budgets/workloads and canonical SEO proof; resolve the 304 exact applicability questions; retain the 76 mathematics, 67 YMYL, 76 source and 76 owner decisions. Separate six-candidate packets retain their own competent review and full-product requirements. A source-established mathematical fact is not a request for owner re-approval, but it does not establish full calculator acceptance.

## Preservation and release gates

All 540 identities, 424 acceptance records, original 14 DRAFTs, 43 authority blockers, retained qualified obligations, immutable historical engines and 194 protected source hashes are preserved. The prior 209 hosted published-engine observation remains a prior observation, not newly measured live canonical acceptance. New approvals, newly eligible calculators and publication/lifecycle changes are zero.

No production SQL, lifecycle writes, migration activation, merge, deployment, payment activation, certification promotion or publication occurred. Exact-head hosted CI is mandatory and its actual status is reported separately; local success is not represented as hosted success.
