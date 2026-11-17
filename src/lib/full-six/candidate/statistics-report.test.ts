import {describe,it,expect} from 'vitest';
import {calculateCandidate} from './workflow';
import {createStatisticsCsvReport} from './statistics-report';
const input={dataset:{mode:'sample',encoding:'frequency',rows:[{value:'-1.000',frequency:'02'},{value:'3',frequency:'1'}],unit:'m,"survey"',missingPolicy:'reject'},bins:3} as const;
describe('complete verified private statistics CSV',()=>{
 it('exports actual sample frequency statistics, original tokens and exact rational table goldens',async()=>{
  const a=calculateCandidate(283,input),csv=await createStatisticsCsvReport(a);
  expect(csv.startsWith('"section","path","type","value"\r\n')).toBe(true);
  for(const golden of [
   '"original-input","/input/dataset/rows/0/value","string","-1.000"',
   '"original-input","/input/dataset/rows/0/frequency","string","02"',
   '"original-input","/input/dataset/unit","string","m,""survey"""',
   '"summary","/output/summary/denominator","number","2"',
   '"summary","/output/summary/metrics/variance","string","5.3333333333333333333333333333333333333333333333333"',
   '"histogram","/output/histogram/bins/0/upper/numerator","string","1"',
   '"histogram","/output/histogram/bins/0/upper/denominator","string","3"',
   '"contributions","/output/contributions/0/weightedSquaredDeviation/numerator","string","32"',
   '"contributions","/output/contributions/0/weightedSquaredDeviation/denominator","string","9"',
  ])expect(csv).toContain(golden+'\r\n');
  expect(await createStatisticsCsvReport(a)).toBe(csv);
 });
 it('checks the worker replay output against the original immutable snapshot',async()=>{
  const a=calculateCandidate(283,input);
  await expect(createStatisticsCsvReport(a,async()=>({...a,output:{...a.output,forged:'0'}}))).rejects.toThrow(/recomputation/);
 });
 it('preserves sub-Number distinctions and population mode',async()=>{
  const csv=await createStatisticsCsvReport(calculateCandidate(282,{dataset:{mode:'population',encoding:'raw',rows:[{value:'1000000000000'},{value:'1000000000000.000000000000000001'}]},bins:2}));
  expect(csv).toContain('"1000000000000.000000000000000001"');
  expect(csv).toContain('"summary","/output/summary/metrics/variance","string","2.5e-37"');
  expect(csv).toContain('"report","primaryMetric","string","standardDeviation"');
 });
 it('retains omission/zero frequency dispositions and authoritative target transform',async()=>{
  const csv=await createStatisticsCsvReport(calculateCandidate(283,{dataset:{mode:'sample',encoding:'frequency',missingPolicy:'omit',rows:[{value:null,frequency:'1'},{value:'7',frequency:'0'},{value:'1',frequency:'1'},{value:'2',frequency:'1'},{value:'3',frequency:'1'}]},analysis:{kind:'target-scale',metric:'variance',target:'2',shift:'0'}}));
  for(const text of ['"omitted"','"zero-frequency"','"base-plus-transform"','/output/analysis/relativeResidual','/output/analysis/derivedRows/0/value','/output/summary/counts/omittedRows'])expect(csv).toContain(text);
 });
 it.each(['=HYPERLINK("evil")',' @SUM(1)','-cmd|evil','+evil','\t=1'])('rejects malicious spreadsheet cells %s',async unit=>{
  await expect(createStatisticsCsvReport(calculateCandidate(282,{...input,dataset:{...input.dataset,unit}}))).rejects.toThrow(/Unsafe spreadsheet cell/);
 });
 it('rejects forged signed outputs, revisions, foreign identities and failures',async()=>{
  const a=calculateCandidate(283,input);
  await expect(createStatisticsCsvReport({...a,output:{...a.output,forged:'0'}})).rejects.toThrow(/recomputation/);
  await expect(createStatisticsCsvReport({...a,implementationRevision:'latest'} as never)).rejects.toThrow();
  await expect(createStatisticsCsvReport(calculateCandidate(276,{mode:'two_points',x1:'0',y1:'0',x2:'1',y2:'1'}))).rejects.toThrow(/282 or 283/);
  await expect(createStatisticsCsvReport(calculateCandidate(283,{dataset:{mode:'sample',encoding:'raw',rows:[{value:'1'}]}}))).rejects.toThrow(/successful/);
 });
});
