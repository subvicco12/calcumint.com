import { describe,expect,it } from "vitest";
import { runCalculator } from "../engine";
import { stairCalculator,fenceCalculator,deckingCalculator,gravelCalculator,asphaltCalculator,excavationCalculator,wallpaperCalculator,insulationCalculator } from "./catalog-batch-2";

describe("Engineering & Construction batch 2 boundaries",()=>{
  it("does not over-count exact whole-unit thresholds",()=>{
    expect(runCalculator(insulationCalculator,{areaSquareMeters:100,packCoverageSquareMeters:10,wastePercent:10}).output.value).toBe(11);
    expect(runCalculator(fenceCalculator,{fenceLengthMeters:20,panelWidthMeters:2,wastePercent:10}).output.value).toBe(11);
    expect(runCalculator(wallpaperCalculator,{wallAreaSquareMeters:50,rollCoverageSquareMeters:5,wastePercent:10}).output.value).toBe(11);
    expect(runCalculator(stairCalculator,{totalRiseCm:280,targetRiserHeightCm:17.5}).output.value).toBe(16);
  });
  it("rounds genuinely fractional purchase quantities upward",()=>{
    expect(runCalculator(insulationCalculator,{areaSquareMeters:100.01,packCoverageSquareMeters:10,wastePercent:10}).output.value).toBe(12);
    expect(runCalculator(insulationCalculator,{areaSquareMeters:1000000000000000.4,packCoverageSquareMeters:1,wastePercent:0}).output.value).toBe(1000000000000001);
    expect(runCalculator(deckingCalculator,{deckAreaSquareMeters:20,boardWidthMeters:.14,boardLengthMeters:4,wastePercent:10}).output.value).toBe(40);
  });
  it("accepts waste endpoints and rejects out-of-range waste",()=>{
    expect(runCalculator(gravelCalculator,{lengthMeters:10,widthMeters:5,depthMeters:.1,wastePercent:0}).output.value).toBe(5);
    expect(runCalculator(gravelCalculator,{lengthMeters:10,widthMeters:5,depthMeters:.1,wastePercent:100}).output.value).toBe(10);
    expect(()=>runCalculator(gravelCalculator,{lengthMeters:10,widthMeters:5,depthMeters:.1,wastePercent:-1})).toThrow();
    expect(()=>runCalculator(gravelCalculator,{lengthMeters:10,widthMeters:5,depthMeters:.1,wastePercent:101})).toThrow();
  });
  it("rejects nonpositive required dimensions and coverage",()=>{
    expect(()=>runCalculator(stairCalculator,{totalRiseCm:280,targetRiserHeightCm:0})).toThrow();
    expect(()=>runCalculator(fenceCalculator,{fenceLengthMeters:30,panelWidthMeters:0,wastePercent:10})).toThrow();
    expect(()=>runCalculator(deckingCalculator,{deckAreaSquareMeters:20,boardWidthMeters:0,boardLengthMeters:4,wastePercent:10})).toThrow();
    expect(()=>runCalculator(asphaltCalculator,{lengthMeters:10,widthMeters:5,depthMeters:.05,densityKgPerCubicMeter:0,wastePercent:5})).toThrow();
    expect(()=>runCalculator(wallpaperCalculator,{wallAreaSquareMeters:40,rollCoverageSquareMeters:0,wastePercent:10})).toThrow();
    expect(()=>runCalculator(insulationCalculator,{areaSquareMeters:100,packCoverageSquareMeters:0,wastePercent:10})).toThrow();
  });
  it("accepts zero bulking but rejects negative bulking",()=>{
    expect(runCalculator(excavationCalculator,{lengthMeters:10,widthMeters:4,depthMeters:2,bulkingPercent:0}).output.value).toBe(80);
    expect(()=>runCalculator(excavationCalculator,{lengthMeters:10,widthMeters:4,depthMeters:2,bulkingPercent:-1})).toThrow();
  });
  it("guards non-finite calculated overflow",()=>{
    expect(()=>runCalculator(asphaltCalculator,{lengthMeters:1e100,widthMeters:1e100,depthMeters:1e100,densityKgPerCubicMeter:1e100,wastePercent:100})).toThrow("supported finite range");
  });
});