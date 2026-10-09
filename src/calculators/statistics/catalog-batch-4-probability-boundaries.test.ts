import{describe,expect,it}from"vitest";
import{weightedMeanCalculator,expectedValueCalculator,bayesTheoremCalculator,coefficientOfVariationCalculator}from"./catalog-batch-4";

describe("certified statistics probability and weighting domain contracts",()=>{
 it("rejects nonpositive weights",()=>{
  expect(weightedMeanCalculator.inputSchema.safeParse({values:[10,20],weights:[1,0]}).success).toBe(false);
 });
 it("rejects mismatched weighted-mean arrays",()=>{
  expect(weightedMeanCalculator.inputSchema.safeParse({values:[10,20],weights:[1]}).success).toBe(false);
 });
 it("rejects probability distributions that do not sum to one",()=>{
  expect(expectedValueCalculator.inputSchema.safeParse({outcomes:[1,2],probabilities:[0.2,0.2]}).success).toBe(false);
 });
 it("rejects mismatched expected-value arrays",()=>{
  expect(expectedValueCalculator.inputSchema.safeParse({outcomes:[1,2],probabilities:[1]}).success).toBe(false);
 });
 it("rejects probabilities outside zero-to-one domain",()=>{
  expect(bayesTheoremCalculator.inputSchema.safeParse({prior:-0.1,likelihood:0.8,evidenceGivenNot:0.1}).success).toBe(false);
 });
 it("rejects zero mean in coefficient of variation",()=>{
  expect(coefficientOfVariationCalculator.inputSchema.safeParse({mean:0,standardDeviation:2}).success).toBe(false);
 });
});
