# Independent Worker 3 restoration and integration — 24 November 2026

RELEASE HOLD ACTIVE. Engineering integration is not qualification, certification or publication.

## Executed result

24/24 ordered bundles retrieved (the 40,371,213-byte first bundle was reconstructed from the two independently size/hash-verified remote parts). Its complete SHA-256 is `259270b324bc7c3e569a2be22dae83d121698ab58f462b8b54b886d75ba8b833`. All bundle and companion checksums match the supplied transfer index. All 25 advertised refs restored in index order into a fresh bare repository, checking prerequisite objects before each fetch, bundle verification, advertised ref membership, exact commit and tree. Final `git fsck --full --strict` exited zero. The separate singleton bundle also verified and restored. All 173 manifest payload hashes matched after resolving the 24 separately transferred bundle paths; 149 payload files came from the evidence archive. No downloaded restoration script was executed.

See `receipts/restoration.json`, `checksums.json`, `remote-artifact-metadata.json`, `payload-verification.json` and `final-fsck.txt`. The original raw transfer index and manifest are preserved alongside this handoff. The large whole-object Drive metadata independently returned file ID `1mFsNfDnuhTmyR4kNfHEmCDt3Z-tF5S80`, size `40371213`, parent `1PzftQ5d-ZlUa0PL0oAf1UbvzUEUO7kYz`; byte verification used its documented parts, not a whole-object download.

## Exact isolated candidates

| Candidate | Remote branch | Commit | Tree |
|---|---|---|---|
| Minimal #440 | engineering/worker3-singleton440-integration-20261124 | 1637b2a2bf582ebc6e4f4452ff9f3a3fe082b35e | 209982b9a81d7bf9f4783228505b5a274563391f |
| Portfolio plus #440 | engineering/worker3-portfolio-integration-20261124 | 964b3974474edc71583f571d5c76ca98b17f0c78 | 9b5ba1df82db02c34acc55faaff3d7b78891099c |

Both branches were pushed and independently read back with `git ls-remote`. Base is the unchanged draft PR #1538 head `49ea243b5be7e1ee9f3cd8af7f936ab784402cf7`.

The #440 source bundle restores `f883fdde52224bd24f631581f437928212a7901f`, exact tree `05e6c006e7f6f7dfd584cc7a111decdf6d56dcf0`. That commit includes unrelated technology changes. The minimal candidate selects only its exact two frequency caller/test successor blobs: `src/components/publication20-tool.tsx` and `.test.tsx`. Refused precision is associated with the value input, entered text survives, refused output remains uncapturable and supported changes recover. Engine `conversion.frequency@1` remains blob `d8f5cb0153a0ae773c0fbd0dd9c999ae8cfb96a3`, SHA-256 `8605a98cbc051450fbd71089d77f174f961ea56d5ee6b743e38c8a473b87c165`. Ten engine/evidence bindings from the supplied singleton manifest independently match restored Git objects and bytes. #432 remains a separate fallback, without automatic substitution.

Portfolio integration preserves the supplied linear family history through `c491fe9f54531d6b77ba75ead364b1b5305a959e`; merge `61a6667790b6fc79bb01a6ddf55475b1964d5652`. Separate battery/water/lighting source `7502dd441b14403c8c50c95732f7e0f93abae33e` supplies #489 (merge `12a50a00`, full identity in Git); horsepower source `c26742fb18539cd762fd7f8b17a338283e85e321` supplies #475–476 (merge `964b3974…`). No textual integration conflicts occurred. The demonstrated reconciliation defect was treating the final linear branch as if it contained all 185 ledger entries; three were on those separate advertised branches. Those source dependencies are now joined.

Actual requested integration count: **185 bounded private-contract identities plus #440 = 186 of the reported 205**. All 185 ledger IDs independently resolve and execute their compiled default contract, with exact engine/version/slug/source-revision and source-file Git/SHA bindings in `receipts/per-id-integration.json`. Every row is INTEGRATED_NOT_QUALIFIED. The restored source also contains 37 additional private draft profiles outside that ledger; they are NOT included in the 185, not canonical approvals, and not qualified. They remain restricted to existing authenticated private review surfaces. Their existence does not establish adoption of owner scope proposals.

## Earlier-19 transfer gap

The source metadata for seven technology IDs #368, #369, #375, #376, #380, #381, #387 and twelve conversion IDs #424, #425, #427–431, #433–434, #437–439 names additional commits `29c53c9548af223d409df537b5e70fbd7eaf4926` (tree `9c85bf8474af25202366514c7d3906152a52ed13`) and `8f9c4ab7106c12759babdcdd7aa32712a3fd65f2` (tree `2b159df6aca803c9fded849d736ed134166fd64b`). Neither object exists in the restored chain; authenticated GitHub commit lookup returned HTTP 422, “No commit found for SHA,” for both. All advertised refs were restored, but those two commits were not advertised by the 24 bundles. This is a remaining payload gap, not an access failure for the supplied 24 bundles. Minimum correction: provide two incremental bundles, first based on the restored f883fdde source and second based on 29c53c95, with exact advertised refs and hashes, through the existing recovery folder. No new credentials or infrastructure needed. These 19 remain outside the integrated count and their earlier feature qualification is not full contract completion.

## Verification receipts and limits

- Minimal singleton: 17 tests passed, 4.23 seconds. Same 17 cases subsequently passed on the integrated portfolio in the affected regression campaign.
- Restored linear families: 228 tests across 22 files passed, 25.41 seconds.
- Retained horsepower/lighting families: nine tests passed, 1.77 seconds; retained UI: one test passed, 1.37 seconds.
- Affected shared converter/factory regressions: 53 tests passed, 7.09 seconds; changed workbench/core/export contracts: 13 tests passed, 2.80 seconds. These counts are separate campaigns and are not an aggregate unique-test claim.
- Final portfolio TypeScript exited zero; changed-file lint exited zero; diff whitespace check passed. No new production build or new full authenticated browser campaign is claimed. Supplied exact-source historical authenticated/mobile/export/replay evidence remains preserved in `transferred-evidence`; applicability to changed shared dependencies still requires integrated acceptance.
- An overbroad local shared regression attempt encountered child-process `spawnSync git EPERM` / `pdftotext EPERM` in the sandbox and was stopped. It is not passing evidence. Focused affected suites were executed with supported child-process access. No security check or timeout was weakened.
- Prior base run 44067453673: checks/build/publication-factory success, full-product failure at “Owner-authorized isolated P0 implementation,” source-acceptance cancelled, aggregate validate failure. Authenticated job metadata was readable; direct raw job-log retrieval returned `Forbidden`, and formatted failed-log retrieval returned an empty body. No candidate-specific source defect is inferred from that unavailable log. Existing focused performance evidence remains in `docs/worker3-performance-20261116/HANDOFF.md`; historical green runs do not qualify these new heads.

## Protected-source and CI handoff

No workflow, source-admission policy, SQL, immutable engine or canonical ledger was modified. `receipts/integration-source-transitions.json` enumerates 49 exact application/test predecessor-successor bindings; `changed-files.txt` is the complete integration file manifest. Review each dependency under existing controls. The known protected singleton caller is `publication20-tool.tsx`, consumed by `scripts/publication20-caller-lineage.mjs` and its completion source chain. Wider changed dependencies include `calculator-factory-workbench.tsx`, completion `next-engineering-core.ts`, `exports.ts`, and `scoped-engineering-metadata.ts`; the core is included in the stage-9 source policy. New private adapters/callers and tests require scope determination too. This manifest is a review proposal, not admission.

The frozen A7 executor approval targets `fb91016…`, not these heads. Do not retarget it or treat its approval as admission of the frequency caller or broader portfolio. Exact delta source review/admission, including any required append-only successor proof, is pending with the source authority/coordinator. No protected-source repair or activation is authorized by this receipt.

Authenticated Actions API returned zero runs for both new exact heads. All six mandatory jobs (`checks`, `build`, `publication-factory`, `source-acceptance`, `full-product`, `validate`) are therefore **NOT RUN / NOT QUALIFIED** for these candidates. No manual workflow was dispatched. Ready diagnostic operation, subject to explicit owner authorization:

```sh
gh workflow run ci.yml --repo subvicco12/calcumint.com --ref engineering/worker3-singleton440-integration-20261124
gh workflow run ci.yml --repo subvicco12/calcumint.com --ref engineering/worker3-portfolio-integration-20261124
```

Operator must verify each ref still equals its exact SHA above before dispatch, bind the resulting run/attempt to that SHA, and require all six conclusions. A diagnostic dispatch does not grant source admission. Do not change deadlines, negative controls or historical bindings to force green CI.

## Owner and first-release decisions

The complete original 38-decision document is preserved at `transferred-evidence/calcumint-batch41/OWNER-DECISIONS.md`, with its verified manifest hash. `receipts/owner-decision-classification.json` indexes all 38 scopes. Pending adoption of distinct scopes blocks divergent canonical identities/behavior, not restoration or isolated integration of unchanged bounded private source. Proposed changes must preserve v1 engines and exact replay and follow separately governed additive identity/version decisions. In particular #57/#59, #397, #494/#537 and all same-contract holds remain unresolved; no declaration here adopts them.

First singleton recommendation: **NO-GO for publication; #440 isolated engineering candidate ready for exact-source review.** Competent independent source/formula/precision and applicable QA approval, canonical scope adoption, exact-head CI and required replay/Business admission remain open. Existing receipts are evidence, not reviewer attestations.

Deployment/DB/writer and recovery custodians must provide current deployed revision/schema/ACL/RLS compatibility; writer inventory and freeze controls; credential custody references without secret values; recoverable backup and independent tested restore; rollback/abort ownership; and separately authorized held-RPC/schema readiness. Supplied dated production observations are preserved but were not independently refreshed in this task. No Hostinger setting was changed; current Auto-deployment OFF has not been freshly authenticated here. The operator must verify it remains OFF before any later authorized production-affecting action.

Minimum later release sequence: competent exact-tuple review and canonical adoption; admitted source and six-job exact-head acceptance; current operational/schema/restore preflight; separate certification/adoption authority; separate exact singleton publication and withdrawal authorization; audited release then authenticated/anonymous route, version, deterministic/refusal, mobile, discovery and existing-public regression readback. None of those production operations was executed. #432 cannot bypass shared gates.

No PR #1538 modification, merge into the draft/main, workflow dispatch, protected admission, production SQL, deployment, certification, publication or held-RPC activation occurred. Canonical confirmed counts remain unchanged.
