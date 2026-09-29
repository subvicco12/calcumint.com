import{describe,expect,it}from"vitest";import{meanMedianModeRangeCalculator,standardDeviationCalculator,varianceCalculator}from"./catalog-batch-1";
describe("statistics finite boundaries",()=>{
 it("keeps the median finite for two maximum finite values",()=>{const input=meanMedianModeRangeCalculator.inputSchema.parse({values:[1e100,1e100]});expect(meanMedianModeRangeCalculator.calculate(input,{}).median).toBe(1e100)});
 for(const calculator of [standardDeviationCalculator,varianceCalculator])it(calculator.slug+" fails closed when squared deviations overflow",()=>{const input=calculator.inputSchema.parse({values:[-1e100,1e100],kind:"population"});expect(()=>calculator.calculate(input,{})).toThrow("outside the supported numeric range")});
});
