import{describe,expect,it}from"vitest";
import{ohmsLawCalculator,currentCalculator,resistanceCalculator,capacitanceCalculator,coulombForceCalculator,projectileMotionCalculator}from"./catalog-batch-3";

describe("certified electrical and motion calculator boundaries",()=>{
 it("preserves certified status for the tested definitions",()=>{
  for(const calculator of [ohmsLawCalculator,currentCalculator,resistanceCalculator,capacitanceCalculator,coulombForceCalculator,projectileMotionCalculator]){
   expect(calculator.reviewStatus).toBe("certified");
  }
 });
 it("returns zero voltage when current is zero",()=>{
  const input=ohmsLawCalculator.inputSchema.parse({current:0,resistance:5});
  expect(ohmsLawCalculator.calculate(input,{}).value).toBe(0);
 });
 it("rejects zero resistance in current calculation",()=>{
  expect(currentCalculator.inputSchema.safeParse({voltage:12,resistance:0}).success).toBe(false);
 });
 it("rejects zero current in resistance calculation",()=>{
  expect(resistanceCalculator.inputSchema.safeParse({voltage:12,current:0}).success).toBe(false);
 });
 it("rejects zero voltage in capacitance calculation",()=>{
  expect(capacitanceCalculator.inputSchema.safeParse({charge:10,voltage:0}).success).toBe(false);
 });
 it("rejects zero distance in Coulomb force calculation",()=>{
  expect(coulombForceCalculator.inputSchema.safeParse({charge1:1,charge2:1,distance:0}).success).toBe(false);
 });
 it("rejects launch angles outside the supported range",()=>{
  expect(projectileMotionCalculator.inputSchema.safeParse({speed:10,angle:91,gravity:9.8}).success).toBe(false);
 });
});
