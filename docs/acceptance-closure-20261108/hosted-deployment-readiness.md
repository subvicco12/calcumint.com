# Exact-site deployment read — 2026-11-08 17:32 UTC

One bounded authenticated Hostinger read used discovered readOnly operation `hosting_get-deployment` with only `domain: calcumint.com`. No configuration, build, deployment, restart, rollback or other production action was requested. See [original receipt](hosted-deployment-receipt.json) and [structured summary](hosted-deployment-summary.json).

The connector now supports deployment/build history inspection; the previous capability gap recorded in [native440 hosting evidence](../native440/hosting-read-only.json) is historical.

Current provider response identifies latest build **01a12a3d-9c48-7282-9707-033bf0bf5cab**, state **completed**, source **subvicco12/calcumint.com**, branch **main**, full commit **caffafe639350ca0c2c2cf33ae1f099294f5af54**. It records creation **2026-10-11 09:14:03 UTC**, update **09:15:17 UTC**, Node22, Next application, npm build and .next output. Its log records checking out caffafe, completed compilation/build, publishing that same version, switching current, restarting the application and deployment completion.

Current `gitAutoDeployment` settings report **is_enabled=true**, repository **subvicco12/calcumint.com**, branch **main**. This refreshes the retained automatic-main-deployment setting. It does not independently prove webhook delivery or future deployment success.

This provides a provider deployment/build/source binding that was previously unknown. It is not an independent attestation of live process/files, nor proof that reviewed PR1538 source **3350a313ebc6b5300757e64ae4c125af29bdfdb3** is deployed. The hashes differ. Deployment/source compatibility of the held SQL with this actual provider-recorded predecessor still requires exact client/writer reconciliation and operator review; no compatibility certification is inferred.

Minimum safe next action: deployment owner records this exact provider binding in the change review and reconciles participating writer/RPC clients at that SHA against the proposed reviewed artifact and rollback plan. Any deployment or automatic-deployment setting change requires separate authority. RELEASE HOLD remains active.
