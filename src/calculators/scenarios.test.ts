import { describe, expect, it } from "vitest";
import { compareScenarios } from "./scenarios";

describe("compareScenarios", () => {
  it("runs scenarios and compares explicit metrics", () => {
    const result = compareScenarios(
      [{ id:"base",label:"Base",input:{principal:100}},{id:"extra",label:"Extra",input:{principal:80}}],
      (input) => ({ cost: input.principal * 1.1, value: 200 - input.principal }),
      [{ id:"cost",value:(output)=>output.cost,preference:"lower" },{id:"value",value:(output)=>output.value,preference:"higher" }],
    );
    expect(result.scenarios).toHaveLength(2);
    expect(result.metrics[0].preferredScenarioId).toBe("extra");
    expect(result.metrics[1].preferredScenarioId).toBe("extra");
  });

  it("does not invent a preferred scenario without an explicit preference", () => {
    const result=compareScenarios([{id:"a",label:"A",input:1},{id:"b",label:"B",input:2}],(input)=>({score:input}),[{id:"score",value:(output)=>output.score}]);
    expect(result.metrics[0].preferredScenarioId).toBeUndefined();
  });

  it("validates scenarios metrics and finite outputs", () => {
    expect(()=>compareScenarios([{id:"a",label:"A",input:1}],(x)=>x,[{id:"x",value:(x)=>x}])).toThrow(/at least two/);
    expect(()=>compareScenarios([{id:"a",label:"A",input:1},{id:"a",label:"Again",input:2}],(x)=>x,[{id:"x",value:(x)=>x}])).toThrow(/unique/);
    expect(()=>compareScenarios([{id:"a",label:"A",input:1},{id:"b",label:"B",input:2}],(x)=>x,[])).toThrow(/at least one metric/);
    expect(()=>compareScenarios([{id:"a",label:"A",input:1},{id:"b",label:"B",input:2}],()=>Number.POSITIVE_INFINITY,[{id:"x",value:(x)=>x}])).toThrow(/finite/);
  });
});
