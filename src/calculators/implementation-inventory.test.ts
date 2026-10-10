import { describe, expect, it } from "vitest";
import { calculatorRegistry } from "./registry";
import { listCalculatorImplementationInventory, summarizeCalculatorImplementationInventory } from "./implementation-inventory";

describe("calculator implementation inventory", () => {
  it("lists exactly the registered calculators without exposing executable definitions", () => {
    const records = listCalculatorImplementationInventory();
    expect(records).toHaveLength(calculatorRegistry.list().length);
    expect(new Set(records.map((record) => record.id)).size).toBe(records.length);
    expect(new Set(records.map((record) => record.slug)).size).toBe(records.length);
    expect(records.map((record) => record.slug)).toEqual([...records.map((record) => record.slug)].sort((a, b) => a.localeCompare(b)));
    for (const record of records) {
      expect(Object.keys(record).sort()).toEqual(["category", "id", "reviewStatus", "riskClass", "slug", "title", "version"]);
      expect(record).toEqual(expect.objectContaining({ id: expect.any(String), slug: expect.any(String), title: expect.any(String) }));
    }
  });

  it("summarizes every registry entry once in each independent dimension", () => {
    const summary = summarizeCalculatorImplementationInventory();
    expect(summary.totalRegistered).toBe(calculatorRegistry.list().length);
    expect(Object.values(summary.byCategory).reduce((sum, count) => sum + count, 0)).toBe(summary.totalRegistered);
    expect(Object.values(summary.byReviewStatus).reduce((sum, count) => sum + count, 0)).toBe(summary.totalRegistered);
    expect(Object.values(summary.byRiskClass).reduce((sum, count) => sum + count, 0)).toBe(summary.totalRegistered);
  });

  it("does not treat certified review status as publication authorization", () => {
    const record = listCalculatorImplementationInventory()[0];
    expect(record).toBeDefined();
    expect(record).not.toHaveProperty("published");
    expect(record).not.toHaveProperty("public");
  });
});
