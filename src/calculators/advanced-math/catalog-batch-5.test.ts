import {describe,expect,it} from "vitest";
import {runCalculator} from "../engine";
import {linearEquationCalculator,matrixDeterminantCalculator,quadraticFormulaCalculator} from "./catalog-batch-5";
describe("advanced math catalog batch 5",()=>{
 it("solves a linear equation with deterministic steps",()=>{const o=runCalculator(linearEquationCalculator,{a:2,b:-8}).output;expect(o.solution).toBe(4);expect(o.steps.at(-1)).toBe("x = 4");expect(()=>runCalculator(linearEquationCalculator,{a:0,b:2})).toThrow();});
 it("solves real and complex quadratic roots",()=>{const r=runCalculator(quadraticFormulaCalculator,{a:1,b:-5,c:6}).output;expect(r.root1).toBe(3);expect(r.root2).toBe(2);expect(r.discriminant).toBe(1);const c=runCalculator(quadraticFormulaCalculator,{a:1,b:0,c:1}).output;expect(c.root1).toBeNull();expect(c.root1Text).toContain("i");expect(()=>runCalculator(quadraticFormulaCalculator,{a:0,b:2,c:1})).toThrow();});
 it("computes a 2x2 determinant",()=>{const o=runCalculator(matrixDeterminantCalculator,{a:1,b:2,c:3,d:4}).output;expect(o.determinant).toBe(-2);expect(o.steps).toHaveLength(3);});
});
