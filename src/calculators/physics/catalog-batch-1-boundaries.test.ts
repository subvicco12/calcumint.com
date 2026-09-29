import{describe,expect,it}from"vitest";import{kineticEnergyCalculator,potentialEnergyCalculator}from"./catalog-batch-1";
describe("physics batch 1 finite-result contract",()=>{
 it("rejects overflowing kinetic energy",()=>{const input=kineticEnergyCalculator.inputSchema.parse({mass:1e100,velocity:1e100});expect(()=>kineticEnergyCalculator.calculate(input,{})).toThrow("outside the supported finite range")});
 it("rejects overflowing potential energy",()=>{const input=potentialEnergyCalculator.inputSchema.parse({mass:1e100,gravity:1e100,height:1e100});expect(()=>potentialEnergyCalculator.calculate(input,{})).toThrow("outside the supported finite range")});
});
