# Business extension review

Reviewed commit `cb652516` against `3674ec4b`, limited to `docs/next-engineering-20261115/business/**`, `scripts/next-engineering-20261115/business-*.mjs`, and `tests/next-engineering-20261115/business-generator.test.mjs`. Read `docs/next-engineering-20261115/DESIGN.md`. Current integrated HEAD has no differences from the reviewed commit in these paths. Read-only review; no repository changes, production calls, SQL execution, or suite rerun.

## Findings

- Critical: none found.
- Important: none found.
- Minor: none found.

## Evidence and scope

- Hold and atomicity: both held SQL files raise before mutations (successor/reverse lines 2–3), require reviewed postgres/READ COMMITTED, lock the four affected tables, check exact function/constraint/table metadata before changes, and check the expected postimage before COMMIT. Generator implementation: `business-sql-generate.mjs:17–24,35–55`.
- Exact scope: `business-identities.mjs:2–15` specifies IDs 284–291,300,329,333–342 with exact engine/slug/version identities; `business-sql-generate.mjs:25–33` enforces 69 retained plus 20 new distinct IDs. No active migration or publication authority substitution is present.
- Authentication and authorization: independently removed only the generated identity/shape additions from each postimage function and compared against the preimage. All four function bodies matched byte-for-byte. Four function owners/ACLs and four table owner/ACL/RLS flag records remain unchanged. The sharing authorization code remains intact (`held-successor.sql:48–70`), including trusted service caller, current Business actor and organization owner, active project, membership and client-project scope.
- Output schema: `business-sql-generate.mjs:58–67` adds exact key counts/presence, numeric JSON type and bounded finite binary64 magnitude for each numeric field, and a string-only steps array for each new slug. Existing structured branches survive. These are transport checks, not recomputation; README line 7 and receipt limitations state that historical agreement belongs to application contracts.
- Preimage authenticity: `business-sql-fixture.mjs:3–7` obtains a local predecessor by applying the prior held milestone100 SQL through the existing disposable fixture. Its upstream fixture refuses external database connection environment variables, uses pinned local images, an internal Docker network and no published ports. This is authentic fixture state, not a production capture. README line 9 explicitly preserves production equivalence UNKNOWN.
- Reverse safety: `business-sql-generate.mjs:50–55` checks the exact successor postimage, refuses if any added catalog ID/slug exists in grant, usage, job or shared-snapshot storage, restores exact prior constraints/functions, and verifies the prior metadata. No deletion of evidence or audit rows is generated. Acceptance includes reverse rollback/roundtrip before evidence and refusal after 28 durable snapshots (`business-sql-acceptance.mjs:33,72–73`).
- Claims remain bounded: checked-in receipt describes the isolated fixture's six groups, 28 recoveries and 232 malformed refusals. It does not claim optional integrated recovery. Actual workflow/template recovery is separately gated by `BUSINESS_INTEGRATED=1` (`business-sql-acceptance.mjs:58–66`) and is being run by the coordinator. Neither mode establishes certification, canonical admission, production equivalence or release permission.

## Independent checks run

A small Node read-only check reproduced both held SQL files exactly from committed pre/postimages and tuples, checked both receipt SQL hashes, verified all four function bodies are unchanged outside their exact additions, checked unchanged four table owner/ACL/RLS records, and matched all 12 engine/producer source hashes in the receipt. Result: PASS. The complete generator and genuine authenticated fixture suites were not rerun, per review assignment.

RELEASE HOLD remains active. This review finds no blocking issue in the scoped held fixture extension; it does not promote qualification or authorize application of the SQL.
