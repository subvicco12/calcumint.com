# Password Recovery Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans; implement and test each task before completion.

**Goal:** Secure accessible email password recovery through the existing SDK.
**Architecture:** PKCE request/callback plus freshly verified, recent recovery-session claims for completion.
**Tech Stack:** Next16/React19, installed Supabase SSR/auth SDK, Vitest, pinned local GoTrue/PostgreSQL17.6.
**Spec:** docs/superpowers/specs/2026-10-24-password-recovery-design.md

## Constraints and review focus

Preserve frozenPR1467–1469, security fences, mathematical history,424ledger statuses and14DRAFTs. No production/migration/payment/publication operations. Test known/unknown accounts, malicious redirects, stale/replaced sessions, replay/expiry, transport and post-update sign-out failure. Never store credentials in evidence.

## Task1: Provider-bound recovery actions

- [x] Add failing tests for fresh verified recovery claims and request/completion actions.
- [x] Implement `verifiedPasswordRecovery` in src/lib/password-recovery.ts and request/complete actions in src/app/login/actions.ts.
- [x] Verify anti-enumeration, owner/session binding, rejection of unsigned/stale/nonrecovery proof and opaque password handling.

## Task2: Accessible pages/callback

- [x] Add failing Forgot password link, form/status/focus and callback-failure tests.
- [x] Implement request/reset pages and client form; fixed callback destination/failure handling.
- [x] Verify invalid/replayed links never expose a completion form; settled rotation/cross-account protections remain.

## Task3: Genuine acceptance and submission

- [x] Reuse pinned isolated GoTrue/PG/SMTP infrastructure for actual UI request, PKCE completion, password change, link replay/expiry and account switching.
- [ ] Run focused regressions, full unit suite, Next runtime/transport/security, certification guards and webpack build.
- [ ] Obtain independent review; commit and push only new engineering branch; create stacked draft and inspect all exact-head CI stages.
