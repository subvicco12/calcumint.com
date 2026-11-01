// Offline registry inspection only: no remote client, publication or mutation API.
import {createServer} from 'vite';
import {readFile,writeFile,mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
const cacheDir=await mkdtemp(path.join(tmpdir(),'calcumint-publication-'));
const server=await createServer({configFile:false,envFile:false,root:process.cwd(),cacheDir,resolve:{alias:{'@':path.join(process.cwd(),'src')}},server:{watch:null}});
try{
 const {calculatorRegistry}=await server.ssrLoadModule('/src/calculators/registry.ts');
 const {getCertificationCandidateContent}=await server.ssrLoadModule('/src/calculators/public-content.ts');
 const {auditLaunchCertificationDefinitions}=await server.ssrLoadModule('/src/calculators/launch-certification.ts');
 const rows=calculatorRegistry.list().map(d=>{
  const content=getCertificationCandidateContent(d.slug);
  return {engineId:d.id,slug:d.slug,version:d.version,title:d.title,category:d.category,reviewStatus:d.reviewStatus,riskClass:d.riskClass,route:content?`/calculators/${content.category}/${content.slug}`:null,formulas:d.formulas,sources:d.sources,exampleCount:d.examples.length,goldenCount:d.goldenTests?.length??0,certificationSoftwareIssues:d.reviewStatus==='certified'?auditLaunchCertificationDefinitions([d],getCertificationCandidateContent).map(i=>i.reason):['Not certified; software audit is not certification authority']};
 });
 const file='docs/calculator-first/registry-snapshot.json',text=JSON.stringify({scope:'Offline current candidate; not deployed build or canonical mapping approval',rows},null,2)+'\n';
 if(process.argv.includes('--check')){if(await readFile(file,'utf8')!==text)throw Error('Registry identity, version or software certification evidence differs');}else await writeFile(file,text);console.log(rows.length+' immutable current registry bindings inspected');
}finally{await server.close();await rm(cacheDir,{recursive:true,force:true});}
