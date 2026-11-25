/** Review-only preparation. No connection strings, execution option or hold removal. */
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {catalogSQL} from '../../tests/adoption1528/catalog.mjs';
import {sha,prepareApply,prepareRollback,bindExpectedPostimage} from '../../tests/adoption1528/bundle.mjs';
import {packageApply,packageReverse} from '../../tests/publication540-shared/database-package.mjs';
import {compose} from '../adoption1535/package.mjs';
import {compareMetadata} from './metadata-diff.mjs';
export const reportedProductionSHA256='8e564644aabd0db81afd5cdaf131577968b732578fd9e24f494f0ae6e4e2668a';
function bytes(capture){assert(capture&&typeof capture.raw==='string','Exact capture bytes required');assert.equal(sha(capture.raw),capture.sha256,'Capture bytes differ from pin');assert.deepEqual(JSON.parse(capture.raw),capture.data,'Capture data differs from exact bytes');}
export async function prepareHeldSuccessor(input){
 const keys=['captureQuerySHA256','productionPreimage','expectedCorePostimage','addonPreimage','expectedComposedPostimage'];
 assert.deepEqual(Object.keys(input).sort(),keys.sort(),'Exact capture package keys required; approval flags cannot substitute');
 assert.equal(input.captureQuerySHA256,sha(catalogSQL),'Capture projection differs from retained seven-relation query');
 const {productionPreimage:before,expectedCorePostimage:after,addonPreimage,expectedComposedPostimage:composed}=input;
 for(const c of [before,after,addonPreimage,composed])bytes(c);
 assert.equal(before.sha256,reportedProductionSHA256,'Current reported production preimage required; historical digest cannot be relabeled');
 assert.equal(before.kind,'AUTHENTICATED_READ_ONLY_METADATA_CAPTURE');assert.equal(before.readOnly,'on');assert.equal(before.observedActor,'postgres');
 assert.equal(after.kind,'DERIVED_EXPECTED_TARGET_POSTIMAGE');
 assert.deepEqual(addonPreimage.data,{base:after.data,addon:[]});assert.deepEqual(composed.data.base,after.data);
 const baseline=JSON.parse(await readFile(new URL('../../docs/adoption1528/target-metadata.json',import.meta.url),'utf8'));baseline.sha256=sha(baseline.raw);
 const diagnostic=compareMetadata(baseline,before);
 // Existing independently reviewed validators and exact source pins remain authoritative.
 const core=bindExpectedPostimage(await prepareApply(before),after),reverseCore=prepareRollback(before,after);
 const addon=await packageApply(addonPreimage,composed),reverseAddon=packageReverse(addonPreimage,composed);
 const apply=compose(core.sql,addon,'APPLY'),reverse=compose(reverseAddon,reverseCore.sql,'REVERSE');
 for(const sql of [apply,reverse]){assert.equal((sql.match(/^DO \$hold\$/gm)||[]).length,1);assert(sql.indexOf('RAISE EXCEPTION')<sql.indexOf('LOCK TABLE'));assert(!/\bCASCADE\b/.test(sql));}
 return{kind:'HELD_REVIEW_ONLY_SUCCESSOR_NOT_APPROVAL',apply,reverse,applySHA256:sha(apply),reverseSHA256:sha(reverse),productionPreimageSHA256:before.sha256,derivedCorePostimageSHA256:after.sha256,derivedComposedPostimageSHA256:composed.sha256,diagnostic,activationAuthorized:false,productionWrites:false,rehearsalPassed:false,independentReviewSatisfied:false,warning:'Supplied authenticated labels are not independently attested by this offline tool. Exact Work capture review, postimage derivation and genuine disposable apply/refusal/reverse rehearsal remain required. Holds are never removed.'};
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
 assert.equal(process.argv.length,3,'One exact capture-package JSON required; no database/execution flags');const input=JSON.parse(await readFile(process.argv[2],'utf8'));console.log(JSON.stringify(await prepareHeldSuccessor(input),null,2));
}
