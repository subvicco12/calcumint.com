import{describe,expect,it}from"vitest";
import{lengthConverter,areaConverter,volumeConverter,temperatureConverter,speedConverter}from"./catalog-batch-1";

describe("batch-one direct conversion safety",()=>{
 const calculators=[lengthConverter,areaConverter,volumeConverter,temperatureConverter,speedConverter];
 const units=["m","m2","m3","c","m_s"];
 it("rejects unsupported identical units in all five converters",()=>{
  for(const calculator of calculators)expect(()=>calculator.calculate({value:1,fromUnit:"invalid",toUnit:"invalid"},{})).toThrow(/supported units/);
 });
 it("rejects nonfinite identity inputs in all five converters",()=>{
  calculators.forEach((calculator,index)=>expect(()=>calculator.calculate({value:Infinity,fromUnit:units[index],toUnit:units[index]},{})).toThrow(/finite/));
 });
 it("rejects invalid temperature source and target units",()=>{
  expect(()=>temperatureConverter.calculate({value:20,fromUnit:"invalid",toUnit:"c"},{})).toThrow(/supported units/);
  expect(()=>temperatureConverter.calculate({value:20,fromUnit:"c",toUnit:"invalid"},{})).toThrow(/supported units/);
 });
 it("preserves valid identity and reference conversions",()=>{
  expect(lengthConverter.calculate({value:1,fromUnit:"mi",toUnit:"km"},{}).result).toBe(1.609344);
  expect(temperatureConverter.calculate({value:32,fromUnit:"f",toUnit:"c"},{}).result).toBe(0);
  expect(speedConverter.calculate({value:0,fromUnit:"m_s",toUnit:"m_s"},{}).result).toBe(0);
 });
});
