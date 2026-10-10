import{describe,expect,it}from"vitest";
import{dataStorageConverter,densityConverter,forceConverter,torqueConverter,frequencyConverter}from"./catalog-batch-3";

describe("batch-three direct unit conversion validation",()=>{
 const calculators=[dataStorageConverter,densityConverter,forceConverter,torqueConverter,frequencyConverter];
 it("rejects unsupported identical units across every converter",()=>{
  for(const calculator of calculators)expect(()=>calculator.calculate({value:1,fromUnit:"invalid",toUnit:"invalid"},{})).toThrow(/supported units/);
 });
 it("rejects nonfinite identity conversions across every converter",()=>{
  const units=["B","kg_m3","n","n_m","hz"];
  calculators.forEach((calculator,index)=>expect(()=>calculator.calculate({value:Infinity,fromUnit:units[index],toUnit:units[index]},{})).toThrow(/finite/));
 });
 it("rejects unsupported source and target units without producing NaN",()=>{
  expect(()=>forceConverter.calculate({value:1,fromUnit:"invalid",toUnit:"n"},{})).toThrow(/supported units/);
  expect(()=>forceConverter.calculate({value:1,fromUnit:"n",toUnit:"invalid"},{})).toThrow(/supported units/);
 });
 it("preserves valid conversions",()=>{
  expect(dataStorageConverter.calculate({value:1,fromUnit:"GiB",toUnit:"MiB"},{}).result).toBe(1024);
  expect(frequencyConverter.calculate({value:2.4,fromUnit:"ghz",toUnit:"mhz"},{}).result).toBe(2400);
 });
});
