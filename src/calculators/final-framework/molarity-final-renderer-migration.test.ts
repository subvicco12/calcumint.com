import { describe,expect,it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { runCalculator } from "../engine";
import { molarityCalculator } from "../chemistry/catalog-batch-1";
import { molarityResult } from "./molarity-adapter";
import { molarityPresentation } from "./molarity-presentation";
import { rendererTrustSurface } from "./renderer-trust-surface";

describe("Molarity Calculator Final renderer migration",()=>{
  it("preserves certified mathematics, mol/L semantics and trust",()=>{
    const output=runCalculator(molarityCalculator,{moles:1,solutionVolumeLiters:2}).output;
    const result=molarityResult(output);
    expect(result.primaryResult.value).toBe(output.value);
    expect(result.primaryResult.unit).toBe("mol/L");
    expect(rendererTrustSurface(result)?.sources.length).toBeGreaterThan(0);
    expect(molarityPresentation.domain).toBe("chemistry");
    expect(molarityPresentation.family).toBe("simple-scalar");
  });
  it("routes only molarity through the Final renderer and retains account actions",()=>{
    const s=fs.readFileSync(path.join(process.cwd(),"src/components/calculator-interactive.tsx"),"utf8");
    const a=s.indexOf("function ChemistryBatch1Tool");
    const b=s.indexOf("type ChemistryNumericKind",a);
    const body=s.slice(a,b);
    expect(body).toContain('kind==="molarity"?<FinalCalculatorRenderer result={molarityResult(output)} presentation={molarityPresentation}/>');
    expect(body).not.toContain("<FinalResultPresentation");
    expect(body).toContain("<CalculatorAccountActions");
  });
});
