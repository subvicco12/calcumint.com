import { describe, expect, it } from "vitest";
import { dateTimeBatch3Definitions } from "./catalog-batch-3";

describe("fixed day date calculators", () => {
  it("registers three distinct standard DRAFT calculators", () => {
    expect(dateTimeBatch3Definitions.map((d) => d.slug)).toEqual(["90-day-calculator", "30-day-calculator", "60-day-calculator"]);
    for (const definition of dateTimeBatch3Definitions) {
      expect(definition.reviewStatus).toBe("draft");
      expect(definition.riskClass).toBe("standard");
      expect(definition.sources.length).toBeGreaterThan(0);
    }
  });

  it("adds exact elapsed calendar days across leap years", () => {
    expect(dateTimeBatch3Definitions[0].calculate({ date: "2023-12-01" }, {})).toEqual({ date: "2024-02-29" });
    expect(dateTimeBatch3Definitions[1].calculate({ date: "2024-02-01" }, {})).toEqual({ date: "2024-03-02" });
    expect(dateTimeBatch3Definitions[2].calculate({ date: "2024-02-01" }, {})).toEqual({ date: "2024-04-01" });
  });

  it("rejects invalid inputs and results outside the four-digit calendar", () => {
    expect(dateTimeBatch3Definitions[0].inputSchema.safeParse({ date: "2025-02-29" }).success).toBe(false);
    expect(dateTimeBatch3Definitions[1].inputSchema.safeParse({ date: "2024-2-01" }).success).toBe(false);
    expect(() => dateTimeBatch3Definitions[2].calculate({ date: "9999-12-01" }, {})).toThrow("four-digit date range");
  });
});
