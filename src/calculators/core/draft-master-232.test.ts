import { describe, expect, it } from 'vitest';
import { draftMaster232Calculator as calc } from './draft-master-232';
import { bigNumberGoldens } from '../verification/fixtures/draft-master-232-goldens';
import { runCalculator } from '../engine';
describe('DRAFT master232 exact integers',()=>{
 it('examples replay exact metadata results',()=>{for(const example of calc.examples)expect(calc.calculate(example.input,{})).toEqual(example.expected);expect(calc.goldenTests?.length).toBeGreaterThan(0)});
 it.each(bigNumberGoldens)('matches independent Python $input.operation golden',({input,expected})=>{expect(calc.calculate(input,{})).toEqual(expected);expect(runCalculator(calc,input).output).toEqual(expected)});
 it.each(['01','+1',' 1','1.0','1e2','-0','1'.repeat(4097)])('rejects noncanonical or oversized operand %s',left=>{const input={left,right:'1',operation:'add' as const};expect(calc.inputSchema.safeParse(input).success).toBe(false);expect(()=>calc.calculate(input,{})).toThrow()});
 it('normalizes arithmetic zero and rejects division by zero',()=>{expect(calc.calculate({left:'-1',right:'1',operation:'add'},{})).toEqual({result:'0'});expect(()=>calc.calculate({left:'1',right:'0',operation:'divmod'},{})).toThrow(/zero/i)});
 it('is standard DRAFT v1',()=>{expect([calc.reviewStatus,calc.riskClass,calc.version]).toEqual(['draft','standard',1])});
});
