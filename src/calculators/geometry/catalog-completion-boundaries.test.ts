import { describe, expect, it } from "vitest";
import { rightTriangleCalculator, surfaceAreaCalculator, volumeCalculator } from "./catalog-completion";

describe("geometry finite result boundaries",()=>{
  it("rejects right-triangle area overflow",()=>{
    const input=rightTriangleCalculator.inputSchema.parse({a:1e308,b:1e308});
    expect(()=>rightTriangleCalculator.calculate(input,{})).toThrow("outside the supported numeric range");
  });
  for(const calculator of [surfaceAreaCalculator,volumeCalculator]){
    it(`${calculator.slug} rejects prism overflow`,()=>{
      const input=calculator.inputSchema.parse({length:1e308,width:1e308,height:1e308});
      expect(()=>calculator.calculate(input,{})).toThrow("outside the supported numeric range");
    });
  }
});
