import Decimal from "decimal.js";
import { describe, expect, it } from "vitest";
import { scientificDraftCalculator as calculator } from "./draft-master-206";
import fixtures from "../verification/fixtures/draft-master-206-goldens.json";

describe("master 206 bounded scientific DRAFT", () => {
  for (const vector of fixtures.vectors) it(`independent 130-digit reference ${JSON.stringify(vector.input)}`, () => {
    const actual = calculator.calculate(vector.input as never, {});
    expect(actual).toEqual(vector.expected);
  });
  it.each([
    {operation:"sqrt",x:"-1"}, {operation:"ln",x:"0"}, {operation:"log10",x:"-2"},
    {operation:"asin",x:"1.01",angleMode:"radians"}, {operation:"acos",x:"-1.01",angleMode:"degrees"},
    {operation:"pow",x:"0",y:"0"}, {operation:"pow",x:"0",y:"-1"}, {operation:"pow",x:"-2",y:"0.5"},
    {operation:"pow",x:"2"}, {operation:"pow",x:"2",y:"1001"}, {operation:"exp",x:"1001"},
    {operation:"sin",x:"1"}, {operation:"tan",x:"90",angleMode:"degrees"}, {operation:"tan",x:"-270",angleMode:"degrees"},
    {operation:"sqrt",x:"1000001"}, {operation:"sqrt",x:"NaN"}, {operation:"sqrt",x:"Infinity"},
    {operation:"sqrt",x:"1e-3"}, {operation:"sqrt",x:"1.2345678901234567890123456789012345"},
  ])("rejects invalid domain/schema in direct calls %j", input => {
    expect(calculator.inputSchema.safeParse(input).success).toBe(false);
    expect(() => calculator.calculate(input as never, {})).toThrow();
  });
  it("rejects bounded-output overflow without clamping general small values", () => {
    expect(() => calculator.calculate({operation:"tan", x:`${"0."}${"0".repeat(45)}1`,angleMode:"radians"}, {})).not.toThrow();
    expect(() => calculator.calculate({operation:"pow",x:`0.${"0".repeat(20)}1`,y:"1000"},{})).toThrow();
    expect(() => calculator.calculate({operation:"pow",x:`0.${"0".repeat(200)}1`,y:"1000"},{})).toThrow();
  });
  it("uses an isolated decimal context", () => {
    const precision = Decimal.precision;
    Decimal.set({precision: 7});
    try { expect(calculator.calculate({operation:"sqrt",x:"2"},{}).result).toBe("1.414213562373095048801688724209698"); }
    finally { Decimal.set({precision}); }
  });
  it("normalizes signed zero and stays unpublished", () => {
    expect(calculator.calculate({operation:"sqrt",x:"-0"},{})).toEqual({result:"0"});
    expect(calculator.reviewStatus).toBe("draft");expect(calculator.version).toBe(1);
  });
});
