import { z } from "zod";
import type { CalculatorDefinition } from "../types";

const finite=z.number().finite().min(-1e150).max(1e150);
const nonZero=finite.refine(v=>Math.abs(v)>=1e-150,"Coefficient magnitude must be at least 1e-150");
function requireFinite(value:number,label:string){if(!Number.isFinite(value))throw new Error(`${label} is outside the supported numeric range`);return value;}

export type LinearEquationOutput={solution:number;steps:readonly string[]};
export const linearEquationCalculator:CalculatorDefinition<{a:number;b:number},LinearEquationOutput>={
 id:"advanced-math.linear-equation",slug:"linear-equation-solver",title:"Linear Equation Solver",category:"advanced-math-graphing",version:1,riskClass:"standard",reviewStatus:"certified",
 inputSchema:z.object({a:nonZero,b:finite}),
 calculate:({a,b})=>{const solution=requireFinite(-b/a,"Solution");return{solution,steps:[`${a}x + ${b} = 0`,`${a}x = ${-b}`,`x = ${solution}`]};},
 formulas:[{id:"linear-root",expression:"For ax + b = 0, x = -b / a",description:"Isolate x by subtracting b and dividing by the non-zero coefficient a."}],
 sources:[{label:"CalcuMint deterministic algebra engine",note:"Standard algebraic isolation of a first-degree equation."}],
 examples:[{label:"2x - 8 = 0",input:{a:2,b:-8},expected:{solution:4,steps:["2x + -8 = 0","2x = 8","x = 4"]}}],
 goldenTests:[{label:"2x - 8 = 0",input:{a:2,b:-8},expected:{solution:4,steps:["2x + -8 = 0","2x = 8","x = 4"]}}]
};

export type QuadraticOutput={discriminant:number;root1:number|null;root2:number|null;root1Text:string;root2Text:string;vertexX:number;vertexY:number;steps:readonly string[]};
export const quadraticFormulaCalculator:CalculatorDefinition<{a:number;b:number;c:number},QuadraticOutput>={
 id:"advanced-math.quadratic-formula",slug:"quadratic-formula-calculator",title:"Quadratic Formula Calculator",category:"advanced-math-graphing",version:1,riskClass:"standard",reviewStatus:"certified",
 inputSchema:z.object({a:nonZero,b:finite,c:finite}),
 calculate:({a,b,c})=>{const d=requireFinite(b*b-4*a*c,"Discriminant");const vx=requireFinite(-b/(2*a),"Vertex x");const vy=requireFinite(a*vx*vx+b*vx+c,"Vertex y");if(d>=0){const sqrtD=Math.sqrt(d);const q=-0.5*(b+(b>=0?sqrtD:-sqrtD));let r1:number,r2:number;if(q===0){r1=r2=0;}else{r1=requireFinite(q/a,"Root");r2=requireFinite(c/q,"Root");}return{discriminant:d,root1:r1,root2:r2,root1Text:String(r1),root2Text:String(r2),vertexX:vx,vertexY:vy,steps:[`D = b² - 4ac = ${d}`,`Use stable q = -½(b + sign(b)√D)`,`x₁ = ${r1}, x₂ = ${r2}`]};}const real=requireFinite(-b/(2*a),"Real root component"),imag=requireFinite(Math.sqrt(-d)/Math.abs(2*a),"Imaginary root component");return{discriminant:d,root1:null,root2:null,root1Text:`${real} + ${imag}i`,root2Text:`${real} - ${imag}i`,vertexX:vx,vertexY:vy,steps:[`D = b² - 4ac = ${d}`,`D < 0, so the roots are complex`,`x = ${real} ± ${imag}i`]};},
 formulas:[{id:"quadratic-formula",expression:"x = (-b ± √(b² - 4ac)) / (2a)",description:"Uses the discriminant to determine and calculate the two roots of ax² + bx + c = 0."}],
 sources:[{label:"CalcuMint deterministic algebra engine",note:"Standard quadratic formula and vertex identities."}],
 examples:[{label:"x² - 5x + 6 = 0",input:{a:1,b:-5,c:6},expected:{discriminant:1,root1:3,root2:2,root1Text:"3",root2Text:"2",vertexX:2.5,vertexY:-0.25,steps:["D = b² - 4ac = 1","Use stable q = -½(b + sign(b)√D)","x₁ = 3, x₂ = 2"]}}],
 goldenTests:[{label:"x² - 5x + 6 = 0",input:{a:1,b:-5,c:6},expected:{discriminant:1,root1:3,root2:2,root1Text:"3",root2Text:"2",vertexX:2.5,vertexY:-0.25,steps:["D = b² - 4ac = 1","Use stable q = -½(b + sign(b)√D)","x₁ = 3, x₂ = 2"]}}]
};

export type DeterminantOutput={determinant:number;steps:readonly string[]};
export const matrixDeterminantCalculator:CalculatorDefinition<{a:number;b:number;c:number;d:number},DeterminantOutput>={
 id:"advanced-math.matrix-determinant",slug:"matrix-determinant-calculator",title:"Matrix Determinant Calculator",category:"advanced-math-graphing",version:1,riskClass:"standard",reviewStatus:"certified",
 inputSchema:z.object({a:finite,b:finite,c:finite,d:finite}),
 calculate:({a,b,c,d})=>{const ad=requireFinite(a*d,"Diagonal product");const bc=requireFinite(b*c,"Diagonal product");const determinant=requireFinite(ad-bc,"Determinant");return{determinant,steps:[`det = (${a} × ${d}) - (${b} × ${c})`,`det = ${ad} - ${bc}`,`det = ${determinant}`]};},
 formulas:[{id:"determinant-2x2",expression:"det([[a,b],[c,d]]) = ad - bc",description:"Computes the determinant of a 2×2 matrix."}],
 sources:[{label:"CalcuMint deterministic linear-algebra engine",note:"Standard 2×2 determinant identity."}],
 examples:[{label:"[[1,2],[3,4]]",input:{a:1,b:2,c:3,d:4},expected:{determinant:-2,steps:["det = (1 × 4) - (2 × 3)","det = 4 - 6","det = -2"]}}],
 goldenTests:[{label:"[[1,2],[3,4]]",input:{a:1,b:2,c:3,d:4},expected:{determinant:-2,steps:["det = (1 × 4) - (2 × 3)","det = 4 - 6","det = -2"]}}]
};

export const advancedMathDefinitions=[linearEquationCalculator,quadraticFormulaCalculator,matrixDeterminantCalculator] as const;
