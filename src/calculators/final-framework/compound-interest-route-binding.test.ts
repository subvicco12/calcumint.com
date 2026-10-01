import { describe, expect, it } from "vitest";
import { referencePresentations } from "./reference-presentations";

describe("Compound Interest Final route contract", () => {
  it("keeps the canonical Reference Six presentation identity", () => {
    expect(referencePresentations.compoundInterest.id).toBe("reference.compound-interest");
    expect(referencePresentations.compoundInterest.family).toBe("growth-accumulation");
    expect(referencePresentations.compoundInterest.level).toBe("analytical");
  });
});
