import { describe,expect,it } from "vitest";
import { conversionBatch1Definitions,lengthConverter,areaConverter,volumeConverter,temperatureConverter,speedConverter } from "./catalog-batch-1";

describe("conversion catalog batch 1",()=>{
 it("maps the selected Master Catalog batch to five standard DRAFT definitions",()=>{
  expect(conversionBatch1Definitions.map(x=>x.slug)).toEqual(["length-converter","area-converter","volume-converter","temperature-converter","speed-converter"]);
  for(const definition of conversionBatch1Definitions){expect(definition.reviewStatus).toBe("draft");expect(definition.riskClass).toBe("standard");expect(definition.formulas.length).toBeGreaterThan(0);expect(definition.sources.length).toBeGreaterThan(0);expect(definition.examples.length).toBeGreaterThan(0);}
 });
 it("converts exact and reference factors deterministically",()=>{
  expect(lengthConverter.calculate({value:1,fromUnit:"mi",toUnit:"km"},{}).result).toBe(1.609344);
  expect(areaConverter.calculate({value:1,fromUnit:"acre",toUnit:"m2"},{}).result).toBeCloseTo(4046.8564224,9);
  expect(volumeConverter.calculate({value:1,fromUnit:"gal_us",toUnit:"l"},{}).result).toBe(3.785411784);
  expect(temperatureConverter.calculate({value:212,fromUnit:"f",toUnit:"c"},{}).result).toBe(100);
  expect(speedConverter.calculate({value:60,fromUnit:"mph",toUnit:"km_h"},{}).result).toBeCloseTo(96.56064,10);
 });
 it("preserves tiny nonzero results without fixed-decimal truncation",()=>{expect(areaConverter.calculate({value:1e-6,fromUnit:"cm2",toUnit:"km2"},{}).result).toBe(1e-16);expect(lengthConverter.calculate({value:1e-12,fromUnit:"mm",toUnit:"km"},{}).result).toBeCloseTo(1e-18,12);expect(volumeConverter.calculate({value:Number.MIN_VALUE,fromUnit:"gal_us",toUnit:"ml"},{}).result).toBeGreaterThan(0);expect(lengthConverter.calculate({value:Number.MIN_VALUE,fromUnit:"cm",toUnit:"mm"},{}).result).toBeGreaterThan(0);expect(lengthConverter.calculate({value:Number.MAX_VALUE,fromUnit:"km",toUnit:"mi"},{}).result).toBeCloseTo(1.1170347264862674e308,12);});
 it("preserves identity conversions at finite numeric boundaries",()=>{expect(areaConverter.calculate({value:Number.MIN_VALUE,fromUnit:"m2",toUnit:"m2"},{}).result).toBe(Number.MIN_VALUE);expect(speedConverter.calculate({value:Number.MAX_VALUE,fromUnit:"mph",toUnit:"mph"},{}).result).toBe(Number.MAX_VALUE);expect(lengthConverter.calculate({value:Number.MIN_VALUE,fromUnit:"mm",toUnit:"mm"},{}).result).toBe(Number.MIN_VALUE);expect(lengthConverter.calculate({value:Number.MAX_VALUE,fromUnit:"km",toUnit:"km"},{}).result).toBe(Number.MAX_VALUE);expect(temperatureConverter.calculate({value:Number.MIN_VALUE,fromUnit:"c",toUnit:"c"},{}).result).toBe(Number.MIN_VALUE);});
 it("rejects conversions whose computed result is non-finite",()=>{expect(()=>areaConverter.calculate({value:Number.MAX_VALUE,fromUnit:"km2",toUnit:"cm2"},{})).toThrow("supported finite range");expect(()=>lengthConverter.calculate({value:Number.MAX_VALUE,fromUnit:"km",toUnit:"mm"},{})).toThrow("supported finite range");});
 it("rejects unsupported units at validation",()=>{
  expect(lengthConverter.inputSchema.safeParse({value:1,fromUnit:"kg",toUnit:"m"}).success).toBe(false);
  expect(temperatureConverter.inputSchema.safeParse({value:0,fromUnit:"c",toUnit:"m"}).success).toBe(false);
 });
});
