# P0 source-fetch coordination repair and physics evidence

Validated source commit: `fe88a3d327fd0e3a0a3ca3299f285c7b123150a5`. Existing draft PR #1538; no new PR. Historical green ancestor cef0352f and PR #1537 preserved.

## Exact failure and correction

CI 43066406561 at aace2ac8 passed checks, build, publication-factory and source-acceptance. Full-product failed in Owner-authorized isolated P0 implementation; aggregate correctly failed. The five exact failing entries and manifests are in failure-matrix.json.

Underlying Git errors were `shallow file has changed since we read it`. ensureParallelSources bypassed the common-directory lock whenever a supplied Git adapter differed from its default. Real current-source readers use wrapped adapters, so they fetched concurrently with protected readers. The reported Business project source mismatch wrapped this object-acquisition failure; the flagged project page, three P0 entries and Business caller verifier have identical source objects before and after this repair. No application hash was blindly replaced.

The correction removes only that adapter bypass. Trusted actual Git still locates the common directory; all adapters recheck object availability under its bounded owned lock. Exact origin, immutable refs, blobs, SHA-256, current bytes, and rejection behavior remain enforced. Git's own lock files are never removed. The new wrapped-real-adapter assertion failed before implementation and passes after; all previous lock assertions remain.

A prepared depth-one baseline reproduced the exact five failures (54/59 registered cases passed; module failures prevented the remaining cases registering). The corrected depth-one P0 command passed all 205 cases in 53.84 seconds; a populated checkout also passed 205/205. The earlier incomplete-preamble experiment is retained separately and is not treated as a faithful CI reproduction.

## Additional demonstrated adoption-test readiness defect

Genuine isolated acceptance exposed PGRST202 after the original OpenAPI-path check. The same five-second deadline and OpenAPI assertion remain. A nonmutating authenticated null-organization RPC now must reach the exact governed P0001/Invalid invitation details refusal before valid business operations begin. Only PGRST202 is retried, each request is bounded by the remaining original deadline, and full business-state equality is asserted. Valid reservation/redemption is never retried. No SQL or production configuration changed.

The corrected committed test passed genuine GoTrue/PostgREST/PostgreSQL acceptance, original source-hash preconditions, late-failure rollback, reapplication refusal, concurrent country-writer exclusion, reversal, data preservation and reinstall checks. Earlier failed receipts remain retained. Successful membership, privileges and private browser runs are reused only for byte-identical runtime/fixture source; validation.json distinguishes their execution head. These are isolated fixtures, not production qualification.

## Source admission and validation

Captures 30 and 31 are additive; capture 29 and all historical hashes/receipts remain unchanged. Exact code objects 13d33b57 and f4fa576c bind the two corrections. Whole current authority remains pinned to committed Git blobs and SHA-256. Independent static reviews found no blocking issue; they are not competent mathematical certification.

Full regression: **9,253 passed, 0 failed, 4 existing skips; 1,011 files passed, 2 skipped**. P0 source cases, 67 source/negative checks, 61 runtime checks, 15 finite-successor checks, 38 retained export readbacks, genuine adoption acceptance, lint, typecheck, launch/security/certification guards and **next build --webpack** pass. Exact-head hosted CI must still run after normal push; local success is not claimed as hosted success.

## Calculator dispositions

#368 technology.ip-subnet@1 and #376 technology.screen-ppi@1 preserve their exact bounded private contracts, original application and genuine workflows. The confirmed scoped engineering overlay is 18 until all five mandatory exact-head jobs plus aggregate pass; then the two qualified additions permit 20. This does not grant full canonical acceptance, certification or publication.

Physics #322/#323/#324/#325/#327 received 25 independent analytical literals and 48 direct invalid-number cases across 12 fields: 73 passing tests on unchanged v1 engines. Earlier 15 genuine account journeys and 50 export files retain their actual producer/verifier identities and isolated-development limitations. The producer source remains recoverable in its separately verified bundle; it is not relabelled as a fresh main-head execution. These five remain partial, with individual scope, units, precision, source and broader canonical requirements explicit in the physics review document. No completion promotion is inferred from these tests.

Canonical counts remain **0 complete/certified, 2 review pending, 495 partial/unproven, 43 identity/scope blocked = 540**. The unchanged 540-row ledger is hash-bound in canonical-and-engineering-disposition.json. Newly canonical-approved or publication-eligible: **0**.

## External gates and next batch

#440 still needs an actual competent, authorized, independent reviewer appointment and source/formula/precision/QA decisions. The existing appointment package and 13 unsigned packets are preserved; no new appointment or signature is invented. Actual production writer/DDL freeze, backup/recovery, credential custody, deployment and held six-RPC adoption require operator attestations and separately scoped authority. Isolated success cannot establish them.

Next safely parallelizable group: physics #322/#323/#324/#325/#327, using the preserved authenticated/export evidence and new bounded witnesses to close individual approved-unit, renderer/accessibility and delivery requirements where source evidence establishes them. Do not duplicate engines, repeat the successful browser campaign, or invent full-domain applicability.

RELEASE HOLD ACTIVE. No merge, production changes, migration activation, credential changes, deployment, certification, publication or live billing activation.
