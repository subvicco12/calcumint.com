import{describe,expect,it}from"vitest";
import{pressureConverter,energyConverter,powerConverter,timeConverter,angleConverter}from"./catalog-batch-2";

describe("batch-two direct conversion safety",()=>{
 const calculators=[pressureConverter,energyConverter,powerConverter,timeConverter,angleConverter];
 const units=["pa","j","w","s","rad"];
 it("rejects unsupported identity units across all five converters",()=>{
  for(const calculator of calculators)expect(()=>calculator.calculate({value:1,fromUnit:"invalid",toUnit:"invalid"},{})).toThrow(/supported units/);
 });
 it("rejects nonfinite identity values across all five converters",()=>{
  calculators.forEach((calculator,index)=>expect(()=>calculator.calculate({value:Infinity,fromUnit:units[index],toUnit:units[index]},{})).toThrow(/finite/));
 });
 it("rejects unknown source and target units",()=>{
  expect(()=>pressureConverter.calculate({value:1,fromUnit:"invalid",toUnit:"pa"},{})).toThrow(/supported units/);
  expect(()=>pressureConverter.calculate({value:1,fromUnit:"pa",toUnit:"invalid"},{})).toThrow(/supported units/);
 });
 it("preserves reference conversions and zero identity",()=>{
  expect(pressureConverter.calculate({value:1,fromUnit:"atm",toUnit:"kpa"},{}).result).toBe(101.325);
  expect(timeConverter.calculate({value:0,fromUnit:"s",toUnit:"s"},{}).result).toBe(0);
 });
});
