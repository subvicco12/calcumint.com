/** Historical receipts retain their exact byte claims; current successors prove separately. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const prior='1ec63cd11626df15063546c7e5bfedecec33f6ee';
// Populated only by independently reviewed final frozen-app source records.
const sources=Object.freeze([]);
const currentContext=Object.freeze([]);
const immutableObjects=new WeakMap();
const hash=b=>createHash('sha256').update(b).digest('hex');
const git=args=>execFileSync('git',args,{stdio:['ignore','pipe','pipe'],maxBuffer:8*1024*1024});
export function verifyCurrentRuntimeContext(read=readFileSync,sourceGit=git){
 assert(currentContext.length>0,'Missing reviewed current runtime context');
 const head=sourceGit(['rev-parse','--verify','HEAD^{commit}']).toString().trim();assert.match(head,/^[a-f0-9]{40}$/);
 let objects=immutableObjects.get(sourceGit);if(!objects){objects=new Map();immutableObjects.set(sourceGit,objects);}
 const immutable=args=>{const key=JSON.stringify(args);if(!objects.has(key))objects.set(key,sourceGit(args));return objects.get(key);};
 for(const row of currentContext){assert.equal(immutable(['rev-parse',head+':'+row.path]).toString().trim(),row.blob,'Retained evidence current context object differs: '+row.path);const blob=immutable(['cat-file','blob',row.blob]);assert.equal(hash(blob),row.sha256,'Retained evidence current context Git bytes differ: '+row.path);assert(read(row.path).equals(blob),'Retained evidence current context target differs: '+row.path);}
}
export function retainedRuntimeBytes(path,read=readFileSync,sourceGit=git){
 const row=sources.find(source=>source.path===path);
 if(!row)return read(path);
 verifyCurrentRuntimeContext(read,sourceGit);
 const current=read(path);
 assert.equal(sourceGit(['rev-parse','HEAD:'+path]).toString().trim(),row.currentBlob,'Retained evidence current HEAD object differs: '+path);
 const blob=sourceGit(['cat-file','blob',row.currentBlob]);assert.equal(hash(blob),row.currentSHA256,'Retained evidence current Git bytes differ: '+path);
 assert(current.equals(blob),'Retained evidence current target bytes differ: '+path);
 const predecessor=sourceGit(['show',prior+':'+path]);assert.equal(hash(predecessor),row.priorSHA256,'Retained evidence predecessor bytes differ: '+path);
 return predecessor;
}
export function readRuntimeEvidenceFile(path,encoding){const bytes=retainedRuntimeBytes(path);return encoding===undefined?bytes:bytes.toString(encoding);}
