# Identity contract evidence — 2026-10-20

The offline Node-only `master-identity-contract-evidence.ts` collector and committed `data/catalog/crosswalk-2026-10-20/contract-evidence.json` add executable implementation-contract evidence to six existing review cases (seven master IDs, nine implementations). They establish **zero new master aliases** and **zero approvals**. They do not change the crosswalk, registry, engines, mapping decision records, golden bindings or approvals. RELEASE HOLD remains.

Each contract records the exact current registry key/slug/version, structural input JSON Schema, existing-example execution observations, rejection probes, formula/source metadata, reviewed unit/scope notes, definition-file SHA-256, and any existing partial-review ledger record. Source hashes attest the listed repository files only; they do not attest the full transitive build closure or a deployed artifact. The collector rejects source-file bytes from another checkout and rejects stale key/version bindings. It has no application runtime consumers.

Existing examples are engine-contract observations, **not independent golden verification or mathematical equivalence proof**. JSON Schema omits some executable refinements; probes and linked source additionally show those constraints. Unit/scope notes explain source semantics and do not supply a missing master contract. The canonical master CSV supplies title and domain, not authoritative master input/output/features or an alias binding.

| Case | Contract evidence collected | Remaining identity blocker |
| --- | --- | --- |
| 55 fixed/term deposit | Principal, annual percentage rate, term months and supported compounding frequencies; maturity, interest and effective yield output | Normalized label hint only; no explicit master alias binding or product/jurisdiction contract |
| 254 root finder | Polynomial up to degree three; bisection with endpoint/sign-changing bracket; constant polynomial rejected by schema and non-bracketing interval rejected during execution | Generic title does not prove the intended master solver features |
| 435 fuel economy | km and liters inputs produce km/L; a conversion-shaped input is rejected | Calculation scope does not establish the Conversion master scope or an alias |
| 222+308 power | Both compute work/time; physics accepts a tiny positive time that the generic launch implementation rejects | Coupled Math/Physics identities remain unresolved; matching equation is insufficient; existing HOLD records retained |
| 377 aspect ratio | Both compute width/height; zero width is accepted by launch and rejected by technology implementation | Different domains/bounds; master candidate selection requires authoritative feature scope |
| 510 travel time | Fixed km and km/h inputs versus generic compatible-unit inputs; each rejects the other's input shape | Unit scope and lifecycle differ; existing HOLD records retained |

All three label hints remain outside candidate edges. Existing candidates remain unapproved. The 540-master crosswalk still has 291 single-candidate rows, 245 missing-linkage rows and four multiple-candidate rows, with 249 selection IDs in 248 triage cases. Six identity HOLDs, the 12-row review queue and protected Slope v1 history are unchanged. No engine absence has been inferred.

## Reproduce

From the repository root, run:

```sh
node -e 'const j=require("jiti").createJiti(process.cwd()+"/evidence-runner.cjs"); const m=j("./src/calculators/master-identity-contract-evidence.ts"); require("fs").writeFileSync("data/catalog/crosswalk-2026-10-20/contract-evidence.json",JSON.stringify(m.buildMasterIdentityContractEvidence(process.cwd()),null,2)+"\n")'
npx vitest run src/calculators/master-identity-contract-evidence.test.ts src/calculators/master-identity-crosswalk.test.ts src/calculators/master-identity-crosswalk-export.test.ts src/calculators/master-identity-proposals.test.ts src/calculators/master-identity-triage.test.ts
npx eslint src/calculators/master-identity-contract-evidence.ts src/calculators/master-identity-contract-evidence.test.ts
npm run typecheck
```

Validation: 24 tests across five files passed; scoped ESLint and TypeScript checks passed. The five new contract tests verify complete bounded coverage, label/candidate separation, preserved HOLD provenance, actual executable contract differences, deterministic artifact reproduction, and fail-closed stale candidate/hint/source bindings. Full suite, build and CI remain the parent workflow's responsibility.
