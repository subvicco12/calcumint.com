// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { FinalCalculatorRenderer } from "@/components/final-calculator-renderer";
import { calculatorRegistry } from "../registry";
import { serializeCalculationCsv } from "@/lib/calculation-export";
import { serializeCalculationJson } from "@/lib/calculation-snapshot";
import { calculateDraftAppliedQuantities, draftAppliedQuantitiesPresentation } from "./draft-applied-quantities";
const cases = [
 [481,{dailyEnergyTargetKwh:12,peakSunHours:4,systemEfficiency:.75,panelRatedWatts:500},"4"],
 [484,{batteryEnergyAddedKwh:50,chargingEfficiency:.9},"55.5556"],
 [487,{rainfallMm:40,catchmentAreaM2:250,collectionEfficiency:.6},"6"],
 [498,{value:90,direction:"massToVolume",densityGPerMl:.75},"120"],
 [529,{powerWatts:240,massKg:80},"3"]
] as const;
describe("unpublished applied quantities Final contracts", () => {
  for (const [id, input, expected] of cases) {
    it(`${id}: exact output survives all plans, JSON, CSV and shared renderer`, () => {
      const { snapshot, result } = calculateDraftAppliedQuantities(id, input);
      expect(result.primaryResult.value).toBe(expected);
      expect(snapshot.calculatorVersion).toBe(1);
      expect(calculatorRegistry.getBySlug(snapshot.calculatorSlug)).toBeUndefined();
      expect(serializeCalculationJson(snapshot)).toContain(snapshot.calculatorSlug);
      expect(serializeCalculationCsv(snapshot.input, snapshot.output)).toContain('"output"');
      for (const plan of ["free", "pro", "business"] as const) {
        const html = renderToStaticMarkup(<FinalCalculatorRenderer result={result} presentation={draftAppliedQuantitiesPresentation} plan={plan}/>);
        expect(html).toContain(expected);
        expect(html).toContain('role="status"');
        expect(html).toContain("DRAFT");
        expect(html).toContain("Sources");
      }
    });
  }
  it("captures raw precision and immutable inputs",()=>{
    const input={batteryEnergyAddedKwh:50,chargingEfficiency:.9};
    const captured=calculateDraftAppliedQuantities(484,input);input.batteryEnergyAddedKwh=100;
    expect(captured.snapshot.input.batteryEnergyAddedKwh).toBe(50);
    expect(captured.snapshot.output.wallEnergyKwh).toBe(50/.9);
    expect(captured.result.primaryResult.value).toBe("55.5556");
    expect(serializeCalculationJson(captured.snapshot)).toContain(String(50/.9));
    expect(serializeCalculationCsv(captured.snapshot.input,captured.snapshot.output)).toContain(String(50/.9));
  });
  it.each([481,484,487,498,529] as const)("rejects corrupt inputs before capture/export: %s", id => {
    expect(() => calculateDraftAppliedQuantities(id, { result: Infinity })).toThrow();
  });
  it("does not accept unsupported master IDs", () => {
    expect(() => calculateDraftAppliedQuantities(207 as never, {})).toThrow();
  });
});
