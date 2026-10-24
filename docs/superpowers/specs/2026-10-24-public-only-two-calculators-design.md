# Approved two-calculator public-only candidate design

Status: design approved; implementation plan awaiting coordinator review. RELEASE HOLD.

## Authority and baseline

The coordinator supplied trusted conversation evidence:

> Assistant: Approve preparing this two-calculator public-only candidate, with no merge, production publication or deployment? This is a minimal first release, not completion of the full catalog.
> User: Proceed

This approves preparation, not release. No external push or PR until the coordinator confirms publication scope. No merge, deployment, production publication, database mutation, credential work or paid resource. Local implementation/commits/tests may follow the plan gate.

On 2026-10-24 GitHub's newest-created PRs end at draft #1470, open and unmerged, head `engineering/password-recovery-20261024` at `6dbf723ec6c4d009816dbe3eb1f16cc22bc16a04`. Remote main remains `caffafe639350ca0c2c2cf33ae1f099294f5af54`. The isolated candidate is `/workspace/public-only-candidate`, branch `candidate/public-only-two-calculators-20261024`, based on that exact #1470 head. It preserves the frozen #1467–#1470 histories. This is a stacked development base, not a claim that the candidate is certified main.

Inspected: B2-public-seo-platform, RELEASE-GOVERNANCE, FINAL-PRODUCT-ENGINEERING-2026-10-24 audit, prior password-recovery design/plan, CI and current routes. No AGENTS.md or repository .agents/skills files exist in this base; /workspace/.agents is empty. Existing document convention is docs/superpowers/specs and docs/superpowers/plans. Release governance contains no plan-review exemption; its sole-owner exception concerns independent release review only. The requested coordinator plan gate remains pending.

## Product contract

Anonymous public home, directory, and relevant category/calculator pages are available only for these exact identities:

| Calculator key | Slug | Version | Category |
| --- | --- | --- | --- |
| core.percentage-of-value | percentage-of-value-calculator | 1 | math |
| core.unit-conversion | unit-conversion-calculator | 1 | unit-conversions |

Public visibility = existing repository certification/content gate AND exact protected published-manifest identity AND this two-identity allowlist. Parse the entire manifest before narrowing it; malformed/conflicting rows must not be hidden by filtering. Missing authority means no public calculators; one valid approved identity means at most that one is visible. Both are required before the scoped candidate can be described as technically ready. Do not publish, certify, or change either calculator to satisfy a check.

Retain deterministic engines, versioned contracts, formulas, reviewed sources, examples, validation, accessible mobile interaction, canonical metadata and honest empty/unavailable states. Existing source records are retained, not newly claimed as independently reviewed. Legal/company/help pages may remain reachable with mode-accurate text. No ads or third-party monetization scripts in this minimal mode.

Accounts (including signup, login, OAuth, recovery and callback), saved data/history/favorites/projects/scenarios, exports, billing/payments, AI, Business/builder, embeds/shares/leads, automation/API/webhooks, admin/publication workers are unavailable in this mode. Preserve their code and full-mode security behavior. Block server routes and every exported Server Action before authentication, parsing sensitive inputs, provider calls or DB operations. Existing credentials or valid sessions must never enable a disabled capability. Render an accessible unavailable explanation with a directory link, not working forms or promises. UI gating alone is insufficient.

Mode is a server-owned runtime policy: unset means existing full mode for compatibility; exact `public-only` opts in; exact `full` retains existing behavior; any other value is invalid and grants no features. Do not accept mode from cookies, query parameters, action arguments or browser storage. Pass a nonsecret server-selected capability snapshot to client rendering; default missing client context to disabled. Ensure dynamic rendering avoids stale mode-specific navigation or cached metadata.

## Readiness and authority

Keep `buildProductionReadinessReport` and `assertProductionEnvironment` full-product contracts unchanged. Add a separately named, explicitly scoped public-only report requiring canonical HTTPS site configuration, anonymous manifest configuration, available protected manifest, both exact governed routes and denied excluded capabilities. Billing, AI, service-role and worker credentials are not prerequisites for anonymous public rendering. A report must distinguish configuration, observed publication and release authority; configuration alone cannot prove publication.

Disable the deployed internal readiness endpoint in public-only mode along with other internal APIs. Evaluate the scoped report in local tests/review tooling using explicit observations; do not expose detailed environment diagnostics publicly or add an admin secret solely for this mode. Full mode keeps its authenticated readiness endpoint unchanged. No report grants release authorization; RELEASE HOLD and all applicable CI, publication, security, source/YMYL and operational gates remain mandatory. Full-product readiness, 424 ledger identities/statuses, 540 catalog mappings and 14 unpublished DRAFTs retain their meaning.

Application guards cannot revoke existing credentials or disable direct external Supabase/Auth/PostgREST service endpoints. No such provider-level shutdown is claimed. Existing RLS remains mandatory; provider exposure/hosting isolation and actual protected-manifest deployment evidence remain pre-release checks, outside this no-DB-change task.

## Acceptance

Public mode works with anonymous manifest fixtures and zero account/provider calls even when synthetic excluded credentials and sessions are populated. Crafted requests/actions, direct URLs and unavailable/malformed publication authority fail closed. Discovery, routes, related links, metadata and sitemap agree. Retain both calculators' existing numerical and presentation regressions; verify mobile keyboard/error handling and no export/save/AI/payment scripts or requests. Run the unchanged full-mode suite and workflows; preserve `next build --webpack`. No test fixture is production publication evidence.
