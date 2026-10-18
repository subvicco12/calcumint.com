import{describe,expect,it}from"vitest";import{compileExpression,parseExpression}from"./expression-engine";describe("deterministic expression engine",()=>{it("respects mathematical precedence and right-associative powers",()=>{expect(compileExpression("2+3*4")(0)).toBe(14);expect(compileExpression("2^3^2")(0)).toBe(512);expect(compileExpression("-2^2")(0)).toBe(-4);expect(compileExpression("(-2)^2")(0)).toBe(4);expect(compileExpression("-x^2")(3)).toBe(-9);expect(compileExpression("2^-2")(0)).toBeCloseTo(.25)});it("supports x, constants and approved functions",()=>{expect(compileExpression("sin(pi/2)+x^2")(3)).toBeCloseTo(10);expect(compileExpression("ln(e)")(0)).toBeCloseTo(1)});it("rejects unknown identifiers and implicit execution",()=>{expect(()=>parseExpression("alert(1)")).toThrow(/Unsupported identifier/);expect(()=>parseExpression("x;1")).toThrow(/Unsupported character/)});it("rejects undefined numeric results",()=>expect(()=>compileExpression("1/(x-1)")(1)).toThrow(/undefined/))});

describe("expression parser security boundaries",()=>{
  it("rejects property access, indexing, assignments, and code separators",()=>{
    for(const payload of ["x.constructor","x[0]","x=1","x;1","x,1","x?1:2","x{1}","process.exit(1)","globalThis","__proto__"]){
      expect(()=>parseExpression(payload),payload).toThrow();
    }
  });
  it("rejects unsupported calls and implicit multiplication",()=>{
    for(const payload of ["eval(1)","fetch(1)","constructor(1)","sin(x)cos(x)","2x","x(x)","sin x"]){
      expect(()=>parseExpression(payload),payload).toThrow();
    }
  });
  it("enforces source length and finite numeric literals",()=>{
    expect(()=>parseExpression("x".repeat(501))).toThrow(/too long/);
    expect(()=>parseExpression("1e999")).toThrow(/outside the supported range/);
  });
  it("rejects nonfinite mathematical evaluations",()=>{
    for(const expression of ["sqrt(-1)","ln(0)","1/0","exp(1000)"]){
      expect(()=>compileExpression(expression)(0),expression).toThrow(/undefined or outside/);
    }
  });
});
