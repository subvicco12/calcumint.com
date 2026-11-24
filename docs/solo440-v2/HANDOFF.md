# Worker3 #440 owner-v2 implementation and targeted portfolio handoff

**RELEASE HOLD ACTIVE. Implementation checkpoint preserved; live source admission, activation and release remain NO-GO.** Cross-host PostgreSQL qualification and #426 authenticated acceptance are blocked, not reported as passing. No frozen ref, ruleset, production setting, PR1538 or existing CI consumer was changed.

## 1. Independent amendment and adoption verification

Retrieved Drive18m7yYxuKse8z82_CZnmd04N3AK0Al-Mj: exactly6,188 bytes; SHA-256 `62c30cc17ad5b9a87e57bb2e91a5ee2b25bbcfd3d9fe3c3e7f1775a99cd8475a`. Retrieved offline package1IvfD3OrMIllFfxjjwbMr07ptdEYI5pel: exactly7,772bytes; SHA-256 `6fa070b6e9bf6dafa3c6be0569cd0a633a37b43ad2803be38a3d7873dce41237`.

Connected profile115201266201052505736, Subrata Singha Roy/subvicco12@gmail.com, independently read back the exact comment `doco.yCW4dzFjM3eDgvrRWjBNVA` in existing document1KU7fGtv86RQz_n3HCdl9HscTyN2Z7SlXz8U8EF3f3MY. Exact content, author.me=true, undeleted status and both timestamps `2026-11-24T12:51:04.217Z` verified. This adopts the amendment solely for general-purpose frequency conversion/two nominated transitions and authorizes isolated implementation. It explicitly does NOT approve methodology, waive provider/legal/specialist requirements or authorize live execution/release. Machine-readable readback and verification receipts are included.

## 2. Exact implementation identities

| Item | Identity |
|---|---|
| Frozen v2 implementation commit | `8a55882b7084c3c68295c62551d996741a1dcd4c` |
| Implementation tree | `ffc375a58c8ab001d2e6360b8412bdf29cd8de9a` |
| Separate v2 policy commit | `aa6b7a18f8dd89c6d4cf01a3aa1514a1c5a5f5ff` |
| Policy tree | `d3189dff251d5d867acf13e00041bff17406bf04` |
| Policy blob | `642d25f770b334a13419c4466d81f17aabff0aae` |
| Policy SHA-256 | `16564fc8612e87a282195193e539b5e9d44d2fd94c88f9ee9b6ea9f19c73008c` |
| Executor blob (`execute.py`) | `eb792c1964d2768940c8b00616e58f220ce5397c` |
| Authority/receipt contract blob | `0b38fedf1885ba382672810ea072948ecf1ae897` |
| PostgreSQL schema candidate blob | `25ac8746534a906cbef375d37db3379425b776e5` |
| Qualification workflow blob | `2cdc3fdc7a38f7f3246733fec69efa571b9aa2a6` |
| Deterministic executor archive | `executor-source.tar.gz`,1,025,838bytes; SHA-256 `448b47d1217e27cb0172d67f8461988c6e6fbb90b1065da038f3c17357ee547b` |

Remote implementation branch: `engineering/worker3-solo440-20261124`. The handoff is on a separate branch so this implementation identity stays frozen.

Candidate remains1637b2a2bf582ebc6e4f4452ff9f3a3fe082b35e/tree209982b9a81d7bf9f4783228505b5a274563391f. Nomination SHA-256 remainsaef727afa4234c4e0e7c6db84bfa312e85696ac655513d3cd6b10a2d829af449; source archive remains6fcfdf70a0e08004e4c7df76a1417b905b166a97cb7f5bba7b2adcf592ca4a72. Immutable frequency engine blobd8f5cb0153a0ae773c0fbd0dd9c999ae8cfb96a3 is preserved. The original executor24a92b77, policy0aef2ad4, handoff1ce38ccf, old verifier, approvals and deadlines remain unchanged.

V2 adds no arbitrary candidate/path authority. Its receipt schema is `calcumint.singleton440.single-owner-source-receipt.v2` with owner-acceptance basis, amendment/policy/executor/source/evidence/store/grant bindings, and explicit `independentApproval:false`, `activated:false`, `certified:false`, `published:false`. Product assessment, applicability decision and short-lived one-run grant must be separate current authenticated owner decisions. Adoption alone cannot pass them.

## 3. Actual qualification matrix

| Requirement | Actual result |
|---|---|
| Supplied offline decision evidence | Six tests PASS unchanged. |
| New v2 scope, adoption, expiry, attempt, receipt, role and refusal controls |14 tests PASS. |
| Local durability reference | Five qualification cases PASS; includes12 fresh Python processes with sanitized environments, exactly one concurrent winner. |
| Replay/replacement/nonce reuse | Refused in fresh local processes. |
| Lost claim acknowledgment/interruption before receipt | Actual worker exit after commit, before acknowledgment; new process reads CLAIMED_NO_RECEIPT and replay stays refused. |
| Lost receipt acknowledgment | Actual worker exit after receipt commit; authoritative read recovers identical stored receipt; a second finalization refuses. |
| Storage unavailable | Missing-store test refuses without recreating local authority state. |
| Historical consumer compatibility | Frozen historical consumer refuses v2; governed review adapter refuses qualification receipts and cannot activate anything. |
| PostgreSQL schema/runtime qualification | **BLOCKED / NOT EXECUTED.** SQL implementation and guarded qualification driver are present, but no approved socket-free disposable client/admin/restart launcher was supplied. |
| Independent runners/hosts | **NOT QUALIFIED.** Fresh processes sharing a temporary SQLite file are not cross-host proof. |
| Actual provider adapter and live admission | **NOT EXECUTED / NOT QUALIFIED.** No live command-line provider adapter is registered; direct invocation fails closed. |

PostgreSQL candidate uses atomic INSERT with unique nonce/grant and run+attempt keys, attempt1, server-clock600-second bound, immutable grant text, restricted executor role, transactional receipt finalization and authoritative reconciliation. There is no upsert, grant replacement or local fallback. Claim and receipt state are separately durable. Uncertain writes stop execution; reconciliation is read-only and does not silently resume an interrupted grant. Same-run replacement stays forbidden. A separately authorized new run would require authoritative reconciliation plus a new nonce and grant.

The current policy explicitly admits no hosted store endpoint. An existing approved durable PostgreSQL endpoint, exact storage/protection qualification, its authenticated client path and a reviewed provider adapter remain actual missing execution dependencies. Do not treat a digest or caller-provided dictionary as provider attestation. Do not retarget this qualification policy to an unspecified service. No new authority service or credential has been commissioned.

Before the later socket prohibition, a disposable local PostgreSQL container/network/volume was created. No authority schema was applied. No further Docker-daemon calls were made after that prohibition. Its state/ownership and pending approved cleanup are recorded in `receipts/disposable-resource-state.json`; this package does not claim it was cleaned up or PostgreSQL-qualified.

## 4. Exact future registration package — preparation only

Proposed qualification definition: `.github/workflows/solo440-owner-v2-qualification.yml` at implementation commit8a55882b, blob2cdc3fdc7a38f7f3246733fec69efa571b9aa2a6. It is manual-only and performs offline qualification/artifact preservation, not admission. No registration or dispatch has occurred.

Authenticated readback confirms active rulesets27851420 and27907165 lock updates/deletion/force-push on the two historical trusted-bootstrap refs. Neither ref may be advanced or bypassed. Environment28262686791 (`calcumint-source-bootstrap-runtime`) currently has a branch-policy rule and only one allowed branch: `engineering/trusted-bootstrap-runtime-20261123`. No reviewer rule was present in that environment response; this does not waive any repository/provider review requirement.

Minimum future operations, each needing separate applicable authorization:

1. Register the exact qualification workflow through the existing provider-compliant default-branch PR/review path. Honor actual required reviews; do not self-approve or add bypass actors.
2. Initialize the proposed new ref `engineering/solo440-owner-v2-execution` at the exact implementation SHA, then apply approved protection to that ref. Preserve both frozen rulesets unchanged. The workflow refuses an unprotected ref.
3. Add only that exact new branch to the existing environment's allowed-branch policy and configure `CALCUMINT_SOLO440_V2_WORKFLOW_SHA` to8a55882b7084c3c68295c62551d996741a1dcd4c. No broad wildcard or environment weakening.
4. Separately authorize one attempt-one qualification-only dispatch. Prepared command: `gh workflow run solo440-owner-v2-qualification.yml --repo subvicco12/calcumint.com --ref engineering/solo440-owner-v2-execution`. **Not executed.** This workflow proves local reference semantics only; PostgreSQL/cross-host qualification needs the missing approved launcher/provider receipts.

One exact narrowly scoped authorization statement prepared for the owner:

> Authorize provider-compliant registration and one non-production attempt-one qualification-only run of executor8a55882b7084c3c68295c62551d996741a1dcd4c/treeffc375a58c8ab001d2e6360b8412bdf29cd8de9a, policyaa6b7a18f8dd89c6d4cf01a3aa1514a1c5a5f5ff/blob642d25f770b334a13419c4466d81f17aabff0aae/SHA-25616564fc8612e87a282195193e539b5e9d44d2fd94c88f9ee9b6ea9f19c73008c and executor archive SHA-256448b47d1217e27cb0172d67f8461988c6e6fbb90b1065da038f3c17357ee547b, solely for the adopted amendment and frozen #440 tuple. Limit any protected configuration operation to the new exact execution ref, that exact environment branch allowance and that exact workflow-SHA variable. Preserve rulesets27851420/27907165 and all provider review requirements. No host Docker socket access, actual source admission, activation, production operation, merge/publication authority or RELEASE HOLD removal is included.

This is prepared text, not an existing authorization. A live source grant cannot yet be frozen honestly: its store, current product/applicability decisions, full evidence and hosted qualification are still missing. Production observer/restoration amendments remain entirely separate.

## 5. Portfolio274 integration acknowledgment

Verified9 outstanding source bundles and9 evidence archives by exact size/SHA-256; restored prerequisite chain in order; verified advertised refs, commit/tree identities and strict Git integrity. Indexed256 evidence files. Integrated source through5ff1aebdb10571529fb08628ade7a92e60cb0139 on isolated branch `engineering/worker3-portfolio274-20261124`.

Integration commit `5f4652917f707e5149d0fe1340a5118ef330ae03`, tree `e4021139f69732bd95d8ee0adc17782739e2454a`. No conflicts.64 focused/affected regression tests PASS across15 files; TypeScript and changed-file lint exit0. Existing passing campaigns were not repeated. Existing immutable engine files and central CI are unchanged. Shared changes are private contract/workbench structured-input handling, cohort delivery and surface samples; they remain subject to exact-source admission and applicable per-ID QA.

The producer ledger independently contains274 unique bounded-private IDs. Integrated representation is274 bounded-private +19 earlier feature-only +#440 singleton=294 represented identities, NOT294 qualified/public calculators. The88 changed src paths versus49ea243b require exact-source disposition. No certification count is changed. Source/precision/mapping/governed-version/QA/Business/replay holds remain as recorded in the exact ledger and owner documents.

## 6. Targeted #426 and cross-worker reconciliation

#426 source bundle and evidence archive match the supplied SHA-256 values. Prerequisite5ff1aebd restored; draft890bf194d5f31954614f82801847eb05c3ea3514/treec85f5484349d3a7d42c5a830671e59a802fd7dae verified. The draft did not include the supplied driver's requested repository path, so its exact18,593-byte archive copy was preserved there unchanged, SHA-256c3ce2ae73597be4a3b27f5b0e9e6d54279fc6508e5c5b9e41009cc9edf5a619c.

Prepared branch `engineering/worker3-mass426-acceptance-20261124`, commit `ac9389fd1cedf202c851218ab36c7b5ff25a496f`, tree `50cb765c35769cd89096062e14e17b6adc5238e1`. Only the supplied test driver is added; source candidate src and immutable engines are untouched. Node24.19.0, Chromium and pdftotext exist; driver syntax checks. Exact pinned installation and genuine acceptance are not qualified.

The supplied producer `browser.log` records permission refusal opening `/var/run/docker.sock`, with0 journeys and0 downloads. The unchanged fixture explicitly opens that socket and rejects external database selectors. The addendum prohibits host Docker access. Therefore the browser driver was NOT invoked again and no fixture guard was altered. Required acceptance remains all3 authenticated plan journeys and actual JSON/CSV/PDF readbacks. #426 remains IMPLEMENTED_NOT_QUALIFIED, source restored/acceptance blocked, counted=false, outside the274 ledger.

Construction #357/#358/#359/#360/#361: remote handoffa802d36d independently verified all102 preserved evidence files and exact executed source8e92ffa761b86a97870fc0192aeeeb348c6e33df. Sports #521/#523/#524: remote handoff56553c47 independently verified all115 files and exact execution15829bca2931e13d0aa777f178e8c944515585c6. Each selected ID has3 existing authenticated plan journeys and3 native export readbacks. These are reused accepted receipts, not newly executed campaigns.

All eight remain IMPLEMENTED_NOT_QUALIFIED with0 new completion credit. Their original v1 engine blobs match, but current portfolio delivery closures do NOT fully match their executed heads; exact differing/missing paths and every per-ID source/precision/QA/replay/Business/integrated-CI decision are in `cross-worker-reconciliation.json`. Do not count them as newly integrated or infer full QA approval. No duplicate implementation was performed.

## 7. Shortest remaining #440 release path

Supply an existing approved socket-free disposable fixture/client path; qualify the exact PostgreSQL code with true independent-runner/concurrency/outage/reconciliation evidence; complete the reviewed provider adapter and exact store policy binding. Obtain the actual competent owner product and applicability decisions. Follow separately authorized registration/protected-configuration/one-run source-grant operations without bypassing provider requirements. Admit and consume the exact source receipt only under separate authorization; then qualify all six mandatory jobs at the resulting exact candidate. Complete current production revision/schema/RLS/writer/backup-restore/credential-custody/freeze/rollback/RPC and unchanged observer/restoration requirements before any separately authorized release.

#440 publication remains NO-GO. PR1538 remains49ea243b5be7e1ee9f3cd8af7f936ab784402cf7. No production SQL, held-RPC activation, workflow dispatch, merge, deployment, certification or publication occurred. Hostinger settings were not changed; Auto-deployment must remain OFF. #432 remains independent and cannot bypass shared release gates.
