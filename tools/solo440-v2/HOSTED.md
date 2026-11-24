# Existing owner-v2 successor: hosted qualification package

This advances the accepted8a55882b implementation. Policyaa6b7a18 and the exact #440 candidate, nomination, engine and source archive are unchanged. No historical approval is reinterpreted. No actual source admission/activation or hosted dispatch has occurred.

## Implemented changes

`provider.py` uses bounded GET-only HTTPS provider reads with redirect refusal. It authenticates the existing Google identity subject and verified email, cross-checks Drive identity, re-reads exact adopted amendment/owner comment, verifies repository/run/workflow/head/ref/attempt/operator, both active frozen rulesets, exact new protected branch and existing environment's explicit branch allowance. It has no provider write operations or admission CLI. Separate owner product, applicability and one-run grant comments remain mandatory for full source-grant review. The qualification CLI verifies adoption/protection only and explicitly does not infer product approval. OAuth userinfo must work with the existing credential; missing scope fails closed and is not permission to provision another credential.

`disposable-sql.py` is a native psql transport. It accepts only run-bound loopback workflow-managed disposable services and preflights their private identity row before application SQL. Role selection is bounded. There is no Docker executable/socket, arbitrary launcher, external DB selector, credential fallback, local SQLite substitute or permanent service. `qualify_postgres.py` uses fresh clients against actual PostgreSQL to check atomicity, concurrent claims, unique grant/nonce/run-attempt, replacements, restricted role, receipt isolation and reconciliation. Fault injection terminates a fresh client process after actual commit before returning acknowledgment. A privileged workflow operator creates an isolated network namespace only for the storage-unavailability probe; no Docker operation is involved. The network probe must show an actual connection refusal, not an unrelated launcher failure.

## Minimum hosted jobs

The manual workflow `.github/workflows/solo440-hosted-qualification.yml` defines:

1. `postgres-contract`: one pinned PostgreSQL17.6 service,10-minute budget; actual SQL contract/concurrency/fault-recovery/partition tests, no source admission.
2. `mass426-authenticated`: pinned PostgreSQL17.6, GoTrue2.197.0 and PostgREST12.2.3;20-minute budget. It fetches the separately pinned socket-free application fixture source, uses lockfile `npm ci`, Node22.23.4, existing Chrome/pdftotext, synthetic accounts and unchanged #426 driver. The application runs UID/GID65534 (existing nobody account) with cleared groups, no-new-privileges, a sanitized environment and a private config. It refuses readable/writable Docker socket access. Provider credentials are absent from the application environment. Only loopback service ports are published. It requires exactly3 plan journeys and3 actual JSON/CSV/PDF downloads. Existing driver assertions additionally enforce replay, account/plan isolation and revocation. Synthetic fixture signing material is not a platform credential and must never be used in production.
3. `provider-readback`:10-minute budget; reuse existing Drive credential and read-only GitHub token for current identity/adoption/protection facts; no live grant, claim, receipt activation or production operation.

The PostgreSQL/auth fixture reuses the unchanged schema initializer and negative guarded-bundle assertion. GoTrue/PostgREST have bounded provider-managed restart-on-failure during initial role setup; no application-managed container lifecycle or Docker access is used. All image references retain exact existing digest pins. Existing six mandatory application CI jobs are unchanged; these3 qualification jobs do not replace them.

## Actual results versus pending execution

New provider semantic/negative tests and socket-free config/client tests pass locally; syntax and workflow YAML checks pass. The prior20 authority tests, five local durability cases and restored/indexed portfolio evidence were reused, not rerun. There is NO actual PostgreSQL, authenticated browser or hosted provider PASS from this package yet. The local socket inventory was rejected by automatic approval review; no workaround or indirect daemon access was attempted.

### Cross-host boundary

Standard hosted job service containers are job-local. Two fresh clients on one runner establish independent-client behavior, not cross-host replay. Sharing a dumped DB/artifact with another job also would not establish one durable authority store. A real cross-host qualification still needs an already authorized non-production PostgreSQL endpoint reachable from two independent runners, with exact store identity, access restrictions and existing authorized credentials. None is nominated here. No public tunnel, new paid host, permanent service or new platform credentials are proposed. The current policy admits no hosted live authority endpoint. Actual source admission remains closed even if the3 proposed jobs pass.

## Provider-compliant registration boundary

Both existing frozen refs and rulesets27851420/27907165 remain untouched. Proposed execution ref is `engineering/solo440-owner-v2-execution`. The exact new workflow source must be registered through the existing required PR/review process. That new ref must be initialized at the frozen candidate, protected, and explicitly added to the existing environment's allowed branches; configure only `CALCUMINT_SOLO440_HOSTED_WORKFLOW_SHA` to that exact SHA. These are separately authorized future operations. Do not add bypass actors, self-approve a required independent review, advance frozen refs, or weaken provider protections. Then obtain one exact attempt-one qualification-only dispatch authorization. No registration, protected-setting operation, dispatch or merge has been performed.
