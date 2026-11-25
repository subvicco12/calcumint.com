# Required read permissions — independently sourced

Official github/docs fine-grained permission metadata blob 686475ba5c572048f3cf8da38a5206e2dc9324f6 (local Git blob hash matches authenticated API metadata). See required-github-permissions.json and permission-source.json.

- Get workflow run: actions:read.
- Get branch: contents:read.
- Get repository ruleset: metadata:read (implicit job permission).
- Get environment: actions:read.
- List environment deployment-branch policies: actions:read.

The consumed job log explicitly lists all three permissions. Thus no missing declared GitHub permission is established and no additional permission or administrator action is proposed as a cure. Actual token/resource/policy authorization can still fail; the generic historical HTTPError cannot eliminate any endpoint. Current linked CLI access is not substituted for hosted token verification.

Google calls require the existing credential to support OAuth userinfo subject/name/verified email, Drive about/user, and read access to the exact adoption comment. Existing identity/userinfo and Drive read scope must be applicable; no credential extraction, generation, replacement or scope expansion performed. Connected Google identity evidence from another authorization context cannot prove the workflow secret's current validity. Provider refusal diagnostics retain all exact checks and must never count as passing acceptance.
