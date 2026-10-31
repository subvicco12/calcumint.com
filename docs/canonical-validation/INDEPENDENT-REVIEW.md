# Independent canonical-contract validator review

No outstanding Critical or Important finding in the corrected reviewed implementation. This is private declared-witness engineering evidence, not canonical acceptance, certification, publication or release authorization.

## Demonstrated defects and corrections

The initial reusable validator accepted authentic engine evidence relabeled with an unrelated catalog ID/key or a nonexistent revision. Two independent rejection regressions were executed RED: changing the first fixed adapter's version by100, or relabeling its ID/key as540/private.forged.540, still returned engineeringPassed true.

Adapters now project identity from actual artifacts and the validator compares key, catalog ID and immutable version with the declaration. Both original regressions were rerun GREEN. Component identity comes from artifact profileId/masterId/version; calculus identity comes from contractId/relatedCatalogId/version, rather than repeating declared metadata.

The initial technical source hash omitted several imported JSON dependencies. The revised script captures literal JSON imports across its bound calculator TypeScript set and includes the calculus source-binding and inherited register/evidence documents. Only its self-referential validation-binding JSON is explicitly excluded. This is exact local technical provenance, not authenticated publisher bytes or applicability approval. Current source check passes.

## Independent attacks and scope

Eight independent tests cover wrong actual identity/version; every actual selected adapter retaining canonicalAccepted false; exact golden array shape and primitive type rejection; packet ID/version/governance tampering; same-contract scenario comparison; rejecting impossible output schemas, permissive input schemas, accepted supposed-negative inputs and wrong goldens; malformed replay and getter rejection without getter execution; source-hash substitution rejection and deep-frozen vectors.

The current collector preserves540 identities and all43 authority blocks, evaluates only28 selected private contracts, and labels requirement satisfaction explicitly limited to recorded witnesses. It marks source provenance and account/workflow scope partial and canonical acceptance blocked. Reused unselected per-ID evidence is not represented as freshly evaluated. The UI distinguishes fixed witness reports from user-input results, restores packet input with its original result, and labels plan selection and history as private/synthetic rather than account/provider acceptance. Exact object-subset golden assertions intentionally do not constitute exhaustive output/full-product acceptance.

## Verification and limitations

65 tests passed across the author and independent validation files, including all eight owned tests. Owned-file ESLint and `canonical-validation-source.py --check` passed. Both initial identity regressions are resolved only after actual GREEN execution. No production implementation was edited by the reviewer.

Browser journeys, full-suite/build/exact-head CI, physical-device accessibility, live providers and protected lifecycle decisions remain separate evidence campaigns and were not independently repeated here. Historical engine correctness outside selected witnesses was not reaccepted. All acceptance/publication/certification flags remain false and RELEASE HOLD remains active.

## Final CI/governance checkpoint

The two additional governance tests independently pass: exact540 identity order and43 blocked IDs are preserved, all canonical flags remain false, and source/history acceptance remains PARTIAL with complete canonical acceptance BLOCKED.

New source/evidence/browser steps run mandatorily after production build in the existing build job. Required validate still runs with always(), requires both checks and build success, and retains original timeouts. No continue-on-error or conditional skip was introduced. The initial independent execution of53 CI guards demonstrated one integration failure: the historical preservation test rejected the added steps. The corrected guard retains full-array equality against exact original checkout/setup/install/build bytes plus two explicit exact mandatory step literals. It permits no extra or missing steps. An actual independent rerun now passes all53 CI guards and all67 focused validator/governance tests. This blocker is resolved; original step assertions,20-minute job budgets and both-job success requirements remain intact.

The parent's full-unit and browser results are reported separately, not independently rerun here. The initial browser blank-page timeout remains a disclosed unresolved runtime observation despite a passing diagnostic rerun; it must not be erased or described as a diagnosed fix.
