import assert from 'node:assert/strict';
import {readFile,writeFile,mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';
import {build} from 'esbuild';
const baseline='3ccdd6d026ca0ec51063ff4501901ac92e8ace6a',source='822743dd987bc2f07e52ab07a3c2ef4ab05f625f',root=process.cwd();
const digest=x=>createHash('sha256').update(x).digest('hex'),git=args=>execFileSync('git',args,{encoding:'utf8'}).trim();
const prior80=[208,209,210,211,212,213,215,216,218,219,220,221,223,224,225,227,228,229,230,231,255,256,259,260,261,262,263,264,265,266,267,269,270,271,272,273,274,275,278,279,280,328,331,332,368,369,370,371,372,373,374,375,376,377,378,379,380,381,382,383,384,385,386,387,423,424,425,427,428,429,430,431,432,433,434,436,437,438,439,440];
assert.equal(new Set(prior80).size,80);
const ledgerPath='docs/milestone100-20261114/requirements-540.json',ledger=JSON.parse(await readFile(ledgerPath));
const blocked=ledger.rows.filter(r=>r.canonicalDisposition==='IDENTITY_OR_SCOPE_BLOCKED').map(r=>r.masterId);assert.equal(blocked.length,43);
const scratch=await mkdtemp(path.join(tmpdir(),'next-engineering-inventory-'));
try{
 const bundle=path.join(scratch,'inventory.mjs');
 await build({stdin:{contents:"import {nextEngineeringContracts} from './src/lib/calculator-factory/completion/next-engineering';import {getFactoryWorkflows} from './src/lib/calculator-factory/registry';export const rows=nextEngineeringContracts.map(({execute,verifyHistorical,...row})=>({...row,sourceVersion:getFactoryWorkflows(row.catalogId).identity.sourceVersion}));",resolveDir:root,sourcefile:'engineering-inventory.ts',loader:'ts'},outfile:bundle,bundle:true,platform:'node',format:'esm',alias:{'@':path.join(root,'src')},logLevel:'silent'});
 const {rows}=await import(pathToFileURL(bundle));assert.equal(rows.length,20);
 const paths=git(['diff','--name-only',baseline,source,'--','src']).split('\n');
 const sourceFiles=[];for(const p of paths){const bytes=await readFile(p);const blob=git(['rev-parse',source+':'+p]);assert.equal(git(['hash-object',p]),blob);sourceFiles.push({path:p,blob,bytes:bytes.length,sha256:digest(bytes)});}
 const sharedFiles=paths.filter(p=>!/^src\/lib\/calculator-factory\/completion\/next-engineering-(statistics|chemistry)-[ab]/.test(p));
 const dispositions=[];
 for(const row of rows){
  assert(![...prior80,226,322,323,324,325,327,...blocked].includes(row.catalogId));assert.equal(row.version,1);assert.equal(row.registered,true);
  const master=ledger.rows.find(r=>r.masterId===row.catalogId);assert(master);assert.equal(master.title,row.title);
  const family=row.catalogId>=329?'chemistry-'+(row.catalogId>=338?'b':'a'):'statistics-'+(row.catalogId>=289?'b':'a');
  const enginePath=row.catalogId>=329?'src/calculators/chemistry/catalog-batch-1.ts':`src/calculators/statistics/catalog-batch-${row.catalogId===284?1:row.catalogId<=288?2:row.catalogId<=291?3:4}.ts`;
  const engineBlob=git(['rev-parse',baseline+':'+enginePath]);assert.equal(git(['hash-object',enginePath]),engineBlob);
  const localEvidence=[];for(const ref of row.sourceEvidence.filter(p=>!/^https?:/.test(p))){const p=ref.split('#')[0],bytes=await readFile(p);localEvidence.push({reference:ref,path:p,bytes:bytes.length,sha256:digest(bytes)});}
  dispositions.push({catalogId:row.catalogId,title:row.title,identity:{engineId:row.engineId,slug:row.slug,version:row.version,sourceVersion:row.sourceVersion},engineBinding:{baseline,path:enginePath,blob:engineBlob,sha256:digest(await readFile(enginePath)),unchanged:true},ledgerBinding:{path:ledgerPath,masterId:master.masterId,canonicalDisposition:master.canonicalDisposition,rowSha256:digest(JSON.stringify(master))},scope:row.scope,primaryKey:row.primaryKey,unit:row.unit,sourceEvidence:row.sourceEvidence,localEvidence,files:[...sharedFiles,`src/lib/calculator-factory/completion/next-engineering-${family}.ts`,`src/lib/calculator-factory/completion/next-engineering-${family}.test.ts`],...([285,286,291].includes(row.catalogId)?{numericalEvidence:{spec:'docs/next-engineering-20261115/statistics-b/numerical/SPEC.json',results:'docs/next-engineering-20261115/statistics-b/numerical/RESULTS.json',hashes:'docs/next-engineering-20261115/statistics-b/numerical/HASHES.json',status:'PASS_EMPIRICAL_DECLARED_SCOPE_NOT_FORMAL_ACCURACY_CERTIFICATION',scopeLimitation:row.catalogId===291?'Finite grid and transformed-case evidence; no continuous-domain error proof.':'Uses the immutable rounded critical table; no ideal-quantile coverage or minimal-sample guarantee.'}}:{}),receipts:{focused:'docs/next-engineering-20261115/validation/frozen-source-focused.log',business:'docs/next-engineering-20261115/business/integrated-receipt.json',lane:`docs/next-engineering-20261115/${family}/`},disposition:'IMPLEMENTED_SCOPED_ENGINEERING_PENDING_EXACT_HEAD_SOURCE_AND_CI_QUALIFICATION',canonicalAccepted:false,certified:false,publicationEligible:false,limitations:row.catalogId===291?['Immutable erf approximation; coefficient provenance and global error bound remain unqualified.']:[]});
 }
 await writeFile('docs/next-engineering-20261115/candidate-dispositions.json',JSON.stringify({kind:'EXACT20_SCOPED_ENGINEERING_HANDOFF_NOT_CANONICAL_ACCEPTANCE',baseline,sourceCommit:source,unchangedCalculatorImplementationSource:'550ae67dfdf8fcfa8fb0ac68ccbe2ac68e13fb0f',additionalSourceChange:'Whole89-tuple roster regression test; mathematical and delivery implementations unchanged',baselineConfirmedOverlay:80,newConfirmed:0,potentialOverlay:100,releaseHold:true,prior80,excludedAuthority43:blocked,selectedIds:rows.map(r=>r.catalogId),sourceFiles,rows:dispositions},null,2)+'\n');
 console.log(JSON.stringify({selected:rows.length,sourceFiles:sourceFiles.length,disjointFromPrior80AndExcluded:true,immutableEngineBindingsVerified:true,releaseHold:true}));
}finally{await rm(scratch,{recursive:true,force:true});}
