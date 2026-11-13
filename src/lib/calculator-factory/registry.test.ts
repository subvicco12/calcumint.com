import {describe,expect,it} from 'vitest';
import {physicsScaledRevision} from './experimental/physics-scaled';
import {calculateFactory,factoryResult,factoryContracts,getFactoryWorkflows,runFactoryCalculation} from './registry';
const ids=[208,209,210,211,212,215,216,218,219,220,423,424,425,427,428,430,431,432,433,434,438,440,322,323,324,325,327];
const defaults=(row:(typeof factoryContracts)[number])=>Object.fromEntries(row.fields.map(field=>[field.key,String(field.defaultValue??'')]));
describe('factory exact integration contracts',()=>{
 it('retains all27 narrow contracts and admits exactly19 source-scoped registered successors with executable defaults',()=>{
  expect(factoryContracts.map(row=>row.catalogId)).toEqual([...ids,...[255, 256, 259, 260, 263, 264, 265, 261, 262, 266, 267, 269, 270, 271, 273, 429, 436, 437, 439]]);
  for(const row of factoryContracts){expect(row.fields.length,row.title).toBeGreaterThan(0);const packet=getFactoryWorkflows(row.catalogId).execute(defaults(row));expect(packet.snapshot.calculatorSlug).toBe(row.slug);expect(packet.snapshot.calculatorVersion).toBe(row.version);expect(Object.values(packet.snapshot.output).some(value=>typeof value==='number'&&Number.isFinite(value))).toBe(true);expect(packet.raw).toEqual(defaults(row));}
 });
 it('rejects null, arrays, numeric coercion, extra fields and incomplete decimal tokens for every contract',()=>{
  for(const row of factoryContracts){const raw=defaults(row),workflow=getFactoryWorkflows(row.catalogId);for(const bad of [null,[],{...raw,unapproved:'1'},Object.fromEntries(Object.entries(raw).map(([key,value])=>[key,Number(value)]))])expect(()=>workflow.execute(bad as never),row.title).toThrow();const numberField=row.fields.find(field=>field.kind==='number');if(numberField)for(const text of ['', ' ', '1x','0x10','Infinity','NaN','1e','1_000'])expect(()=>workflow.execute({...raw,[numberField.key]:text}),row.title+':'+text).toThrow();}
 });
 it('preserves exact entered raw provenance and rejects identity, version, output and raw packet tampering',()=>{
  const workflow=getFactoryWorkflows(208),raw={old:'080.0',next:'100.00'},packet=workflow.execute(raw);expect(packet.raw).toEqual(raw);expect(calculateFactory(208,raw)).toEqual(packet.snapshot);expect(workflow.replay(JSON.stringify(packet))).toEqual(packet);
  for(const change of [(p:Record<string, unknown>)=>{(p.identity as Record<string,unknown>).engineId='wrong'},(p:Record<string, unknown>)=>{(p.identity as Record<string,unknown>).calculatorVersion=2},(p:Record<string, unknown>)=>{(p.identity as Record<string,unknown>).sourceVersion='wrong'},(p:Record<string, unknown>)=>{((p.snapshot as Record<string,unknown>).output as Record<string,unknown>).result=999},(p:Record<string, unknown>)=>{(p.raw as Record<string,unknown>).next='200'},(p:Record<string, unknown>)=>{p.extra=true}]){const bad=JSON.parse(JSON.stringify(packet));change(bad);expect(()=>workflow.replay(JSON.stringify(bad))).toThrow();}
  expect(()=>runFactoryCalculation(208,2,raw)).toThrow();expect(()=>runFactoryCalculation(-1,1,raw)).toThrow();
 });
 it('binds private physics arithmetic revision into exported source identity',()=>{for(const id of [323,324])expect(getFactoryWorkflows(id).identity.sourceVersion).toContain(physicsScaledRevision);});
 it('preserves case-sensitive target and percentage presentation units',()=>{expect(factoryResult(208,{old:'100',next:'125'}).primaryResult.unit).toBe('%');expect(factoryResult(440,{value:'1',fromUnit:'khz',toUnit:'mhz'}).primaryResult.unit).toBe('MHz');});
 it('gates paid local workflows without changing shared mathematics',()=>{
  for(const row of factoryContracts){const workflows=getFactoryWorkflows(row.catalogId),raw=defaults(row),packet=workflows.execute(raw);expect(()=>workflows.exportPacket(packet,'json','free')).toThrow();expect(()=>workflows.scenario([],'A',packet,'','free')).toThrow();const pro=JSON.parse(workflows.exportPacket(packet,'json','pro')),business=JSON.parse(workflows.exportPacket(packet,'json','business'));expect(pro).toEqual(business);expect(pro.snapshot).toEqual(calculateFactory(row.catalogId,raw));}
 });
});
it('uses source-defined case-sensitive symbols in every scoped converter control and result',()=>{
 for(const [id,code,symbol] of [[423,'km','km'],[430,'mj','MJ'],[431,'mw','MW'],[432,'week','wk'],[438,'kn','kN'],[440,'mhz','MHz']] as const){
  const row=factoryContracts.find(row=>row.catalogId===id)!;
  expect(row.fields.find(field=>field.key==='toUnit')?.optionLabels?.[code]).toBe(symbol);
  expect(factoryResult(id,{value:'1',fromUnit:code,toUnit:code}).primaryResult.unit).toBe(symbol);
 }
});
