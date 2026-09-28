import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("calculator category publication routing", () => {
  const source = readFileSync("src/app/calculators/[category]/page.tsx", "utf8");

  it("resolves categories at runtime from governed published calculators", () => {
    expect(source).toContain('dynamic = "force-dynamic"');
    expect(source).toContain("getPublishedCalculatorSlugs");
    expect(source).toContain("listGovernedPublicCalculators");
    expect(source).not.toContain("generateStaticParams");
  });
});
