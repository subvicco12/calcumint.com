import{describe,expect,it}from"vitest";import{meanMedianModeRangeCalculator}from"./catalog-batch-1";
describe("statistics median finite boundaries",()=>{
 for(const values of [[1e100,1e100],[Number.MIN_VALUE,Number.MIN_VALUE],[-1e100,1e100]])it("preserves a finite median for "+values.join(","),()=>{const input=meanMedianModeRangeCalculator.inputSchema.parse({values});const result=meanMedianModeRangeCalculator.calculate(input,{});expect(Number.isFinite(result.median)).toBe(true);expect(result.median).toBe(values[0]===values[1]?values[0]:0)});
});
