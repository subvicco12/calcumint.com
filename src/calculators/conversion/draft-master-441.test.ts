import { describe, it, expect } from "vitest";
import { draftMaster441Calculator as calculator } from "./draft-master-441";
import { draftMaster441Goldens } from "../verification/fixtures/draft-master-441-goldens";
describe("draft master 441 exact conversion", () => {
 it("matches independent Python rational/Decimal goldens for every ordered pair", () => {
  for (const vector of draftMaster441Goldens) expect(calculator.calculate(vector.input, {})).toEqual(vector.expected);
 });
 it("validates even direct calculate calls", () => {
  for (const value of ["-1", "1e2", "NaN", "Infinity", "", "0.000000000000000000001", "1000000000000000000000", "1.2345678901234567890123456789012345"]) {
   expect(() => calculator.calculate({value,fromUnit:"dpi",toUnit:"dppx"}, {})).toThrow();
  }
  expect(() => calculator.calculate({value:"1",fromUnit:"bogus",toUnit:"dpi"} as never, {})).toThrow();
  expect(() => calculator.calculate({value:1,fromUnit:"dpi",toUnit:"dpi"} as never, {})).toThrow();
 });
 it("accepts inclusive exponent bounds and normalizes identity", () => {
  for (const value of ["0.00000000000000000001", "100000000000000000000"]) expect(calculator.calculate({value,fromUnit:"dpi",toUnit:"dpi"}, {}).result).toBe(value);
  expect(calculator.calculate({value:"00012.3400",fromUnit:"dpi",toUnit:"dpi"}, {}).result).toBe("12.34");
 });
 it("preserves draft standard metadata", () => {expect(calculator.reviewStatus).toBe("draft");expect(calculator.riskClass).toBe("standard");expect(calculator.version).toBe(1);});
});
it("accepts zero density and exact CSS anchors",()=>{expect(calculator.calculate({value:"0",fromUnit:"dpi",toUnit:"dppx"},{})).toEqual({result:"0"});expect(calculator.calculate({value:"96",fromUnit:"dpi",toUnit:"dppx"},{})).toEqual({result:"1"});expect(calculator.calculate({value:"1",fromUnit:"dpcm",toUnit:"dpi"},{})).toEqual({result:"2.54"});});

it("accepts equivalent plain decimal spellings without number coercion",()=>{
 for(const value of [".5","+0.5","000.5000"])expect(calculator.calculate({value,fromUnit:"dpi",toUnit:"dpi"},{})).toEqual({result:"0.5"});
 expect(calculator.calculate({value:"12345678901234567890.12345678901234",fromUnit:"dpi",toUnit:"dpi"},{})).toEqual({result:"12345678901234567890.12345678901234"});
});
