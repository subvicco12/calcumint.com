# Risk-based Review Implementation Plan

> **For agentic workers:** use superpowers:executing-plans for inline implementation.

**Goal:** prospective, auditable engineering-led review routes without lifecycle or publication changes.
**Architecture:** immutable historical register plus new per-ID risk overlay; pure offline evaluator; unchanged enforcing publication boundary.
**Tech Stack:** TypeScript/Zod/Vitest; existing PostgreSQL/browser CI.
**Spec:** docs/superpowers/specs/2026-10-26-risk-review-design.md

## Global Constraints

No math edits, certification/publication, production access or migration application. Preserve540 IDs,424 ledger records/statuses,14 original DRAFTs and all earlier candidates.

## Review Focus

Unknown or forged evidence must fail closed. Safety and binding-obligation requirements cannot be waived by owner convenience. Source currency must match intended effective date and jurisdiction. Review readiness must never promote a draft or bypass the DB manifest. Historical pending approvals remain pending.

## Tasks

- [x] Add failing policy tests: ordinary arithmetic engineering route; rule-source dates/jurisdiction; safety qualified reviewer; unknown obligation screening; identity/version/hash; independent reviewer; no publication authority.
- [x] Implement `assessCertificationReview` in src/calculators/certification-review-policy.ts using strict Zod runtime schemas; retain legacy gates unchanged.
- [x] Add controlled Blueprint amendment and exact70-row risk reassessment with original provenance, per-ID rationales, remaining evidence and escalation triggers.
- [x] Verify overlay identities/counts/history/protected hashes and source-based review's inability to promote actual private drafts.
- [x] Run focused and full applicable local tests, guards, lint/typecheck/build; independent review and RED/GREEN corrections.
- [ ] Submit separate draft PR and inspect exact-head CI.
