# Attempt-one recovery findings

Run 45537165821 executed b2c84b5296f85d97d77c6604334b6d64f1a0a2a5, attempt 1; authorization consumed. No rerun or dispatch is authorized.

## PostgreSQL preserved

Job 138946486879 succeeded in 15 seconds (including setup). Artifact 14987606015 is 787 bytes. Independently downloaded ZIP SHA-256 a1098236906e43035e80390bd9b1bbf8254d9873c424b929352870000f907560 matches GitHub metadata and owner binding. All 12 stored results pass. No PostgreSQL tests repeated. These are job-local PostgreSQL receipts, explicitly not cross-host evidence.

## #426 setup

Job 138946487143 used Ubuntu 26.04.1, image ubuntu-26.04 version 20261116.202.1. The pinned Node executable check succeeded. The next step used set -euo pipefail and command -v pdftotext as its first command, then command -v google-chrome. There is no output between that step's environment footer and exit 1. A successful command -v would print its path, therefore pdftotext was absent from PATH and stopped the shell; google-chrome was not reached. Chrome 157.0.8103.78 is listed in the exact runner image manifest, which is not proof of its runtime path. The authenticated driver never ran. No engine or numerical defect is established.

Minimal correction: explicit Ubuntu26.04 runner label; SHA-256-pinned official poppler-utils and libpoppler156 packages version 26.01.0-2build2; supported google-chrome/google-chrome-stable path resolution and executable probe. Exact package bytes independently downloaded and verified locally; Ubuntu installation and actual browser journeys remain unexecuted. Other OS dependency resolution remains via authenticated Ubuntu apt metadata, not a fully frozen OS image. Application still runs as UID/GID65534, clear groups, no-new-privs, env -i, and cannot access Docker or provider credentials. Original fixture bab4fd87e91309b15cce9600d81ec523f645f158, driver and engine unchanged.

Provision, tool-resolution and private-workspace failures now yield a bounded fixed-category receipt; no environment/configuration, failing command, exception text or provider body is serialized. Provider diagnostics upload uses always().

## Provider failure: bounded unresolved cause

Job 138946487046 used contents:read, actions:read and implicit metadata:read GITHUB_TOKEN plus the existing Drive secret. Its only error is Provider verification refused (HTTPError). The frozen adapter discards HTTP status, URL and request stage. No successful provider receipt was uploaded (upload was skipped). The exact failed endpoint/status cannot be recovered from this log. Do not claim a Google credential failure or GitHub permission failure without evidence.

Exact GET sequence: GitHub run -> execution branch -> ruleset27851420 -> ruleset27907165 -> environment -> environment deployment-branch policies -> Google OAuth userinfo -> Drive about/user -> exact adoption comment. Every one can produce HTTPError. Existing linked CLI credential can currently read the GitHub endpoints; this does not establish the hosted GITHUB_TOKEN's access. Google userinfo requires existing owner identity/email verification access; Drive about and exact comment require existing Drive read access to that document. No credential retrieved, generated, replaced or expanded.

Remediation wraps each required request with a fixed endpoint-category and HTTP-status diagnostic. It emits a refusal receipt before exiting and never logs credential, headers, raw response, exception string or sensitive URL. Every original identity, exact adoption, run/head/ref, ruleset, environment and source-package assertion remains required. Recovery workflow has a distinct ref/path; it cannot reuse the original protected ref or attempt 2. Existing source authority execution path remains fixed to its historical ref.

Provider access requirements must be independently established for all listed endpoints before a new qualification is authorized. No speculative permission increase is proposed. Current generic log cannot justify a specific credential or administrator change. The successor is an engineering candidate, not proof that provider readback now passes.

## Verification

13 affected offline tests pass (9 new recovery tests plus 4 existing provider tests). Python AST, proposed YAML parsing, embedded bash syntax and provision-script bash syntax pass. Real missing-executable and unsupported-platform negative checks executed locally; provider API failures use synthetic HTTP/transport fixtures. No actual provider-secret read or hosted rerun occurred. actionlint unavailable: local go command does not support go install; no actionlint success claimed. Broad application suites, SQLite qualification and successful PostgreSQL campaign were not repeated.

## Disposition

#426 IMPLEMENTED_NOT_ACCEPTED: 0 completed authenticated journeys and 0 native export readbacks from the consumed run. No new ledger credit. Existing deduplicated portfolio remains 274 bounded private contracts; no certification promotion. Cross-host PostgreSQL durability, provider access/readback, #426 full authenticated acceptance, competent #440 product/applicability review, exact-source admission/receipt review, six mandatory application CI gates and production operational/observer/restore decisions remain separate. No release, admission or activation follows from these engineering tests.
