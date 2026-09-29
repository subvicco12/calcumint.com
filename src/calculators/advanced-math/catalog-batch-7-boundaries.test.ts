import{describe,expect,it}from"vitest";import{vectorCalculator}from"./catalog-batch-7";
describe("vector finite-result contract",()=>{
 it("rejects an undefined zero-vector angle",()=>{const input=vectorCalculator.inputSchema.parse({ax:0,ay:0,az:0,bx:1,by:0,bz:0});const result=vectorCalculator.calculate(input,{});expect(result.angleRadians).toBeNull();expect(result.dot).toBe(0);expect(result.magnitudeA).toBe(0);expect(result.magnitudeB).toBe(1)});
 it("preserves finite orthogonal-vector behavior",()=>{const input=vectorCalculator.inputSchema.parse({ax:1,ay:0,az:0,bx:0,by:1,bz:0});const result=vectorCalculator.calculate(input,{});expect(result.angleRadians).toBe(Math.PI/2);expect(Number.isFinite(result.angleRadians)).toBe(true)});
});
