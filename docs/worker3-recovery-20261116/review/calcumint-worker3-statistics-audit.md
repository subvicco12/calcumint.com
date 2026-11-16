# Statistics recovery audit

Code requested `419d56c17ca72dae58132aa00c7424b07477aa6c`; observed `1e0ba5baa2a437e44b625b15ac66f9a4f264df54`. Evidence `4a895fcba82c719c21749d0efcfa5f8f1bad26a6`. Read only; no tests rerun; no count/ledger/production edits.

All nine remain IMPLEMENTED_NOT_QUALIFIED; shared delivery metadata defects and shared CI qualification remain. No additional calculator-specific arithmetic defect found within carefully stated capture scopes.

| ID | Applicable model and quality | Remaining requirement |
|---|---|---|
| 284 | Arithmetic standardization; supplied same-unit mean/positive SD; no distribution/tail claim. OpenStax 6.1 fixture 17,5,6 → 2; zero deviation and invalid sigma cases. | Shared metadata delivery + shared CI |
| 285 | Two-sided normal estimate ± z*SE; five confidence levels; caller establishes normal approximation; collapsed endpoints refused. Five table constants compared against 90-digit oracle: maximum absolute discrepancy 4.728118191455206e-13 ≤ 5e-13. Textbook interval fixture; does not prove coverage. | Shared metadata delivery + shared CI; rounded-table caveat must be delivered |
| 286 | Normal proportion planning; 0<p<1, 0<E≤1; five confidence levels; count≤1e9; ceiling of inherited rounded-table expression. Five explicit ceil discrepancies from ideal quantiles retained: all confidence levels can differ by one near integer boundaries. p=.5,E=.05,CL=.95 gives 385. No ideal minimal-sample/coverage guarantee. | Shared metadata delivery + shared CI; rounded-table caveat must be delivered |
| 287 | Independent event intersection/union/complement; [0,1] with guards against out-of-bounds or swallowed positive contributions. Independent .5/.4 fixture and endpoint identities; near-one union rounding and tiny contribution guards; original outputs historically replayable. | Shared metadata delivery + shared CI |
| 288 | Ordered distinct-object selections without replacement; integer 0≤r≤n≤1e9 and exact safe result. Product factors are exact while safe; 6P3=120, empty product=1, 18! accepted, 19! refused. | Shared metadata delivery + shared CI |
| 289 | Unordered distinct-object selections; integer 0≤r≤n≤10000; exact BigInt recurrence and safe integer output. 52C5=2598960; 56C28=7648690600760440; 57C28 overflow refused; exact recurrence independently justified. | Shared metadata delivery + shared CI |
| 290 | Exactly k successes; independent fixed-p Bernoulli trials; n≤10000; log-space binary64 approximation. Interior underflow/subnormal/saturation refused; exact degenerate endpoints retained. Independent 15/128 golden plus boundary/schema/refusal tests. No declared uniform error bound or whole-domain numerical accuracy certification; do not infer such from this single PMF golden. | Shared metadata delivery + shared CI |
| 291 | Normal model; same-unit x/mean/positive SD; erf approximation restricted to |z|≤4, positive normal density/tails and nonsaturated CDF. 8001 standard-grid points plus 20 transforms: 24063 scalar comparisons pass. CDF/tail observed max 6.968741261075226e-8; PDF relative max 7.579148293168502e-16. Two transformed points are supplementary outside capture. No continuous supremum/coefficient provenance certified. | Shared metadata delivery + shared CI |
| 300 | Complementary exhaustive H/not-H; same-population evidence; supplied [0,1] probabilities; positive denominator; interior rounded endpoint refused. Independent 15/112 posterior; zero-evidence refusal, exact endpoints, retained joint numerator/denominator; no calibration/diagnostic/causal inference. | Shared metadata delivery + shared CI |

Publisher artifacts and numerical evidence hashes checked; Business fingerprints matched 124/124. Full SHA256 bindings and per-ID history/UI/scenario/target/exports/native rationale are in the JSON companion.

285 estimate sampling is a constant-response direction for marginOfError; use standardError/confidence for a meaningful margin target. All target searches are finite exact forward witnesses, with no unique inverse/all-solutions claim. 291 finite grid is empirical only; 290 has a PMF golden and boundary tests, not a uniform accuracy certificate.

298 focused and 482 affected receipts overlap. Neither overrides held source/CI gates. Existing engine and numerical receipts remain reusable while dependencies match; metadata repairs need affected verification and updated bindings.
