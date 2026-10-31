# Native auth/account browser against the full repository model

The existing actual10-check GoTrue/browser runner now accepts `BATCH16_FULL_SCHEMA=1`, selecting the existing `initializeFullSchema` hook. Its default initializer and all10 assertions are preserved. No new application wrapper, engine, historical migration edit or production write is introduced.

Executed with Node22.23.4 and the exact installed dependency tree:

```sh
PATH=/tmp/calcumint-node22:$PATH BATCH16_FULL_SCHEMA=1 GOTRUE_ARTIFACTS=/tmp/batch16-full-schema-browser node tests/gotrue-runtime/acceptance.mjs
```

All10 checks completed successfully. The runner asserts41 public tables before starting acceptance. Genuine signup creates a Free profile despite editable elevation metadata; actual password, foreign-owner writes, plan writes, admin APIs, subjectless tokens and forged signatures are denied. Real refresh/logout rotates and revokes refresh sessions. An issued access JWT remains accepted immediately after logout; elapsed expiry is not tested or claimed.

The native Next login form then authenticates through the installed Supabase SDK and genuine GoTrue, renders the authenticated user's account, survives an actual reload using SSR cookies, and denies account access after native sign-out. Browser errors and disallowed network requests were empty. Runtime, schema mode, table count,5 harness source hashes and the full modeled-schema provenance/source hashes are recorded in `full-schema-browser-receipt.json`. `full-schema-browser-run.log` and `full-schema-browser-next.log` retain actual execution output. All5 harness hashes were independently rechecked against the committed source. The run used application source from laneB baseline `f1b5765` plus the receipt-bound runner change; later root application changes require final-candidate CI.

This closes the previous gap where actual auth/account browser journeys ran only against the selective initializer while the41-table model had SDK-only coverage. It does **not** establish authentic captured hosted-schema/ACL/ledger parity, production equivalence, hosted gateway behavior, mail delivery, OAuth/MFA/recovery, Business UI acceptance, or production deployment approval. The guarded review bundle is adopted only inside the disposable fixture. Hosted parity remains **BLOCKED/UNKNOWN**. The separate Batch16 business-integrity successor is not adopted by this browser mode.

The runner exited0 and cleaned up its browser, copied Next runtime, Docker containers and internal network before releasing the exclusive lease. No additional full suite or build was run in this lane.
