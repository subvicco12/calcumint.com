# First20 exact-source CI repair

The failure at PR1538 head65d8724fd8e8167b9e092f199611a161c4281f03 / run42968347568 is reproduced locally. Checks, full-product, source-acceptance and build passed; publication-factory and aggregate failed correctly.

`src/lib/first20/preview-security.test.ts` legitimately advanced from a54520f4… to bf5cc36e… at exact commitd7eb23e22d2357af838b6d4ba983971090ed8713. That test-only readiness change was already independently admitted with unchanged security assertions,5s cases and30s setup. The old first20 consumer still used direct live hash equality.

The historical execution manifest is unchanged byte-for-byte. The corrected consumer first verifies the independent current source proof with the same reader/Git. Only the named preview uses the existing finite successor verifier. The consumer's own original f116f77b… source claim is proven against literal A7 Git, while its successor is bound to a separately reviewed exact current source capture. Every other manifest hash remains strict. No generic SHA exemption, automatic QA pass, certification promotion or waiver was added.

Revision16 independently binds586source objects and14authority pins.58source/negative-diagnostic tests passed. The new consumer tests are1positive plus7refusal cases: unreviewed preview bytes, valid-old preview reversion, unrelated source tamper, changed historical claim, missing Git, valid-old verifier reversion and coordinated self-nomination. Combined with the original14 tests,22 pass. The real CLI and these22 cases now execute through mandatory unit discovery.

All four unchanged commands in the failed CI step passed locally within its original4min budget: polygon evidence, manifest, original evidence tests,120browser journeys and3polygon cases. Browser accounts are synthetic and imply no genuine authenticated or competent approval. Actual five-calculator authenticated/native95-artifact and isolated SQL/auth evidence are reused only where unchanged application bytes permit.

The initial two-worker full run hit an existing45s source-proof timeout plus a worker RPC timeout; its9128passing cases and1failure are retained as FAILED. A complete serial full run uses the same exact frozen source, same Node22.23.4, same assertions and all original timeouts. Its final results are in validation.json; this is not a rewrite of the failed run.

The source-qualified repair is8640505041eb54ca3b37963c357c746639eb2874. Final delivery adds recovery evidence only. Exact delivery SHA, mandatory hosted job conclusions and post-CI engineering overlay are saved to the immutable Drive checkpoint to avoid a self-referential Git event. No hosted success is claimed before all5mandatory jobs and aggregate pass.

Canonical540 dispositions remain0complete/certified,2review-pending,495partial/unproven,43identity/scope-blocked. Five provisional scoped profiles369/375/380/381/387 remain preserved; the separate13+5 overlay can be confirmed18 only after genuine hosted qualification. Newly canonical-accepted, certified and publication-eligible counts remain0. #440 competent appointment/decisions and actual operator/writer/freeze/recovery/custody/deployment/adoption requirements remain external. Held SQL and historical versions are unchanged.

Post-recovery targets are368IPSubnet and376ScreenPPI. Exact existing engines and retained history evidence already exist; native Business/sharing integration remains missing.368 needs exact IPv4 TEXT handling,376 must preserve its existing numeric formula/fractional dimensions and precision refusals. No formula replacement, duplicate engine, source-scope approval or production action is authorized by this packet.

RELEASE HOLD ACTIVE. No merge, deployment, production SQL, credential change, certification, publication or live billing activation.

## Final local result

All mandatory local checks passed at frozen source8640505041eb54ca3b37963c357c746639eb2874 under Node22.23.4:9129unit cases passed/4existing skipped/0failed;1006files passed/2skipped. Lint0errors/36warnings, typecheck, launch45, certification guards15 and `next build --webpack` passed. The serial run retained every assertion/deadline. The unchanged4-command target step passed in207.60s against its240s limit. All58source tests and22consumer cases passed; nested/subset counts are not additive to the full unit total. Final delivery source admission is checked again after this documentation-only commit. HostedCI must independently pass all5jobs and aggregate before the five provisional overlay records are confirmed.
