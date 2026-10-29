# Batch04 recovery and engineering report

RELEASE HOLD remains active. No merge, deployment, production database operation, certification or publication.

## Recovery

GitHub PR1486 metadata and `git fetch origin pull/1486/head` both resolve to **00d12203e71032b3efca10f548a85ada9333b67a**. Created isolated worktree `/workspace/work/calcumint-batch04`, branch `engineering/cloud-batch04-20261029`, directly from this commit. Old checkout's `work` branch remains at caffafe639350ca0c2c2cf33ae1f099294f5af54; no uncommitted prior-task state was used. Initial fetch failed because the session proxy was not ready; the supported escalated fetch succeeded after runtime became connected with enforced policy. No proxy bypass.

Read committed Batch03 REPORT, RECEIPT, PLAN and contract-assessment plus the technical register. Preserve the three completed private profiles and their recorded acceptance evidence. CI40732512191 SUCCESS is owner-supplied completed evidence; it was neither polled nor rerun. Prior full QA was not repeated.

## New engineering

Added `private.profile.annual-heat-comparison` v1 to advance independently implementable requirement488. It calculates annual conventional input, heat-pump base and outside-SCOP auxiliary electricity, separate costs, signed savings and conditional simple payback from explicitly supplied compatible quantities. Uses existing exact rational arithmetic; no financial rounding policy invented. Explicit acknowledgement fields prevent silently assuming a heat/auxiliary boundary. Conventional efficiency must lie in(0,1]; existing heat pumps require another contract.

Closed export/import recomputes output through the actual engine and pins private identity, version, source extracted-text hash and all inputs. Rejects tampering and unknown fields; detached snapshots and nested source bindings are frozen. Free/Pro/Business review plans produce identical mathematics and exported values. This is review-plan parity, not authenticated subscription acceptance.

This batch provides a private engine/replay API only. No new UI, public route, registry entry, subscription flow or persistence transport is claimed. New bounded private engine count1; canonical completed count remains0. New module does not supersede the original catalog requirement or any historical version. See SOURCE.md for live official ETL retrieval and remaining provenance limits.

## Focused validation

- New engine/exchange:34 passing tests, including independent savings200 and175, negative/zero savings, zero-demand auxiliary, zero-cost payback, repeating fractions, small positive divisors, strict fields and domain bounds, immutable copies, plan parity and six replay-tamper classes.
- Focused regressions:156 total passing tests across5 files: new34, Batch03 engines/exchange53, Batch03 provenance7, prior scenario workflows42 and shared calculation snapshots20. No failures or skips.
- `npm run typecheck`: exit0.
- ESLint for both new code/test files: exit0, no diagnostics.
- Independent read-only reviewer ran34 focused tests and inspected engine/snapshot/rational dependencies, mathematical/domain and replay boundaries; no Critical/Important finding. This is engineering review, not qualified applicability approval.
- Before staging additions, `git diff --exit-code 00d12203e71032b3efca10f548a85ada9333b67a -- .` exited0. All1905 baseline tracked files are unchanged, including Batch03 evidence, all historical engines, catalog identities/acceptance records, dependencies and workflows.

RED record: initial focused run failed because the new module did not yet exist; after implementation all34 cases passed. Raw focused, initial RED, GREEN, typecheck and lint logs remain under `/workspace/work/cloud-batch04-evidence/`; these workspace artifacts are not claimed to be permanently hosted. Dependencies were reused from the existing checkout through an untracked local symlink; installed Vitest3.2.7 matches the committed lockfile. No dependencies or lockfiles changed.

Full baseline browser/security/build/unit campaigns were not repeated, per mission. New code has no UI/transport/database integration. Existing hosted CI will perform repository checks on the separate draft PR. Check new commit status at most twice; a pending result is reported pending, never awaited indefinitely.

## Remaining blockers

Requirement488 still needs owner full-product selection and competent equipment/climate/heat-boundary/auxiliary/tariff/cost applicability review. Exact normative source version, effective date and publisher-byte evidence remain missing. Simple payback excludes changing annual savings, maintenance, incentives, tax and discounting. Input declarations cannot verify physical truth.

Marketplace198 and Etsy199 are next substantial candidates but schedule/platform/country/currency/revision/refund-base evidence is insufficient for new provider-specific branches. Do not duplicate existing generic supplied-fee workflows or invent a universal fee schedule. Other23-cohort blockers remain unchanged.

Implementation SHA and final draft PR/CI receipt are reported in delivery metadata after committing, avoiding a self-referential hash. No completed CI monitoring, task cancellation or RELEASE HOLD change was attempted.
