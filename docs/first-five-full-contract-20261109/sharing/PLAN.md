# Five-calculator Business sharing implementation plan

Goal: provide real organization/project/client shared immutable snapshot capture, owned team replay and recorded exports for retained technical versions 1 of 386/370/371/372/373.

Approved architecture: reuse organization membership and project/client containers, immutable exact-version verification and existing SavedCalculationActions/AccountSessionBoundary. A NEW guarded review-only atomic sharing contract lives outside active migrations. Its absence fails closed. No held SQL activation, historical calculator/history changes, production deployment or canonical/source approval.

Approaches: personal scenarios fail the explicit team/client requirement; direct writes to the existing mutable shared_calculations table do not establish immutable or same-tenant integrity. The selected guarded successor uses its own immutable shared-snapshot table and atomic idempotent RPC, validates same-org project/client binding, and preserves existing tables/policies byte for byte.

Tasks:
1. TDD strict exact-five snapshot/request validation and server boundary helpers; run red then green focused tests. Unknown identities, extraneous fields, forged outputs, foreign tenant/role, replay and idempotency must refuse.
2. Add guarded SQL proposal with advisory/request serialization, current membership and paid owner checks, project/client tenant checks, append-only immutable snapshots and audit writes. Prove refusal while guard is retained; adopt ONLY disposable local fixture after explicit removal of this new guard. Never apply held SQL.
3. TDD project list/detail capture and shared record read/replay/export UI. Reuse existing renderer and export/scenario tools, retain exact record rather than reapplying current display metadata. Missing RPC/schema exposes explicit unavailable state.
4. Genuine GoTrue/PostgREST local evidence: exact five shares/retries/read/export, team role differences and membership revocation, foreign-project/client and cross-org negatives. Focused checks only; root owns full build/suite and final source admission.

File ownership: new src/lib/business/technology-five-sharing.ts/.test.ts; new src/app/business/projects/[id] and src/app/business/shared/[id] routes/actions/tests; minimal business/page.tsx project links; new docs/first-five-full-contract-20261109/sharing and tests/first-five-full-contract-20261109/sharing*. API/native embed files remain another agent's ownership. API dashboard insertion is coordinated separately.
