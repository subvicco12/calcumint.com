import { describe, expect, it } from "vitest";
import sitemap from "./sitemap";

describe("public sitemap", () => {
  it("contains certified calculator pages and category hubs while excluding drafts", () => {
    const urls = sitemap().map((entry) => entry.url);
    expect(urls.some((url) => url.endsWith("/calculators/math"))).toBe(true);
    expect(urls.some((url) => url.endsWith("/calculators/finance-investment"))).toBe(true);
    expect(urls.some((url) => url.endsWith("/calculators/loans-mortgages"))).toBe(true);
    expect(urls.some((url) => url.includes("simple-interest-calculator"))).toBe(true);
    expect(urls.some((url) => url.includes("loan-payment-calculator"))).toBe(true);
    expect(urls.some((url) => url.includes("loan-emi-calculator"))).toBe(true);
  });
});
