import { describe, expect, it } from 'vitest';
import { draftMaster233Calculator as calc } from './draft-master-233';
import { pcgGoldens } from '../verification/fixtures/draft-master-233-goldens';
import { runCalculator } from '../engine';
describe('DRAFT master233 deterministic PCG',()=>{
 it('examples replay exact metadata results',()=>{for(const example of calc.examples)expect(calc.calculate(example.input,{})).toEqual(example.expected);expect(calc.goldenTests?.length).toBeGreaterThan(0)});
 it.each(pcgGoldens.slice(1))('matches independent state and bounded draws $input.minimum',({input,expected})=>{expect(calc.calculate(input,{})).toEqual(expected);expect(runCalculator(calc,input).output).toEqual(expected);expect(calc.calculate(input,{})).toEqual(expected)});
 it('matches official six raw PCG words through the signed full-width mapping',()=>{const signed=calc.calculate(pcgGoldens[1].input,{}).values;expect(signed.map(x=>x+2147483648)).toEqual(pcgGoldens[0].expected.values)});
 it.each([{seed:'18446744073709551616'},{stream:'9223372036854775808'},{seed:'-1'},{seed:'1e2'},{maximum:2147483648},{minimum:-2147483649},{minimum:2,maximum:1},{count:0},{count:1001},{count:1.5}])('rejects invalid schema and direct input %j',patch=>{const input={seed:'42',stream:'54',minimum:0,maximum:10,count:2,...patch};expect(calc.inputSchema.safeParse(input).success).toBe(false);expect(()=>calc.calculate(input,{})).toThrow()});
 it('accepts decimal seed and stream with leading zeros by their numeric value',()=>{const input={...pcgGoldens[1].input,seed:'0'.repeat(30)+'42',stream:'0'.repeat(30)+'54'};expect(calc.calculate(input,{})).toEqual(pcgGoldens[1].expected)});
 it('accepts upper count and is standard DRAFT v1',()=>{expect(calc.calculate({seed:'0',stream:'0',minimum:0,maximum:0,count:1000},{}).values).toHaveLength(1000);expect([calc.reviewStatus,calc.riskClass,calc.version]).toEqual(['draft','standard',1])});
});
