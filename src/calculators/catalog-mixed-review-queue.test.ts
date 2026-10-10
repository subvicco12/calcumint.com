import { describe, expect, it } from "vitest";
import { buildMixedCategoryReviewQueue } from "./catalog-mixed-review-queue";
import { listCalculatorImplementationInventory } from "./implementation-inventory";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("mixed-category review queue", () => {
  it("reports partial ledger coverage without treating HOLD as approval", () => {
    const reviews = JSON.parse(readFileSync(resolve(process.cwd(), "data/catalog/mixed-category-review-ledger.partial.json"), "utf8"));
    const queue = buildMixedCategoryReviewQueue(reviews);
    expect(queue.approved).toBe(reviews.filter((item: {decision: string}) => item.decision === "approved").length);
    expect(queue.held).toBe(reviews.filter((item: {decision: string}) => item.decision === "hold").length);
    expect(queue.total).toBe(queue.approved + queue.held + queue.missing);
    expect(queue.entries.find((item) => item.slug === "power-calculator")?.decision).toBe("hold");
    expect(queue.entries.find((item) => item.slug === "travel-time-calculator")?.decision).toBe("hold");
  });
  it("enumerates every science and everyday slug without guessed approvals", () => {
    const expected = listCalculatorImplementationInventory()
      .filter((item) => item.category === "science" || item.category === "everyday");
    const queue = buildMixedCategoryReviewQueue([]);
    expect(queue.total).toBe(expected.length);
    expect(queue.missing).toBe(expected.length);
    expect(queue.held).toBe(0);
    expect(queue.approved).toBe(0);
    expect(queue.entries.map((entry) => entry.slug)).toEqual(expected.map((entry) => entry.slug));
    expect(queue.entries.every((entry) => entry.decision === "missing" && entry.proposedDomain === null)).toBe(true);
  });
});
