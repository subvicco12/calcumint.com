/** One explicitly reviewed retained claim: F042 bytes equal the exact Stage8 predecessor. */
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const path='src/components/saved-calculation-actions.tsx';
const historical={path,ref:'f042748d08caa4f51c19b7cf6fc675a3a1fb5dd5',blob:'160bbac3e8e9522f0615036f36714ba3ca2f83f6',bytes:5325,sha256:'eb10109b0dfc8a73b0ed4043d35da898cd11a3eace9e711755d8de5179928529'};
export const savedActionsClaim=Object.freeze({path,historical:Object.freeze(historical),predecessor:Object.freeze({...historical,ref:'eac9a6c23ae4d8f1abb607e32f57ce0d422a3cb8'}),current:Object.freeze({path,ref:'b1dccffe1cc9e0515030d5e7ea4bad8a72756080',blob:'6ed37e10bc37e802ccc2aaf03a7a9b8e9af8eb52',bytes:5333,sha256:'c93c78822427b99490cec057f0b62abd2c22a55b03f56ef38682c15caedbd994'})});
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
function immutable(record,git){
 assert.equal(git(['rev-parse','--verify',record.ref+'^{commit}']).toString().trim(),record.ref,'Exact retained source commit required');
 assert.equal(git(['rev-parse',record.ref+':'+record.path]).toString().trim(),record.blob,'Exact retained source object required');
 const bytes=git(['cat-file','blob',record.blob]);assert(Buffer.isBuffer(bytes));assert.equal(bytes.length,record.bytes);assert.equal(sha(bytes),record.sha256);return bytes;
}
export function proveSavedActionsClaim({file,recordedSHA256,row,currentBytes,git}){
 assert.equal(file,savedActionsClaim.path,'Only the exact reviewed saved-actions claim may extend an unchanged F042 path');
 assert.equal(recordedSHA256,savedActionsClaim.historical.sha256,'Exact original F042 source claim required');
 assert(row?.predecessor,'Added source has no retained predecessor claim');
 assert.deepEqual(row.predecessor,savedActionsClaim.predecessor,'Exact eac9 predecessor required');
 assert.deepEqual(row.current,savedActionsClaim.current,'Exact reviewed current source required');
 const original=immutable(savedActionsClaim.historical,git),previous=immutable(savedActionsClaim.predecessor,git),current=immutable(savedActionsClaim.current,git);
 assert(original.equals(previous),'F042 must join byte-identically to the exact eac9 predecessor');
 assert(Buffer.isBuffer(currentBytes)&&currentBytes.equals(current),'Current named application successor differs');
 return true;
}

/** Receipt digest and historical chain digest are separate facts. */
export function savedActionsReceiptHistoricalClaim(binding,currentBytes){
 assert.equal(binding.path,savedActionsClaim.path,'Only the exact reviewed saved-actions receipt path');
 assert([savedActionsClaim.historical.sha256,savedActionsClaim.current.sha256].includes(binding.sha256),'Captured saved-actions historical/current claim differs');
 assert(Buffer.isBuffer(currentBytes)&&sha(currentBytes)===savedActionsClaim.current.sha256,'Captured source bytes differ: '+binding.path);
 return savedActionsClaim.historical.sha256;
}
