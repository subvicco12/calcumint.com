# Native action evidence follow-up — RELEASE HOLD

Test-fix commit: `177dd5aaffba6edc9da8ed7c624f36608a80072a`. Previous independently reviewed head: `90c6597b959fef508dc265493c1ee7c6e35970a8`. Frozen base: `6dbf723ec6c4d009816dbe3eb1f16cc22bc16a04`.

## Preserved original review

The independent native reviewer inspected all 110 changed files at the previous exact head, with no blocking implementation finding. Fresh focused tests passed 129 tests/12 files; full-mode regressions passed 187 tests/26 files; actual Next browser checks passed 13 checks/17 manifest-only requests. All 11 original audit artifact hashes matched. Builds were hash-verified, not independently rebuilt.

The sole low-severity finding was that the native-action assertion accepted any HTTP error, so lookup or decoding failures could be false positives. The original audit and logs remain unchanged. Its native-action HTTP assertion alone is insufficient guard proof; the evidence below supersedes that assertion without rewriting the historical record.

## Correction and verification

The fixture now selects exactly `app/login/actions.ts#signInWithGoogle` from the compiled registry, including its login worker. It requires the real policy error, both guard and selected-action stack frames, a matching digest in fresh server logs, and zero provider requests. It uses existing Next development errors only; no production diagnostics, runtime behavior, dependencies or application files changed. Separate mode directories preserve both server logs.

- Regression red phase: six false-positive cases failed against the old generic HTTP assertion (2 passed/6 failed).
- Final `npm run test:public-only-browser`: 10 node regression tests passed; 13 actual Next webpack browser checks passed; 17 manifest-only fixture requests. Known action reached `FeatureUnavailableError`, digest `1822926364`, zero provider requests. Actual unknown-ID and malformed-payload controls were rejected by the same guard-proof assertion.
- `npx vitest run src/app/public-only-boundaries.test.ts src/app/login/actions.test.ts src/lib/product-mode.test.ts src/lib/product-proxy.test.ts`: 118 tests/4 files passed.
- `npm run typecheck`: passed. `npm run lint`: zero errors, 28 existing warnings. `git diff --check`: passed.
- Initial runtime rerun failed because the test assumed a 40-character compiled ID; observed Next IDs contain 42 hex characters. Corrected the fixture format and synthetic registrations, then reran the complete browser command successfully. This failure was not counted as guard evidence.

No full suite or production builds were rerun for this test-only change. Prior full-suite/build evidence retains its original source revision and limits. Independent verification of the subsequent documentation-inclusive exact head is requested separately; this author record does not claim that review has occurred.

## Remaining gates

RELEASE HOLD is unchanged. Production protected DB publication, direct-provider/RLS/live-session behavior, DB-backed Business acceptance, hosted exact-head CI, deployed cache/CDN transitions, physical-device accessibility, deployed performance and operational release evidence remain pending. Local synthetic evidence does not certify them. No push, PR, merge, deployment, database mutation, credentials or paid-resource action occurred. No action was denied or left with an uncertain outcome.

Artifact SHA-256 values and exact local paths are preserved in the adjacent JSON file. A portable recovery bundle will be prepared locally after independent review, without external upload.
