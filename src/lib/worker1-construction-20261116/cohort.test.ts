import {expect,it} from 'vitest';
import {constructionContracts,constructionContract} from './cohort';
it('binds exactly the ten reserved catalog identities to their immutable v1 engines',()=>{
 expect(constructionContracts.map(x=>x.catalogId)).toEqual([343,344,345,346,348,349,350,354,355,356]);
 expect(constructionContract(343)).toMatchObject({slug:'concrete-calculator',version:1});
});

import {constructionWorkflows,verifyConstructionPacket,verifyConstructionSnapshot,constructionResult} from './cohort';
import {factoryDownload} from '@/lib/calculator-factory/completion/exports';
import {readFileSync} from 'node:fs';
const witnesses=[
 [343,{lengthMeters:'3',widthMeters:'2',depthMeters:'.25',wastePercent:'20'},1.8],
 [344,{lengthFeet:'12.5',widthFeet:'8',quantity:'3'},300],
 [346,{lengthMeters:'7.5',widthMeters:'4',wastePercent:'12.5'},33.75],
 [350,{thicknessInches:'1.5',widthInches:'8',lengthFeet:'16',quantity:'4'},64],
 [354,{lengthMeters:'12',widthMeters:'3',depthMeters:'.5',wastePercent:'10'},19.8],
 [355,{lengthMeters:'8',widthMeters:'5',depthMeters:'.04',densityKgPerCubicMeter:'2350',wastePercent:'5'},3948],
 [356,{lengthMeters:'3.5',widthMeters:'2',depthMeters:'1.25',bulkingPercent:'30'},11.375],
 [345,{wallAreaSquareMeters:'75',coats:'3',coverageSquareMetersPerLiter:'12.5',wastePercent:'20'},21.6],
 [348,{areaSquareMeters:'22.5',tileLengthCm:'50',tileWidthCm:'25',wastePercent:'25'},225],
 [349,{surfaceAreaSquareFeet:'200',sheetLengthFeet:'8',sheetWidthFeet:'4',wastePercent:'20'},8],
] as const;
it.each(witnesses)('independent dimensional golden, immutable history and source-bound workflows #%s',(id,raw,expected)=>{
 const c=constructionContract(id),flow=constructionWorkflows(id),packet=flow.execute(raw),before=JSON.stringify(packet);
 expect(Math.abs(Number(packet.snapshot.output.value)-expected)).toBeLessThanOrEqual(32*Number.EPSILON*Math.abs(expected));
 expect(verifyConstructionPacket(packet)).toEqual(packet);expect(verifyConstructionSnapshot(packet.snapshot).snapshot).toEqual(packet.snapshot);
 expect(constructionResult(packet).primaryResult.value).toBe(packet.snapshot.output.value);
 for(const plan of ['pro','business'] as const){
  for(const format of ['json','csv','pdf'] as const){const file=factoryDownload(flow,packet,format,plan,c.title);expect(file.bytes.length).toBeGreaterThan(0);if(format==='json')expect(flow.replay(new TextDecoder().decode(file.bytes))).toEqual(packet);}
  expect(flow.scenario(flow.scenario([],'A',packet,'original',plan),'B',packet,'repeat',plan)).toHaveLength(2);
 }
 expect(()=>flow.exportPacket(packet,'json','free')).toThrow(/Pro/);
 const batch=flow.batch([raw,{...raw,[c.fields[0].key]:''},raw]);expect(batch.map(x=>!!x.packet)).toEqual([true,false,true]);expect(()=>flow.exportBatch(batch,'business')).toThrow(/Correct/);
 expect(flow.replayBatch(flow.exportBatch(flow.batch([raw]),'pro'))[0].packet).toEqual(packet);
 for(const bad of [{...packet,identity:{...packet.identity,catalogId:id+100}},{...packet,identity:{...packet.identity,calculatorVersion:2}},{...packet,identity:{...packet.identity,sourceVersion:'unapproved'}},{...packet,snapshot:{...packet.snapshot,output:{...packet.snapshot.output,value:expected+1}}}])expect(()=>verifyConstructionPacket(bad)).toThrow();
 for(const bad of [{...packet.snapshot,calculatorVersion:2},{...packet.snapshot,input:{...packet.snapshot.input,extra:1}},{...packet.snapshot,output:{value:expected,steps:['unapproved']}},{...packet.snapshot,extra:true}])expect(()=>verifyConstructionSnapshot(bad)).toThrow();
 for(const bad of ['', ' ', '1x','NaN','Infinity','0x10','1e101','5e-324'])expect(()=>flow.execute({...raw,[c.fields[0].key]:bad})).toThrow();
 expect(()=>flow.execute({...raw,extra:'1'})).toThrow();expect(JSON.stringify(packet)).toBe(before);
});
it('refuses demonstrated finite-input underflow and overflow without rewriting historical results',()=>{
 const raw={lengthMeters:'1e-200',widthMeters:'1e-200',depthMeters:'1e-200',wastePercent:'0'};
 const c=constructionContract(343),input=Object.fromEntries(Object.entries(raw).map(([k,v])=>[k,Number(v)]));const output=c.engine.calculate(input,{});
 expect(output.value).toBe(0);expect(()=>constructionWorkflows(343).execute(raw)).toThrow(/capture range/);
 expect(verifyConstructionSnapshot({calculatorSlug:c.slug,calculatorVersion:1,input,output}).snapshot.output.value).toBe(0);
 expect(()=>constructionWorkflows(355).execute({lengthMeters:'1e100',widthMeters:'1e100',depthMeters:'1e100',densityKgPerCubicMeter:'1e100',wastePercent:'0'})).toThrow();
});
it('preserves valid zero allowances, strict quantities and every catalog mapping',()=>{
 for(const c of constructionContracts){
  const raw=Object.fromEntries(c.fields.map(f=>[f.key,String(f.defaultValue)]));
  for(const f of c.fields.filter(f=>f.key==='wastePercent'||f.key==='bulkingPercent'))expect(constructionWorkflows(c.catalogId).execute({...raw,[f.key]:'0'}).snapshot.output.value).toBeGreaterThan(0);
  const catalog=readFileSync('data/catalog/master-catalog-2026.csv','utf8');expect(catalog).toContain(`"${c.catalogId}","Engineering & Construction","${c.title}"`);
  for(const field of c.fields.filter(f=>f.unit==='integer'))expect(()=>constructionWorkflows(c.catalogId).execute({...raw,[field.key]:'1.5'})).toThrow();
 }
 expect(()=>verifyConstructionSnapshot(Object.defineProperty({calculatorSlug:'concrete-calculator'},'input',{enumerable:true,get(){throw Error('getter');}}))).toThrow(/Unsupported/);
});
it.each(witnesses)('CSV presentation retains explicit dimensional metadata #%s',(id,raw)=>{
 const c=constructionContract(id),flow=constructionWorkflows(id),csv=flow.exportPacket(flow.execute(raw),'csv','pro');
 expect(csv).toContain('outputUnit');expect(csv).toContain(c.unit);expect(csv).toContain('inputUnits');
});
it.each([
 [348,{areaSquareMeters:'22.5',tileLengthCm:'50',tileWidthCm:'25',wastePercent:'10'}],
 [349,{surfaceAreaSquareFeet:'5760',sheetLengthFeet:'8',sheetWidthFeet:'4',wastePercent:'10'}],
] as const)('refuses demonstrated v1 whole-unit ceiling error #%s without rewriting history',(id,raw)=>{
 const c=constructionContract(id),input=Object.fromEntries(Object.entries(raw).map(([k,v])=>[k,Number(v)])),output=c.engine.calculate(input,{});
 // Exact normalized-input count is 180 * (1 + 10/100) = 198.
 expect(output.value).toBe(199);expect(()=>constructionWorkflows(id).execute(raw)).toThrow(/Whole-unit rounding/);
 const saved={calculatorSlug:c.slug,calculatorVersion:1,input,output};expect(verifyConstructionSnapshot(saved).snapshot.output.value).toBe(199);
});
it('refuses unsafe whole-unit captures without inventing a commercial quota',()=>{
 expect(()=>constructionWorkflows(348).execute({areaSquareMeters:'1e20',tileLengthCm:'100',tileWidthCm:'100',wastePercent:'0'})).toThrow(/Safe whole-unit/);
});
