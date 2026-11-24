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
npm ci --ignore-scripts --no-audit --no-fund
node tests/worker2-energy-mobility-20261119/recovered-mass.local.mjs
node - "$WORKER2_MOBILITY_BROWSER_ARTIFACTS/receipt.json" <<'JS'
const fs=require('node:fs');const r=JSON.parse(fs.readFileSync(process.argv[2]));
if(r.passed!==true||r.rows.length!==3||r.downloads.length!==3)throw Error('Mass426 acceptance incomplete');
if(!['free','pro','business'].every(plan=>r.rows.some(x=>x.plan===plan)))throw Error('Missing authenticated plan');
if(!['json','csv','pdf'].every(format=>r.downloads.some(x=>x.format===format)))throw Error('Missing native export readback');
JS
