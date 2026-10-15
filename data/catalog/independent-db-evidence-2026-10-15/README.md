# Independent DB evidence integration — 15 October 2026 IST

Baseline: draft #1396 `ea2e70c975fe861c399dde10f636c361362a10fc`. Isolated branch: `audit/sanitized-db-evidence-import`. Release HOLD.

## What was supplied and what remains blocked

The user supplied independently verified DB aggregates: **209 published standard-risk v1 identities; 3,135 QA checks across 209 identities, with 11 passed and 4 waived per identity; 210 source records covering 209 identities**. Thus passed checks total 2,299 and waived checks total 836. These are recorded as `user-verified-aggregate`, received 15 October 2026. Observation time and original payload hash are UNKNOWN, not borrowed from the earlier anonymous snapshot.

No row-level export path/artifact was supplied or found in the scoped project evidence. The user was asked for its location while independent engineering continued. No privileged access was requested and no production DB query was repeated. The prior anonymous209-entry manifest is reused; its count agrees with the new aggregate, but matching counts do not prove equal identity sets, observation times, source coverage or per-key QA decisions.

**Engineering is ready; authoritative row-level integration is blocked by missing records.** The actual imported `rows` array is empty. No QA/source/review record is manufactured from totals. In particular, none of the836 waivers is represented as a passed check, and the identity with an additional source record is not guessed. Synthetic209-identity data exists only in unit tests, never in actual report artifacts.

## Reuse and 540-row results

The existing #1396 JSON report is the input; its master matching/reconciliation is not rebuilt. An additive overlay appends independently sourced observations, exact key/slug/version comparisons and recorded mapping decisions. The existing CSV exporter gains optional evidence columns; calling it without them is byte-identical and the prior frozen 540-row test still passes. Parent artifacts and calculator definitions remain unchanged.

All 540 master rows are exported at this commit. Baseline classifications remain 0 fully verified, 245 missing linkage evidence, 174 ambiguous, 0 observed version conflicts, 121 approval pending. Missing linkage is not a proven absent engine. The earlier public manifest has 209 exact registry key/slug/version matches and 136 master rows with a unique published candidate; those are not approved master mappings. **New identity-keyed QA/source joins: 0.** Per-master certification/specialist/mapping evidence remains UNKNOWN where it was unavailable; the aggregate facts are retained separately, not discarded or projected onto candidates.

## Sanitized import contract

`sanitized-import.schema.json` is generated from the strict Zod contract in `src/calculators/sanitized-db-evidence.ts`. Always run `parseSanitizedDbEvidence`: the schema alone does not enforce cross-record totals, uniqueness or payload digests.

- Envelope: schemaVersion 1; provenance evidenceId, sourceKind, receivedOn, observedAt (UTC or null), payloadSha256 (null for aggregate-only); scope and aggregate totals; identity rows.
- Scopes: aggregate-only has no rows/hash and explicitly user-verified provenance. Partial-rows does not claim complete population coverage. Complete-published-population must reproduce the published count, risk/version cohort, all per-identity 11 passed / 4 waived counts and exact QA/source totals.
- Identity: calculatorKey, slug, positive version, observed lifecycle/risk and explicit rule-pack applicability (`UNKNOWN` allowed). Multiple current versions under one key/slug are rejected; historical saved-data payloads are not current catalog records.
- QA: recognized existing checkType and status, authorityRole-at-decision, hashed decision and rationale references. Sources: hashed structured source-record reference, sourceKind and hashed review reference. Reviews: kind, recorded decision, role, hashed decision reference and approved engine commit (or null when unknown).
- Master mapping: optional explicit masterId plus recorded decision/role/reference. It is separate from title candidates. Recorded approval claims do not change canonical mappings or clear existing HOLDs; they remain review evidence.
- QA/source/review sections use null for unavailable evidence; non-null arrays declare complete sections for that identity. Empty arrays must not be substituted for unavailable data. A complete-population claim cannot omit QA/source sections. Zero observed records and UNKNOWN are distinct.
- No names, email addresses, user/reviewer UUIDs, notes, details, credentials, URLs, tokens, sessions, private calculator inputs or personal history are accepted fields. References are SHA-256 hex identifiers of records, not hashes of people. Role strings carry no credentials or access capability. Exporters must sanitize before import; structural validation is not a general-purpose detector of personal text hidden in mislabeled machine IDs.

Rows require a canonical SHA-256 digest over `{aggregates,rows}`. Keys are sorted lexicographically, array order is preserved, primitives use JSON encoding, and UTF-8 bytes are hashed. `evidencePayloadDigest` is the normative helper. The hash detects payload drift; **it is not a signature, proof of DB authenticity, approval or authority verification**. Retain the independently obtained original/export provenance out of band. Unknown fields, duplicate identities/check types/source references/review kinds/master claims, contradictory aggregates and false complete-coverage claims reject rather than becoming empty evidence.

## Waiver / source / certification audit

The overlay reuses `requiredQaChecks` from the existing admin publishing module, including YMYL and applicable rule-pack requirements. Unknown rule-pack applicability remains a blocker. Failed, pending and unobserved required checks are surfaced. Standard-risk does not itself establish applicability.

Migration 022 restricts human waiver decisions to owner/admin; reviewer/editor claims are flagged, missing authority stays UNKNOWN, and missing decision/rationale references are flagged. Recorded publication/certification role contradictions are checked with the existing roleCanTransition helper; approved certifications without an exact engine commit are flagged. The existing service-role trigger bypass is not proof of a human waiver approval. Authorized reviewers must establish historical authority-at-decision; current role membership or published lifecycle alone is insufficient. Even a recorded owner/admin waiver with references remains **REQUIRES_REVIEW**, not newly approved by this audit. No guess is made that the four waived checks are optional analytics.

Migration 023 treats structured source evidence as authoritative; cached source_count is not substituted. Counts do not identify source kinds, review provenance or applicability. Source reference hashes require authorized out-of-band review to establish actual mathematical/source authority. A specialist decision or generic reviewer role does not independently establish specialist scope. QA/source completeness, certification decisions, approved engine SHA, published lifecycle and master identity approval remain separate. Matching v1 labels cannot prove approval of the inherited mathematical corrections at the current code SHA.

## Six HOLDs / historical compatibility

The six explicit master HOLDs (#235,#251,#275,#276,#282,#283) and six candidate-linked HOLD rows are preserved. Their public absence and code-certified flags from #1396 are not changed by this aggregate. Slope remains draft-registry `geometry.slope` v2 with legacy v1 source and strict historical decoding preserved. A aggregate for published v1 identities cannot certify coordinate v2. No scenario eligibility, saved-history replay, version rewrite or registry migration is introduced. Relevant Slope compatibility tests are reused; no personal production history is fetched.

## Artifacts and reproduction

- `supplied-aggregates.json`: only actual independently supplied aggregate facts; no row records.
- `sanitized-import.schema.json`: strict machine-readable contract.
- `reconciled-master.csv` / `reconciled-master.json`: all540rows, baseline facts plus explicit independent evidence/provenance.
- `summary.json`: baseline counts separately from supplied aggregates and import coverage.
- `decision-ledger.json`: prioritized master decisions and global evidence blockers.

Reproduce current artifacts offline:

```sh
CALCUMINT_SANITIZED_EVIDENCE_OUT=data/catalog/independent-db-evidence-2026-10-15 npx vitest run src/calculators/sanitized-db-evidence-export.test.ts
```

For an authorized contract-conforming sanitized row export, point CALCUMINT_SANITIZED_DB_EXPORT to a local JSON path and choose a local output directory. With neither output nor alternate-input variables, tests compare committed artifact bytes. No Supabase configuration or credentials are read by this importer; CI remains fully offline for these evidence tests.

## Priority decisions / next actions

1. P0: supply the missing sanitized identity-keyed export, including observation time and digest. Do not send privileged credentials or personal reviewer data.
2. P0: audit all836 waivers by check type, historical owner/admin decision and rationale references. Establish review provenance for 210 structured sources; do not promote counts to per-key evidence.
3. P0: retain six explicit and six candidate-linked HOLDs, preserve Slope v1/v2, and separately review certification, specialist scope and approved engine SHA/version.
4. P1: resolve 245 missing identity links and 174 ambiguities through authorized catalog decisions, not title guesses. Imported explicit mapping claims remain distinct from approved canonical mappings.

Review order remains #1393→#1394→#1395→#1396→this evidence delta. No calculator identities, versions, formulas, RLS, security, certification/waiver rules, publication gates or workflows are modified. No DB writes, approvals, certification/publication promotions, merges or deployments. Release HOLD.

## Verification

16 new deterministic tests; 50 tests across 9 relevant modules passed, including the unchanged parent 540-row reproduction, publishing/YMYL boundaries and Slope compatibility/HOLD checks. Typecheck and affected lint passed. Actual `NODE_USE_ENV_PROXY=1 npm run build` passed with unchanged `next build --webpack`; generated tsconfig edits were restored. The complete 209-identity synthetic population is tested for all 3,135 QA and 210 source counts. Exact-head CI is attached to the draft PR; no repeated local full suite or live DB query was needed.
