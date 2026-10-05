import { describe,expect,it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { runCalculator } from "../engine";
import { momentumCalculator } from "../physics/catalog-batch-2";
import { momentumResult } from "./momentum-adapter";
import { momentumPresentation } from "./momentum-presentation";
import { rendererTrustSurface } from "./renderer-trust-surface";

describe("Momentum Calculator Final renderer migration",()=>{
  it("preserves certified signed mathematics and trust",()=>{
    const positive=runCalculator(momentumCalculator,{mass:2,velocity:3}).output;
    const negative=runCalculator(momentumCalculator,{mass:2,velocity:-3}).output;
    expect(momentumResult(positive).primaryResult.value).toBe(6);
    expect(momentumResult(negative).primaryResult.value).toBe(-6);
    expect(rendererTrustSurface(momentumResult(positive))?.sources.length).toBeGreaterThan(0);
    expect(momentumPresentation.domain).toBe("physics");
    expect(momentumPresentation.family).toBe("simple-scalar");
  });
  it("keeps Physics Batch 2 exhaustively on the Final renderer",()=>{
    const s=fs.readFileSync(path.join(process.cwd(),"src/components/calculator-interactive.tsx"),"utf8");
    const a=s.indexOf("function PhysicsBatch2Tool");
    const b=s.indexOf("type PhysicsKind",a);
    const body=s.slice(a,b);
    expect(body).toContain('kind==="momentum"?<FinalCalculatorRenderer result={momentumResult(output)} presentation={momentumPresentation}/>');
    expect(body).not.toContain("<FinalResultPresentation");
    for(const sibling of ['kind==="pressure"','kind==="density"','kind==="frequency"','kind==="period"']) expect(body).toContain(sibling);\n    expect(body).toContain('wavelengthResult(output)');
  });
});
