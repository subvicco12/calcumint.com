import { describe,expect,it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { runCalculator } from "../engine";
import { speedCalculator } from "../physics/catalog-batch-1";
import { speedResult } from "./speed-adapter";
import { speedPresentation } from "./speed-presentation";
import { rendererTrustSurface } from "./renderer-trust-surface";

describe("Speed Calculator Final renderer migration",()=>{
  it("adapts the certified engine without changing mathematics or trust",()=>{
    const output=runCalculator(speedCalculator,{distance:100,time:20}).output;
    const result=speedResult(output);
    expect(result.primaryResult.value).toBe(output.value);
    expect(result.primaryResult.label).toBe("Speed");
    expect(rendererTrustSurface(result)?.sources.length).toBeGreaterThan(0);
    expect(speedPresentation.domain).toBe("physics");
    expect(speedPresentation.family).toBe("simple-scalar");
    expect(speedPresentation.supportedVisualizations).toHaveLength(0);
  });
  it("routes only the speed branch through the Final renderer",()=>{
    const s=fs.readFileSync(path.join(process.cwd(),"src/components/calculator-interactive.tsx"),"utf8");
    const a=s.indexOf("function PhysicsBatch1Tool");
    const b=s.indexOf("function PhysicsBatch3Tool",a);
    const body=s.slice(a,b);
    expect(body).toContain('kind==="speed"?<FinalCalculatorRenderer result={speedResult(output)} presentation={speedPresentation}/>');
    expect(body).not.toContain("<FinalResultPresentation");
  });
});
