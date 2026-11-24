# Socket-free acceptance and hosted authority handoff

**RELEASE HOLD ACTIVE. Source implementation and exact execution package are preserved. Actual PostgreSQL, cross-host and authenticated browser qualification have NOT run. No identity is promoted.**

## Exact remotely preserved source

- Authority/package commit `ef54c5d1203ae693a186ecbb75394c5a89cd9a6a`, tree `28cd8a8b10240ecd4fe3b07efc3782e0e28ad60d`, branch `engineering/worker3-authority-hosted-20261124`.
- Fixture/application commit `bab4fd87e91309b15cce9600d81ec523f645f158`, tree `dac8a76d9ad2745e673d3194ec9da0b37905b6bb`, branch `engineering/worker3-socketfree-20261124`.
- Workflow blob `c27a3ee13a7305c118a96f22f36fd5dbe2364cab`.
- Provider adapter blob `c7b6b7dfa63c32ea2cf96af133cdfeecf2b455fe`.
- Qualification-only SQL blob `cab111d7d95a765743a2f0ce7cdbe9de35981a97`.
- Source archive `hosted-source.tar.gz`,1,034,641bytes, SHA-256 `2348755b682f6a89adc8b02ed3108e2741afbe9e426d6f4a0d260f08e5c538ea`.

Accepted v2 implementation8a55882b, policyaa6b7a18, amendment/adoption records,20 passing authority tests and five local SQLite cases remain preserved. They were not rerun. Frozen original bootstrap, two-path verifier, historical engines, old approvals and source archive/nomination are unchanged. The274 portfolio stays5f4652917f707e5149d0fe1340a5118ef330ae03/treee4021139f69732bd95d8ee0adc17782739e2454a. PR1538 still resolves49ea243b5be7e1ee9f3cd8af7f936ab784402cf7. No existing six mandatory CI definitions were changed.

## Minimum implementation delivered

`tests/gotrue-services/fixture.mjs` consumes private run-bound loopback service endpoints and provider-managed service IDs. It rejects external selectors, wrong scope/run/attempt and missing config; socket-free mode cannot fall back to Docker. It uses the unchanged existing schema initializer, guarded-bundle negative control and HTTP browser/export journeys. SQL uses native `psql -X -qAt -v ON_ERROR_STOP=1`, retaining original statement/transaction/output behavior, with a private disposable identity preflight and bounded role/timeout. Errors disclose SQLSTATE, not query text or credentials.

The #426 driver remains byte-identical, SHA-256c3ce2ae73597be4a3b27f5b0e9e6d54279fc6508e5c5b9e41009cc9edf5a619c. There are no `src` changes versus its exact890bf194 candidate. The app runs as existing nobody UID/GID65534 with cleared groups/no-new-privileges and sanitized environment. It checks that the Docker socket is neither readable nor writable and that provider credentials are absent, and writes an isolation receipt before acceptance. Credentials are not exported to the application. Known synthetic fixture signing material is test-only.

Existing v2 PostgreSQL claim functions are advanced, not replaced by another framework. Qualification now has a fixed native psql transport, actual concurrent clients, server-enforced unique run/attempt/nonce, discarded commit acknowledgments via terminated client process, interrupted receipt reconciliation, restricted-role tests and a real client network-partition probe. The installed SQL explicitly refuses source-admission mode under the current unadmitted-hosted-store policy; qualification receipts cannot turn into admissions. **These PostgreSQL cases are prepared, not passed.**

`provider.py` implements fresh bounded GET-only identity/Drive/GitHub readbacks, verified owner subject/email, exact adoption, exact repository/run/workflow/head/ref/attempt/operator, unchanged active rulesets and explicit environment branch allowance. Source-grant review also requires separate current owner product/applicability/grant decisions, complete evidence and pinned runtime/context checks. There is no admission CLI, provider write or authority cache. The existing credential must support verified identity readback; missing scope or access fails closed. No new credential was requested or created.

## Actual verification and exact remaining authorization

Eight new test methods pass:4 provider semantic/negative tests,2 service config/no-fallback tests,2 SQL selector/role tests. Python syntax, Bash syntax, YAML structure/source bindings and fixture lint were checked. Lint reported only React-version detection because shared dependencies were not installed into the isolated fixture checkout; no browser/dependency-install PASS is inferred. The new hosted application step runs lockfile npm ci.

No actual PostgreSQL qualification ran. Local Docker inventory was rejected by automatic approval review; no workaround was attempted. No hosted workflow registration or dispatch is authorized yet. Workflow/run/job IDs and conclusions therefore do not exist and are not invented. Local SQLite evidence was neither repeated nor substituted for PostgreSQL.

[AUTHORIZATION.md](AUTHORIZATION.md) freezes the exact3 jobs, permitted resources,10/20/10-minute budgets, registration/protected-configuration sequence and one bounded attempt-one authorization statement. Existing locks cannot be advanced. The environment currently allows only the old frozen runtime ref; new exact execution-ref protection/allowance and the exact new SHA variable require separate authorization. Required provider reviews remain mandatory.

A job-local PostgreSQL service cannot establish cross-host replay. Two independent runners must address one nominated existing approved non-production PostgreSQL store with exact identity/access/credential bindings. None is supplied. No public exposure, tunnel, new permanent service, VPS or new platform credentials are proposed. The3-job package can establish independent-client PostgreSQL behavior and #426 acceptance, not cross-host or publication readiness.

## Portfolio acceptance ledger

The consolidated acceptance archive1vKo7soGIFucAhgGy-mmZEF6lAspOf8xo matches SHA-256b81783c86a740462f13f81cdcb3edd2e58a8d366a70970c949d5a2599f749d0b. Its original inner digests were verified. Existing mass restoration was not repeated. The previously missing sibling review source1f05b241b4b76e37cab37ec2299c0d2aa0c6d537/treedf27bb8ba025373b7f2a7c39871e496824eff517 was restored once from its verified supplied bundle.

| IDs | Actual disposition |
|---|---|
|#426|Source/driver preserved; socket-free fixture prepared.0 new authenticated journeys and0 exports. Hosted authorization pending; not counted.|
|#57/#82|Review source verified; no account-backed isolated caller. Reuse61 supplied passing focused tests/TypeScript evidence without rerun. Financial methodology/numerical conventions, governed version adoption, source approval and actual delivery acceptance remain separate.|
|#377/#510/#511|Review replay bindings verified as supplied; isolated account caller, authenticated history/export/replay and final mapping remain pending. #511 also needs exact historical-rendering evidence. No active public dispatcher was widened.|
|#357/#358/#359/#360/#361|Existing3 journeys/3 exports per ID preserved at execution8e92ffa7 and immutable handoffa802d36d. Current integrated closure mismatch remains; no new credit.|
|#521/#523/#524|Existing3 journeys/3 exports per ID preserved at execution15829bca and handoff56553c47. Current integrated closure mismatch remains; no new credit.|

The prior exact-head closure reconciliation in e3882139 remains applicable because the integrated head5f465291 is unchanged. The217 historical files were not indexed or tested again. `portfolio-acceptance-ledger.json` enumerates every target and preserves274 bounded-private IDs,19 feature-only identities and separate #440 representation, with representation/completion/qualification deltas0. No canonical certification count changed. A passing future qualification run alone cannot close source/methodology/QA/Business/adoption/CI decisions.

## Disposable cleanup and publication dependencies

[CLEANUP.md](CLEANUP.md) contains exact recorded container/network IDs and volume name, original ownership/purpose/dependencies, current UNKNOWN state, cost/sensitivity limits and conditional operator commands. No deletion is authorized or performed. Read-only host-socket inventory was rejected by automatic approval review, so a permitted socket-free readback or separately authorized narrow operator inspection is required before deciding cleanup.

#440 remains NO-GO. Next gates are actual hosted PostgreSQL/provider evidence, real cross-host storage qualification and exact live-store adoption, competent owner product/applicability decisions, an exact short-lived grant, separately authorized source admission and governed receipt consumption, all six mandatory exact-head jobs, and existing current-production/writer/RLS/backup/restore/credential/freeze/rollback/RPC evidence. Production observer/restoration amendments remain separate. #432 cannot bypass shared gates. Hostinger settings were not changed; Auto-deployment must remain OFF. No actual source admission, activation, production SQL, deployment, merge, certification or publication occurred.
