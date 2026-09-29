import{describe,expect,it}from"vitest";import{oddsCalculator}from"./catalog-batch-4";
describe("odds finite-result contract",()=>{
 it("rejects probability 1 rather than returning Infinity",()=>{const input=oddsCalculator.inputSchema.parse({probability:1});expect(()=>oddsCalculator.calculate(input,{})).toThrow("undefined as a finite value")});
 it("preserves finite boundary behavior below 1",()=>{const input=oddsCalculator.inputSchema.parse({probability:1-Number.EPSILON});const result=oddsCalculator.calculate(input,{});expect(Number.isFinite(result.odds)).toBe(true)});
});
