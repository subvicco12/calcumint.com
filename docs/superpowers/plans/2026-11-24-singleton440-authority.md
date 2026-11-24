# Singleton440 Authority Implementation Plan

> **For agentic workers:** Use inline execution; the owner explicitly authorized implementation and offline qualification.

**Goal:** Freeze one tuple-specific source-admission executor without executing admission or activation.

**Architecture:** Keep fa6e158 and frozen A7 files unchanged. Freeze the two-path policy/data in a separate ancestor commit, then bind an executor to those objects. Reuse the existing exact-stage verifier and runtime provisioner. A new manual-only workflow is a proposal until separately registered and protected.

**Tech Stack:** Python standard library, retained Node ESM verifier, existing GitHub/Drive authentication.

**Spec:** User's 24 November minimum two-path authority successor instruction; existing decision package 66a02d5f.

## Global Constraints

- No live admission, activation, workflow dispatch/registration, production change or merge.
- Only 1637b2a2 / 209982b9 and its exact two source transitions.
- Preserve frozen bootstrap, historical pins, existing deadlines and engine.
- Tests use fixture authorization and disposable replay state; offline receipts cannot authorize activation.

## Review Focus

- Wrong candidate, unrelated source or dirty source must fail retained exact verification.
- Policy, archive or runtime substitution must fail before a receipt.
- Owner and independent reviewer must be separately authenticated and exact-scope bound.
- Expired authorization, wrong hosted run/attempt and replay must fail closed.
- Receipt content digest and admission/activation distinction must remain explicit.

## Task 1 — Freeze policy

- [ ] Copy retained verifier/capture; create deterministic five-blob archive and manifest.
- [ ] Commit policy independently; executor binds its commit/blob/digests.

## Task 2 — Executor and offline controls

- [ ] Write failing unittest cases for exact identity, scope, authorization, replay and receipts.
- [ ] Implement fixed policy verification and owner/reviewer/run binding, no generalized authority.
- [ ] Reuse unchanged Node verifier through a fresh bounded child; recheck current bytes before receipt.
- [ ] Run isolated success/refusal tests. Live CLI requires real protected hosted identity and fresh provider readback.

## Task 3 — Freeze handoff

- [ ] Prepare manual-only workflow proposal using existing protected ref/environment/runtime.
- [ ] Commit executor, freeze tree, package digests and authorization text naming exact identities.
- [ ] Retrieve/integrate portfolio increments separately; preserve singleton.
- [ ] Publish isolated branches and receipts only; no executable registration or admission.
