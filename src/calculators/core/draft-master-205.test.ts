import { describe, expect, it } from "vitest";
import { basicDraftCalculator } from "./draft-master-205";
import fixtures from "../verification/fixtures/draft-master-205-goldens.json";

describe("master 205 unpublished exact arithmetic", () => {
  for (const { input, expected } of fixtures.vectors) {
    it(`independent Decimal: ${input.left} ${input.operation} ${input.right}`, () => {
      expect(basicDraftCalculator.calculate(basicDraftCalculator.inputSchema.parse(input), {})).toEqual(expected);
    });
  }
  it.each([
    { left: "NaN", right: "1", operation: "add" },
    { left: "1e2", right: "1", operation: "add" },
    { left: "1", right: "0", operation: "divide" },
    { left: "1", right: "1", operation: "eval" },
    { left: "1".repeat(101), right: "1", operation: "add" },
    { left: `0.${"0".repeat(100)}1`, right: "1", operation: "add" }
  ])("rejects invalid schema and direct calls: %j", (input) => {
    expect(basicDraftCalculator.inputSchema.safeParse(input).success).toBe(false);
    expect(() => basicDraftCalculator.calculate(input as never, {})).toThrow();
  });
  it("normalizes signed zero and plain decimal zeros", () => {
    expect(basicDraftCalculator.calculate({ left: "-000.000", right: "+0002.00", operation: "multiply" }, {})).toEqual({ result: "0" });
  });
  it("retains maximum operand precision before one final rounding", () => {
    const value = "9".repeat(100);
    expect(basicDraftCalculator.calculate({ left: value, right: value, operation: "subtract" }, {})).toEqual({ result: "0" });
  });
  it("remains uncertified DRAFT without entitlement-dependent arithmetic", () => {
    expect(basicDraftCalculator.reviewStatus).toBe("draft");
    expect(basicDraftCalculator.version).toBe(1);
    for (const locale of ["en-US", "de-DE", "hi-IN"]) {
      expect(basicDraftCalculator.calculate({ left: "0.1", right: "0.2", operation: "add" }, { locale })).toEqual({ result: "0.3" });
    }
  });
});
