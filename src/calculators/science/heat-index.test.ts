import { describe, expect, it } from "vitest";
import { calculateHeatIndex } from "./heat-index";

// References transcribed from pinned MetPy test_basic.py; rounded there to whole F.
describe("private heat index scientific kernel", () => {
  it.each([[86,45,87],[111,27,121],[96,60,116],[96,65,121],[92,70,112],[110,40,136],[86,88,104]])("matches independent published regression vector %s/%s", (temperature,rh,expected) => {
    const r = calculateHeatIndex({temperature, temperatureUnit:"F",relativeHumidityPercent:rh});
    expect(r.status).toBe("supported");
    if(r.status === "supported") expect(Math.abs(r.heatIndexF-expected)).toBeLessThan(.5);
  });
  // Independent 40-digit Decimal calculation recorded under docs/evidence/heat.
  it.each([[95,10,89.44958730],[80,90,86.34189170],[80,0,76.58525919657369],[90,50,94.59694120],[112,13,108.98888766]])("matches Decimal reference %s/%s", (temperature,rh,expected) => {
    const r=calculateHeatIndex({temperature,temperatureUnit:"F",relativeHumidityPercent:rh});
    expect(r.status === "supported" && r.heatIndexF).toBeCloseTo(expected,9);
  });
  it("switches from simple to regression at the source threshold", () => {
    const below=calculateHeatIndex({temperature:80,temperatureUnit:"F",relativeHumidityPercent:27});
    const above=calculateHeatIndex({temperature:80,temperatureUnit:"F",relativeHumidityPercent:28});
    expect(below.status === "supported" && below.regime).toBe("simple");
    expect(above.status === "supported" && above.regime).toBe("rothfusz");
  });
  it("preserves Celsius units and published precision", () => {
    const r=calculateHeatIndex({temperature:35,temperatureUnit:"C",relativeHumidityPercent:70});
    expect(r.status).toBe("supported");
    if(r.status === "supported") expect(r.heatIndex).toBeCloseTo(50.3405,3);
  });
  it.each([[80,0,"simple"],[95,10,"rothfusz-low-humidity"],[80,90,"rothfusz-high-humidity"],[87,85,"rothfusz"],[112,13,"rothfusz-low-humidity"]])("identifies branch at %s/%s", (t,rh,regime) => {
    const r=calculateHeatIndex({temperature:t as number,temperatureUnit:"F",relativeHumidityPercent:rh as number});
    expect(r.status === "supported" && r.regime).toBe(regime);
  });
  it.each([[79,50],[113,50],[90,-1],[90,101],[NaN,50],[Infinity,50],[90,NaN]])("rejects unsupported inputs %s/%s without numeric placeholders", (temperature,rh) => {
    const r=calculateHeatIndex({temperature,temperatureUnit:"F",relativeHumidityPercent:rh});
    expect(r.status).toBe("unsupported"); expect(r).not.toHaveProperty("heatIndex");
  });
  it("rejects runtime units and provides exposure/model limitations", () => {
    expect(calculateHeatIndex({temperature:90,temperatureUnit:"K" as "F",relativeHumidityPercent:50}).status).toBe("unsupported");
    const r=calculateHeatIndex({temperature:90,temperatureUnit:"F",relativeHumidityPercent:50});
    expect(r.modelVersion).toContain("d247e5d");
    expect(r.limitations.join(" ")).toMatch(/shade/);
  });
});
