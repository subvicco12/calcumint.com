# Trusted source bootstrap preparation

This workflow authenticates and verifies the one reviewed scope, runs disposable refusal fixtures, and emits a review-only result. Protected activation and execution are disabled.

## Owner-controlled configuration required before hosted qualification

1. Register the workflow through an authorized default-branch update so GitHub exposes workflow_dispatch. Review the exact workflow and verifier commit and independently set CALCUMINT_BOOTSTRAP_WORKFLOW_SHA to its commit. A separate owner-controlled repository would need an independently reviewed repository and ref binding.
2. Create an active ruleset on refs/heads/engineering/trusted-bootstrap-20261122. Restrict updates and deletion, block force pushes, and restrict bypass to the authorized provisioning authority. Candidate branch writers and Actions tokens must have no bypass.
3. Create calcumint-source-bootstrap with deployment branches restricted to that exact branch, a required independent reviewer, self-review prevented, and administrative bypass disabled. Confirm the repository plan supports these controls.
4. Set environment variables CALCUMINT_BOOTSTRAP_WORKFLOW_SHA, CALCUMINT_BOOTSTRAP_SOURCE_FILE_ID, CALCUMINT_BOOTSTRAP_PACKET_FILE_ID, CALCUMINT_BOOTSTRAP_NODE, and CALCUMINT_BOOTSTRAP_GIT. File IDs identify owner-controlled exact inputs. Tool paths must refer to regular files supplied by a trusted runner with the reviewed Node and Git hashes. The hosted image must supply those exact binaries, or a separately reviewed provisioning step or trusted runner is required.
5. Supply a short-lived owner-attributed OAuth access token with Drive read permissions through CALCUMINT_BOOTSTRAP_DRIVE_TOKEN or a separately reviewed credential broker. It needs comment and file read access. It stays scoped to the verification step and is absent from the fixture launcher process.
6. Make the exact candidate SHA fetchable via a separately authorized inert remote ref, or review changing delivery to an independently verified Git bundle. PR #1538 is outside this preparation. Verify hosted branch and environment enforcement before dispatch.

In-process checks compare the workflow SHA, ref, repository, event and protected-ref signal. Synthetic refusal tests cannot attest to deployed GitHub rules. The fixture runs verified launcher bytes in a fresh process with a private directory and explicit environment, excluding Drive credentials and Node loader configuration. A real activation path needs separate authorization and runtime isolation review.
