import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const report=JSON.parse(fs.readFileSync('docs/decimal50-statistics/execution-manifest.json'));
assert.equal(report.baseline,'af94b00cee5e8ef53e2b6ecdf1501c6b45cbaee5');
assert.equal(report.releaseHold,true);assert.equal(report.publicationEligible,0);assert.equal(report.canonicalPromotion,false);
assert.deepEqual(report.catalogIds,[282,283]);
for(const [name,expected] of Object.entries(report.sourceHashes)){
 assert(/^(src|tests|scripts|docs)\//.test(name)&&name.split('/').every(v=>v&&v!=='.'&&v!=='..')&&!name.includes('\\'));
 const actual=crypto.createHash('sha256').update(fs.readFileSync(name)).digest('hex');assert.equal(actual,expected,'Source revision mismatch: '+name);
}
console.log(JSON.stringify({catalogIds:report.catalogIds,sourceBindings:Object.keys(report.sourceHashes).length,publicationEligible:0,releaseHold:true}));
