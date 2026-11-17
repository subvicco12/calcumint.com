import assert from 'node:assert/strict';
import {readFile,mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {build} from 'esbuild';
import {newIdentities,shapeFields} from './business-identities.mjs';
import {digest} from './business-sql-generate.mjs';
export const engineSources=['src/calculators/statistics/catalog-batch-1.ts','src/calculators/statistics/catalog-batch-2.ts','src/calculators/statistics/catalog-batch-3.ts','src/calculators/statistics/catalog-batch-4.ts','src/calculators/chemistry/catalog-batch-1.ts'];
export async function loadCases(){
 const dir=await mkdtemp(path.join(tmpdir(),'next-business-engines-'));
 try{
  const result=await build({stdin:{contents:engineSources.map((file,i)=>`export * as m${i} from ${JSON.stringify(path.resolve(file))};`).join('\n'),resolveDir:process.cwd(),loader:'ts'},outfile:path.join(dir,'engines.mjs'),bundle:true,platform:'node',format:'esm',metafile:true,logLevel:'silent'});
  const modules=await import(pathToFileURL(path.join(dir,'engines.mjs'))),engines=Object.values(modules).flatMap(m=>Object.values(m)).filter(x=>x&&typeof x==='object'&&!Array.isArray(x)&&typeof x.calculate==='function');
  const cases=newIdentities.map(tuple=>{const engine=engines.find(x=>x.id===tuple.engineId);assert(engine);assert.equal(engine.slug,tuple.slug);assert.equal(engine.version,tuple.version);const input=engine.inputSchema.parse(engine.examples[0].input),output=engine.calculate(input,{});assert.deepEqual(Object.keys(output).sort(),[...shapeFields[tuple.slug]].sort());for(const [k,v]of Object.entries(output))assert(k==='steps'?Array.isArray(v)&&v.every(s=>typeof s==='string'):typeof v==='number'&&Number.isFinite(v));return {...tuple,input,output};});
  const sourceHashes={};for(const file of Object.keys(result.metafile.inputs).filter(f=>f.startsWith('src/')))sourceHashes[file]=digest(await readFile(file));
  return {cases,sourceHashes};
 }finally{await rm(dir,{recursive:true,force:true});}
}
