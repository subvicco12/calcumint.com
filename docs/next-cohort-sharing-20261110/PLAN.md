# Next-cohort sharing: bounded implementation plan

Baseline1ec63cd1 plus root/catalog/capture successors at9e69a442. Exact cohort:374@1,377@1,378@1,379@1,382@1,383@2,384@1,385@1. Priority closure377/378/379. The shared client-safe native catalog is the sole tuple source; root's validateTechnologyNextCapture governs new captures, while historical replay keeps original exact engines.

Demonstrated mismatch: existing sharing core/SQL accepts only original five slugs at version1, so383@2 and the other new identities cannot enter without changing its constraints. Use one new guarded sibling table/capability/service-only atomic RPC; retain the original proposal, table, constraints and stored rows unchanged. Reuse current session/role checks and existing UI via a closed optional cohort selector; legacy URLs default only to legacy storage, with no fallback or upgrade. Unknown cohort/tuple/version is refused.

374 has recorded fromUnit/toUnit. Current scenario recovery restores unit context only for the generic unit converter, so a storage set with omitted/forged metadata can otherwise compare different output units. Add a narrowly tested storage-v1 working-copy normalization: derive units solely from recorded valid inputs, reject forged metadata, and mark incompatible output contexts unavailable. Keep files and saved rows unchanged. Current sharing comparisons group by recorded output unit.

Tasks: (1) TDD exact next tuples/parser/capture/replay, then guarded service-only persistence using existing authority helpers. (2) Closed-cohort composition in current project/template/detail/form and unit-aware comparison/recovery, preserving legacy defaults. (3) Focused unit/type/lint and independent review, freeze code before lengthy proof. (4) Genuine priority3 team/template/comparison/export, extend to all8 if practical; no production build before reserved auth slot is released. Personal24journey helper is delegated into the auth lane's single genuine Next runtime and needs no app source changes.

No production writes, schema activation, old packet rewrites, registered technical-version allocation, method changes or canonical/source/specialist/publication approval.
