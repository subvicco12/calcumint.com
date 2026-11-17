import {expect,it} from 'vitest';
import {correlationCalculator} from '@/calculators/statistics/catalog-batch-3';
import {linearRegressionCalculator,weightedMeanCalculator,percentileCalculator} from '@/calculators/statistics/catalog-batch-4';
import {statisticsContracts,statisticsWorkflows,verifyStatisticsSnapshot,statisticsResult} from './cohort';
import {factoryDownload} from '@/lib/calculator-factory/completion/exports';
const engines=[correlationCalculator,linearRegressionCalculator,weightedMeanCalculator,percentileCalculator];
const raw:Record<string,string>[]=[{xValues:'1, 2, 3',yValues:'2, 4, 6'},{xValues:'1, 2, 3',yValues:'2, 4, 6'},{values:'10, 20',weights:'1, 3'},{values:'4, 1, 3, 2',percentile:'75'}];
it('binds the exact catalog tuples without registering new engines',()=>{
 expect(statisticsContracts.map(c=>[c.catalogId,c.engineId,c.slug,c.version])).toEqual(engines.map((e,i)=>[292+i,e.id,e.slug,1]));
});
it.each([292,293,294,295])('preserves immutable outputs, raw provenance, scenarios, batch recovery and exports #%s',id=>{
 const i=id-292,c=statisticsContracts[i],flow=statisticsWorkflows(id),packet=flow.execute(raw[i]);
 expect(packet.raw).toEqual(raw[i]);expect(verifyStatisticsSnapshot(packet.snapshot).snapshot).toEqual(packet.snapshot);
 expect(statisticsResult(packet).primaryResult.value).toBe(packet.snapshot.output[c.primaryKey]);
 for(const plan of ['pro','business'] as const){
  for(const format of ['json','csv','pdf'] as const){const file=factoryDownload(flow,packet,format,plan,c.title);expect(file.bytes.length).toBeGreaterThan(100);if(format==='json')expect(flow.replay(new TextDecoder().decode(file.bytes))).toEqual(packet);}
  expect(flow.scenario(flow.scenario([],'A',packet,'A',plan),'B',packet,'B',plan)).toHaveLength(2);
 }
 expect(()=>flow.exportPacket(packet,'json','free')).toThrow(/Pro/);
 const broken={...raw[i],[c.fields[0].key]:'1,,2'};
 const batch=flow.batch([raw[i],broken,raw[i]]);expect(batch.map(x=>!!x.packet)).toEqual([true,false,true]);expect(()=>flow.exportBatch(batch,'business')).toThrow(/Correct/);
 for(const wrong of [{...packet,identity:{...packet.identity,catalogId:999}},{...packet,identity:{...packet.identity,sourceVersion:'forged'}},{...packet,snapshot:{...packet.snapshot,output:{...packet.snapshot.output,count:999}}}])expect(()=>flow.verify(wrong)).toThrow();
 expect(()=>verifyStatisticsSnapshot({...packet.snapshot,calculatorVersion:2})).toThrow();
 expect(()=>verifyStatisticsSnapshot({...packet.snapshot,output:{...packet.snapshot.output,count:999}})).toThrow();
});
it('has independent hand-derived goldens including legitimate zero and negative values',()=>{
 expect(statisticsWorkflows(292).execute({xValues:'-1,0,1',yValues:'1,0,-1'}).snapshot.output.correlation).toBeCloseTo(-1,14);
 expect(statisticsWorkflows(292).execute({xValues:'-1,0,1',yValues:'1,-2,1'}).snapshot.output.correlation).toBe(0);
 const line=statisticsWorkflows(293).execute({xValues:'0,1,2,3',yValues:'1,3,5,7'}).snapshot.output;expect(line.slope).toBe(2);expect(line.intercept).toBe(1);
 expect(statisticsWorkflows(293).execute({xValues:'1,2,3',yValues:'4,4,4'}).snapshot.output.slope).toBe(0);
 expect(statisticsWorkflows(294).execute({values:'-10,10',weights:'1,1'}).snapshot.output.weightedMean).toBe(0);
 for(const [percentile,expected] of [['0',1],['25',1.75],['75',3.25],['100',4]] as const)expect(statisticsWorkflows(295).execute({values:'4,1,3,2',percentile}).snapshot.output.percentile).toBe(expected);
});
it.each([292,293,294,295])('refuses malformed/unsupported new captures #%s',id=>{
 const i=id-292,c=statisticsContracts[i],flow=statisticsWorkflows(id);
 for(const bad of ['', ' ', '1,,2','1x,2','NaN,2','Infinity,2','0x10,2','1e-99,2','1e99,2',',1','1,', '1,2\n3'])expect(()=>flow.execute({...raw[i],[c.fields[0].key]:bad})).toThrow();
 expect(()=>flow.execute({...raw[i],extra:'1'})).toThrow();
});
it('refuses known weighted cancellation while preserving exact historical v1 output',()=>{
 const input={values:[1e50,1,-1e50],weights:[1,1,1]},output=weightedMeanCalculator.calculate(input,{});
 expect(output.weightedMean).toBe(0); // exact rational weighted mean is 1/3
 expect(()=>statisticsWorkflows(294).execute({values:'1e50,1,-1e50',weights:'1,1,1'})).toThrow(/precision/);
 expect(verifyStatisticsSnapshot({calculatorSlug:weightedMeanCalculator.slug,calculatorVersion:1,input,output}).snapshot.output.weightedMean).toBe(0);
});
it('rejects pairing and degeneracy instead of fabricating results',()=>{
 for(const id of [292,293]){expect(()=>statisticsWorkflows(id).execute({xValues:'1,2',yValues:'1,2,3'})).toThrow();expect(()=>statisticsWorkflows(id).execute({xValues:'1,1',yValues:'1,2'})).toThrow();}
 expect(()=>statisticsWorkflows(294).execute({values:'1,2',weights:'0,1'})).toThrow();
 expect(()=>statisticsWorkflows(295).execute({values:'1,2',percentile:'101'})).toThrow();
});
it('refuses regression loss of centered precision while preserving immutable v1 history',()=>{
 const input={xValues:[1e16,1e16+2],yValues:[0,1]},output=linearRegressionCalculator.calculate(input,{});
 // Two distinct points define slope (1-0)/((1e16+2)-1e16) = 1/2.
 expect(output.slope).toBe(.25);
 expect(()=>statisticsWorkflows(293).execute({xValues:'10000000000000000,10000000000000002',yValues:'0,1'})).toThrow(/precision/);
 expect(verifyStatisticsSnapshot({calculatorSlug:linearRegressionCalculator.slug,calculatorVersion:1,input,output}).snapshot.output.slope).toBe(.25);
});
it('refuses percentile interpolation cancellation without rewriting its historical result',()=>{
 const input={values:[-1e16,1e16],percentile:50.00000000000001},output=percentileCalculator.calculate(input,{});
 // p is exactly 50 + 2^-47 in binary64. The linear formula gives
 // 2e16 * (2^-47 / 100) = 1.4210854715202004, not v1's 2.
 expect(output.percentile).toBe(2);
 expect(()=>statisticsWorkflows(295).execute({values:'-1e16,1e16',percentile:'50.00000000000001'})).toThrow(/precision/);
 expect(verifyStatisticsSnapshot({calculatorSlug:percentileCalculator.slug,calculatorVersion:1,input,output}).snapshot.output.percentile).toBe(2);
});
