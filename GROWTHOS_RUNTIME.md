# GrowthOS production runtime — CalcuMint

## Security boundary
The GrowthOS heartbeat is server-side only. Never expose `GROWTHOS_CONNECTOR_SECRET` through a `VITE_*`, `NEXT_PUBLIC_*`, browser bundle, repository, build log, or command output.

## Required runtime environment
- `GROWTHOS_SITE_ID`: canonical integer site ID assigned by GrowthOS.
- `GROWTHOS_CONNECTOR_SECRET`: server-only connector credential (minimum 32 characters).
- `GROWTHOS_CONTROL_PLANE_URL`: optional; defaults to `https://growthos.converentis.com`.
- `GROWTHOS_CONNECTOR_KIND`: optional; defaults to `webapp`.

## One-shot runner
Run from the deployed application directory:

```sh
npm run growthos:heartbeat
```

The runner is intentionally one-shot. Scheduling belongs to the production host/process scheduler so a failed heartbeat remains observable. Configure the scheduler environment using the host's protected server-side environment facility; the runner does not read a public/client environment file.

## Production certification gate
Do not enroll or rotate a connector credential until all of these are verified on the actual production host:
1. The deployed application has a server-side Node.js execution path.
2. The scheduler can run `npm run growthos:heartbeat` from the deployed release.
3. The required `GROWTHOS_SITE_ID` and `GROWTHOS_CONNECTOR_SECRET` variables are available only to the server-side scheduled process. If the optional `GROWTHOS_CONTROL_PLANE_URL` or `GROWTHOS_CONNECTOR_KIND` overrides are supplied, they must also remain server-side only.
4. A dry execution with the secret intentionally absent fails closed with `GROWTHOS_CONNECTOR_SECRET missing or too short`.
5. After enrollment, one signed heartbeat returns success and GrowthOS records the connector as connected.
6. The secret is never printed, copied into client configuration, or committed.

## Rollback
Disable the scheduler first. Then revoke the connector in GrowthOS. Removing the schedule must not affect the website application itself.

This document defines the deployment contract only; it does not claim that the production scheduler is already configured.
