# Final sprint engineering — RELEASE HOLD

Baseline: PR #1470 `6dbf723ec6c4d009816dbe3eb1f16cc22bc16a04`. Branch: `engineering/final-sprint-20261025`. Separate worktree; frozen PRs #1467–#1470 are not integration targets.

## Completed implementation

| Scope | Demonstrated problem / resulting behavior | Existing ledger references |
| --- | --- | --- |
| Billing management | Stale rendered account controls requested a portal for the newly authenticated account. Missing/stale bindings and a user returned with an auth error now reject before billing reads or provider calls. All three portal controls supply the rendered owner. | BP-0533-0534, BP-0544-0544 |
| Regional preferences | A stale or unbound form wrote defaults to whichever account authenticated the request. Fresh authentication plus mandatory rendered-owner equality now rejects these requests; existing country mapping remains unchanged. Shared account mutation UI supplies the binding and generic recovery. | BP-0129-0130; existing account isolation evidence |
| Provider error privacy | A failed portal session returned arbitrary provider exception text. A deterministic regression now requires only the application-owned retry message. | Existing billing/security scope; no provider acceptance promotion |
| Owned saved work | Registered history linked to calculator search and saved scenarios were plain text; only private DRAFTs reopened captures. `/account/saved` now reads one explicitly owner-filtered history/scenario record and renders its immutable version, inputs and results without engine execution or current-version metadata. Retired records remain readable. Private DRAFTs retain their separate reviewer gate and reader. `/account/history` adds bounded 20-record browsing of older calculations/scenarios with owner/source/page-size-bound keyset cursors and timestamp/ID ordering. | BP-0323-0326, BP-0552-0552, BP-0768-0771, BP-0842-0845 |

Billing and history lanes used independent worktrees. Their changes are integrated with the preferences correction. Independent whole-branch review and a subsequent narrow pagination integration review found no demonstrated critical or important issue; the latter independently passed 33 history/cursor tests. Tests cover invalid references, unavailable authentication/storage, malicious recorded text, private-DRAFT exclusion, retired snapshots, historical Slope v1 and stale-account rejection. Owned reading and browsing are available after downgrade; project listing and mutation entitlements remain the existing policy. The reader is deliberately read-only and does not load old values into today's calculator. Native pagination acceptance also exposed inherited capitalization of saved scenario names; scoped list styles now preserve their exact case and wrap metadata, with a failing application-CSS regression corrected before final validation.

## Evidence and limits

Private command logs and sanitized reports are stored outside Git at `/workspace/.pr1467/final-sprint-20261025/`. This evidence is local/disposable unless the final draft PR explicitly identifies a hosted run. The implementation plan records validation steps; final exact-head CI belongs to PR metadata rather than inherited earlier green checks.

- Final combined unit suite: 4,694 passed, four existing skips; 715 files passed, two skipped.
- Final integrated focused tests: 88 passed across seven files. Lane-focused results overlap and are not additive totals.
- Transport: 13 passed. PostgreSQL 17.6/PostgREST security: eight checks plus schema preflight passed.
- Launch guards: 45 passed; calculator/rule-pack guards: 15 passed. These tests perform no certification or publication.
- Full lint: zero errors, 28 existing warnings. Typecheck passed with tracked configuration preserved.
- Intermediate native runtime: 28/28 passed, zero browser exceptions, all resources cleaned. Its initial red run exposed missing registry JSON data in the isolated Next fixture; copying the existing repository `data/` directory corrected that fixture defect without changed assertions or deadlines. The failed run is retained separately.
- A real Chromium regression demonstrated that the old trusted-input helper typed into the previously focused field when the intended account control was hidden/inert despite attached React props. The helper now waits for actual focus/visibility within the existing deadline, types once, then asserts the exact resulting value. No mutation retry or weakened security assertion was added. The original no-POST credential journey failure is retained; its original focus state was not directly captured, so the controlled regression establishes the helper defect rather than claiming complete historical tracing. Independent narrow review found no blocking issue.
- Final combined native runtime: 29/29 passed, zero browser exceptions, every browser request remained within the isolated allowlist, all resources cleaned. Includes 26 records across two pages with equal microsecond timestamps, scenario browsing on Free after downgrade and cross-owner cursor rejection.
- `next build --webpack`: passed. Next-generated tracked tsconfig changes were restored; preserved-config typecheck is recorded separately.
- Exact-head hosted results belong to the final draft PR checkpoint; no hosted result is inherited from frozen PRs or asserted before completion.

## Queue disposition and release gates

This batch closes the concrete account/saved-work items selected from existing evidence; it does not equate 424 PARTIAL/BLOCKED/UNKNOWN records with missing software or claim universal Final Product acceptance. The ledger is byte-for-byte unchanged: 424 identities, 55 VERIFIED / 331 PARTIAL / 20 BLOCKED / 18 UNKNOWN. No calculator source, mathematical contract, historical snapshot, catalog definition, migration or DRAFT lifecycle changed.

Current-provider auth/cookie/SMTP/Paddle acceptance, reviewed SQL adoption and current deployment compatibility, owner/specialist catalog and mathematical-policy decisions, physical Android/TalkBack, independent PDF/UA and controlled deployed performance remain evidence-bound external gates. Reuse prior local GoTrue and remediation evidence with their original scope; no backup or credential-delivery investigation was reopened. Broader international shaping/typography is not established by this batch's raw saved-record reader. No new calculator or guessed source authority is justified by missing catalog mappings.

No production connection or writes, merges, deployments, payments, certification or publication. RELEASE HOLD remains active.
