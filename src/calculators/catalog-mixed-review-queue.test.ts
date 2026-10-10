import { describe, expect, it } from "vitest";
import { buildMixedCategoryReviewQueue } from "./catalog-mixed-review-queue";
import { listCalculatorImplementationInventory } from "./implementation-inventory";

describe("mixed-category review queue", () => {
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
