# Singleton #440 owner authority v2 — isolated implementation

This successor is separately versioned. It preserves every byte of `tools/singleton440-authority`, the original bootstrap, frozen approvals and historical receipts. The adopted amendment is limited to general-purpose frequency conversion at the exact two-path candidate. It is not competent product approval or a live source grant.

## Implemented

- Frozen policy, exact amendment/adoption check, immutable nomination/archive/verifier bindings.
- Strict v2 grant and source-only receipt schemas with explicit authenticated-owner basis and `independentApproval:false`, `activated:false`, `certified:false`, `published:false`.
- Separate owner product assessment, legal/provider/specialist/governing applicability decision, and one-run grant. Adoption cannot replace any of these decisions.
- Attempt1, maximum600 seconds, exact candidate/tree/policy/executor/evidence/store/source bindings. Live API retains protected workflow/ref/environment/run and pinned Node/Git checks and compares mutable executor files with their exact Git objects.
- PostgreSQL atomic unique claim/nonce/run+attempt constraints, role-restricted claim/reconcile/finalize functions, authoritative receipt persistence and fail-closed state reconciliation. **The SQL has not been executed or qualified in this checkpoint.** There is no approved hosted store endpoint or production deployment.
- Disposable SQLite reference and fresh-process qualification. It refuses live authority and has no fallback role in the live PostgreSQL transport.
- Governed receipt-consumption review adapter. It refuses qualification receipts and returns review data only; no existing CI consumer or protected assertion is modified.

## Actual qualification and its limits

`python3 -B -m unittest discover -s tools/solo440-v2 -p 'test_*.py'`

`python3 -B tools/solo440-v2/qualify_local.py`

The supplied six v1 offline tests are retained unchanged under vendor. The new local driver uses12 separate Python processes with sanitized environments and a temporary SQLite file. It checks concurrent claims, replay, nonce reuse, replacements, actual process exit after commit/before acknowledgment, interruption before receipt, exact receipt reconciliation, and missing storage without automatic recreation. These are **local shared-file reference results, not independent-host or PostgreSQL qualification**. Synthetic test decisions are labeled and establish no real owner product acceptance.

`qualify_postgres.py` is an executable future qualification package. It refuses to run unless existing approved disposable client, admin and restart launchers are supplied. It has no Docker fallback. A supplied launcher must provide independent-environment execution and authenticated provider identity receipts if a cross-runner claim is made. No PostgreSQL or hosted qualification PASS may be inferred from Python/SQLite results.

## Current execution boundary

`execute.py` has no live command-line provider adapter. Direct invocation refuses. The live orchestration API is review-only; it requires an approved adapter that authenticates provider readbacks, verifies the protected workflow and exact runtime, addresses an approved durable store and supplies bound qualification/protection evidence. An arbitrary caller's dictionary or digest is not provider attestation. **That adapter and hosted durable-store admission remain actual missing execution dependencies.** The current policy explicitly admits no hosted endpoint, so actual hosted-store adoption requires an exact governed successor/binding rather than silently repointing this policy.

The manual qualification workflow is source only on the isolated engineering branch. No registration, dispatch, protected-ref update, protection change or provider bypass has happened. It runs offline qualification only, requests no production credentials, and cannot perform source admission. Future registration requires provider-compliant authorization and any reviews GitHub requires. Existing locked refs cannot be advanced. The proposed new execution ref must be separately authorized and protected before use; creating an unprotected ref does not satisfy its guard.

Provider rulesets27851420 and27907165 read back active with update locks on their original frozen branches. No amendment to a project policy overrides those locks, GitHub review gates or legal/specialist obligations. Actual source-only execution remains closed until the endpoint, adapter, owner product/applicability decisions, exact evidence and one-run grant exist. Activation, exact-head six-job CI, certification, deployment and publication remain separate gates. Production observer and restoration amendments are not included.
