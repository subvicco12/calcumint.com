Run from repository root:

```sh
node tests/critical440-auth/acceptance.mjs
```

Requires installed repository dependencies and the three pinned Docker images already used by `tests/gotrue-runtime/fixture.mjs`. No image pulls or production configuration are used. Docker and loopback networking must be available. `CRITICAL440_AUTH_ARTIFACTS` overrides the default `docs/critical440-auth` receipt directory.

Every execution creates fresh internal Docker PostgreSQL 17.6, GoTrue and PostgREST containers with random local credentials, initializes the existing full candidate schema, signs up three actual SDK users, performs the assertions, writes a source-fingerprinted receipt, and removes the containers/network. The temporary esbuild bundle invokes the real account persistence helper, historical validator, candidate engines and registered replay verifier. It does not replace SDK requests with fake responses.

The exact current twenty inputs come from `docs/shortest-publication-20/browser-cases.json`, bound through `publication20Definitions`. #440 explicitly asserts `conversion.frequency` / `frequency-converter` / version 1. Twenty owned snapshots per tier are saved and replayed; #440 additionally exercises quota boundaries, lost-acknowledgement retry, conflicting same-request output, foreign owner requests, read/update isolation, paid atomic scenario copies and downgrade/logout boundaries.
