import { describe, expect, it } from "vitest";
import { createStructuredResult } from "./structured-result";
import { toRendererResult } from "./structured-result-interop";

describe("normalized structured-result renderer interoperability", () => {
  it("preserves authoritative result values without recalculation", () => {
    const normalized = createStructuredResult({
      primaryResult: { key: "answer", label: "Answer", value: 42 },
      metrics: [{ key: "secondary", label: "Secondary", value: 7 }],
      composition: [{ key: "part", label: "Part", value: 42 }],
      methodology: "Certified engine result."
    });
    const rendered = toRendererResult(normalized);
    expect(rendered.primaryResult).toMatchObject({ id: "answer", value: 42 });
    expect(rendered.metrics?.[0]).toMatchObject({ id: "secondary", value: 7 });
    expect(rendered.composition?.[0]).toMatchObject({ id: "part", value: 42 });
  });
});
