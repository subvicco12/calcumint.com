import { describe, expect, it } from "vitest";
import { resolveFinalCapability, MATHEMATICAL_PARITY_CAPABILITIES } from "./product-capabilities";
import { referencePresentations } from "./reference-presentations";

describe("Final free core surface", () => {
  it("keeps mathematical parity and a free visualization available together", () => {
    for (const definition of Object.values(referencePresentations)) {
      expect(definition.freeVisualization).toBeTruthy();
      for (const capability of MATHEMATICAL_PARITY_CAPABILITIES) {
        expect(resolveFinalCapability("free", capability)).toBe("active");
      }
    }
  });
});
