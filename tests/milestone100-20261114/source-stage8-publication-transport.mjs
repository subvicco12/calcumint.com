/** One exact native Git transport successor; literal G2 guard policy is retained. */
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {guardSuccessors} from './source-stage8-guard-policy.mjs';
export const publicationTransportPath='scripts/publication20-caller-lineage.mjs';
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
export function expectedPublicationTransport(previous){
 const before="const git=args=>execFileSync('git',args,{cwd:directory,maxBuffer:8*1024*1024,stdio:['pipe','pipe','pipe']});";
 const after="const git=completionGitReader((args,options={})=>execFileSync('git',args,{cwd:directory,maxBuffer:8*1024*1024,stdio:['pipe','pipe','pipe'],...options}));";
 assert.equal(previous.split(before).length,2,'Exactly the literal G2 Git constructor is required');
 assert(!previous.includes("import {completionGitReader}"),'Transport import must be the single new import');
 return "import {completionGitReader} from '../tests/parallel-source-20261110/git-reader.mjs';\n"+previous.replace(before,after);
}
export function publicationTransportArgumentBytes(git){
 const old=guardSuccessors.find(row=>row.path===publicationTransportPath);assert(old);
 assert.equal(git(['rev-parse','--verify',old.ref+'^{commit}']).toString().trim(),old.ref);assert.equal(git(['rev-parse',old.ref+':'+old.path]).toString().trim(),old.blob);
 const bytes=git(['cat-file','blob',old.blob]);assert.equal(bytes.length,old.bytes);assert.equal(sha(bytes),old.sha256);
 return Buffer.from(expectedPublicationTransport(bytes.toString()));
}
/** Caller must first prove the complete current source and independent authority. */
export function provePublicationTransportSuccessor(git,read){
 const expected=publicationTransportArgumentBytes(git),capture=JSON.parse(read('docs/parallel-source-20261110/capture-revision77.json'));assert(capture.sourceStage8V10.guardPaths.includes(publicationTransportPath));
 const row=capture.currentSources.find(row=>row.path===publicationTransportPath);assert(row);assert.equal(row.ref,capture.sourceStage8V10.guardRef);
 assert.equal(git(['rev-parse','--verify',row.ref+'^{commit}']).toString().trim(),row.ref);assert.equal(git(['rev-parse',row.ref+':'+row.path]).toString().trim(),row.blob);assert.equal(git(['rev-parse','HEAD:'+row.path]).toString().trim(),row.blob);
 const current=git(['cat-file','blob',row.blob]);assert.equal(current.length,row.bytes);assert.equal(sha(current),row.sha256);assert(current.equals(expected),'Only the exact transport import and constructor may change');assert(read(row.path).equals(current),'Completion supplemental source bytes differ: '+row.path);return current;
}
