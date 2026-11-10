/** Independent literal pin for installed R4 authority, never chosen by candidate data. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
export const reviewedSourceCommit='UNREVIEWED';
const accepted=Object.freeze([]);
const sourceGit=args=>execFileSync('git',args,{stdio:['ignore','pipe','pipe'],maxBuffer:8*1024*1024});
export function verifyAcceptedR4Authority(read=readFileSync,git=sourceGit){
 assert(accepted.length>0,'Independent reviewed R4 authority is not installed');
 const head=git(['rev-parse','--verify','HEAD^{commit}']).toString().trim();assert.match(head,/^[a-f0-9]{40}$/,'Independent R4 authority provenance differs');
 for(const record of accepted){assert.equal(git(['rev-parse',head+':'+record.path]).toString().trim(),record.blob,'Independent R4 authority object differs');const bytes=git(['cat-file','blob',record.blob]);assert.equal(createHash('sha256').update(bytes).digest('hex'),record.sha256,'Independent R4 authority Git bytes differ');assert(read(record.path).equals(bytes),'Fixed next caller target bytes differ; Independent current target bytes differ: '+record.path);}
 return true;
}
