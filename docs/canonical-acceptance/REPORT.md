# Canonical acceptance and release engineering

Parent PR1496: `5b60fcd2bdc3116aab7700f3daea67ca303e4bb6`; hosted CI41114602079 independently verified SUCCESS. The exact remote heads of PRs1486–1496 match their recorded SHAs and form the ordered cumulative ancestry of1496. No PR was merged. See ancestry.json. Work is isolated on `engineering/canonical-acceptance-20261031`.

## Exact portfolio reconciliation and authority limits

canonical-ledger.json and canonical-ledger.csv contain exactly540 unique catalog identities with original titles/domains. Each row separates observed registered/private input/output contracts, latest bounded profiles, source/applicability/review restrictions, actual authored-fixture diagnostics, missing canonical requirements, numerical/UX/security/lifecycle dimensions and its next action. work-queue.json prioritizes the exact remaining per-ID work. The old implementation classes are retained for traceability, not reinterpreted as canonical completion.

|Evidence population|Count/status|
|---|---|
|Catalog identities|540, preserved|
|Historical requirement/acceptance records|424, byte-identical|
|Recorded requirement statuses|55VERIFIED,331PARTIAL,18UNKNOWN,20BLOCKED; historical scoped statuses, not new approvals|
|Registered engine definitions actually audited|574|
|Legacy implementation classes|305REGISTERED_IMPLEMENTED,192PRIVATE_COMPLETE,0COMPONENT_ONLY,43CONTRACT_BLOCKED|
|PostBatch09 private source profiles previously omitted from540manifest|11, now represented separately|
|New private analytical calculus successors|3, internal revision2; no replacement of historicalv1|
|Canonical complete/accepted identities established by available evidence|0|
|Current protected database certification/publication|UNKNOWN; no writes or approvals|

The complete Final Master Blueprint attachment is unavailable. The checkout contains its preserved424record paragraph ledger and the controlled prospective governance amendment, which itself records the missing original attachment and unverified original hash. **This delivery cannot establish a complete comparison against the unavailable full document.** The original hash is not fabricated. Every row explicitly marks canonical scope UNKNOWN_FULL_BLUEPRINT_UNAVAILABLE and preserves observed contracts separately from the unknown complete scope. A row does not claim a feature is absent merely because its full requirement is unavailable.

The11 latest profiles are #485 electricity, #95/#97/#98/#132 tax methods, and #9/#20/#23/#112/#199/#204 conditional methods. Actual example inputs/results and three-plan equality are captured. Their source revisions, provider limitations and excluded full-product branches remain attached. All11 original canonical blocks remain. The existing192PRIVATE_COMPLETE class means bounded private scope, not192canonical products. The original14privateDRAFTs and all43full-product authority blockers remain unchanged.

## Actual-engine audit and demonstrated defects

The reconciler executes registered authored examples and partial golden fixtures through the actual engine. Exact numeric/object/array comparison uses **no invented tolerance or wildcard empty array**. It records inputs/output hashes, exceptions and exact mismatch paths. Golden partial-object semantics are retained. This is authored-fixture execution, **not independent expected mathematics or canonical acceptance**. Thirty-seven underlying engine definitions have at least one declared-fixture mismatch, affecting16 current catalog identity bindings. These mismatches require precision/fixture/contract review; they are not all independently adjudicated mathematical defects. They are listed without weakening assertions or rewriting old expected values.

Independent numerical investigation demonstrated two more consequential v1 defects:

- **#248 Limit:** `exp(-x^2/1e-20)` at0 is continuous with limit1. The existing finite-sample estimator returns0 and emits “Certified finite limit”.
- **#247 Integral:** `exp(-((x-0.1234567)/0.0000001)^2)` on[0,1] returns0 with estimatedError0. On center±1e-7 the integrand is at least1/e, proving integral>=2e-7/e (>7.35e-8), already contradicting the zero error/result; the full area is approximately1.77245e-7.

A separate helper-level equal-bound validation bypass was reproduced: old integrate returns0 before parsing/finite-bound checks. The catalog wrapper subsequently parses expression, so the helper finding is not falsely attributed to that public wrapper.

These diagnostic inputs/results and mathematical expectations are attached to the corresponding540ledger rows and prioritized ahead of ordinary fixture review. Historical numerical-calculus/catalog definitions remain byte-identical. No old certified repository metadata or saved result is rewritten, and no current publication state is inferred.

## Independently supportable engineering implemented

**IDs246,247,248 receive a separate private internal revision2**, not canonical acceptance:

- Analytic differentiation applies forward chain/product/quotient/power rules to the parsed expression tree and rejects unsupported nondifferentiable/singular domains.
- Limits use direct evaluation only after recursive continuity-domain checks. The narrow continuous peak correctly returns1. Removable singularities, unsupported one-sided/boundary cases, near tangent poles and unsupported real powers reject rather than receive sampled proof claims.
- Integrals validate expression/domain first, derive polynomial coefficients of degree<=32 and evaluate a power-rule antiderivative. Non-polynomial integrands, including the missed Gaussian, reject explicitly. Additional sampling is not presented as proof of arbitrary quadrature accuracy.
- Coordinates/bounds are finite within±1000000; expressions<=500characters. Values use binary64; roundoff is **not rigorously bounded**, and certifiedErrorBound is null. No certified numerical-error claim is made.
- Independent review exposed destructive intermediate underflow even where the final mathematical answer was representable. Nonzero multiplication/division/power, exponential and numeric-literal underflow now reject. Complete nonzero addend erasure also rejects. Genuinezeros and exact cancellation are retained.

These are source-defined analytic mathematical methods and bounded engineering corrections; their complete canonical input/output/feature scope remains unapproved. General symbolic calculus, arbitrary integrals and complete derivative/integral/limit products are not claimed. Source method/limitations, immutable internal version and governance are exported; imports recompute the entire selected operation and reject tampered methods/results/versions/approval flags. Free/Pro/Business use identical mathematics.

The new private canonical inspector provides searchable540-ID discovery, exact unresolved gates and I/O signatures, newest bounded evidence and demonstrated defects. It downloads immutable per-ID review packets, retains up to20tab-local review-history entries, restores selections and verifies packets against compiled identity/requirements/source bindings. Forged canonical acceptance or removed gaps fail. It also exposes the three private calculus successors and their exports/replay. This is a private review application, not a public route, calculator alias, database approval writer or certification submission.

## Security, schema, accessibility and performance

Isolated pinned PostgreSQL17.6 and real PostgREST acceptance passes8HTTP/RLS checks plus schema preflight: wrong signatures, ownership, plan-write denial, membership fencing, protectedRPC access, concurrent receipts, late-failure rollback and missing/inaccessible signatures. Eleven additional schema/security-contract cases pass against the disposable repository fresh/model/proposal lane. Intact guarded SQL is shown to refuse; reviewed proposal guards are removed only inside that local model as prescribed by the existing harness. No production SQL, migrations or metadata mutation occurs. Passing local modeled adoption does not establish authentic current production compatibility.

GoTrue is **unavailable** in the local image/config inventory. The existing identity fixture is explicitly a synthetic HS256 user endpoint and PostgREST proxy, notGoTrue. Signup/password grant, recovery, refresh rotation, revocation, PKCE, MFA, email delivery and live-provider equivalence remain UNKNOWN. Installed SDK/user-lookup and real database transport evidence does not substitute for these. Supabase skill/changelog was consulted; no Supabase feature/configuration/schema was implemented or upgraded. The exact pinned17.6 fixture is not a claim to current hosted-service versions.

Final browser journeys cover60cases:7representative per-ID evidence selections×3plans×2widths and3successor operations×3plans×2widths. All540identities are present and unaccepted in the authenticated proof. Real downloads, history/scenario restoration, source/requirements tampering, different-input calculus restore, invalid-domain stale-result removal, labels, keyboard plan navigation, no horizontal overflow and private401/403/405 boundaries are checked. Evidence fixtures are not production authentication.

Observed final private fixture load times were545ms at320px and420ms at1280px on the local test host. These are bounded local measurements, not production/CoreWebVitals or full540accessibility/performance acceptance. Full-domain UX/accessibility/history/scenario/export/parity readiness remains a separate per-ID gate.

## Validation and remaining path

Final focused campaign:50tests pass, including independent numerical/domain/underflow/replay cases,540/424ledger invariants, source/approval tampering and three preserved-v1 diagnostics. Full applicable unit-suite receipt is recorded separately in verification.json. Browser60journeys pass; PostgreSQL/PostgREST security8+schema preflight and local schema11cases pass. Transport/CIguards73pass, launch45/certificationguards15pass. Lint0errors/28existingwarnings; typecheck and next build --webpack pass(37staticpages). Offline generation/check reproduces the540ledger, CSV, discovery and prioritized queue exactly. Independent review: INDEPENDENT-REVIEW.md. Certification guards grant no certification.

Review corrections were made without weakening assertions: destructive underflow/addend erasure now rejects; calculus artifact restore now updates both displayed input and result, with browser input deliberately changed before import. Temporary polynomial-helper name shadowing and missing diagnostic context arguments were fixed before final passes. Failed initial runs are retained as failures, not counted as successful verification.

Shortest path:

1. Recover the complete authoritative Blueprint attachment and verify its original bytes/hash; map complete per-ID requirements prospectively without changing the424historical records.
2. Review the highest-priority #247/#248 defects and private successors against complete canonical scopes. Keep old versions immutable; no automatic routing or publication.
3. Adjudicate the37engine/16identity fixture mismatches with explicit method/precision contracts and independent expected mathematics; do not “fix” expectations by convenience.
4. For the remaining identities, resolve their exact mapping/I/O/model/feature requirements and close the per-ID numerical, source/applicability, qualified-review and UX dimensions. Provider/tax/clinical/institutional requirements and all43authority blocks remain explicit; fiveSOURCE_PARTIAL cases and #527restrictions are not waived.
5. Obtain an isolated actualGoTrue stack and authentic protected schema metadata before claiming those unavailable acceptance dimensions. Production compatibility, certification and publication remain separate future authority actions.

The inherited implementationSourceTreeSHA256 is scoped to the reconciliation's calculator-TypeScript graph, not the complete review application. engine-bindings.json separately pins new implementation, UI, tests, generator, source catalog/requirement ledger and generated artifacts. Hashes establish inspected bytes, not authority or credentials.

Preservation:integrity.json verifies2107of2108baselinefiles unchanged; only the existingCI file gains mandatory ledger-reproduction/browser acceptance. All540identities,424historicalrecords,14originalDRAFTs, prior source profiles, historical versions and existing publication/security/RLS controls are intact. One bounded draft-head CI check is performed after opening the new draft PR. RELEASE HOLD remains active. No merges, deployments, production database operations, payments, certification or public publication.
