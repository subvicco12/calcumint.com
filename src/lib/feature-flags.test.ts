import { describe, expect, it } from "vitest";
import { featureFlags } from "./feature-flags";

describe("B0 feature flags", () => {
  it("keeps dependent production features disabled during foundation build", () => {
    expect(Object.values(featureFlags).every((value) => value === false)).toBe(true);
  });
});
