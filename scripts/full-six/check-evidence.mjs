import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const integrity=JSON.parse(fs.readFileSync('docs/full-six/package-integrity.json'));
const manifest=JSON.parse(fs.readFileSync('docs/full-six/input/MANIFEST-SHA256.json'));
for(const [name,hash] of Object.entries(integrity.retainedFiles)){
 assert(!name.startsWith('/')&&!name.includes('\\')&&name.split('/').every(p=>p&&p!=='.'&&p!=='..'),'Unsafe retained evidence path');
 const bytes=fs.readFileSync('docs/full-six/input/'+name);assert.equal(sha(bytes),hash,name);
 if(name!=='MANIFEST-SHA256.json'){
  const entries=manifest.files.filter(e=>e.path===name);assert.equal(entries.length,1,name);
  assert.equal(bytes.length,entries[0].bytes);assert.equal(hash,entries[0].sha256);
 }
}
const index=JSON.parse(fs.readFileSync('docs/full-six/input/contract-index.json'));
assert.deepEqual(index.contracts.map(c=>c.catalogId).sort((a,b)=>a-b),[235,251,275,276,282,283]);
for(const row of index.contracts)assert.equal(sha(fs.readFileSync('docs/full-six/input/'+row.file)),row.sha256);
const execution=JSON.parse(fs.readFileSync('docs/full-six/execution-manifest.json'));
assert.equal(execution.baseline,'7cdffeed3d5a8789689aa5495277e28b780227dc');
assert.equal(execution.releaseHold,true);assert.equal(execution.canonicalPromotion,false);assert.equal(execution.publicationEligible,0);
for(const [name,hash] of Object.entries(execution.sourceHashes)){
 assert(/^(src|tests|scripts)\//.test(name)&&!name.includes('\\')&&name.split('/').every(p=>p&&p!=='.'&&p!=='..'));
 assert.equal(sha(fs.readFileSync(name)),hash,'Source revision mismatch: '+name);
}
console.log(JSON.stringify({retainedFiles:Object.keys(integrity.retainedFiles).length,contracts:6,sourceBindings:Object.keys(execution.sourceHashes).length,publicationEligible:0}));
