# Calculator completion sprint — bounded functional closure

Baseline: draft PR #1538 `6e5b8aa3dd07b1c57993c4cc8b6f1cf1be7ce2ef`, exact-head CI42485198064 SUCCESS. Preserved PR #1537 remains `a955cdad7019a645b7ed2950299d0603ba1784a7`. Work continues through the existing draft #1538, without a new integration PR. The final delivery SHA and hosted result belong to the external SHA-bound checkpoint; they are not inferred from local tests.

## Actual software changes

**65 existing private profiles:** two separate native interfaces parsed raw JSON before validating identity, revision and inputs. Digits could disappear before the engine or snapshot verifier saw them: `81.000000000000001` became81, fractional version `1.0000000000000001` became1, and tiny new input `1e-400` became0. Both callers now reuse the established lossless new-input boundary. Snapshot imports use a shared lexical number check before the existing replay verifier. Canonical JSON, quoted exact decimals, canonical historical subnormals, recovery and native downloads remain supported. Existing input/import size limits remain1MB/8million UTF-16 characters respectively; no new import-depth restriction was added.

First cohort29 IDs:21,32,35,36,43,46,49,80,81,82,84,85,86,88,89,90,91,96,125,126,127,133,134,468,469,470,472,488,516.

Second cohort36 IDs:139,140,141,142,143,144,148,149,151,152,153,164,165,166,167,169,171,174,175,176,178,180,182,183,185,186,187,188,189,190,192,193,196,197,202,207.

These close concrete serialized-input/replay workflow defects, not full canonical contracts. Original deterministic engines, definitions and registered versions are unchanged. Full mathematical artifact parity is tested across Free/Pro/Business; synthetic plan selection does not establish provider subscription acceptance.

**Two financial review associations, #1/#51:** retained engines reproduce a cent error at exact principal12000000000000.25 for zero-duration compound interest and zero-rate single-period loan identities. Two new private, unregistered remedies use the existing exact-grid rounding candidate and original schemas/formulas. Independent quarter-grid identities, ordinary goldens, refusal boundaries and immutable export/replay are tested. The transport explicitly binds `private-financial-exact-grid-20261108.1`; no registered successor version is allocated. Off-grid rounding inherits legacy behavior and is not newly qualified. No historical financial engine was changed or silently adopted. Original PRs #1370/#1231/#1230 remain open and preserved, with authenticated exact-head observations in financial-successor.json.

**First two review-pending identities:** #432 `conversion.time@1` and #440 `conversion.frequency@1`. Exact engines match the preserved candidate. Prepared version-specific source/QA/workflow packets with explicit evidence limits and unsigned competent decisions. No new defect justified modifying either engine. #440-specific authenticated scenario evidence was not generalized to #432.

**43 authority blockers:** classified exact active prerequisites using nine retained source captures and658 evidence pointers. Categories overlap; method/identity interpretation flags do not prove a duplicate. Narrow prior private components do not resolve full-product authority. Zero blockers were artificially removed.

## Immutable source and delivery protection

Current caller/CI successors are admitted through exact Git source commits, preserving predecessor captures and rejecting reversion, tampering and missing provenance. Source captures: first caller and private financial implementation `e80a691e86b5bb996a0cd0863fc810b432d7303d`; second caller `b6b1a72127d40712f0d3c212188d8ca84063721b`; final CI artifact step `606c44e09799a89922e4c575d24a7798d33ee33b`. Private financial dependencies include the lockfile and transport verifier. No historical packet was rebased to new bytes.

All five mandatory CI jobs and the fail-closed aggregate remain. New focused unit, provenance and real native browser regressions run in publication-factory; both native receipts are retained as an exact-head artifact. No timeout, certification gate or security assertion was relaxed.

## Evidence and disposition

See validation.json for actual command receipts, requirements-540.json for all540 inherited row dispositions plus scoped technical deltas, engineering-closure.json for exact functional claims, and preservation.json for unchanged source/SQL evidence.

| Disposition | Count |
|---|---:|
| COMPLETE_AND_CERTIFIED |0|
| IMPLEMENTED_REVIEW_PENDING |2|
| IMPLEMENTED_TEST_GAPS |0|
| PARTIALLY_IMPLEMENTED / full-contract proof incomplete |495|
| NOT_IMPLEMENTED, proven absent |0|
| IDENTITY_OR_SCOPE_BLOCKED |43|
| Total |540|

Zero proven-absent entries is not a claim every full engine exists. Newly full engineering-complete canonical products:0. Newly accepted, certified, publication-eligible or published:0.65 existing private workflows improved;2 unregistered remedies added;112 distinct identities received targeted implementation or evidence work, counting the43 blocked cases and2 review packets separately. The14,293 historical requirement dispositions remain unchanged; objective workflow deltas do not silently promote UNKNOWN requirements.

## Remaining critical path

Competent exact-version source/formula/precision/QA review remains required for #432/#440 and all applicable cohorts. Financial rounding qualification and version adoption are pending. Original full-scope and specialist/applicability requirements remain per identity.

The last authenticated read-only observation (2026-11-08 12:39:36 UTC) found the five audited hosted RPCs absent. This sprint does not manufacture a fresh target-schema attestation, external-writer completeness, operator freeze, restore rehearsal or secret custody. Held guarded adoption/reversal SQL and publication evidence remain unchanged. Genuine isolated issuance acceptance retains the known direct-insert reservation bypass as a characterized blocker; no global seat-capacity fix is claimed.

Prefer progressive independently accepted cohorts, with #440 then #432 conditional pilot targets. Neither is newly eligible. Next engineering batch: reproduce remaining private serialized-entrypoint defects and reuse the same boundary only where compatible (estimated6–10 focused engineering hours). Financial off-grid qualification8–16 hours, exact review-packet assistance2–4 hours, and existing runbook operational rehearsal4–8 hours are conditional on their stated external prerequisites. These are task estimates, not measured labor or a full-catalog deadline. No defensible four-day completion promise exists with9,395 retained UNKNOWN requirements and unassigned competent-review capacity.

Independent engineering review found no blocking defects in the bounded changes. It is not mathematical certification or specialist approval. All540 identities,424 acceptance records,14 original DRAFTs,43 authority blockers, historical engines, source evidence, RLS and publication protections remain preserved. No production writes, migration activation, merge, deployment, certification, publication or live billing. **RELEASE HOLD remains active.**
