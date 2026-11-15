import {describe,it,expect} from 'vitest';
import {readFileSync,mkdtempSync,writeFileSync,rmSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {getFactoryWorkflows} from '../registry';
import {calculateGeometryNext100 as calc,reverseGeometryNext100 as reverse,graphGeometryNext100 as graph,type GeometryNext100Id} from './geometry-next100';
import {factoryDownload} from './exports';
import {verifySurfaceAreaSnapshot} from '@/lib/surface-area-snapshot-verification';
import {verifyRegisteredSnapshot} from '@/lib/registered-snapshot-verification';
import {verifyFactoryPacket,verifyFactoryStoredSnapshot} from './business';
const cases:[GeometryNext100Id,Record<string,string>,number][]=[
 [272,{radius:'3',height:'4'},37.699111843077518861551720599354],
 [274,{length:'2',width:'3',height:'4'},52],
 [275,{length:'2',width:'3',height:'4'},24],
 [278,{a:'119',b:'120'},169],
 [279,{degrees:'-450'},-7.8539816339744830961566084581988],
 [280,{radians:'7.853981633974483'},450],
];
describe('Worker B individual bounded geometry acceptance, not certification',()=>{
 for(const [id,raw,expected] of cases)it(`verifies original engine, domain, replay, scenarios and real exports #${id}`,()=>{
  const flows=getFactoryWorkflows(id),packet=flows.execute(raw),input=Object.fromEntries(Object.entries(raw).map(([k,v])=>[k,Number(v)]));
  const result=calc(id,input);expect(Math.abs(result.value-expected)).toBeLessThanOrEqual(Math.max(1,Math.abs(expected))*8*Number.EPSILON);
  expect(verifyFactoryPacket(packet)).toEqual(packet);if(id===274){expect(()=>verifyRegisteredSnapshot(packet.snapshot)).toThrow(/unavailable/);expect(verifySurfaceAreaSnapshot(packet.snapshot).snapshot).toEqual(packet.snapshot);for(const bad of [{...packet.snapshot,calculatorVersion:2},{...packet.snapshot,input:{...packet.snapshot.input,extra:1}},{...packet.snapshot,output:{surfaceArea:0}}])expect(()=>verifySurfaceAreaSnapshot(bad)).toThrow();}else expect(verifyRegisteredSnapshot(packet.snapshot).snapshot).toEqual(packet.snapshot);expect(verifyFactoryStoredSnapshot(packet.snapshot).snapshot).toEqual(packet.snapshot);
  const solved=reverse(id,input,result.value);expect(solved.replay.snapshot.output).toEqual(result.snapshot.output);
  expect(graph(id,input,[solved.value,Infinity])[1]).toHaveProperty('error');
  for(const bad of [NaN,Infinity,1e51,1e-51])expect(()=>calc(id,{...input,[Object.keys(input)[0]]:bad})).toThrow();
  expect(()=>flows.execute({...raw,[Object.keys(raw)[0]]:''})).toThrow();
  const scenarios=flows.scenario([],'A',packet,'baseline','pro');expect(flows.scenario(scenarios,'B',packet,'comparison','business')).toHaveLength(2);
  for(const plan of ['pro','business'] as const){
   const json=factoryDownload(flows,packet,'json',plan,'Geometry '+id);expect(flows.replay(new TextDecoder().decode(json.bytes))).toEqual(packet);
   const csv=new TextDecoder().decode(factoryDownload(flows,packet,'csv',plan,'Geometry '+id).bytes);expect(csv).toContain(String(packet.snapshot.calculatorVersion));
   const pdf=factoryDownload(flows,packet,'pdf',plan,'Geometry '+id),dir=mkdtempSync(path.join(tmpdir(),'worker-b-pdf-'));
   try{writeFileSync(path.join(dir,'artifact.pdf'),pdf.bytes);const text=execFileSync('pdftotext',['-layout',path.join(dir,'artifact.pdf'),'-'],{encoding:'utf8',timeout:10000});expect(text).toContain('Geometry '+id);expect(text).toContain(packet.identity.calculatorSlug);}finally{rmSync(dir,{recursive:true,force:true});}
  }
  for(const format of ['json','csv','pdf'] as const){expect(()=>factoryDownload(flows,packet,format,'free','Geometry')).toThrow();expect(()=>factoryDownload(flows,{...packet,snapshot:{...packet.snapshot,output:{forged:1}}},format,'business','Geometry')).toThrow();}
  const batch=flows.batch([raw,{...raw,[Object.keys(raw)[0]]:''}]);expect(batch[0].packet).toBeTruthy();expect(batch[1].error).toBeTruthy();expect(()=>flows.exportBatch(batch,'business')).toThrow();
 });
 it('checks independent integer prism and Pythagorean families',()=>{
  for(const [a,b,c]of [[3,4,5],[5,12,13],[8,15,17],[7,24,25],[119,120,169]])expect(calc(278,{a,b}).value).toBe(c);
  for(const [a,b,c]of [[2,3,4],[13,17,19],[123,456,789]]){expect(calc(275,{length:a,width:b,height:c}).value).toBe(Number(BigInt(a)*BigInt(b)*BigInt(c)));expect(calc(274,{length:a,width:b,height:c}).value).toBe(Number(2n*(BigInt(a)*BigInt(b)+BigInt(a)*BigInt(c)+BigInt(b)*BigInt(c))));}
 });
 it('verifies retained publisher bytes without granting formal applicability',()=>{
  const capture=JSON.parse(readFileSync('docs/milestone100-20261114/geometry/source-excerpts.json','utf8'));expect(capture.formalReviewGranted).toBe(false);
  for(const source of capture.sources){const bytes=readFileSync(source.path);expect(bytes.length).toBe(source.bytes);expect(createHash('sha256').update(bytes).digest('hex')).toBe(source.sha256);}
 });
 it('preserves original engine and source excerpt bytes at the immutable baseline',()=>{
  for(const file of ['src/calculators/launch-portfolio.ts','src/calculators/geometry/catalog-completion.ts','docs/milestone100-20261114/geometry/source-excerpts.json'])expect(readFileSync(file).equals(execFileSync('git',['show','dc8544422dbb4ebccfc96e03431e64ebcf871fc9:'+file]))).toBe(true);
 });
});
