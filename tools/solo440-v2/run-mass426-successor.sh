#!/usr/bin/env bash
# Runs only after the workflow-owned service setup; no Docker API is used.
set -euo pipefail
: "${APP_SOURCE:?}" "${CALCUMINT_SERVICE_CONFIG:?}" "${WORKER2_MOBILITY_BROWSER_ARTIFACTS:?}"
test "$(id -u)" = 65534
test "$(id -g)" = 65534
test "$(id -G)" = 65534
if test -r /var/run/docker.sock || test -w /var/run/docker.sock; then
  echo 'Application can access host Docker socket; refusing' >&2
  exit 1
fi
cd "$APP_SOURCE"
node - "$WORKER2_MOBILITY_BROWSER_ARTIFACTS/socket-isolation.json" <<'JS'
const fs=require('node:fs'),assert=require('node:assert/strict');
for(const key of ['GITHUB_TOKEN','BOOTSTRAP_DRIVE_TOKEN','ACTIONS_RUNTIME_TOKEN','ACTIONS_ID_TOKEN_REQUEST_TOKEN'])assert(!process.env[key],'Provider credential reached application');
assert.equal(process.getuid(),65534);assert.deepEqual(process.getgroups(),[65534]);
fs.writeFileSync(process.argv[2],JSON.stringify({uid:process.getuid(),groups:process.getgroups(),dockerSocketReadableOrWritable:false,providerCredentialsPresent:false,node:process.version,runId:process.env.GITHUB_RUN_ID,workflowSha:process.env.GITHUB_WORKFLOW_SHA})+'\n');
JS
npm ci --ignore-scripts --no-audit --no-fund
# Use the approved installation's ELF directly; no uninspected launcher PATH utilities.
export CHROMIUM_PATH="$(node -p 'require("path").join(require("path").dirname(require("fs").realpathSync(process.env.CHROMIUM_PATH)),"chrome")')"
node "$APP_SOURCE/../tools/dependency-preflight.mjs"
node tests/worker2-energy-mobility-20261119/recovered-mass.local.mjs
node - "$WORKER2_MOBILITY_BROWSER_ARTIFACTS/receipt.json" <<'JS'
const fs=require('node:fs');const r=JSON.parse(fs.readFileSync(process.argv[2]));
if(r.passed!==true||r.rows.length!==3||r.downloads.length!==3)throw Error('Mass426 acceptance incomplete');
if(!['free','pro','business'].every(plan=>r.rows.some(x=>x.plan===plan)))throw Error('Missing authenticated plan');
if(!['json','csv','pdf'].every(format=>r.downloads.some(x=>x.format===format)))throw Error('Missing native export readback');
JS
