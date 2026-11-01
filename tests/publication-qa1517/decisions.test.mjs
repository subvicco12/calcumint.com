import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {validateQaRows,resolvePointer,repositoryEvidencePath} from '../../scripts/publication-qa1517/decisions.mjs';
const source=JSON.parse(readFileSync('docs/publication-qa1517/input/qa-evidence-disposition-1207.json','utf8')).rows,cohort=JSON.parse(readFileSync('docs/publication-factory/cohort-76.json','utf8'));
const fresh=()=>structuredClone(source);
test('all1207 exact pending requests retain original decisions and gaps',()=>validateQaRows(fresh(),cohort,source));
test('rejects tuple substitution, removal, fabricated approval and N/A',()=>{
 for(const mutate of [r=>r.pop(),r=>{r[1]=r[0];},r=>{r[0].engineId='invented';},r=>{r[0].version++;},r=>{r[0].qaStatus='PASS';},r=>{r[0].fullCriterionEvidenceSufficient=true;},r=>{r[0].reviewer='invented';},r=>{r[0].gaps=[];},r=>{r.find(q=>q.checkType==='reverse-solve').disposition='N/A';}]){const rows=fresh();mutate(rows);assert.throws(()=>validateQaRows(rows,cohort,source));}
});
test('source pointers resolve exact own fields and reject prototype, escaped substitution and missing indexes',()=>{
 const value={rows:[{masterId:3}],a:{'b/c':1}};assert.equal(resolvePointer(value,'/rows/0/masterId'),3);assert.equal(resolvePointer(value,'/a/b~1c'),1);
 for(const p of ['/rows/01/masterId','/rows/1/masterId','/rows/0/constructor','/a/b~2c','/toString'])assert.throws(()=>resolvePointer(value,p));
});

test('source metadata cannot select files outside repository evidence roots',()=>{assert.equal(repositoryEvidencePath('docs/publication-factory/browser.json'),'docs/publication-factory/browser.json');for(const path of ['../../.env','docs/../../.env','/etc/passwd','docs/../secrets','src\\..\\secrets','docs//x'])assert.throws(()=>repositoryEvidencePath(path));});
