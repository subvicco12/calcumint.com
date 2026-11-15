/** Refusal only; the complete original Stage5 proof remains mandatory for every successful call. */
import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {realpathSync} from 'node:fs';import {resolve} from 'node:path';
import {accepted} from '../parallel-source-20261110/authority.mjs';import {sourceGit} from '../parallel-source-20261110/baseline-runtime.mjs';
import {sourceStage8HistoricalView} from '../milestone100-20261114/source-stage8.mjs';import {appStage5Policy} from '../completion-wave-20261113/source-app-stage5-policy.mjs';
export function rejectChangedKnownStage5Source(input){
 const view=sourceStage8HistoricalView(input.git);if(!view&&input.git!==sourceGit)return;
 if(view){assert.equal(input.read,view.historicalInput.read,'Historical Stage8 reader capability differs');assert.equal(resolve(input.root),resolve(view.historicalInput.root),'Historical Stage8 root differs');}
 const actual=view?.actualInput??input;assert.equal(resolve(actual.root),realpathSync(process.cwd()),'Actual workspace root required');
 assert.equal(appStage5Policy.paths.length,19);const rows=appStage5Policy.paths.map(path=>accepted.find(row=>row.path===path)).filter(Boolean);assert.equal(rows.length,16,'Fixed known Stage5 source intersection required');
 for(const row of rows){const bytes=actual.read(row.path);assert(Buffer.isBuffer(bytes)&&createHash('sha256').update(bytes).digest('hex')===row.sha256,'Current factory bytes differ: '+row.path);}
}
