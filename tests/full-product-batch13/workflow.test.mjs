import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
const yaml=readFileSync('.github/workflows/ci.yml','utf8'),job=yaml.split('  full-product:\n')[1].split('  validate:\n')[0];
test('genuine-auth and private sensitivity are mandatory bounded sequential CI steps',()=>{
 assert.match(job,/timeout-minutes: 20/);assert(job.includes('docker pull supabase/gotrue:v2.197.0@sha256:1736a63078f5922b198c4cbe50f80ab9a2d3b54fe8b7b6cfb2e9dc5dbbc12c6b'));
 const commands=['node tests/full-product-batch12/private-browser.mjs','node tests/full-product-batch12/account-browser.mjs','node scripts/full-product-batch13-evidence.mjs --check','node --test tests/next-runtime/cdp-network-diagnostics.test.mjs','node tests/full-product-batch13/private-browser.mjs','node tests/gotrue-runtime/acceptance.mjs'];let position=-1;for(const command of commands){const next=job.indexOf(command);assert(next>position,command+' must execute in sequence');position=next;}
 assert(!/continue-on-error|^\s+if:|\s&\s*$/m.test(job),'New acceptance may not be skipped, ignored or backgrounded');
});
test('immutable native evidence source is fetched before unchanged strict reconciliation',()=>{
 const fetch=yaml.indexOf('git fetch --no-tags --depth=1 origin 50f307c67e3a5e5d289d2b83e2a285029151f866');assert(fetch>0);assert(yaml.indexOf('python3 scripts/reconcile-native-blueprint.py --check')>fetch);
});
