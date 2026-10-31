# Bounded genuine expiry/recovery campaign

Run from the repository with the installed locked dependencies and digest-pinned local Docker images:

```sh
EXPIRY_ARTIFACTS=/tmp/batch17-expiry-evidence node tests/batch17-expiry/acceptance.mjs
```

This requests a 15-second fixture JWT lifetime without changing the fixture default. The campaign uses a 120-second observation and SDK request budget measured from campaign start. Its fetch wrapper limits each SDK and raw-bearer request, including response-body consumption, to the smaller of five seconds or the remaining budget while preserving caller cancellation. Natural expiry waits use one-second timers. Fixture startup/readiness and cleanup retain their existing Docker/readiness bounds; this request budget does not preempt synchronous Docker work. CI should retain its outer five-minute job bound. Cleanup runs even on failure.

The installed SDK obtains genuine GoTrue signup sessions. The campaign saves the exact original session to a private mode-0600 artifact, replays its access token directly to PostgREST before its actual `exp`, then polls the unchanged token until PostgREST rejects it, and refreshes its genuine refresh token after expiry. The receipt contains claims and token SHA-256 identifiers, never raw access/refresh tokens. Do not publish `private-issued-session.json`.

A second account measures global logout: actual session row deletion, an authentic SDK `AuthApiError` for the revoked refresh token, and unchanged issued access JWT acceptance before expiry followed by rejection after expiry. SDK signOut can proactively rotate a short-lived session because of its built-in expiry margin, even with automatic refresh disabled; the test deliberately retains and probes the original genuine access JWT. No immediate access revocation is asserted or implemented. The initial campaign measured acceptance at exp+2 seconds; the final campaign records every post-exp acceptance until actual rejection, preserving the pinned PostgREST source's 30-second validation skew instead of assuming an instantaneous exp cutoff. Rejection must occur by exp+35 seconds (five seconds allowed for polling/scheduling), with HTTP 401, PGRST301 and an expired-JWT message.

The receipt describes the selective unchanged application migration fixture, not hosted schema equivalence, production behavior, mail/provider acceptance or a policy decision. Existing Batch16 sources and receipts are historical and must remain unchanged.

Run the targeted configuration and request-budget checks with `node --test tests/batch17-expiry/config.test.mjs tests/batch17-expiry/bounded-fetch.test.mjs`. Hanging-transport/body and caller-abort cases execute in real Node child processes and assert clean exit. The committed expiry receipt predates the fetch-wrapper follow-up and remains historical; a fresh campaign receipt includes the helper source hash.
