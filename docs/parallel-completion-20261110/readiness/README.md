# Retained readiness projection

Run `node scripts/parallel-completion-20261110/readiness.mjs` to generate and `node scripts/parallel-completion-20261110/readiness.mjs --check` to check freshness. Run `node tests/parallel-completion-20261110/readiness.test.mjs` for the five focused regressions.

This composes the existing 540-row inventory, 14,293 retained requirements, current thirteen-program ledger, and 43 authority requests. It does not repeat inventory or research. `projection.json` retains exact per-ID requirement statuses, evidence pointers, immutable engine bindings, source file hashes, and the nine requested category labels. Category levels distinguish shared, individual, and shared-plus-individual gaps; shared implementation never supplies individual acceptance. Repeated requirements across categories are cross references, not additional requirements or additional engineering tasks.

All 540 remain outside the release subset. Actual retained canonical, certification and publication approvals are absent; affirmative production adoption authorization is absent. Stale or missing source/version evidence and incomplete full-scope evidence also fail closed. The projection cannot mutate approval, SQL, source evidence or product state. Existing canonical validators and exact qualification receipts remain the evidence-producing authority; this is a reporting composition, not their replacement. New lane artifacts are not automatically promoted into canonical proof.

The 43-item `authorityQueue` reuses exact existing questions, requested return, qualified review obligations, original register pointers, bounded authorization already granted, and case-specific acceptance rules. No new source collection or operator attestations are represented.

Current remaining engineering hours are **unestimated**. The historical batch22 queue contains a concrete 4–8-hour authenticated physics workflow task and a 2–4-hour empirical assistive/device task (6–12 historical scoped hours total). New authenticated evidence may have addressed part of the first task; it must be reconciled before calling that range remaining work. The historical six-candidate estimate is 772–1,202 implementation hours plus 32–64 competent review hours; these are retained planning figures and have not been decremented using invented velocity or extrapolated across540. The framework deliberately does not add historical figures into a current estimate. Per-ID full engine/UI/Business work, 43 authority decisions, production adoption and external waits remain unestimated. Root can append current lane-specific estimates once tasks have explicit remaining acceptance criteria.

## Known retained workload by category

These are retained requirement dispositions, not missing-code counts or current engineering hours. The canonical status comes from `docs/thirteen-program-20261110/requirements-540.json`; detailed original requirements remain linked to the existing inventory, preserving their original evidence limits. New scoped lane evidence does not silently rewrite those original requirement dispositions.

| Category | Verified bounded or full | Partial | Blocked | Unknown | Full-scope proof | Missing retained requirement |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Reusable implementation | 237 | 0 | 129 | 1254 | 0 | 0 |
| Calculator-specific engine | 237 | 0 | 129 | 1254 | 0 | 0 |
| Final renderer UI | 0 | 0 | 172 | 1988 | 0 | 0 |
| Business delivery | 0 | 337 | 172 | 1651 | 0 | 0 |
| Numerical/source evidence | 0 | 576 | 86 | 418 | 0 | 0 |
| Independent QA | 0 | 79 | 129 | 1412 | 0 | 0 |
| Identity/scope decisions | 0 | 994 | 86 | 0 | 0 | 0 |
| Competent acceptance | 0 | 0 | 583 | 497 | 0 | 0 |
| Production adoption/publication | 0 | 0 | 0 | 0 | 0 | 0 |

Production adoption/publication has no direct retained requirement rows in this grouping; its zero requirement counts are **not** evidence of completion. All 540 identities lack affirmative production authorization and remain outside the release subset. Every category has 540 identities with unestablished full scope. Category rows overlap: independent QA reuses numerical, browser and accessibility requirements. Do not add these counts to derive unique requirements, tasks or hours. Source/publisher decisions remain case-specific; repository-byte hashes establish provenance integrity only, not publisher authenticity, applicability, qualified review or canonical acceptance.

The mandatory `src/lib/parallel-readiness-evidence.test.ts` bridge executes the five Node regressions and projection `--check` during the normal Vitest suite.
