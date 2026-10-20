// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { FinalCalculatorRenderer } from "@/components/final-calculator-renderer";
import { calculatorRegistry } from "../registry";
import { serializeCalculationCsv } from "@/lib/calculation-export";
import { serializeCalculationJson } from "@/lib/calculation-snapshot";
import { calculateDraftMathConversion, draftMathConversionPresentation } from "./draft-math-conversion";
const cases = [
  [205, { left: "0.1", right: "0.2", operation: "add" }, "0.3"],
  [232, { left: "9007199254740993", right: "1", operation: "add" }, "9007199254740994"],
  [233, { seed: "42", stream: "54", minimum: 7, maximum: 7, count: 2 }, "7, 7"],
  [435, { value: "20", fromUnit: "km_per_l", toUnit: "l_per_100km" }, "5"],
  [441, { value: "96", fromUnit: "dpi", toUnit: "dppx" }, "1"]
] as const;
describe("unpublished math/conversion Final contracts", () => {
  for (const [id, input, expected] of cases) {
    it(`${id}: exact output survives all plans, JSON, CSV and shared renderer`, () => {
      const { snapshot, result } = calculateDraftMathConversion(id, input);
      expect(result.primaryResult.value).toBe(expected);
      expect(snapshot.calculatorVersion).toBe(1);
      expect(calculatorRegistry.getBySlug(snapshot.calculatorSlug)).toBeUndefined();
      expect(serializeCalculationJson(snapshot)).toContain(snapshot.calculatorSlug);
      expect(serializeCalculationCsv(snapshot.input, snapshot.output)).toContain('"output"');
      for (const plan of ["free", "pro", "business"] as const) {
        const html = renderToStaticMarkup(<FinalCalculatorRenderer result={result} presentation={draftMathConversionPresentation} plan={plan}/>);
        expect(html).toContain(expected);
        expect(html).toContain('role="status"');
        expect(html).toContain("DRAFT");
        expect(html).toContain("Sources");
      }
    });
  }
  it("preserves signed exact integer division and immutable capture", () => {
    const raw = { left: "-7", right: "3", operation: "divmod" };
    const capture = calculateDraftMathConversion(232, raw);
    raw.left = "100";
    expect(capture.snapshot.input.left).toBe("-7");
    expect(capture.result.primaryResult.value).toBe("-2");
    expect(capture.result.metrics).toContainEqual({ id: "remainder", label: "Remainder", value: "-1" });
    expect(serializeCalculationCsv(capture.snapshot.input,capture.snapshot.output)).toContain("'-2");
  });
  it.each([205,232,233,435,441] as const)("rejects corrupt inputs before capture/export: %s", id => {
    expect(() => calculateDraftMathConversion(id, { result: Infinity })).toThrow();
  });
  it("does not accept unsupported master IDs", () => {
    expect(() => calculateDraftMathConversion(207 as never, {})).toThrow();
  });
});
