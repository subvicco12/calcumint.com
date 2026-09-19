import { describe, expect, it } from "vitest";
import { generateStaticParams } from "./page";

describe("calculator category static routes", () => {
  it("generates categories that contain certified public calculators", () => {
    const categories = generateStaticParams().map((item) => item.category);
    expect(categories).toContain("math");
    expect(categories).toContain("finance-investment");
    expect(categories).toContain("loans-mortgages");
  });
});
