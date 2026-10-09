import{describe,expect,it}from"vitest";import{cookingMeasurementConverter,conversionBatch4Definitions}from"./catalog-batch-4";
describe("conversion catalog batch 4",()=>{it("keeps Cooking Measurement standard-risk and DRAFT",()=>{expect(conversionBatch4Definitions.map(x=>x.slug)).toEqual(["cooking-measurement-converter"]);expect(cookingMeasurementConverter.riskClass).toBe("standard");expect(cookingMeasurementConverter.reviewStatus).toBe("draft")});
it("converts U.S. kitchen volume units deterministically",()=>{expect(cookingMeasurementConverter.calculate({value:1,fromUnit:"cup_us",toUnit:"fl_oz_us"},{}).result).toBe(8);expect(cookingMeasurementConverter.calculate({value:3,fromUnit:"tsp_us",toUnit:"tbsp_us"},{}).result).toBeCloseTo(1,6)});
it("does not pretend ingredient mass and volume are interchangeable",()=>expect(cookingMeasurementConverter.inputSchema.safeParse({value:100,fromUnit:"g",toUnit:"cup_us"}).success).toBe(false));
it("preserves finite identity values exactly",()=>expect(cookingMeasurementConverter.calculate({value:Number.MAX_VALUE,fromUnit:"ml",toUnit:"ml"},{}).result).toBe(Number.MAX_VALUE));
it("rejects genuinely non-finite converted results",()=>expect(()=>cookingMeasurementConverter.calculate({value:Number.MAX_VALUE,fromUnit:"gallon_us",toUnit:"ml"},{})).toThrow("outside the supported finite range"))});

describe("cooking converter schema and boundary invariants",()=>{
 it("rejects non-finite source values at the schema boundary",()=>{
  for(const value of [Number.NaN,Infinity,-Infinity])expect(cookingMeasurementConverter.inputSchema.safeParse({value,fromUnit:"ml",toUnit:"l"}).success).toBe(false);
 });
 it("rejects unsupported target units",()=>{
  expect(cookingMeasurementConverter.inputSchema.safeParse({value:1,fromUnit:"cup_us",toUnit:"kg"}).success).toBe(false);
 });
 it("preserves zero across supported units",()=>{
  expect(cookingMeasurementConverter.calculate({value:0,fromUnit:"gallon_us",toUnit:"tsp_us"},{}).result).toBe(0);
 });
 it("preserves sign for negative volume arithmetic without implicit clamping",()=>{
  expect(cookingMeasurementConverter.calculate({value:-2,fromUnit:"l",toUnit:"ml"},{}).result).toBe(-2000);
 });
});
