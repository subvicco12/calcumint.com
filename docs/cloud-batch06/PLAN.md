# Batch06 remaining private engineering and discovery

Baseline PR1488:0cf89461797a92d0f83350af5a6f94fe6149d779, fetched and verified. Isolated branch engineering/cloud-batch06-20261029. RELEASE HOLD. Mission authorizes continued engineering; no additional design approval stop.

## Selected scope and architecture

Reconcile every original23 component-supported identity and the other27 methodology cases. Preserve all original gaps and existing implementations. Add14 private supplied contracts:35 closing cash reconciliation;80 finite retirement corpus;81 savings trace;84 inflation-adjusted finite need;85 withdrawal trace;86 finite-horizon exhaustion;88/90/91 supplied FIRE/Lean/Fat spending targets and accumulation;89 Coast target discounting;96 explicitly supplied employee/employer tranche vesting;125/127 supplied classified price lines;134 selected-denominator supplied-liability ratio.

Alternatives: duplicate prior generic components (insufficient); modify immutable prior engines (violates preservation); new product-specific private contracts, reusing existing rational/snapshot logic and existing projection workflows through unchanged adapters and source observations, plus adapters to a unified review workbench (selected).

No retirement safety/withdrawal fraction, Lean/Fat threshold, tax eligibility/rates, plan matching/vesting schedule, institutional entitlement or provider policy is inferred. Quantities/timing/rates are explicitly supplied. Full product, source version/applicability, qualified approval and canonical acceptance remain open.198/199 stay blocked; do not manufacture fee schedules. No clinical or jurisdiction-specific defaults.

Retirement calculations use0..600 supplied equal periods, begin/end cashflow timing, explicit decimal-string effective fractional returns/inflation(-1,1], nonnegative decimal-string quantities with at most12 integer/6 fractional digits, and the existing exact-rational helpers. Exact rational arithmetic is selected so mathematical depletion and payment boundaries do not depend on binary cancellation. No invoice/display rounding is invented. Corpus is finite present value of positive spending gaps plus terminal reserve, not a perpetuity. Inflation multiplies from period0 values; real returns use(1+r)/(1+i)-1. Withdrawals cap at funds and distinguish exact zero from insufficiency. FIRE ratios are supplied targets, not safe withdrawal prescriptions. Coast has no later contributions. Vesting uses explicitly supplied nondecreasing tranche fractions and separate fully vested employee funds, without account-law decisions.

Closing costs: named disjoint categories and prior-paid amounts, base acquisition financing plus separately financed closing costs, deposits and credits, signed cash due/refund. Price lines use exact decimal-string rational algebra with caller supplied classification/rate, distinct zero-rated/exempt totals and inclusive/exclusive handling. Ratio inputs explicitly declare denominator basis and period; no statutory definition or monetary rounding inferred.

Unified private workbench: discover all50 original methodology identities, with29 available supplied profiles and21 explicitly blocked (21/23 cohort available,198/199 blocked). Existing15 adapters retain original payload formats and replay engines. New outer closed envelope identifies contract/engine without rewriting historical snapshots. Add labeled search, full method/sources, example input, immutable tab-local history, saved-scenario restore, clear history, JSON export/replay and stale-result invalidation. No public route, registry, account transport or persistent browser storage.

## Execution

- [x] Write independent literal product goldens and boundary/replay tests first; verify RED, implement retirement and supplied-accounting modules, then GREEN.
- [x] Add closed unified adapters and discovery/replay tests first, then workbench/UI and actual Chromium acceptance for29×3plans×2widths, including downloads/replay, discovery of blocked cases, recovery and scenario restore.
- [x] Obtain independent actual-engine numerical and code review. Fix demonstrated defects with RED/GREEN regressions.
- [x] Run focused security/transport and full applicable units, certification/launch guards, lint/typecheck/webpack build. Do not repeat unaffected Windows or old browser/native Next campaigns.
- [x] Verify540 identities,424 acceptance rows, original14 drafts and prior tracked mathematical/history/evidence bytes; prepare verified machine-readable manifest/report and commit payload. Delivery policy: push separate branch/draft against Batch05 and check hosted CI exactly once.

Review focus: begin/end discount and withdrawal timing; inflation-period alignment; negative returns; zero-horizon corpus/Coast; precise zero versus unpaid withdrawals; supplied FIRE ratios not safety claims; employee versus employer vesting; prior-paid/financed closing cost duplication; taxable/zero-rated/exempt distinctions; unknown field/source/version/output tampering; original replay formats; stale export and scenario restoration.
