import {describe,expect,it} from "vitest";
import {runCalculator} from "../engine";
import {distanceTimeCalculator} from "../physics/catalog-batch-1";
import {distanceTimeResult} from "./distance-time-adapter";
import {distanceTimePresentation} from "./distance-time-presentation";
import {rendererTrustSurface} from "./renderer-trust-surface";

describe("Distance-Time Final renderer migration",()=>{
  it("preserves deterministic output, boundaries, presentation and trust metadata",()=>{
    const output=runCalculator(distanceTimeCalculator,{speed:12,time:5}).output;
    expect(output.value).toBe(60);
    expect(distanceTimeResult(output).primaryResult).toEqual({id:"distance",label:"Distance",value:60});
    expect(distanceTimeResult(output).primaryResult.unit).toBeUndefined();
    expect(distanceTimePresentation.domain).toBe("physics");
    expect(distanceTimePresentation.family).toBe("simple-scalar");
    expect(rendererTrustSurface(distanceTimeResult(output))?.sources.length).toBeGreaterThan(0);
    expect(runCalculator(distanceTimeCalculator,{speed:0,time:5}).output.value).toBe(0);
    expect(runCalculator(distanceTimeCalculator,{speed:12,time:0}).output.value).toBe(0);
  });
});
