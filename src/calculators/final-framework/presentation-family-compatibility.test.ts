import { describe, expect, it } from "vitest";
import type { PresentationFamily } from "./types";

function acceptsFamily(family: PresentationFamily) { return family; }

describe("presentation-family migration compatibility", () => {
  it("accepts canonical Final Blueprint families", () => {
    expect(acceptsFamily("growth-accumulation")).toBe("growth-accumulation");
    expect(acceptsFamily("range-classification")).toBe("range-classification");
    expect(acceptsFamily("rule-based-jurisdictional")).toBe("rule-based-jurisdictional");
  });
  it("temporarily accepts legacy metadata during staged migration", () => {
    expect(acceptsFamily("growth-goal")).toBe("growth-goal");
    expect(acceptsFamily("range-health")).toBe("range-health");
  });
});
