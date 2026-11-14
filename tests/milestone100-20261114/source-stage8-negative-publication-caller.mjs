/** Negative-only fixed publication evidence checks; every positive still requires the original full proof. */
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
export const publicationCallerNegativeRecords=Object.freeze([{"path":"src/components/publication20-batch.tsx","ref":"f042748d08caa4f51c19b7cf6fc675a3a1fb5dd5","blob":"1a6bc1208d67a1815ed3f9dc6cda1ebdcaa6deda","bytes":4219,"sha256":"f0382de47a12962efdb3b744a655343f7282488fe31dfab695341acdfadad661","kind":"batch","historicalClaim":"6288b2ccdc4236c0c2c7b4e37cc7cbb52c94df8eb7b5aa8e1db9ad1f27c35ea9"},{"path":"src/lib/publication20/batch.ts","ref":"f042748d08caa4f51c19b7cf6fc675a3a1fb5dd5","blob":"1eda85cd91f6193dabf7f8c0316d7b3e10d1aa14","bytes":3987,"sha256":"2dd8637472e447fd72c070e02ba6220139f6ea40d9f489d24e3646b742c5357e","kind":"batch","historicalClaim":"2dd8637472e447fd72c070e02ba6220139f6ea40d9f489d24e3646b742c5357e"},{"path":"src/components/publication20-tool.tsx","ref":"f042748d08caa4f51c19b7cf6fc675a3a1fb5dd5","blob":"e04f45cf07ae73e801520bf975488d06c433e9ac","bytes":6371,"sha256":"8b33b466dbe902dfe2f16e580f78c11482d3a960165e3649c3a20033cd51cb02","kind":"supplemental"},{"path":"src/lib/frequency-presentation.ts","ref":"a7bab5b5534d51cea25ba5ffe4aa9b3630176909","blob":"b2be37990725e83dfbedce4ebc3dcef3b874677e","bytes":912,"sha256":"b9c0015f7a6ca30426c2963a10384c05cc99b3cd5d08dc1d1782af48ddfabb05","kind":"supplemental"}].map(Object.freeze));
export const publicationCallerHistoricalManifest=Object.freeze({"path":"docs/shortest-publication-20/caller-lineage.json","ref":"a955cdad7019a645b7ed2950299d0603ba1784a7","blob":"4c0126a413efa65c14bcd6131efd21b788252386","bytes":2632,"sha256":"33394a9c3274961e78fed448acec32f59d44e81cfdcb785a165b650a880753e1"});
export function rejectPublication20CallerEvidence(manifest,read){
 assert.equal(typeof read,'function','Explicit publication caller source reader required');
 for(const row of publicationCallerNegativeRecords){
  const bytes=read(row.path);if(!Buffer.isBuffer(bytes)||bytes.length!==row.bytes||hash(bytes)!==row.sha256)throw Error((row.kind==='batch'?'Caller source hash differs: ':'Completion supplemental source bytes differ: ')+row.path);
  if(row.kind==='batch'&&manifest?.sourceHashes?.[row.path]!==row.historicalClaim)throw Error('Caller historical claim differs: '+row.path);
 }
}
