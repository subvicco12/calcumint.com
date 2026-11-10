/** Literal authority is populated only after separate source-object review. */
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const fixed=Object.freeze([]);
const captureSHA256='UNREVIEWED';
export function verifyFixedR4Anchor(capture,read,git){
 assert(fixed.length>0,'Reviewed R4 source authority is not installed');
 assert.equal(createHash('sha256').update(JSON.stringify(capture)).digest('hex'),captureSHA256,'Fixed R4 capture differs');
 for(const path of ['tests/publication-workflows-20261109/current-source-evolution.mjs','tests/publication-workflows-20261109/accepted-current-source-guard.mjs','tests/first-five-20261109/accepted-evolution-guard.mjs'])assert(read(path).equals(git(['show','1ec63cd11626df15063546c7e5bfedecec33f6ee:'+path])),'Historical fixed source anchor changed; Independent current target bytes differ: '+path);
 for(const row of fixed){assert.equal(git(['rev-parse','--verify',row.ref+'^{commit}']).toString().trim(),row.ref);assert.equal(git(['rev-parse',row.ref+':'+row.path]).toString().trim(),row.blob);const bytes=git(['cat-file','blob',row.blob]);assert.equal(createHash('sha256').update(bytes).digest('hex'),row.sha256);assert(read(row.path).equals(bytes),'Fixed next caller target bytes differ; Independent current target bytes differ: '+row.path);}
 return true;
}
