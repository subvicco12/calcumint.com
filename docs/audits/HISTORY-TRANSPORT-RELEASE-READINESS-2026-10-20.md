# History transport and consolidated release dependencies

**RELEASE HOLD.** Baseline draft #1458 `587317d389ec9d994a0314b3e1c606e993c66a66`; its six CI checks passed. Main remains `caffafe639350ca0c2c2cf33ae1f099294f5af54`. No production access, production SQL application, payment, certification or publication occurred. Source PRs remain unchanged.

## Verified transport, with explicit boundaries

`npm run test:atomic-history-postgres` now runs the existing native quota acceptance followed by **20 real HTTP/PostgREST tests**. PostgreSQL16 and PostgREST12.2.3 images are digest-pinned, run on a disposable internal Docker network with no published container ports and are removed afterward. A temporary loopback gateway adapts Supabase's `/rest/v1` URL prefix; it is not a Supabase gateway emulator. Database mutations and synthetic accounts exist only in the disposable fixture.

The transport is actual Supabase JS → loopback HTTP → PostgREST JWT verification → PostgreSQL RPC/RLS. Only server-client creation and `auth.getUser()` are synthetic; private `requireDraftAccountAccess` still queries actual `platform_admins` through authenticated JWT/RLS. `auth.uid()` and platform grants are explicitly modeled fixture dependencies. This does **not** attest production GoTrue, cookies, PKCE, token refresh/revocation, gateway configuration or deployed schema equivalence.

Coverage includes:

- Concurrent identical and conflicting history/scenario UUID requests; exact immutable payload preservation, ownership/source/project binding and no foreign-row visibility.
- Concurrent Free19→20 RPC saves, legacy REST denial at quota, paid→Free profile-lock waits and scenario entitlement downgrade fencing. Existing Free20 / paid-unlimited policy is unchanged.
- Committed response loss followed by explicit same-UUID retry; late history/scenario trigger failures roll back and then accept a retry. No automatic success after an uncertain reply and no global exactly-once claim.
- Missing/argument-mismatched/revoked RPCs fail closed without a REST fallback. Actual JWT signature rejection and unauthenticated RPC denial are exercised.
- Actual038 client ACLs preserve profile display-name updates while denying plan changes and billing-table writes.
- Private save/reopen of all14 DRAFT v1 snapshots on Free/Pro/Business: **42 save/reopen roundtrips**. Persisted values are compared with unchanged deterministic engine captures; existing independent mathematical goldens are reused, not relabeled as new certification.
- Actual private pagination actions traverse45 rows through timestamp microseconds and UUID ties, retain an off-page selected record, deny foreign owner contexts/reads and reject corrupt/unsupported-version reopen. Revoked reviewer membership is denied by the real access adapter. Owner/source/page-size cursor rejection is separately covered by the reused cursor unit tests.

The prior #1458 389 focused tests, five browser pagination groups at320/1280 and native46 assertions remain evidence for unchanged application/SQL behavior. This batch additionally runs33 focused tests across five affected contract files. New transport tests are separate from those counts. Physical Android/TalkBack and real browser authentication remain UNVERIFIED. No browser behavior changed, so baseline browser runs were not repeated.

## Migration and RPC dependency matrix

| Contract | Repository/disposable evidence | Production readiness / decision |
| --- | --- | --- |
| Supabase auth roles, JWT claims, `auth.uid()` | Modeled claims bridge supports native SQL and actual PostgREST JWT claims; synthetic authenticator is NOINHERIT | UNKNOWN: deployed helper, role memberships, default grants and gateway settings are not attested |
| `001_b3_accounts.sql` | Applied unchanged in disposable DB: profiles/history/favorites, ownership RLS and account bootstrap | UNKNOWN deployed definition/digest; retain immutable version/input/output fields |
| `002_b4_billing.sql` | Applied unchanged; legacy Free20 history trigger coexists with atomic guard | Verify deployed legacy trigger/function identities; no billing activation implied |
| `008_b10_admin_factory.sql` | Applied unchanged; real platform-admin role/active checks through RLS | Actual reviewer authority is external; fixture assignments authorize synthetic tests only |
| `010_b7_pro_workspace.sql` | Applied unchanged; projects/scenarios, owner/project binding and cascade behavior | UNKNOWN deployed schema/grants; existing paid capability preserved |
| `011_b8_free_save_quotas.sql` | **FAILED unchanged:** PostgreSQL42601, unterminated dollar quote; file ends function with `end $;` although it opens `$$` | BLOCKED historical repair decision. File remains unchanged. Production may have a corrected function or a different migration history; neither is inferred |
| Fixture-only011 model | Exact one-terminator repair `end $$;` is applied only in memory in disposable DB, after asserting unchanged failure | Not deployable evidence for the original migration; owner must choose auditable repair/rebaseline strategy without silently rewriting applied history |
| `029_account_rls_auth_initplan.sql`, `033_pro_workspace_rls_auth_initplan.sql` | Applied unchanged after prerequisite tables; actual owner policies exercised | UNKNOWN deployed equivalence; repeated032–035 prefixes must resolve by exact filename/dependencies, not numeric prefix alone |
| `038_client_account_billing_privileges.sql` | Existing review-only proposal applied unchanged **only to disposable DB**; HTTP effective-grant checks pass | BLOCKED owner adoption. No claim it is deployed; no new grants are introduced in this PR |
| `ATOMIC-ACCOUNT-HISTORY.sql` | Existing guard rejects application; fixture removes only that guard. Legacy002 + modeled011 triggers coexist with tested atomic behavior | BLOCKED owner/security review: trusted function owner, fixed paths, EXECUTE/default/inherited ACLs, maintenance contexts, profile row-version writes and deployed billing/profile triggers |
| `save_calculation_history_atomic(uuid,text,integer,jsonb,jsonb,uuid)` | Required JSON arguments: request ID, slug/version, input/output and expected-owner UUID; scalar result must equal request UUID | Matching RPC required before new history saves; no REST/count fallback. Last argument is an equality fence against JWT owner, not an ownership selector |
| `save_project_scenario_atomic(uuid,uuid,uuid,text,uuid)` | Required request/project/history/name/expected-owner arguments; project may be null; source snapshot copied transactionally | Matching RPC required before scenario creation. Existing owner-bound reads/deletes remain independent |
| History seek index | Proposal `(user_id,created_at DESC,id DESC)`; limit+1 owner/source keyset reads pass | Review index naming, size/build strategy and deployment locking; no index was added outside fixture |

Migration031's complete source-evidence dependency graph is not loaded by this bounded fixture. Its platform-owner predicate optimization is therefore not claimed tested here. Migration009 absence and historical duplicate-prefix resolution remain inherited integration-owner blockers, not silently repaired prerequisites.

## All-writer acceptance

| Writer | Current application behavior | Adoption dependency |
| --- | --- | --- |
| Shared calculator browser save | `calculator-account-actions.tsx` → `saveHistoryAtomically`; retains UUID per captured revision | Atomic history RPC + DB guard |
| Generic server save | `app/account/actions.ts` → same helper; optional caller UUID | Same; callers needing retries across requests must retain/supply UUID. A server-generated UUID is invocation-local |
| Private14-DRAFT save | `app/account/drafts/actions.ts` → strict v1 capture, exact owned reconciliation, same RPC | Same; active reviewer guard remains |
| Scenario creation from history | `saveProjectScenario` → expected-owner copy RPC, retained form UUID | Atomic scenario RPC + DB guard |
| Project creation and scenario rename | Existing owner-filtered REST writers retained | Proposed trigger serializes plan; scenario snapshot edits denied while name/updated_at remain editable |
| Own history/scenario/project cleanup | Existing DELETE + owner RLS retained, including downgrade cleanup | Retained-row replay memory disappears if its row is deleted |
| Local synthetic snapshots/scenarios | Browser-local reviewer fixture only | No authenticated persistence grant, no database quota claim |

No identified application history/scenario INSERT bypass remains. Favorites, custom-calculator runs, API jobs and billing events have separate policies and are not claimed covered by the history quota contract. Privileged external/manual writers cannot be inventoried from repository code alone: UNKNOWN owner attestation required. Legacy direct cross-owner same-new-UUID collisions can expose a PK23505 error; RPC callers map that failure to generic rejection, as documented at #1458.

## Cumulative compatibility and release-blocker matrix

The candidate retains #1458 ancestry and changes tests, scoped CI and acceptance evidence only. No engine, renderer, auth, billing, SQL proposal or historical migration implementation changed. Previously passing cumulative CI is reused; final-head automatic CI validates integration again.

Bounded provenance reconciliation found #1444 head `f5712ba6811e9ed311df2ea95cfa02d3fbf4622e` in ancestry. Current independent #1450 head `8792150c9b6cd129e3123049e75248acec3248f7` is **not** a literal ancestor, but all four changed file blobs exactly equal incorporated `7f31398` and baseline #1458. That is content equivalence, not an invented merge. Other checked cumulative ledger heads through #1458 are ancestors. Source PRs were not modified or closed.

| Release area | Status | Remaining authority / action |
| --- | --- | --- |
| History/scenario HTTP transaction contract | VERIFIED_DISPOSABLE | No additional application defect reproduced; production compatibility remains UNKNOWN |
| New production history/scenario writes | BLOCKED_MATCHING_REVIEWED_RPC | Do not deploy application alone: absent/mismatched contracts fail closed across every plan |
| Migration011 syntax/history | BLOCKED_OWNER_REPAIR_STRATEGY | Database/integration owner establishes applied history and approves an auditable fresh-install/upgrade repair |
| Atomic quota/profile locking,038 and maintenance writers | BLOCKED_SECURITY_DATABASE_REVIEW | Confirm trusted owners/grants, actual triggers, account maintenance and retention/rollback contracts |
| Billing/API/embed/membership proposals | BLOCKED_INHERITED_ADOPTION_GATES | Reuse their existing isolated evidence; this history test does not authorize or attest their production deployment |
| Real auth/cookies/refresh/revocation + physical devices | UNKNOWN / UNVERIFIED | Authorized non-production auth/device verification; no new Supabase resource is required by this PR |
| Calculator portfolio | 540 master rows /574 registry definitions /14 owner-authorized unregistered DRAFTs retained | No new engines/mappings/certifications/publications; private approval is not public publication authority |
| Publication evidence | Historical209-identity sanitized DB snapshot reused | Current production approvals/visibility UNKNOWN in this batch; no production query performed |
| Waiver/source/mapping/HOLD/specialist authority | UNKNOWN |836 waiver authorities,210 source reviews,540 mapping decisions,12 HOLD dispositions,38 specialist reviews require authentic authorized evidence |
| Mortgage/BMI and SIP v2 | BLOCKED_EXISTING_SPECIALIST_VERSION_GATES | No invented period/clinical/numerical-policy decisions, no version activation |

## Ordered rollout/rollback proposal — no authorization to execute

1. **Keep HOLD.** Integration owner reviews the cumulative draft and exact-head CI. Retain immutable captures and request IDs; leave source PR states unchanged.
2. **Read-only owner evidence.** Database/security owner supplies exact deployed table/function/trigger/index definitions or digests, migration-history identities, RLS/owners, inherited/default/table/column ACLs and maintenance writers. Resolve009,011,029 and duplicate032–035 prefixes by actual dependency identity. Missing evidence remains UNKNOWN.
3. **Decisions before SQL.** Owner chooses011 repair policy and authorizes a separately reviewed migration plan; trusted RPC owner, least-privilege grants, profile lock/billing interactions, service/maintenance contexts and receipt deletion/retention must be explicit. No row-deletion-surviving exactly-once guarantee is promised; stronger tombstone retention is an optional product/security decision.
4. **Isolated adoption rehearsal.** Run full fresh-install and upgrade fixtures, effective role/RLS matrix, concurrency/rollback, actual PostgREST schema-cache reload and client retry tests against the approved schema. Add real non-production auth/cookie tests when authorized; synthetic `getUser` is insufficient for that claim.
5. **Future separately authorized rollout.** Back up/record schema and data contracts; adopt approved storage/RPCs before application writers; verify exact signatures/grants/index and schema-cache visibility. Keep app writes paused until matching contract is verified. Do not activate public calculators or certify anything as a side effect.
6. **Future rollback.** Stop new writes, retain immutable rows/request IDs and preserve reads. Coordinate application rollback with storage compatibility; never restore a count→insert fallback. Reversing triggers/functions/grants requires an owner-approved data-preserving rollback and renewed quota/security verification. No automatic DROP or destructive SQL is supplied.

Smallest next engineering batch: exercise the owner-approved fresh-install/upgrade history contract once the011 history/repair strategy is decided; independently extend synthetic cookie/refresh tests only for reproduced defects. Collecting missing reviewer decisions is an owner/specialist task, not a reason to repeat passing math or HTTP tests.

Local final validation:20 HTTP cases plus the inherited native groups passed;33 focused contract tests, typecheck, affected ESLint and one `next build --webpack` passed. Local Node24.19.0/npm11.9.0; mandatory final-head CI uses Node22 and the unchanged locked install/build commands. Runtime differences are recorded rather than presented as production equivalence.
