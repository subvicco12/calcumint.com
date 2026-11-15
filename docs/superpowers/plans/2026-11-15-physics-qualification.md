# Physics queue qualification plan

**Goal:** Reconcile catalog IDs 322, 323, 324, 325 and 327 at baseline `3ccdd6d026ca0ec51063ff4501901ac92e8ace6a` without changing historical arithmetic or assuming source scope.

**Architecture:** Add qualification witnesses outside the admitted application source. Bind unchanged source bytes to the baseline, exercise numerical and historical boundaries, and use disposable genuine GoTrue/PostgREST/Postgres for current historical snapshots. Record per-ID limitations separately from test success.

**Constraints:** Isolated branch; PR1538 untouched; RELEASE HOLD ACTIVE; no production, registry adoption, historical engine modification, certification or publication.

**Review focus:** tiny positive angle conversion; premature free-fall underflow; signed quotient zero; private-versus-historical identity; authenticated ownership and exact snapshot preservation.

- [x] Reconcile existing implementation, source manifests, private revision and retained workflow limits.
- [x] Add missing numerical/identity witnesses and baseline byte bindings in `tests/physics-qualification-20261115/`.
- [x] Run existing numerical, presentation, source, replay and delivery tests; retain raw receipts.
- [x] Run disposable authenticated per-ID history/scenario checks; distinguish historical identities from private revisions.
- [x] Record dispositions and genuine blockers in `docs/physics-qualification-20261115/REPORT.md`, commit isolated work, push and independently read back remote SHA (delivery step recorded in final response).

This is an evidence investigation, not a new physical method or successor implementation. Existing approval gaps are not repaired by inventing units or adoption decisions.
