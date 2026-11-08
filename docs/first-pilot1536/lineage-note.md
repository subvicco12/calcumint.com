# Batch21 browser historical source successor

The calculator closure history wrapper now admits the exact reviewed four-file Batch21 browser harness at commit `815fa75177ff4348b64502d6745a8fc294c65fed`. This is an additional provenance bridge, not a change to the frozen six-publication packets, original guards, or historical source claims.

The historical browser at baseline `6d2960c2fac7817741b08877ebd3b611720923b7` and frozen source capture `c1c7371ac4f284ff7b6371a90fb3296c632396f9` independently resolve to blob `0249ae4743a0ddc7387b99b64f7b7104c47f30c8`, SHA256 `42ead9e3ca6ccb3491230cde760a462f1bc9292e364a5fab97b363dbdccb836d`. That digest remains the packet's historical claim.

The bridge pins these successor files independently by commit membership, regular-file Git mode, blob ID, SHA256, and exact current bytes:

| File under tests/batch21-calculator-wave | Git blob | SHA256 |
| --- | --- | --- |
| browser.mjs | 45b920157091642f5d36afe0c94ff1aa002f9591 | f3a0f846466e1ef7cb58ed04724351202e873a0d1c6926e49167364141887b60 |
| failure-diagnostics.mjs | ced72a6ba9a5fe88d45285783067d5bba6f1d295 | e74969be1d5e048464d6021214d61a39359a54cc65a029790873f0fc100f5221 |
| journey-readiness.mjs | 66fe732edce61707f75ef5a2eca9ad9da98db2c1 | 7a90c6fd87a5b294b50723d9923aa395b8e6bf05d21db4b11c88fbb48cd95fcc |
| journey-lifecycle.mjs | 471b57cbb914162c325f65cd3ecf1abbb52a1a41 | e942f81e4c42890782236c529737897eeb529e3c05e31614325c2311ab4b4d47 |

Current files are verified before constructing the historical temporary fixture. Only the browser's exact predecessor bytes are substituted alongside the already verified historical caller. The original historical guard, packet generator, full-six guard, and historical negative tests execute unchanged. The bridge rejects missing exact commits, Git membership/object substitutions, edited historical claims, current-file tampering, predecessor bytes substituted for current bytes, and file/directory/root symlinks. The wrapper explicitly clears inherited Node test context for its original negative-test subprocess, so nested test execution still runs all eight tests.

Validation: `node --test tests/first-pilot1536/browser-lineage.test.mjs` passes 20 tests, including the full wrapper and its eight original historical negative tests. Both `node scripts/check-calculator-closure-history.mjs` and its `--full-six-only` mode pass. The unchanged historical guards verify 21 sources/two packets and 24 full-six bindings/25 retained files respectively. These checks need Git and Node, without browser or Docker. Browser acceptance was not rerun for this provenance-only change; no production writes, publication eligibility, certification, or acceptance promotion are claimed.
