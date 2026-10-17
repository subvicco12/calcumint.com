# Sanitized production evidence acceptance ledger — 15 October 2026

RELEASE HOLD. This evidence import grants no certification, publication, identity mapping or specialist approval.

## Provenance and integrity

User-supplied `Supabase Snippet Observed Source Count.csv`: 463,727 bytes, SHA-256 `f32d87049761afe18aa929f9490480bf5f349867738bac03833c74fbb7e3e43e`.
Raw input remains outside Git. CSV parsed with quoted-field handling; every observed QA/pass/waiver/source count was independently compared with its nested arrays before transformation. No discrepancies. Only strict-schema sanitized fields are retained. No credentials, names, UUIDs, notes or raw URLs are included.

Canonical `{aggregates, rows}` digest: `c4ad1110d6db0ce1c31ef0279283fd123fec9b8dea1fb60618f1d36d2ca1f0f5`. Received date is known; SQL export observation time is unavailable (`null`), not replaced with receipt time. Hashes establish integrity, not authenticity or approval. `input-provenance.json` records input integrity and waiver types. `supplied-aggregates.json` retains the earlier aggregate-only evidence separately.

## Verified coverage

209 unique key/slug published standard-risk v1 identities; all209 match current registry key/slug/version, zero conflicts. 3,135 QA records: 2,299 passed and836 waived, exactly11/4 per identity. 210 structured source records cover209 identities. All836 waivers have UNKNOWN authority and absent decision/rationale references; all210 source reviews are absent. Rule-pack applicability, certification/publication/specialist decisions and master mappings are UNKNOWN for every imported identity. QA status does not establish these decisions.

All540 master rows are exported. Existing classifications remain0 verified canonical mappings,245 missing linkage evidence,174 ambiguous,121 approval pending,0 observed version conflicts. Missing linkage does not mean missing implementation. 140 master rows have at least one imported identity candidate; the prior136 count describes uniquely linked public candidates, a narrower criterion. Neither count authorizes mappings.

## Approval checklist and safe next batches

1. P0: owner/admin-authorized reviewers must supply historical waiver authority and decision/rationale evidence for836 waivers; structured-source reviewers must provide210 source-review references. Missing role evidence is UNKNOWN, not a proven role conflict.
2. P0: authorized certification/publication and applicable YMYL specialists must separately establish exact engine SHA/version, specialist scope and lifecycle decisions. DB published state is observed, not authorization to publish this branch.
3. P0: retain six explicit master HOLDs235,251,275,276,282,283 and six candidate-linked HOLD rows. Slope draft coordinatev2 and retained historicalv1 remain isolated; no identity/version migration is authorized.
4. P1: catalog authority must resolve245 missing links and174 ambiguities with explicit mapping evidence. No title guesses.
5. P1:24 nonstandard golden gaps remain outside this import; batch by risk/domain with independent source-backed vectors and required specialist review. Passing tests alone cannot certify.
6. Review cumulative provenance #1393→#1394→#1395→#1396→#1397; then protected approval review, mandatory CI and authorized release decisions. No merge/deployment/publication is authorized here.

## Reproduction

`npx vitest run src/calculators/sanitized-db-evidence.test.ts src/calculators/sanitized-db-evidence-export.test.ts`

Regenerate with `CALCUMINT_SANITIZED_EVIDENCE_OUT=data/catalog/independent-db-evidence-2026-10-15 npx vitest run src/calculators/sanitized-db-evidence-export.test.ts`. Default input is `sanitized-row-export.json`; optional `CALCUMINT_SANITIZED_DB_EXPORT` accepts another strict JSON envelope. Without output override, committed bytes are checked. No network or credentials required.

No formulas, identities, technical versions, CI/RLS/security, publication or specialist gates changed. Build remains `next build --webpack`.
