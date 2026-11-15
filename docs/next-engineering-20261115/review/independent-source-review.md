# Independent source-admission review

Initial candidate: `80e52c5cd5d89cd88826ad5b06378431f4cf693b`, based on frozen source `550ae67dfdf8fcfa8fb0ac68ccbe2ac68e13fb0f`.

Status: all three findings resolved; latest reviewed candidate is `7fd9e40cb69ccfee70924e6dd6c2bc393a0043f8`. Independent clean remote availability verification passed for predecessor b8694256 and, separately, the new lint-fix authority 379997d8. No source or candidate files changed by this review. No full suite run. No unresolved critical, important or minor findings.

## Important findings

1. **Caller-provided Git can impersonate native HEAD and physical source state.** `tests/next-engineering-20261115/source-stage10.mjs:26-29` treats `immutableTreeQueryReader(input.git)` as native evidence. Physical reads independently authenticate the 23 admitted paths, but HEAD, status and the complete source delta come only from the supplied Git function. Read-only reproduction on the initial candidate: provide a Git function that returns `550ae67dfdf8fcfa8fb0ac68ccbe2ac68e13fb0f\n` solely for `['rev-parse','--verify','HEAD^{commit}']` and delegates everything else to `execFileSync('git', args)`. Both `proveSourceStage10({root:process.cwd(),read:readFileSync,git})` and `assertSourceStage10Stable(proof)` succeed, and `proof.nativeHead` is 550ae67 even though physical HEAD is 80e52c5. Similar delegation can suppress dirty/untracked or whole-tree evidence outside the 23 physically checked rows. Independently observe the actual root, native HEAD and source status/delta before and after proof; require the supplied transport to agree. Add negative coverage for concealed dirty/untracked paths and dishonest HEAD. Worker acknowledged and is fixing.

2. **Public named-current helpers omit the Stage10 successor.** `tests/parallel-source-20261110/core.mjs:369-370` merges only Stage8 and Stage9 rows and selects only `stage9Live`/`live`. A Stage10-overlapping path such as `src/lib/calculator-factory/registry.ts` therefore retains an older current record in `proveNamedCurrentContext`; `assertNamedApplicationSuccessor` uses that older row when checking actual new bytes. Propagate authenticated Stage10 rows through the nested views and observation aliases, merge them last for current identities and select them first for current-byte verification. Preserve original recorded SHA claims; added files have no inherited historical claim and must not receive one. Worker independently confirmed and is fixing, including downstream source-row selection.

## Verified preservation and provenance

- Inspected the full large artifacts, not just their summary hashes. `guard-capture.json` differs structurally from retained `capture-revision112.json` only at `currentSources` and the added `sourceStage10`. The original candidate has 12 updated/added guard rows and zero dropped rows. All other historical fields, scopes and deadlines are identical.
- Copied `authority-retained.mjs` is byte-identical to frozen-base authority: 553460 bytes, SHA256 `81b736eadfccbf601b3780e70ad3d4134d889cf50cd4dc02e522fdb3a5ceb7b8`. All existing authority declarations before the aggregate `accepted` declaration are literal; Stage10 is appended separately.
- Native `git diff --name-only 3ccdd6d 550ae67 -- src` equals the 23 Stage10 capture paths exactly. Candidate commits introduce no further SRC changes. Capture rows include exact predecessor/current refs, blobs, lengths and SHA256 values, with a finite nine-commit parent chain.
- The independent current-authority test pins `7e65c1fe521116d247688b8f11edd4bab4af6f4e`, blob `d97c4e4ea844da3c7d6267cc090f238d0de3f6d0`, SHA256 `8262a17e3cb7940f8ff6e0c38a213c3daf30aa31df37ef9038fa0e02d2bc6fe3`; it retains the preceding authority pin and validates Git path/blob and bytes, not only an unbound hash. The pinning commit is its child 80e52c5.
- Existing workflows call `scripts/fetch-source-lineage.mjs`; Stage10 ancestry/guard refs are appended to bootstrap and fetch sets. Remote hosted availability of these new local commits is not established by this review and requires publication/clean-checkout verification. A local object being present is not proof GitHub can fetch it.
- Stage10 does not add new calculator IDs to historical receipt scopes. Its metadata explicitly limits the operation to source admission and leaves cohort qualification false. The pending named-context fix must retain that boundary.

## Coverage observations

The initial six Stage10 tests cover reader tampering, predecessor reversion, capture/root replacement, extra object fields, supplied dirty status, wrong source delta/path, missing Git, stale reader capabilities, simulated HEAD movement, alias roots and closed-reader omissions. They do not cover dishonest clean/native status, physical source symlink mutation, or independently observed actual HEAD. Those missing transport negatives exposed finding 1. Parent/worker test reports are not treated as independent execution evidence here.

## Pending incremental review

Review native observation fixes, Stage10 current-row propagation, successor-aware Stage8 physical-byte assertion and metadata-HEAD test, exact preflight fetch transform, regenerated additive captures and final immutable authority pin. Recheck retained-array/capture literal preservation and final SRC equality after regeneration.

## Incremental review: 2f74af87

Findings 1 and 2 are resolved. Independent read-only replay now refuses the original forged-HEAD input; a real Stage10 proof and final stability check pass, and nested Stage8 exposes all 23 authenticated Stage10 rows equal to the direct proof. Native root/HEAD/status/whole-SRC-delta observations occur before and after the exact proof. The new physical-negative test uses a disposable worktree for hidden untracked files, concealed tracked-byte edits and same-byte source symlinks. Worker reports 8/8 Stage10, 11/11 Stage8-live and raw authority success; those are attributed reports, not reviewer reruns.

The named-current map now includes Stage10 rows last, selecting them first for current bytes; observation aliases forward them. The dedicated regression asserts that added source has no inherited receipt SHA. The receipt helper adds only the exact known verifier hash at the frozen code ref, and the existing path/claim scopes remain unchanged. Stage8 physical-row assertions retain exact byte equality against the authenticated current successor, and metadata movement still refuses.

Independently checked the entire new large capture: changes from the first Stage10 capture are limited to current guard rows, unioned Stage10 guard paths, and added Review2 metadata; all other fields remain identical. Previous authority declarations, including the initial Stage10 array, remain literal. There is zero SRC delta from frozen 550ae67. Pin `2b74b7a5c81bbae7625451df4f7f082b5452093b` resolves authority path to blob `95ac0ff4bff4ac3d9bdcd24afedeefac87e1f376`, SHA256 `917006b023974725e77cb02adba62450230f02e67cb8462fbdffb04f4c00489d`; pinning commit 2f74af87 is its immediate child. Retained initial pin 7e65c1fe also verifies independently.

### Additional important finding: prior authority objects omitted from shallow bootstrap

The new independent-authority test retains both `31a5322591af546b732096008dea8408cca23f9b` and `7e65c1fe521116d247688b8f11edd4bab4af6f4e`, but the 442 refs visited by `fetchSourceLineage` include neither. `ensurePinnedAuthorityRecord(expectedAuthority)` fetches only the current 2b74b7a5 authority. A fresh shallow checkout and depth-one guard fetch do not guarantee those older commits exist. The historical pin loop can therefore fail with a missing object even though the candidate passes in the populated development repository.

Exact read-only reproduction: invoke `fetchSourceLineage` with a callback which records each `rev-parse --verify REF^{commit}` argument and returns that REF; compare the resulting set against every literal authority record in `current.test.mjs`. The only absent pins are 31a53225, 7e65c1fe, and current 2b74b7a5 (the latter has its own explicit availability helper). Worker acknowledged and is adding the prior pins, including 2b74b7a5 once superseded, to a separate additive availability declaration and regression. No other historical pin was absent.

## Final incremental review: ebf95539

The availability finding is resolved. Independently executed `node --test tests/next-engineering-20261115/source-availability.test.mjs` (1/1 passes), then independently enumerated the entire fetch callback set: 446 refs, including every retained literal authority pin. The current pin has its separate immutable availability helper. Prior declarations and arrays remain literal; the availability refs are appended in their own declaration.

Reviewed the additional workflow47 and preflight fixes. Workflow47 retains its exact historical arrays and selects authenticated Stage10 current rows only where paths already overlap; all positive admission still executes the full proof. The preflight still requires the historical two-path scope, exact current immutable row, independent authority, exact reviewed text transform, and literal original audit; only the choice of authenticated current guard metadata advances.

Independently checked the entire availability capture against Review2: differences are only current guard rows, unioned Stage10 guard paths, and additive availability metadata. No old capture file or authority declaration was rewritten. Frozen 550ae67 to final HEAD has zero SRC changes. Final expected authority ref `955f860712e938c9d1140e4fda41ff1535c53272` resolves the authority path to blob `d459d0a269bbb8276ef00feefd4dafbbc2b21b75`, SHA256 `0955ed90b9aaae5f4377ab8a480d51b8fa8677a0adad6c96401a0becce84ee6c`; final pinning HEAD is its immediate child.

No unresolved critical, important or minor code finding in the reviewed final diff. The remaining operational check is a clean remote checkout/fetch of the published final candidate and required immutable objects. This review does not authorize production, canonical count changes, PR1538 changes, or new cohort qualification.

## Deadline-preserving final incremental review: b8694256

Reviewed the added checksum-pinned negative preflight over Stage8, Stage9 and Stage10 capture rows, with newer rows overriding older identities. It only rejects byte mismatches early; every successful invocation continues through native root/HEAD/status/whole-source delta, exact Git ancestry/path/blob checks, physical bytes and final stability checks before historical capability construction. No deadline changed. Worker reports retained Stage9 5/5 in 6.4 seconds, within its original 15-second limit.

Independently checked the full deadline capture and previous authority declarations: history remains literal except additive guard rows/metadata, and frozen source has zero delta. All retained independent authority pins occur in the now-448-ref fetch set, including the newly superseded 955f8607. Final authority pin `13298943d7357e4593c25772c3e7d9db118db623` resolves to blob `affeb22f66657baac8dbeb6d9cfb49b340b35328` and SHA256 `6fe5ae67ff4c9382f58a0a6ced695232c9c4cc30899f3d463b62c7a6339e49f5`; final candidate b8694256 is its immediate child. No additional code finding.

## Independent clean remote verification

After authorized source-branch publication, initialized a disposable bare repository at `/tmp/calcumint-source-remote-proof-99vx7a6j`, with no object alternates or local object reuse. Fetched final b8694256 plus every Stage10 bootstrap ref and the current authority ref directly from `https://github.com/subvicco12/calcumint.com.git`, using `--no-tags --depth=1`. Fetch succeeded for all 19 distinct refs. The default sandbox network connection failed; the authorized escalated read-only network fetch succeeded.

Independently verified all 19 commit content addresses, all five Stage10 retained/current authority records by commit-to-path/blob mapping, blob SHA1 and SHA256, shallow repository status, absence of alternates, and zero SRC delta from frozen 550ae67 to final b8694256. This establishes remote availability for all newly introduced Stage10 dependencies; it is not a claim that all 448 historical refs were freshly fetched in this review.

Machine-readable proof: `/tmp/calcumint-source-clean-remote-proof.json`. Fetch log: `/tmp/calcumint-source-remote-fetch.log`.

Worker's final attributed validation reports 30 cases passed: strict Stage10 8, retained Stage9 child 5 inside its unchanged 15000ms deadline (7266ms observed), Stage8-live 11, preflight 4 including the literal prior five-case audit, actual named-current context 1, and availability 1; raw `verifyParallelAuthority` also returned true. The later `347c9e65` receipt commit is reported docs-only and is not the reviewed implementation identity. Final approval here is limited to exact source admission; historical evidence remains scoped, and this does not qualify the new cohort or authorize production/canonical-count/PR1538 changes.

## CI lint correction review: 7fd9e40c

CI identified the prohibited local binding `module` in the new physical-source negative test. Mechanically verified that the test file changes only `const module` to `const stage10Module` and its one `JSON.stringify` reference. Every assertion, fixture operation and deadline remains identical. Worker reports full lint passes with zero errors and 88 warnings.

Reviewed the exact supplemental guard adapters and entire new lint capture. All previous authority declarations remain byte-literal, prior capture fields remain identical except additive current guard rows/metadata, and the fetch set now contains 450 refs including every retained authority pin (newly including 13298943). Source and workflow deltas from frozen 550ae67 remain zero. Final authority ref `379997d86b163f5dc7e95de76e26fa055361a2d1` maps its authority path to blob `37dbab1c426e93ba758a8594a255d8da6e526ce3`, SHA256 `9f394ef02e8c10482741ec86ddc4afb312258ce151e6d8bfb91cf31806fda264`; candidate 7fd9e40c is its immediate child. No additional finding; incremental signoff given pending new-pin remote verification after publication.

After parent-confirmed publication at docs-only descendant `a931482f3972bda57dcf966fce9a3bbe9b4d8320`, independently fetched exact authority commit `379997d86b163f5dc7e95de76e26fa055361a2d1` into a second freshly initialized bare repository, `/tmp/calcumint-source-lint-remote-n49c9q_d`, directly from the official HTTPS origin with `--depth=1`. Verified shallow status, no alternates, commit SHA1, exact authority path/blob, blob SHA1 and SHA256. The new authority remote verification passed. This second check fetched only that exact new authority commit; prior 19-ref remote evidence is retained separately and not represented as a rerun against the latest docs-only branch tip.

New machine-readable proof: `/tmp/calcumint-source-lint-clean-remote-proof.json`; fetch log: `/tmp/calcumint-source-lint-remote-fetch.log`. Worker reports post-pin Stage10 8/8, preflight 4/4, availability 1/1 and raw authority success. No full current-test suite or hosted CI success is claimed by this review.
