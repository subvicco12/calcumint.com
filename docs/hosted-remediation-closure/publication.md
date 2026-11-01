# Publication closure acceptance

Status: **blocked for real publication**. This successor acceptance exercises the existing exact-hash date correction and the captured hosted lifecycle trigger in a disposable synthetic PostgreSQL 17.6 database. It does not certify any calculator, approve an evidence record, or publish catalog content.

Run from the repository root:

```sh
PUBLICATION_CLOSURE_ARTIFACTS=/absolute/path/outside/repository node tests/hosted-remediation-closure/publication/acceptance.mjs
```

The runtime image is pinned to `postgres:17.6-alpine@sha256:ef257d85f76e48da1c64832459b59fcaba1a4dac97bf5d7450c77753542eee94`, uses `--pull=never`, a unique container name, no network and ephemeral database storage. It uses explicit synthetic auth helpers and minimal dependency tables; it does not represent hosted RLS, GoTrue, provider auth or the entire hosted database. No build or production query is required.

The guarded correction remains unchanged under `tests/hosted-schema-remediation/publication/`. Only the disposable test string removes its abort guard. Acceptance verifies exact predecessor and successor hashes, rejects hostile and cosmetic predecessor drift without overwriting either, rejects reapplication, and injects a wrong postcondition hash to prove transaction rollback restores the predecessor.

`captured-lifecycle.sql` contains the exact function definition and trigger statement selected from the private descriptor. `source-binding.json` records descriptor, function and fixture hashes. The acceptance checks the fixture hashes and links its descriptor binding to the existing publication manifest. This is a scoped sanitized fixture, not a new migration or an instruction to install the trigger.

Actual captured lifecycle behavior is exercised: direct draft publication and incomplete review certification fail atomically; reviewer publication and scheduling fail; a synthetic owner with synthetic complete evidence can transition through review/certified/published, with timestamps populated. These transitions are test data only.

**Remaining defect:** the captured `BEFORE UPDATE` trigger calls `validate_calculator_publish_gate(new.id)`, which selects the persisted row. A published row's first invalid metadata update therefore passes against its old valid metadata. A subsequent sensitive update fails against the now invalid persisted metadata and rolls that subsequent update back. Acceptance deliberately asserts this observed defect rather than treating it as protection. The date correction does not close this lifecycle defect. The successor `review-only-deferred-gate.sql` adds a separate constraint trigger that validates persisted final row state after UPDATE. It preserves the original BEFORE trigger and function, requires exact captured lifecycle and corrected predicate hashes, checks the captured trigger definition and enabled state, requires both new objects absent, and retains an unconditional review-only abort guard. Its default immediate check and explicitly deferred COMMIT check both reject invalid rows and roll back the accompanying synthetic audit insertion. A valid scheduling update and its audit record persist. Installation and reapplication are exercised only after removing the guard from the disposable test string. Dependency mutation trigger integration, hosted auth/RLS and real catalog evidence remain outside this fixture and block approval.

Verified with Node 24.19.0 and pinned PostgreSQL 17.6 on 2026-11-01. The private receipt at `/workspace/work/hosted-remediation-closure-private/publication/receipt.json` records the eight successor checks, runtime image, source bindings and explicit blocked status. No hosted writes occurred.

The additive constraint trigger covers **UPDATE only**. It does not protect INSERT or establish that direct INSERT into a certified/published lifecycle is safe. INSERT lifecycle authorization and source/evidence/QA dependency mutation guards require separate integration verification; no coverage or remediation for those paths is claimed here. Artifact paths are canonicalized and rejected inside the source checkout, including symlink destinations, before Docker starts.
