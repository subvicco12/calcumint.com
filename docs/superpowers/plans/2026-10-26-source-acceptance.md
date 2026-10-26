# Source Acceptance Implementation Plan

> **For agentic workers:** parallel evidence lanes; coordinator integrates and verifies.

**Goal:** advance all59source-reviewable cases with precise evidence and truthful completeness.
**Architecture:** three independent local evidence lanes, immutable per-ID packets,70-row register and offline integrity/replay checks. Public-source retrieval preserves proxy/TLS and cannot grant review status.
**Tech Stack:** JSON, Python standard library, existing Vitest/CI.
**Spec:** docs/superpowers/specs/2026-10-26-source-acceptance-design.md

## Global Constraints

Preserve540catalog IDs,424ledger records,14privateDRAFTs,historicalmath and11qualified-reviewcases. No production/certification/publication.

## Review Focus

Blocked/unavailable or merely downloaded primary sources cannot be marked verified. Candidate witness results cannot be presented as actual-engine goldens. Missing jurisdiction, effective date, rounding, product choice or source-binding remains a precise gap. All59IDs need complete per-ID records, with exact matching source provenance. No readiness field may grant lifecycle authority.

- [x] Prepare22bounded per-ID contracts with new independent numerical witnesses.
- [x] Prepare37official-rule/model evidence requests in two parallel lanes with exact known/unknown source metadata.
- [x] Integrate59packets and70-row fail-closed register; negative integrity probes and protected source-fetch/replay commands.
- [x] Run focused/full applicable tests, guards,security/transport,lint,typecheck,webpack build.
- [x] Independent review and RED/GREEN provenance correction.
- [ ] Separate draftPR and exact-head hosted CI; report genuine completeness and external blockers.
