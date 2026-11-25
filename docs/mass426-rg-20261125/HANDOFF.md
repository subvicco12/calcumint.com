# Immutable #426 Ripgrep recovery handoff

RELEASE HOLD ACTIVE.

Exact remotely verified source branch: engineering/worker3-mass426-rg-20261125
Commit: 819ec27df5d9c7f16f090a597216d51ace4090e7
Tree: 95ae51d6ac6d2534f26af3267e4abcacf725a75b
Parent governing source: d93f3b4b986401ca7bae91961360985818bbc7b8

## Engineering result

Pinned Ripgrep staging, a restricted application PATH and fail-closed unprivileged execution guard are implemented. Original runtime call, source enumeration flags, immutable engines, digest functions, historical replay, PDF/browser/Node pins, provider adapter and PostgreSQL contract are unchanged.

Read FINDINGS.md for historical cause bounds; path-permissions.json and the two before-remediation JSON receipts for actual permissions/EACCES; qualification.json for ten passing focused cases; stage-final.log for two passing unit tests; ripgrep-isolation.json for successful Node22.23.4 UID/GID65534 namespace execution; enumeration-equivalence.json and enumerated-source-sha256.json for exact source equality. The complete canonical manifest hashes to ce884cadd5a2340fb5e1c2a59086d61b03fc9feb05b1b68cb6c0bd066944df20 and covers 2183 src/data files plus next.config.ts, bound to exact fixture bab4fd87e91309b15cce9600d81ec523f645f158/tree dac8a76d9ad2745e673d3194ec9da0b37905b6bb.

The historical rg absolute path was not logged. Do not claim recovery of a specific runner file or parent-directory permission. The fix eliminates inherited PATH dependence and proves the known pinned replacement path under real kernel execution. Native GitHub-hosted acceptance remains outstanding; rootless user-namespace results are not presented as that acceptance.

## Boundaries and disposition

Both protected execution refs are preserved: original b2c84b5296f85d97d77c6604334b6d64f1a0a2a5 and recovery d93f3b4b986401ca7bae91961360985818bbc7b8. No protected settings, environment, registration, workflow dispatch/retry, source admission, production SQL, activation, deployment, certification, publication or resource cleanup occurred. Existing application CI controls and all historical approvals remain unchanged. The original PostgreSQL ZIP remains verbatim at SHA256 a1098236906e43035e80390bd9b1bbf8254d9873c424b929352870000f907560; its12 tests were not repeated.

This source head is an OFFLINE ENGINEERING CANDIDATE. Existing workflow/ref/provider bindings deliberately remain frozen; no old authorization applies to it and it is not dispatch-ready. A fresh exact-head execution/ref binding package and explicit owner authorization are prerequisites for any hosted follow-up. The inherited earlier authorization proposal must not be mistaken for authorization of this head.

#426 remains IMPLEMENTED_NOT_ACCEPTED: zero browser journeys, zero actual export readbacks and zero ledger credit from these tests. Deduplicated portfolio remains274 bounded private contracts. Required hosted evidence remains three authenticated plan journeys, ownership/entitlement denial, exact replay and actual JSON/CSV/PDF readbacks. No promotion from focused-test or workflow status alone.

Provider job139283964120 separately refused Google userinfo with HTTP401. Identity assertions are unchanged and no new provider call or credential change occurred. See WORK-PROVIDER-HANDOFF.md for the external applicability finding. An existing Work destination was requested because connected search did not identify one; this packet is ready for coordination but no delivery or competent decision is invented.

Cross-host durability and all #440 competent review, exact-source admission, application CI, operational and publication decisions remain separate and unresolved. Hostinger configuration was not changed; Auto-deployment must remain OFF.
