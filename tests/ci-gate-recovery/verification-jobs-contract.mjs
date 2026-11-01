import assert from 'node:assert/strict';
export const protectedVerificationJobs=Object.freeze(['checks','build','full-product','source-acceptance','publication-factory']);
/** Parse the repository's explicitly supported workflow shape; unknown syntax fails closed. */
export function workflowJobs(source){
 const root=source.split('\njobs:\n');assert.equal(root.length,2,'Exactly one jobs mapping required');
 const matches=[...root[1].matchAll(/^  ([A-Za-z_][A-Za-z0-9_-]*):\n([\s\S]*?)(?=^  [A-Za-z_][A-Za-z0-9_-]*:\n|$(?![\s\S]))/gm)];
 assert.equal([...root[1].matchAll(/^  [^\s#][^\n]*:/gm)].length,matches.length,'Unsupported job declaration syntax');
 assert.equal(new Set(matches.map(m=>m[1])).size,matches.length,'Duplicate workflow job');
 return Object.fromEntries(matches.map(m=>[m[1],m[2]]));
}
export function requiredVerificationJobs(source){
 const jobs=workflowJobs(source);assert(jobs.validate,'Required aggregate missing');
 const match=jobs.validate.match(/^    needs: \[([^\]]+)\]$/m);assert(match,'Explicit supported aggregate dependency list required');
 const names=match[1].split(',').map(n=>n.trim());assert.equal(new Set(names).size,names.length,'Duplicate aggregate dependency');
 for(const name of protectedVerificationJobs)assert(names.includes(name),'Protected verification job missing: '+name);
 assert.deepEqual([...names].sort(),Object.keys(jobs).filter(n=>n!=='validate').sort(),'Every verification job must gate validate');
 return names;
}
export function aggregateVerificationContract(source){
 const jobs=workflowJobs(source),names=requiredVerificationJobs(source),gate=jobs.validate;
 assert.match(gate,/^    if: \$\{\{ always\(\) \}\}$/m);
 const bindings=[...gate.matchAll(/^          ([A-Z_][A-Z0-9_]*): \$\{\{ needs\.([A-Za-z_][A-Za-z0-9_-]*)\.result \}\}$/gm)].map(m=>({variable:m[1],job:m[2]}));
 assert.equal(new Set(bindings.map(b=>b.variable)).size,names.length);assert.deepEqual(bindings.map(b=>b.job).sort(),[...names].sort());
 const block=gate.match(/^        run: \|\n([\s\S]*)$/m);assert(block,'Required aggregate shell missing');
 const lines=block[1].split('\n').filter(Boolean);const variables=lines.map(line=>{const match=line.match(/^          test "\$([A-Z_][A-Z0-9_]*)" = success$/);assert(match,'Aggregate must remain an exact conjunction of success guards');return match[1];});
 assert.deepEqual(variables.sort(),bindings.map(b=>b.variable).sort(),'Every job requires exactly one success guard');
 return {names,bindings,script:lines.map(line=>line.slice(10)).join('\n')};
}
