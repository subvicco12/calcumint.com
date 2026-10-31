import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {historicalWorkflowWithoutPdfTools,pdfToolsStep} from './pdf-tools-contract.mjs';
test('independent PDF prerequisite is unconditional and precedes the full unit suite',()=>{
 const workflow=readFileSync('.github/workflows/ci.yml','utf8');
 const source=workflow.split('\n  source-acceptance:\n')[1].split('\n  build:\n')[0];
 assert.equal(source.split(pdfToolsStep).length,2);assert(source.indexOf(pdfToolsStep)<source.indexOf('      - name: Unit tests\n'));
 for(const altered of [workflow.replace(pdfToolsStep,''),workflow.replace('node scripts/assert-pdf-tools.mjs','node scripts/assert-pdf-tools.mjs || true')])assert.throws(()=>historicalWorkflowWithoutPdfTools(altered));
});
test('missing reader tools fail closed instead of silently skipping independent export checks',()=>{
 const result=spawnSync(process.execPath,['scripts/assert-pdf-tools.mjs'],{env:{...process.env,PATH:''},encoding:'utf8'});
 if(result.error)throw result.error;
 assert.notEqual(result.status,0);assert.match(result.stderr,/Required independent PDF tool unavailable/);
});
