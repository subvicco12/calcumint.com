import {it,expect} from 'vitest';
import {readFileSync,mkdtempSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {getFactoryWorkflows} from '../registry';
import {verifyRegisteredSnapshot} from '@/lib/registered-snapshot-verification';
import {verifyWorkerCScienceSnapshot} from '@/lib/science-worker-c-snapshot-verification';
import {verifyFactoryPacket,verifyFactoryStoredSnapshot} from './business';
import {factoryDownload} from './exports';
import {calculateNextScience as calc,reverseNextScience as reverse,graphNextScience as graph,type NextScienceId} from './science-next100';
import {dilutionCalculator} from '@/calculators/chemistry/catalog-batch-1';
import {createCalculationSnapshot} from '@/lib/calculation-snapshot';
const cases:[NextScienceId,Record<string,string>,number,string][]=[[328,{moles:'0.01',solutionVolumeLiters:'0.2'},0.05,'mol/L'],[331,{massGrams:'36',molarMass:'18'},2,'mol'],[332,{initialConcentration:'2.04',initialVolume:'0.025',finalVolume:'0.5'},0.102,'mol/L']];
for(const [id,raw,expected,unit]of cases)it(`exact science contract and delivery #${id}`,()=>{
 const flows=getFactoryWorkflows(id),packet=flows.execute(raw),input=Object.fromEntries(Object.entries(raw).map(([k,v])=>[k,Number(v)]));
 expect(()=>verifyRegisteredSnapshot(packet.snapshot)).toThrow(/unavailable/); // Coordinator must wire the target verifier.
 expect(verifyWorkerCScienceSnapshot(packet.snapshot).snapshot).toEqual(packet.snapshot);expect(verifyFactoryPacket(packet)).toEqual(packet);expect(verifyFactoryStoredSnapshot(packet.snapshot).snapshot).toEqual(packet.snapshot);
 const capture=calc(id,input);expect(Math.abs(Number(capture.snapshot.output.value)-expected)).toBeLessThanOrEqual(8*Number.EPSILON*Math.abs(expected));expect(capture.unit).toBe(unit);
 for(const bad of [{...packet.snapshot,calculatorVersion:2},{...packet.snapshot,input:{...packet.snapshot.input,extra:1}},{...packet.snapshot,output:{...packet.snapshot.output,value:999}},{...packet.snapshot,extra:true}])expect(()=>verifyWorkerCScienceSnapshot(bad)).toThrow();
 const inverse=reverse(id,input,expected);expect(Number(inverse.replay.snapshot.output.value)).toBeCloseTo(expected,14);expect(graph(id,input,[0,-1,Infinity]).map(p=>'error'in p)).toEqual([false,true,true]);
 for(const bad of ['', 'NaN', 'Infinity','1e-320','-1'])expect(()=>flows.execute({...raw,[Object.keys(raw)[0]]:bad})).toThrow();
 const a=flows.scenario([],'A',packet,'baseline','pro');expect(flows.scenario(a,'B',packet,'compare','business')).toHaveLength(2);
 for(const plan of ['pro','business']as const){
  const json=factoryDownload(flows,packet,'json',plan,'Science '+id);expect(flows.replay(new TextDecoder().decode(json.bytes))).toEqual(packet);
  expect(new TextDecoder().decode(factoryDownload(flows,packet,'csv',plan,'Science '+id).bytes)).toContain(String(packet.snapshot.output.value));
  const pdf=factoryDownload(flows,packet,'pdf',plan,'Science '+id),dir=mkdtempSync(path.join(tmpdir(),'worker-c-pdf-'));
  try{writeFileSync(path.join(dir,'out.pdf'),pdf.bytes);const text=execFileSync('pdftotext',['-layout',path.join(dir,'out.pdf'),'-'],{encoding:'utf8',timeout:10000});expect(text).toContain('Science '+id);expect(text).toContain(packet.identity.calculatorSlug);}finally{rmSync(dir,{recursive:true,force:true});}
 }
 for(const format of ['json','csv','pdf']as const){expect(()=>factoryDownload(flows,packet,format,'free','Science')).toThrow();expect(()=>factoryDownload(flows,{...packet,snapshot:{...packet.snapshot,output:{value:1}}},format,'business','Science')).toThrow();}
 const badBatch=flows.batch([raw,{...raw,[Object.keys(raw)[0]]:''}]);expect(badBatch[1].error).toBeTruthy();expect(()=>flows.exportBatch(badBatch,'business')).toThrow();
});
it('independently verifies exact rational amount and concentration witnesses',()=>{
 for(const [numerator,denominator,expected]of [[36,18,2],[123456,64,1929],[7,8,.875],[5,16,.3125]]){
 expect(calc(331,{massGrams:numerator,molarMass:denominator}).snapshot.output.value).toBe(expected);
 expect(calc(328,{moles:numerator,solutionVolumeLiters:denominator}).snapshot.output.value).toBe(expected);
 }
 expect(calc(332,{initialConcentration:8,initialVolume:3,finalVolume:16}).snapshot.output.value).toBe(1.5);
});
it('preserves historical dilution records without imposing new capture policy',()=>{
 const input={initialConcentration:2,initialVolume:2,finalVolume:1},snapshot=createCalculationSnapshot({calculatorSlug:dilutionCalculator.slug,calculatorVersion:1,input,output:dilutionCalculator.calculate(input,{})});
 expect(()=>calc(332,input)).toThrow(/Dilution/);expect(verifyWorkerCScienceSnapshot(snapshot).snapshot).toEqual(snapshot);
});
it('preserves immutable engines and retained source evidence bytes',()=>{
 for(const file of ['src/calculators/chemistry/catalog-batch-1.ts','docs/milestone100-20261114/science/completion.md','docs/milestone100-20261114/science/candidates.json'])expect(readFileSync(file).equals(execFileSync('git',['show','dc8544422dbb4ebccfc96e03431e64ebcf871fc9:'+file]))).toBe(true);
});
