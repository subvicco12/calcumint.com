import {afterEach,describe,it,expect} from 'vitest';
import {execFileSync,spawnSync} from 'node:child_process';
import {mkdtempSync,mkdirSync,writeFileSync,readFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {calculateCandidate,createCandidateSnapshot,replayCandidateSnapshot} from './workflow';
import {createStatisticsPdfReport} from './statistics-pdf-report';
const dirs:string[]=[];
afterEach(()=>{for(const path of dirs.splice(0))rmSync(path,{recursive:true,force:true});});
const input={dataset:{mode:'sample',encoding:'frequency',rows:[{value:'-1.000',frequency:'02'},{value:'3',frequency:'1'}],unit:'μm²',missingPolicy:'reject'},bins:3} as const;
const population={dataset:{mode:'population',encoding:'raw',rows:[{value:'1000000000000'},{value:'1000000000000.000000000000000001'}],unit:'m'},bins:3};
const target={dataset:{mode:'sample',encoding:'frequency',missingPolicy:'omit',rows:[{value:null,frequency:'1'},{value:'7',frequency:'0'},{value:'1',frequency:'1'},{value:'2',frequency:'1'},{value:'3',frequency:'1'}]},analysis:{kind:'target-scale',metric:'variance',target:'2',shift:'0'}};
// Optional real artifacts for shell/browser inspection when the test sandbox
// disallows child processes. Normal tests need no generated repository files.
function evidence(name:string,bytes:Uint8Array){const path=process.env.STATISTICS_PDF_EVIDENCE_DIR;if(path){mkdirSync(path,{recursive:true});writeFileSync(join(path,name+'.pdf'),bytes);}}
function literalText(bytes:Uint8Array){const raw=new TextDecoder().decode(bytes);return raw+Array.from(raw.matchAll(/\(((?:\\.|[^\\)])*)\)\s*Tj/g),m=>m[1].replace(/\\([\\()])/g,'$1')).join('');}
const popplerAvailable=['pdftotext','pdfinfo','pdffonts','pdftoppm'].every(command=>!spawnSync(command,['-v']).error);
function readPdf(bytes:Uint8Array){
 const dir=mkdtempSync(join(tmpdir(),'statistics-pdf-'));dirs.push(dir);const file=join(dir,'report.pdf');writeFileSync(file,bytes);
 return {file,text:execFileSync('pdftotext',['-layout',file,'-'],{encoding:'utf8'}),info:execFileSync('pdfinfo',[file],{encoding:'utf8'})};
}
describe('verified private statistics PDF with shared production writer',()=>{
 it('serializes exact sample/frequency goldens, bound provenance and complete tagged tables',async()=>{
  const artifact=calculateCandidate(283,input),snapshot=await createCandidateSnapshot(artifact),bytes=await createStatisticsPdfReport(artifact);evidence('sample-frequency',bytes);
  expect(await createStatisticsPdfReport(artifact)).toEqual(bytes);
  const raw=literalText(bytes);
  for(const expected of ['PRIVATE EXPERIMENTAL STATISTICS','All stored observations','PDF/UA conformance: UNVERIFIED','5.3333333333333333333333333333333333333333333333333','32/9','1/3','-1.000','02',snapshot.sha256,artifact.contractSHA256,artifact.implementationRevision,'/StructTreeRoot','/FontFile2','/ToUnicode','/S /TH','/S /TD'])expect(raw.includes(expected),expected).toBe(true);
 });
 it('preserves population sub-Number raw input differences and the final contribution',async()=>{
  const bytes=await createStatisticsPdfReport(calculateCandidate(282,population));evidence('population-precision',bytes);const raw=literalText(bytes);
  for(const expected of ['1000000000000.000000000000000001','2.5e-37','5e-19','["contributions"][1]["weightedSquaredDeviation"]'])expect(raw.includes(expected),expected).toBe(true);
 });
 it('retains missing and zero-frequency dispositions and full authoritative target transform/residuals',async()=>{
  const bytes=await createStatisticsPdfReport(calculateCandidate(283,target));evidence('target-transform',bytes);const raw=literalText(bytes);
  for(const expected of ['omitted','zero-frequency','base-plus-transform','["analysis"]["relativeResidual"]','["analysis"]["derivedRows"][2]["value"]','manualInputCapAppliedToDerived'])expect(raw.includes(expected),expected).toBe(true);
 });
 it('uses bounded worker replay when supplied and rejects forged worker returns',async()=>{
  const artifact=calculateCandidate(283,input),calls:number[]=[];
  const bytes=await createStatisticsPdfReport(artifact,async(id,text)=>{calls.push(id);return(await replayCandidateSnapshot(text,id)).artifact;});expect(bytes[0]).toBe(37);expect(calls).toEqual([283]);
  await expect(createStatisticsPdfReport(artifact,async()=>({...artifact,output:{...artifact.output,forged:'1'}}))).rejects.toThrow(/recomputation/);
 });
 it('fails closed on tampered calculations, identities, revisions and invalid outputs',async()=>{
  const artifact=calculateCandidate(283,input);
  await expect(createStatisticsPdfReport({...artifact,output:{...artifact.output,forged:'1'}})).rejects.toThrow(/recomputation/);
  await expect(createStatisticsPdfReport({...artifact,implementationRevision:'latest'} as never)).rejects.toThrow();
  await expect(createStatisticsPdfReport(calculateCandidate(276,{mode:'two_points',x1:'0',y1:'0',x2:'1',y2:'1'}))).rejects.toThrow(/282 or 283/);
  await expect(createStatisticsPdfReport(calculateCandidate(283,{dataset:{mode:'sample',encoding:'raw',rows:[{value:'1'}]}}))).rejects.toThrow(/successful/);
 });
 it.skipIf(!popplerAvailable)('independently extracts Unicode/numeric values, reads PDF structure/font metadata and rasterizes actual bytes',async()=>{
  const {file,text,info}=readPdf(await createStatisticsPdfReport(calculateCandidate(283,input))),compact=text.replace(/\s/g,'');
  for(const expected of ['μm²','-1.000','5.3333333333333333333333333333333333333333333333333','32/9','1/3'])expect(compact).toContain(expected);
  expect(info).toMatch(/Tagged:\s+yes/);expect(info).toContain('PRIVATE EXPERIMENTAL STATISTICS');
  const fonts=execFileSync('pdffonts',[file],{encoding:'utf8'});expect(fonts).toMatch(/(?:DejaVuSansMono|CalcuMintUnicode).*yes\s+yes\s+yes/);
  execFileSync('pdftoppm',['-f','1','-l','1','-singlefile','-scale-to','600','-png',file,file],{maxBuffer:4_000_000});
  const image=readFileSync(file+'.png');expect(image.subarray(0,8).toString('hex')).toBe('89504e470d0a1a0a');expect(image.byteLength).toBeGreaterThan(5_000);
 });
});
