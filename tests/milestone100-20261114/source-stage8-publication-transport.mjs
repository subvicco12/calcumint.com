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
 const membership=" if(JSON.stringify(Object.keys(m.sourceHashes??{}).sort())!==JSON.stringify(expectedPaths))throw Error('Caller source binding membership differs');\n";
 assert.equal(previous.split(membership).length,2,'Exactly the literal source membership check is required');
 const preflight=" // Reject unsafe declared source paths before deeper successor dependencies are read.\n // This preflight grants no source/hash admission; every original proof still follows.\n for(const name of [...expectedPaths,frequencyPresentationSupplementalPath,n1PublicationSupplementalPath])safe(directory,name);\n";
 return "import {completionGitReader} from '../tests/parallel-source-20261110/git-reader.mjs';\n"+previous.replace(before,after).replace(membership,membership+preflight);
}
export function publicationTransportArgumentBytes(git){
 const old=guardSuccessors.find(row=>row.path===publicationTransportPath);assert(old);
 assert.equal(git(['rev-parse','--verify',old.ref+'^{commit}']).toString().trim(),old.ref);assert.equal(git(['rev-parse',old.ref+':'+old.path]).toString().trim(),old.blob);
 const bytes=git(['cat-file','blob',old.blob]);assert.equal(bytes.length,old.bytes);assert.equal(sha(bytes),old.sha256);
 return Buffer.from(expectedPublicationTransport(bytes.toString()));
}
/** Caller must first prove the complete current source and independent authority. */
export function provePublicationTransportSuccessor(git,read){
 const expected=publicationTransportArgumentBytes(git),capture=JSON.parse(read('docs/parallel-source-20261110/capture-revision78.json'));assert(capture.sourceStage8V11.guardPaths.includes(publicationTransportPath));
 const row=capture.currentSources.find(row=>row.path===publicationTransportPath);assert(row);assert.equal(row.ref,capture.sourceStage8V11.guardRef);
 assert.equal(git(['rev-parse','--verify',row.ref+'^{commit}']).toString().trim(),row.ref);assert.equal(git(['rev-parse',row.ref+':'+row.path]).toString().trim(),row.blob);assert.equal(git(['rev-parse','HEAD:'+row.path]).toString().trim(),row.blob);
 const current=git(['cat-file','blob',row.blob]);assert.equal(current.length,row.bytes);assert.equal(sha(current),row.sha256);assert(current.equals(expected),'Only the exact transport and negative path preflight may change');assert(read(row.path).equals(current),'Completion supplemental source bytes differ: '+row.path);return current;
}
