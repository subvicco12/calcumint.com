# Worker 2 — Statistics cohort B

**RELEASE HOLD ACTIVE.** New bounded contracts and genuine local delivery acceptance for296/297/299;298 remains source/applicability/ownership blocked. No scoped engineering promotion, canonical acceptance, certification or publication is claimed.

Baseline `6fa8f87433ee8434d1d89aaf93deea0216eb17cb`. Source implementation commit `5e69ccc2124b176ff806efdfbfd60427cf1719c9`. Isolated branch `engineering/worker2-statistics-b-20261117`. Final delivery SHA is returned after remote readback. Later commits add only non-SRC proposal/evidence files; exact ten-path source bytes remain at5e69ccc2.

## Per-ID acceptance and remaining requirements

| ID | Exact observed candidate | Implemented and locally verified | Disposition |
|---|---|---|---|
|296|`statistics.quartile` / `quartile-calculator` @1|Strict numeric JSON arrays and Q1/Q2/Q3 selection; retained type7 interpolation; all three displayed quartiles independently guarded against normalized-input cancellation error; structured Final result, discrete graph, steps, replay, history/scenarios and exports.|IMPLEMENTED_NOT_INTEGRATED_OR_QUALIFIED. Source authority/dispatch intake, applicable full-contract review, Business team/native adoption and integrated exact-head qualification remain.|
|297|`statistics.interquartile-range` / `interquartile-range-calculator` @1|Same array contract and type7 source convention; Q1/Q3/IQR/count preserved. Precision guard covers the difference and every displayed quartile, preventing accurate IQR from hiding inaccurate terms. Genuine account/scenario/Final/native workflows pass.|IMPLEMENTED_NOT_INTEGRATED_OR_QUALIFIED. Same integration/authority/Business/qualification boundaries.|
|298|`statistics.coefficient-of-variation` / `coefficient-of-variation-calculator` @1|Read-only identity/source review and unchanged historical witness only. No capture, selector option, source successor or action exposes298.|BLOCKED_SOURCE_APPLICABILITY_AND_OWNERSHIP_DECISION. Engine uses SD/abs(mean) with signed nonzero mean; canonical mapping, ratio-scale/mean-sign/near-zero interpretation and flagged ownership/version decision remain unresolved.|
|299|`statistics.expected-value` / `expected-value-calculator` @1|Finite paired outcome/probability arrays; exact binary64 mass1 requirement without normalization; original sum expression/result/steps retained. New cancellation refusal, per-outcome contribution graph, exact historical zero replay, history/scenarios and exports.|IMPLEMENTED_NOT_INTEGRATED_OR_QUALIFIED. Same integration/authority/Business/qualification boundaries.|

All canonical mappings remain unapproved in the baseline inventory/Blueprint/proposal evidence. Exact candidate identification is not canonical authority. The old module `next-engineering-statistics-b.ts` concerns289/290/291/300 and was not modified or relabeled.

## Ownership, sources and contracts

Only new Worker2 namespaces under `src/lib/`, `src/components/`, `src/app/admin/`, `tests/` and `docs/worker2-statistics-b-20261117/` changed. Ten SRC files were added. No Worker1 construction path, immutable mathematics, historical dispatcher, shared registry/admission manifest, canonical ledger, dependency, migration, workflow or PR1538 changed. The original Worker1 portable account/UI acceptance pattern was reused into new files; Worker1's source bytes stay unchanged. The array-capable workbench is local because the shared scalar restore path rejects array inputs.

Reservation was checked before implementation: the new paths did not exist at baseline; no competing20261117 worker namespace was observed remotely. Worker1's observed remote high-readiness branch remained75040e74 and its recorded343–357 reservation does not overlap these IDs. Source/ownership clarification for298 was requested while other work continued; no resolving decision was supplied. No298 implementation change followed.

`SOURCES.md`, `r-quantile.md` and `openstax-expected-value.md` retain explicit applicability. Firecrawl retrieved publisher bodies: R documents nine quantile types and the retained type7 convention; OpenStax describes finite discrete expectation. These are method evidence, not source approval. Values share a caller-supplied unit; no physical dimension or conversion is inferred. New scope includes finite |x|≤1e50/nonzero≥1e-50,1–10000 array elements and inherited64KiB raw-packet bound. Strict raw parsing rejects malformed/lost numeric text, unknown fields, blanks and nonfinite values. Probabilities are never renormalized.

Raw fields, normalized arrays, full structured output, exact tuple/version and `worker2-statistics-b-20261117.1/<engine>@1` source namespace remain in replay packets. JSON/CSV/PDF carry compiled scope, units, limitations and publisher sources. Historical records remain full-domain original forward-engine agreement, separate from current capture guards. Restored entry text is explicitly reconstructed from normalized arrays; original keystrokes are not invented. Historical records outside capture scope open read-only.

The numerical refusal guard computes the retained mathematical formula independently on exact binary64 rationals and demands relative agreement within2^-40 (exact agreement when the reference is zero). It refuses a new capture rather than replacing an engine/output. This worker-local policy is not a canonical precision decision or full-domain certificate. The graph shows three discrete v1 quartiles or the first100 original outcome contributions; full input arrays remain in exports. No distribution fit, continuous accuracy bound or statistical confidence guarantee is inferred.

## Genuine missing work and review corrections

The shared scalar contract helper cannot capture array-valued inputs: the retained red test demonstrates `Numeric engineering fields required`. The new cohort adapter resolves this without modifying that helper or v1 engines.

For expected value, outcomes[-1e20,3,1e20], probabilities[.25,.5,.25] return historical0 although the exact normalized-input sum is1.5. New capture refuses it; historical snapshot verification/recovery preserves0. Reviewer testing found IQR could pass while a displayed Q1 failed: values[-100000000000000020000,300000000000000000000] produce Q1=-16384 versus exact binary64 interpolation -12288. A failing test was retained, then capture was extended to check all displayed quartiles.

Review also found page-only review authorization insufficient for private actions. A failing action test was retained, then all six account operations were gated by fresh authenticated owner and active owner/admin/reviewer checks before existing persistence or Business context delegation. A genuine browser test revokes review access after loading the page and verifies the subsequent save is refused without adding a history row.

No additional blocking defect remained in the read-only software review of the fixes. This is software review, not competent methodology/precision approval.

## Exact validation receipts

| Check | Actual result |
|---|---|
|Own contract/account/Final UI and recovery tests|38 passed,0failed across4files (`receipts/review-fixed.json`). Includes independent quartile reference vectors, singleton/ties/sign cases,10000-observation bound, cancellation witnesses, strict packet/source/version refusals, paid/free exports/scenarios, array restore and stale-response protection.|
|Retained statistics v1/boundaries/probability/Final migration tests|27 passed,0failed across4files (`receipts/historical.json`).|
|Full-context TypeScript / focused lint|Both exit0 after review fixes; raw logs retained.|
|Final production fixture build|Ordinary `next build --webpack` passed, including final source typechecking.2125 source/data/config fingerprints independently match authoring and compiled bytes; no lower publication reader or CSP override.|
|Genuine local authenticated browser|9 journeys: all3IDs as Free/Pro/Business. Owned persisted history, same-request retry, foreign history-read RLS denial,6 paid-plan scenario save/recovery/foreign-read denials, mobile390px/AX labels, blank-input stale-result removal and keyboard recovery. Private route denies anonymous/non-reviewer; already-loaded action denies revoked reviewer.|
|Native delivery|9 actual Pro browser downloads: JSON/CSV/PDF for each ID. JSON source-bound replay, CSV metadata/unit checks, PDF title/unit extraction; every artifact size/SHA256 read back and all3 PDFs parsed independently. Same compiled helper's Business parity is unit evidence, distinguished from genuine Pro download evidence.|
|Worker-local exact source proposal|10 current paths/ref/blob/length/SHA256 verified under actual common-Git-directory availability lock. Every-path tamper, capture corruption, dirty/unknown source, HEAD reversion and symlink refusals pass (`receipts/source-admission.json`). Central source authority remains unactivated.|

Genuine fixture uses repository-pinned PostgreSQL17/GoTrue/PostgREST and unchanged full candidate schema initializer, fixture-only paid-plan/reviewer setup, same-origin loopback transport and unchanged production CSP/application configuration. No production schema, mail/billing/provider or hosted equivalence is inferred. Browser, Next runtime and containers were closed before the final receipt was written.

The first9-journey/9-download run preceded the review corrections and is retained as predecessor evidence only. Failed PDF metadata mapping and red numerical/action tests remain retained. Raw logs preserve original whitespace. The final authenticated packet, not the predecessor, is bound to final authoring bytes through2125 copied-source fingerprints.

Reproduce targeted acceptance:

```sh
node node_modules/vitest/vitest.mjs run --config tests/worker2-statistics-b-20261117/vitest.config.ts
node tests/worker2-statistics-b-20261117/source-admission.mjs
WORKER2_STATS_ARTIFACTS=/tmp/worker2-stats-auth node tests/worker2-statistics-b-20261117/auth-browser.mjs
```

Browser/auth acceptance requires Docker access and the three exact cached image digests declared in the existing fixture. Tested browser/runtime: Node22.23.4 and installed Chromium. Unit/type/lint checks used Node24.19.0. No full unfiltered suite or hosted CI was launched.

## Coordinator handoff and genuine blockers

1. Independently review/pin the local ten-path `source-policy.json`/`source-successor.json`. They are proposals validated by the existing verifier, not independently activated source authority. Preserve old captures and actual common-directory lock behavior.
2. Review explicit closed dispatch for `verifyStatisticsSnapshot` and the new packet namespace if integrated. Never use capture policy to reject or upgrade historical v1 outputs. Do not edit immutable catalog-batch-4.ts to repair cancellation cases.
3. Existing Business tuple/storage/API/embed/job/webhook allowlists do not admit these new contracts. The page exposes authentic Business owner context and a truthful delivery hold; it does not enable team writes, native grants or metered jobs. Those coordinator-owned capabilities need exact adoption, SQL/grant/RLS/concurrency/audit and per-ID acceptance before availability can be claimed.
4. Canonical scope/mapping, competent source/precision/QA review and full-contract applicability remain unresolved. In particular298 must receive an actual source/applicability/ownership/version decision; none is inferred from its legacy certified label or negative-mean arithmetic.
5. Run controlled integrated regression and required exact-head CI after authorized intake. Local evidence does not promote these IDs or change certification/engineering ledgers.

Exact changed files: `changed-files.json`; per-ID machine acceptance: `acceptance.json`; source proposal and raw receipts remain alongside this report. **RELEASE HOLD ACTIVE.**
