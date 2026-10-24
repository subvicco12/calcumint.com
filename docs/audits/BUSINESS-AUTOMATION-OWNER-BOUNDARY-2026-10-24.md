# Business automation owner boundary — RELEASE HOLD

Frozen baseline: PR1467 `b85e845ecd11856f963c9f32af9634b8e4738293`.

The existing Business credential creation actions checked the rendered account against a fresh authenticated user before writing. API-key revocation and webhook disabling omitted that check and their forms omitted the rendered owner. A stale page could therefore revoke automation under a subsequently authenticated administrator in the same organization. The organization filter and role check did not distinguish those two accounts.

Both revocation actions now reuse `verifyCredentialOwner` immediately before their updates. Both actual dashboard forms send `expectedOwnerId`. Existing Business entitlement, administrator permission, organization filters and revoked/disabled states are retained.

Deterministic red evidence: the credential-action suite had four failures because stale-owner and missing-owner revocation calls resolved instead of rejecting. After the fix, 59 tests across ten focused Business/action/dashboard files passed. Six revocation cases cover both rejected contexts and valid current-owner operation; the actual dashboard rendering test checks both form contexts. Affected ESLint and `git diff --check` passed. No full suite/build was run in this lane; integration owns those checks.

This is bounded application evidence for existing PARTIAL ledger requirement BP-0546-0546 (scoped/revocable API/embed keys), also relevant to Business automation BP-0776-0779. The existing 424-record ledger classifications remain unchanged. Prior scenario-business and runtime-PDF acceptance evidence remains applicable; no deployment/DB adoption is inferred from synthetic transport.

Real remaining gates include integrated exact-head verification, deployed authentication/RLS/RPC enforcement, provider adoption and the existing external review authorities. No production operations, SQL migration application, payment, calculator/math/version, historical-result, certification or publication changes occurred.
