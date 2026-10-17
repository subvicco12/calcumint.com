# 540-master publication evidence reconciliation

15 October 2026 IST. Baseline draft #1395 `1368fb96a665a3803a4fbe81ee8dac0c2f71a90e`. Source registry remains unchanged on isolated `audit/master-catalog-publication-evidence`.

## Evidence and coverage

The authoritative repository master CSV supplies exactly540unique master IDs/domains/titles. Existing provisional reconciliation and exact-title candidate helpers, plus the reviewed partial mixed-category ledger, are reused without inventing aliases/domain approvals. Fully reviewed category/slug mapping files are unavailable; this is a complete540-row **evidence audit**, not a claim that all540identity mappings are approved.

Anonymous observation:15October2026,14:38IST (raw UTC timestamp retained in the snapshot). Only configured NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY were used, without printing values. The collector refuses privileged credential roles and uses HTTPS GET only. The repository migration026 stable public manifest RPC exposes published key/slug/version triples only. Response:HTTP 200,209 entries. The protected calculator_catalog_admin SELECT returnedHTTP 401. No alternate privileged credential, protected approval lookup, write RPC or DB mutation was attempted. Deployment attestation/live visibility is UNKNOWN.

-209 published DB manifest identities all match active registry key/slug/version and inherited code-certified flags. No public-manifest orphan, key conflict, version conflict or code-status mismatch was observed.
-Those209matches do not prove DB certification, specialist approval, approval of proposed numerical corrections, exact deployed engine SHA or master identity approval.
-136 master rows have a unique candidate with a matching public identity; these remain candidate joins, not approved master mappings.
-DB certification and specialist evidence is UNKNOWN for all540rows. A public manifest omission is NOT an unpublished/HOLD/rejected decision; protected rows remain UNKNOWN.

## Classification definitions and exact counts

| Classification | Rows | Meaning |
| --- | ---: | --- |
| verified |0| Full master identity plus protected certification/approval evidence; unavailable here. This does not mean zero DB-published calculators. |
| missing |245| Missing reviewed/title-candidate linkage evidence. NOT245proven absent engines. Existing aliases or differently named implementations may exist. |
| ambiguous |174| Candidate/domain/shared-title mapping unresolved, or identity conflict. No canonical mapping guessed. |
| version conflict |0| No differing version on an observed same-key/slug public candidate. Private/unpublished version conflicts remain UNKNOWN. |
| approval pending |121| Existing master HOLD or provisional source match requiring protected decisions. |
| Total |540| Every master ID appears exactly once in CSV and JSON. |

Candidates and code review flags are explicitly separate from DB observations. `publicationAuthorized:false` and `certificationAuthorized:false` mean **this audit grants neither authority**, not that it revokes the209observed publications. `holdBasis` distinguishes existing master review decisions from a held candidate whose master mapping is still unapproved. Six explicit master HOLDs plus six additional candidate-linked HOLD rows are retained (12 rows total). The latter are IDs222,277,308,402,510,511, concerning Power, Distance, Pace and Travel Time; no new HOLD decision is manufactured.

## Six explicit HOLD findings

All six are absent from the209-entry public manifest; protected certification and specialist/lifecycle decisions remain UNKNOWN. All retain inherited code-certified flags, which grant no approval.

| Master | Current registered identity | Version | Unresolved decision |
| --- | --- | ---: | --- |
| 235 / Graphing |advanced-math.graphing / graphing-calculator|1| Exact expression/parser/sampling and analytical visualization scope; distinct from2Dplotter. |
| 251 / 2D Function Plotter |advanced-math.function-plotter-2d / function-plotter-2d|1| Essential presentation versus Graphing analytical contract; shared engine does not approve equivalence. |
| 275 / Volume |geometry.volume / volume-calculator|1| Master-required shapes, units and visualization versus current rectangular-prism scope. |
| 276 / Slope |geometry.slope / slope-calculator|2| Retain draft v2 coordinate identity and v1 historical meaning; publication/certification and external/history consumer review still blocked. |
| 282 / Standard Deviation |statistics.standard-deviation / standard-deviation-calculator|1| Sample/population behavior, precision/dataset limits and distribution-summary UI approval. |
| 283 / Variance |statistics.variance / variance-calculator|1| Same statistical contract/source/visualization review; passing existing regressions is not approval. |

The six-source review CSV and master feature/provenance packets are reused. **Stale Slope notes are not current registry authority.** Older13October collision/proposal packets describe active launch v1 and an inactive coordinate v1. The newer `slope-draft-migration-final-readiness-assessment-2026-10-13.md`, current source/tests and inherited source commit372b180f31f49ffa2a517d541ee9443cf2587824 show draft-only atomic geometry.slope v2 with one active slug. The legacy launch v1 source remains excluded. Strict isolated decoders preserve stored outputs and reject cross-version/mixed shapes; both versions remain excluded from scenario re-evaluation. No historical migration, version rewrite, registry switch or approval is made by this audit. Existing read-only screenshots cannot prove absence of external/browser history; current protected history is not queried.

## Artifacts and reproduction

- `master-publication-audit.csv`:540 rows, unknowns explicit, formula-safe spreadsheet cells, candidate identities, code status, DB facts, HOLD basis, priority and next action.
- `master-publication-audit.json`:same540rows, candidate details, classification definitions, six HOLD findings and prioritized blockers.
- `summary.json`:aggregate counts and public identity mismatches.
- `anonymous-publication-snapshot.json`:sanitized public triples, observation time, response statuses and UNKNOWN protected evidence; no URL/key/token/reviewer/PII.

Collect a fresh authorized anonymous snapshot only when required (one collection used here):

```sh
NODE_USE_ENV_PROXY=1 node scripts/catalog-anonymous-snapshot.mjs /tmp/anonymous-publication-snapshot.json
```

Review/copy the sanitized observation to the snapshot artifact, then generate outputs offline:

```sh
CALCUMINT_MASTER_AUDIT_OUT=data/catalog/audit-2026-10-15 npx vitest run src/calculators/master-publication-audit-export.test.ts
```

Without the output variable, the test regenerates in memory and compares committed CSV/JSON/summary bytes. CI never contacts Supabase; it reuses the timestamped observation. Unavailable/invalid/pagination-limited manifests never become zero approvals; malformed available manifests reject. This540-row report deliberately does not bypass the separate fully-audited-domain helper's missing mapping gates.

## Prioritized blockers and safe next actions

1. **P0 protected evidence:** authorized catalog/QA/specialist authorities must supply a permitted sanitized read-only evidence export covering exact key/slug/version, lifecycle, certification/QA, reviewer decisions and HOLD history. Named authorized approvers are UNKNOWN here. Do not supply privileged credentials to this collector or infer approval from code/CI/public visibility.
2. **P0 identity HOLDs:** retain the6explicit master decisions and6candidate-linked rows; product/catalog owner must resolve exact feature/identity contracts. Publication reviewers must separately verify gates. Preserve Slope v1/v2 interpretation and external/history compatibility.
3. **P1 mapping gaps:** review245missing links and174ambiguities using actual source/catalog contracts and authorized alias/domain decisions. No engine implementation count or publication gap is inferred from title absence. Per-master priority/actions are exported; candidate source HOLD does not approve a master identity.
4. **P2 release evidence:** technical-version disposition for inherited mathematical corrections, exact approved engine SHA, certification/specialist review and deployment remain separate prerequisites even when public key/slug/version matches.

Review source provenance #1393→#1394→#1395→this audit. No source PR is modified. Passing CI/build is engineering evidence only. Release HOLD; no DB write, identity/version/formula change, certification, specialist approval, publication, merge or deployment.

## Verification

Initial audit tests reproduced8failures before implementation; an additional regression pinned retained candidate HOLDs. Final10targeted modules passed53tests, including offline540-row reproduction, publication/identity reconciliation, six-standard boundaries and Slope strict v1/v2/snapshot/scenario HOLD checks. Typecheck and affected lint passed. Actual `NODE_USE_ENV_PROXY=1 npm run build` passed with unchanged `next build --webpack`; generated tsconfig edits were restored. A synthetic privileged-role probe was refused before network/output, without production credentials. Final exact-head CI is attached to the draft PR; no repeat local full suite was needed for isolated reporting code.
