import{describe,expect,it}from"vitest";
import{cookingMeasurementConverter}from"./catalog-batch-4";

describe("cooking converter direct calculation safety",()=>{
 it("rejects unknown units even for identity conversions",()=>{
  expect(()=>cookingMeasurementConverter.calculate({value:2,fromUnit:"unknown",toUnit:"unknown"},{})).toThrow(/supported units/);
 });
 it("rejects invalid source or target units without returning NaN",()=>{
  expect(()=>cookingMeasurementConverter.calculate({value:2,fromUnit:"unknown",toUnit:"ml"},{})).toThrow(/supported units/);
  expect(()=>cookingMeasurementConverter.calculate({value:2,fromUnit:"ml",toUnit:"unknown"},{})).toThrow(/supported units/);
 });
 it("rejects nonfinite values on the identity shortcut",()=>{
  expect(()=>cookingMeasurementConverter.calculate({value:Infinity,fromUnit:"ml",toUnit:"ml"},{})).toThrow(/finite/);
 });
 it("preserves supported identity and regular conversion",()=>{
  expect(cookingMeasurementConverter.calculate({value:-2,fromUnit:"ml",toUnit:"ml"},{}).result).toBe(-2);
  expect(cookingMeasurementConverter.calculate({value:2,fromUnit:"l",toUnit:"ml"},{}).result).toBe(2000);
 });
});
