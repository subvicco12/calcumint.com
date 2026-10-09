import{describe,expect,it}from"vitest";import{oddsCalculator,linearRegressionCalculator,bayesTheoremCalculator,percentileCalculator}from"./catalog-batch-4";
describe("odds finite-result contract",()=>{
 it("rejects probability 1 rather than returning Infinity",()=>{const input=oddsCalculator.inputSchema.parse({probability:1});expect(()=>oddsCalculator.calculate(input,{})).toThrow("undefined as a finite value")});
 it("preserves finite boundary behavior below 1",()=>{const input=oddsCalculator.inputSchema.parse({probability:1-Number.EPSILON});const result=oddsCalculator.calculate(input,{});expect(Number.isFinite(result.odds)).toBe(true)});
});

describe("statistics batch four invalid-domain boundaries",()=>{
 it("rejects constant-x regression rather than dividing by zero",()=>{
  const input=linearRegressionCalculator.inputSchema.parse({xValues:[2,2,2],yValues:[1,2,3]});
  expect(()=>linearRegressionCalculator.calculate(input,{})).toThrow(/x is constant/);
 });
 it("rejects mismatched regression observation lengths",()=>{
  expect(()=>linearRegressionCalculator.inputSchema.parse({xValues:[1,2,3],yValues:[1,2]})).toThrow();
 });
 it("rejects Bayes posterior with zero-probability evidence",()=>{
  const input=bayesTheoremCalculator.inputSchema.parse({prior:0,likelihood:0.8,evidenceGivenNot:0});
  expect(()=>bayesTheoremCalculator.calculate(input,{})).toThrow(/evidence probability is zero/);
 });
 it("returns the exact endpoint observations at percentiles zero and one hundred",()=>{
  const low=percentileCalculator.inputSchema.parse({values:[9,-2,4],percentile:0});
  const high=percentileCalculator.inputSchema.parse({values:[9,-2,4],percentile:100});
  expect(percentileCalculator.calculate(low,{}).percentile).toBe(-2);
  expect(percentileCalculator.calculate(high,{}).percentile).toBe(9);
 });
});
