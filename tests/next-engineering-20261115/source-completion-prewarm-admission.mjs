/** Exact immutable-availability wrapper compatibility only; no graph or verifier bytes are otherwise projected. */
import assert from 'node:assert/strict';
const reviewed="/** Availability only through already-supplied immutable capabilities; opaque transports retain original queries. */\nexport function verifyCompletionBinding(name,bytes,claim,git,read=readFileSync){\n const b=bindings.find(row=>row.path===name);\n if(b&&claim===b.predecessorSHA256){\n  const records=[...(b.supplementalSources??[]),...(b.intermediateSources??[]).map(row=>({...row,path:name})),...['predecessor','successor'].map(stage=>({ref:b[stage+'Ref'],path:name,blob:b[stage+'Blob']}))];\n  if(typeof git.preloadCommits==='function')git.preloadCommits([...new Set(records.map(row=>row.ref))]);\n  if(typeof git.preloadPaths==='function')git.preloadPaths(records.map(({ref,path,blob})=>({ref,path,blob})));\n  if(typeof git.preloadBlobs==='function')git.preloadBlobs([...new Set(records.map(row=>row.blob))]);\n }\n return retainedVerifyCompletionBinding(name,bytes,claim,git,read);\n}\nfunction retainedVerifyCompletionBinding(name,bytes,claim,git,read=readFileSync){",original='export function verifyCompletionBinding(name,bytes,claim,git,read=readFileSync){';
export function retainedCompletionExecutable(source){
 assert.equal(typeof source,'string');
 if(!source.includes('function retainedVerifyCompletionBinding('))return source;
 assert.equal(source.split(reviewed).length,2,'Only the exact reviewed immutable availability wrapper may extend the executable graph');
 return source.replace(reviewed,original);
}
