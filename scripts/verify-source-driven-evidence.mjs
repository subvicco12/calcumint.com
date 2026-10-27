/** Offline Windows/Node equivalent of the preserved Python verifier.
 * Reads the pinned archive in memory; never extracts or executes its contents. */
import {readFileSync} from 'node:fs';
import {inflateRawSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const pinned='80226cfdf3d9bd2a5aba4d6e8ff4a49077d61533b20c459f0d54b3bba51797d5';
function crc32(bytes){let crc=0xffffffff;for(const b of bytes){crc^=b;for(let i=0;i<8;i++)crc=(crc>>>1)^((crc&1)?0xedb88320:0);}return (crc^0xffffffff)>>>0;}
// zipfile-created, bounded ZIP32 archive; central metadata gives authoritative
// compressed sizes even for entries using a local data descriptor.
function entries(bytes){
 let end=bytes.length-22;
 while(end>=Math.max(0,bytes.length-65557)&&bytes.readUInt32LE(end)!==0x06054b50)end--;
 assert(end>=0,'ZIP end record');
 assert.equal(bytes.readUInt16LE(end+4),0);assert.equal(bytes.readUInt16LE(end+6),0);
 const count=bytes.readUInt16LE(end+10);assert.equal(bytes.readUInt16LE(end+8),count);
 assert.equal(end+22+bytes.readUInt16LE(end+20),bytes.length);
 const centralEnd=bytes.readUInt32LE(end+16)+bytes.readUInt32LE(end+12);assert.equal(centralEnd,end);
 let offset=bytes.readUInt32LE(end+16),total=0;const result=new Map();
 for(let i=0;i<count;i++){
  assert.equal(bytes.readUInt32LE(offset),0x02014b50);
  const flags=bytes.readUInt16LE(offset+8),method=bytes.readUInt16LE(offset+10),crc=bytes.readUInt32LE(offset+16),compressed=bytes.readUInt32LE(offset+20),size=bytes.readUInt32LE(offset+24);
  const nameLength=bytes.readUInt16LE(offset+28),extra=bytes.readUInt16LE(offset+30),comment=bytes.readUInt16LE(offset+32),local=bytes.readUInt32LE(offset+42);
  const name=bytes.subarray(offset+46,offset+46+nameLength).toString('utf8');
  assert(name&&!name.startsWith('/')&&!name.includes('\\')&&!name.split('/').includes('..')&&!/^[A-Za-z]:/.test(name),'Unsafe archive name');
  assert(!result.has(name),'Duplicate archive entry');assert.equal(flags&1,0,'Encrypted entry');assert([0,8].includes(method),'Unsupported compression');
  total+=size;assert(total<16*1024*1024,'Archive size limit');
  assert.equal(bytes.readUInt32LE(local),0x04034b50);
  const start=local+30+bytes.readUInt16LE(local+26)+bytes.readUInt16LE(local+28);assert(start+compressed<=bytes.readUInt32LE(end+16));
  const raw=bytes.subarray(start,start+compressed),body=method===0?raw:inflateRawSync(raw,{maxOutputLength:16*1024*1024});
  assert.equal(body.length,size,'Entry size');assert.equal(crc32(body),crc,'CRC mismatch');result.set(name,body);
  offset+=46+nameLength+extra+comment;
 }
 assert.equal(offset,centralEnd);return result;
}
// Python json.dumps(sort_keys=True, ensure_ascii=False) separator convention.
function pythonJson(value){if(Array.isArray(value))return '['+value.map(pythonJson).join(', ')+']';if(value&&typeof value==='object')return '{'+Object.keys(value).sort().map(k=>JSON.stringify(k)+': '+pythonJson(value[k])).join(', ')+'}';return JSON.stringify(value);}
export function verifySourceDrivenEvidence(bytes=readFileSync(new URL('../data/catalog/source-driven-2026-10-27/input-package.zip',import.meta.url))){
 assert.equal(hash(bytes),pinned,'Input archive checksum mismatch');const files=entries(bytes);
 const read=name=>{assert(files.has(name),`Missing ${name}`);return JSON.parse(files.get(name).toString('utf8'));};
 const manifests=['MANIFEST-SHA256.json','input-evidence/MANIFEST-SHA256.json'].map((name,index)=>{const m=read(name);for(const [path,digest] of Object.entries(m)){const entry=(index?'input-evidence/':'')+path;assert(files.has(entry),`Missing ${entry}`);assert.equal(hash(files.get(entry)),digest,entry);}return m;});
 assert.deepEqual(Object.keys(manifests[0]).sort(),[...files.keys()].filter(n=>n!=='MANIFEST-SHA256.json').sort());
 const rows=read('methodology-decision-register-50.json').rows,ids=rows.map(r=>r.masterId);
 assert.equal(ids.length,50);assert.equal(new Set(ids).size,50);assert.deepEqual(read('codex-tasks-50.json').rows.map(r=>r.masterId),ids);
 assert(rows.every(r=>r.approval==='PENDING'&&!r.scopeAdopted&&!r.actualEngineAcceptance&&!r.evidenceComplete));
 const missing=read('missing-source-cases-9.json'),retained=read('retained-qualified-cases-11.json').rows;
 const cohorts=[ids,missing.map(r=>r.masterId),retained.map(r=>r.masterId)];assert.deepEqual(cohorts.map(c=>new Set(c).size),[50,9,11]);
 const all=new Set(cohorts.flat());assert.equal(all.size,70);assert.deepEqual([...all].sort((a,b)=>a-b),read('input-evidence/baseline-readiness-register.json').rows.map(r=>r.masterId).sort((a,b)=>a-b));
 const matrix=read('input-evidence/source-verification-matrix.json').rows;
 for(const row of matrix)assert.equal(hash(pythonJson(row.observationRecord)),row.observationRecordSHA256,`Observation ${row.sourceOrdinal}`);
 return {ids,cases:rows.length,rootManifestEntries:Object.keys(manifests[0]).length,nestedManifestEntries:Object.keys(manifests[1]).length,sourceObservations:matrix.length,readableSourceObservations:matrix.filter(r=>r.substantiveRelevantContentVerified).length,retainedQualifiedCases:retained.length,missingSourceCases:missing.length};
}
if(process.argv[1]===fileURLToPath(import.meta.url))console.log(JSON.stringify(verifySourceDrivenEvidence()));
