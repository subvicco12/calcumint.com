import {expect,it,describe} from 'vitest';
import {statisticsContracts,statisticsContract,statisticsWorkflows,verifyStatisticsSnapshot,prepareStatisticsRecovery,statisticsResult} from './cohort';
import {coefficientOfVariationCalculator,expectedValueCalculator} from '@/calculators/statistics/catalog-batch-4';
import {factoryDownload} from '@/lib/calculator-factory/completion/exports';

const cases=[
 [296,{values:'[4,1,3,2]',quartileNumber:'1'},'quartile',1.75],
 [297,{values:'[4,1,3,2]'},'interquartileRange',1.5],
 [299,{outcomes:'[0,10]',probabilities:'[0.7,0.3]'},'expectedValue',3],
] as const;
it('pins only the assigned unblocked candidate identities, never298',()=>{
 expect(statisticsContracts.map(c=>[c.catalogId,c.engineId,c.version])).toEqual([[296,'statistics.quartile',1],[297,'statistics.interquartile-range',1],[299,'statistics.expected-value',1]]);
 expect(()=>statisticsContract(298)).toThrow('source/ownership');
 expect(coefficientOfVariationCalculator.calculate({mean:-10,standardDeviation:2},{}).coefficientOfVariation).toBe(.2);
});
describe.each(cases)('%s complete packet/replay/delivery', (id,raw,key,value)=>{
 it('retains complete structured results and normalized arrays',()=>{
  const f=statisticsWorkflows(id),p=f.execute(raw);expect(p.snapshot.output[key]).toBe(value);expect(p.snapshot.output.steps).toBeInstanceOf(Array);
  expect(f.replay(JSON.stringify(p))).toEqual(p);expect(verifyStatisticsSnapshot(p.snapshot).snapshot).toEqual(p.snapshot);
  expect(p.identity.sourceVersion).toBe(`worker2-statistics-b-20261117.1/${statisticsContract(id).engineId}@1`);
  for(const field of statisticsContract(id).fields.filter(f=>f.kind==='text'))expect(p.snapshot.input[field.key]).toBeInstanceOf(Array);
 });
 it('rejects forged identity, source revision, fields and output',()=>{
  const f=statisticsWorkflows(id),p=f.execute(raw);
  for(const bad of [{...p,identity:{...p.identity,calculatorVersion:2}},{...p,identity:{...p.identity,sourceVersion:'other'}},{...p,snapshot:{...p.snapshot,output:{...p.snapshot.output,[key]:999}}},{...p,snapshot:{...p.snapshot,output:{...p.snapshot.output,extra:1}}},{...p,raw:{...p.raw,extra:'1'}}])expect(()=>f.verify(bad)).toThrow();
  expect(()=>verifyStatisticsSnapshot({...p.snapshot,calculatorVersion:2})).toThrow();
  expect(()=>verifyStatisticsSnapshot({...p.snapshot,input:{...p.snapshot.input,extra:1}})).toThrow();
 });
 it('delivers method, source, units and raw provenance in all paid formats',()=>{
  const f=statisticsWorkflows(id),p=f.execute(raw);
  for(const plan of ['pro','business'] as const){
   for(const format of ['json','csv','pdf'] as const){const d=factoryDownload(f,p,format,plan,'Statistics scoped artifact');expect(d.bytes.length).toBeGreaterThan(100);if(format==='json')expect(f.replay(new TextDecoder().decode(d.bytes))).toEqual(p);if(format==='csv')expect(new TextDecoder().decode(d.bytes)).toContain('supplied common unit');if(format==='pdf')expect(new TextDecoder().decode(d.bytes.slice(0,5))).toBe('%PDF-');}
   expect(f.scenario([],'A',p,'',plan)[0].packet).toEqual(p);
  }
  for(const format of ['json','csv','pdf'] as const)expect(()=>factoryDownload(f,p,format,'free','Statistics')).toThrow('Pro');
  expect(()=>f.scenario([],'A',p,'','free')).toThrow('Pro');
 });
 it('refuses malformed fields and preserves each batch row decision',()=>{
  const f=statisticsWorkflows(id),first=statisticsContract(id).fields[0].key;
  for(const bad of [{},{...raw,extra:'1'},{...raw,[first]:''},{...raw,[first]:'[1,"2"]'},{...raw,[first]:'[1,null]'},{...raw,[first]:'[1e999]'},{...raw,[first]:'[]'},{...raw,[first]:'[1,]'}])expect(()=>f.execute(bad)).toThrow();
  const rows=f.batch([raw,{...raw,[first]:''}]);expect(rows[0].packet).toBeTruthy();expect(rows[1].error).toBeTruthy();expect(()=>f.exportBatch(rows,'pro')).toThrow('Correct every row');
  const good=f.batch([raw]);expect(f.replayBatch(f.exportBatch(good,'pro'))[0].packet).toEqual(good[0].packet);
 });
});
it('uses type7 rather than silently changing to Tukey hinges',()=>{
 const f=statisticsWorkflows(296);
 for(const [q,value]of[[1,1.75],[2,2.5],[3,3.25]])expect(f.execute({values:'[1,2,3,4]',quartileNumber:String(q)}).snapshot.output.quartile).toBe(value);
 expect(f.execute({values:'[7]',quartileNumber:'3'}).snapshot.output.quartile).toBe(7);
 expect(statisticsWorkflows(297).execute({values:'[7,7,7]'}).snapshot.output.interquartileRange).toBe(0);
 expect(statisticsResult(f.execute({values:'[1,2,3,4]',quartileNumber:'1'})).series?.[0].points.map(p=>p.y)).toEqual([1.75,2.5,3.25]);
 expect(statisticsResult(statisticsWorkflows(299).execute({outcomes:'[0,10]',probabilities:'[0.7,0.3]'})).series?.[0].points.map(p=>p.y)).toEqual([0,3]);
});
it('refuses new cancellation loss and preserves the exact original expected-value snapshot',()=>{
 const input={outcomes:[-1e20,3,1e20],probabilities:[.25,.5,.25]},output=expectedValueCalculator.calculate(input,{});expect(output.expectedValue).toBe(0);
 const snapshot={calculatorSlug:expectedValueCalculator.slug,calculatorVersion:1,input,output};
 expect(()=>statisticsWorkflows(299).execute({outcomes:JSON.stringify(input.outcomes),probabilities:JSON.stringify(input.probabilities)})).toThrow('cancellation');
 expect(verifyStatisticsSnapshot(snapshot).snapshot).toEqual(snapshot);expect(prepareStatisticsRecovery(snapshot).currentCaptureAvailable).toBe(false);
});
it('does not normalize probabilities or drop tiny original historical terms',()=>{
 expect(()=>statisticsWorkflows(299).execute({outcomes:'[0,1]',probabilities:'[0.5,0.49999999999]'})).toThrow('exactly1');
 const input={outcomes:[1e-200,0],probabilities:[1e-200,1]},snapshot={calculatorSlug:expectedValueCalculator.slug,calculatorVersion:1,input,output:expectedValueCalculator.calculate(input,{})};
 expect(snapshot.output.expectedValue).toBe(0);expect(verifyStatisticsSnapshot(snapshot).snapshot).toEqual(snapshot);expect(prepareStatisticsRecovery(snapshot).currentCaptureAvailable).toBe(false);
});
it('preserves normalized unit-label semantics and rejects data outside explicit capture range',()=>{
 for(const raw of [{values:'[1e51]',quartileNumber:'1'},{values:'[1e-51]',quartileNumber:'1'},{values:'[1,2]',quartileNumber:'4'}])expect(()=>statisticsWorkflows(296).execute(raw)).toThrow();
 expect(()=>statisticsWorkflows(299).execute({outcomes:'[1,2]',probabilities:'[1]'})).toThrow();
});
it.each([
 [[13],[13,13,13]], [[-2,6],[0,2,4]], [[0,10,40],[5,10,25]],
 [[0,4,8,12],[3,6,9]], [[2,2,2,2],[2,2,2]], [[-10,-4,2,8],[-5.5,-1,3.5]],
 [[0,1,1,2,9],[1,1,2]],
] as const)('independent type7 reference vector %j', (values,quartiles)=>{
 for(const q of [1,2,3])expect(statisticsWorkflows(296).execute({values:JSON.stringify(values),quartileNumber:String(q)}).snapshot.output.quartile).toBe(quartiles[q-1]);
 expect(statisticsWorkflows(297).execute({values:JSON.stringify(values)}).snapshot.output.interquartileRange).toBe(quartiles[2]-quartiles[0]);
});
it('honors the retained10000-observation bound without changing historical limits',()=>{
 expect(statisticsWorkflows(296).execute({values:JSON.stringify(Array(10000).fill(1)),quartileNumber:'2'}).snapshot.output.count).toBe(10000);
 expect(()=>statisticsWorkflows(297).execute({values:JSON.stringify(Array(10001).fill(1))})).toThrow();
});
it('refuses cancellation in any displayed quartile even when IQR primary error is small',()=>{
 const raw={values:'[-100000000000000020000,300000000000000000000]'};
 expect(()=>statisticsWorkflows(297).execute(raw)).toThrow('precision');
});
