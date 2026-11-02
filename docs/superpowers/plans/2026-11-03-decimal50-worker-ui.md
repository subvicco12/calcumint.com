# Decimal50 private worker/UI continuation

Goal: Expose the existing unregistered #282/#283 exact-decimal core through cancellable bounded worker jobs and an isolated reviewer UI, without canonical routing or historical mutation.
Spec: docs/full-six/input/SHARED-PRODUCT-CONTRACT.md and contracts/282-standard-deviation-calculator.json, contracts/283-variance-calculator.json. OWN-01–08 isolated engineering approval remains effective; qualified and release approvals remain absent.

- Worker lane owns new statistics/{worker-protocol,worker-runner,statistics.worker}.ts and tests. Single active worker, fresh worker per request; cancel/supersession/deadline/dispose terminates and settles, rejects stale/mismatched payloads, bounded input before transfer. A 5-second hard safety deadline is a disclosed operational ceiling, not proof of the separate 500ms p95 acceptance target.
- UI lane owns new components/full-six/statistics-workbench.tsx/tests and statistics/dataset-draft.ts/tests. Empty explicit estimand, raw/frequency selection, exact tokens and units, explicit omission confirmation, calculate/cancel/error/recovery and stale result state. No synchronous math fallback. In-memory scenarios and plan-allowed JSON artifact export/replay reuse existing primitives; do not claim authenticated storage.
- Root owns a new loopback Basic-auth reviewer server and real-worker Chromium acceptance. Use existing protected credential helper, exact Host/Origin and read-only methods, no public assets/env exposure. No production/private-account route change. Include controls, bytes, cancellation/retry, error and malformed imports plus mobile/keyboard checks.
- Verify unchanged v1 definitions/history, all protected source pins and untouched 44-candidate queue. Run focused tests, unchanged independent oracle, full regression/security/certification/lint/typecheck/webpack. Obtain independent review before a single successor draft PR; check its exact-head CI once.

Review focus: no stale completion after edits/cancellation; preserve decimal tokens; zero-frequency and missing data remain distinct; no main-thread recomputation during replay; exported/replayed ID/contract/version must match; resource-bound failure must never be shown as saved success. Histogram, sensitivity, reverse and broader analysis stay incomplete.

Baseline exact-head CI was IN_PROGRESS at first check (three workers passed, two running); no hosted-green assertion or certification inference. Work remains isolated.
