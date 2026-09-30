import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("calculator public release terminology", () => {
  const source = readFileSync("src/app/calculators/[category]/[slug]/page.tsx", "utf8");

  it("presents the Final calculator experience without exposing the internal version in the trust card", () => {
    expect(source).toContain("<dt>Release</dt><dd>Final</dd>");
    expect(source).not.toContain("<dt>Version</dt><dd>{definition.version}</dd>");
  });

  it("retains the immutable technical calculation version in Methodology", () => {
    expect(source).toContain("<strong>Technical calculation version:</strong> {definition.version}");
  });
});
