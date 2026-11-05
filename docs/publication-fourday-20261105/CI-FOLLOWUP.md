# CI follow-up — 2026-11-05

The first successor run 42077182638 at 0e36d630ad449a765f406990c8c29d014eb398f5 failed. Browser download recovered, but the unchanged Batch 13 workflow guard rejected the newly added artifact-upload `if: always()` condition. The condition is removed; the guard is unchanged.

Running every inherited workflow test also exposed the earlier publication-factory timeout change from 12 to 20 minutes. The inherited guard’s 12-minute budget is restored (the immediate baseline used 20 minutes) without dropping steps or changing assertions. The observed publication-factory job succeeded in 265 seconds, within that budget.

Focused verification: 64 Node workflow/cache/browser-installer/readiness tests passed; nine offline route-auditor tests passed; git diff --check passed. The downloader suite exercises three real HTTP transfer cases. No calculator, formula, history, certification, RLS or publication source changed in this follow-up.

The successful read-only URL artifact from the failed overall run remains valid scoped evidence: 209 published engine URLs returned matching HTTP 200 HTML surfaces, 17 absent candidates returned HTTP 404, and discovery/sitemap included all 209 and none of the 17. This is not numerical, authenticated, specialist or canonical acceptance. Its execution head remains 0e36d630; it is not relabeled as this follow-up head.

The original report and receipts remain dated evidence. Overall exact-head CI must be reported separately for the successor revision. No production changes, certification or publication occurred. RELEASE HOLD remains active.

Independent read-only review found no blockers and reran all nine route tests successfully. Removing the upload condition means earlier unhandled/test failures skip upload; handled transport failures still produce UNKNOWN evidence.
