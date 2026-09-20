import { z } from "zod";
import type { CalculatorDefinition } from "../types";
const finite=z.number().finite().min(-1e100).max(1e100);
function checked(n:number,label:string){if(!Number.isFinite(n))throw new Error(`${label} is outside the supported numeric range`);return n;}

export type System2Output={x:number;y:number;determinant:number;steps:readonly string[]};
export const systemOfEquationsCalculator:CalculatorDefinition<{a:number;b:number;c:number;d:number;e:number;f:number},System2Output>={
 id:"advanced-math.system-equations",slug:"system-of-equations-solver",title:"System of Equations Solver",category:"advanced-math-graphing",version:1,riskClass:"standard",reviewStatus:"certified",
 inputSchema:z.object({a:finite,b:finite,c:finite,d:finite,e:finite,f:finite}).refine(v=>v.a*v.e-v.b*v.d!==0,"The system must have one unique solution"),
 calculate:({a,b,c,d,e,f})=>{const det=checked(a*e-b*d,"Determinant"),x=checked((c*e-b*f)/det,"x"),y=checked((a*f-c*d)/det,"y");return{x,y,determinant:det,steps:[`D = ae - bd = ${det}`,`x = (ce - bf) / D = ${x}`,`y = (af - cd) / D = ${y}`]};},
 formulas:[{id:"cramers-rule-2x2",expression:"x=(ce-bf)/(ae-bd), y=(af-cd)/(ae-bd)",description:"Solves ax + by = c and dx + ey = f using the non-zero 2×2 determinant."}],
 sources:[{label:"CalcuMint deterministic algebra engine",note:"Standard two-variable linear-system identities."}],
 examples:[{label:"x+y=5; x-y=1",input:{a:1,b:1,c:5,d:1,e:-1,f:1},expected:{x:3,y:2,determinant:-2,steps:["D = ae - bd = -2","x = (ce - bf) / D = 3","y = (af - cd) / D = 2"]}}],
 goldenTests:[{label:"x+y=5; x-y=1",input:{a:1,b:1,c:5,d:1,e:-1,f:1},expected:{x:3,y:2,determinant:-2,steps:["D = ae - bd = -2","x = (ce - bf) / D = 3","y = (af - cd) / D = 2"]}}]
};

export type MatrixInverseOutput={m11:number;m12:number;m21:number;m22:number;determinant:number;steps:readonly string[]};
export const matrixInverseCalculator:CalculatorDefinition<{a:number;b:number;c:number;d:number},MatrixInverseOutput>={
 id:"advanced-math.matrix-inverse",slug:"matrix-inverse-calculator",title:"Matrix Inverse Calculator",category:"advanced-math-graphing",version:1,riskClass:"standard",reviewStatus:"certified",
 inputSchema:z.object({a:finite,b:finite,c:finite,d:finite}).refine(v=>v.a*v.d-v.b*v.c!==0,"Matrix must be invertible"),
 calculate:({a,b,c,d})=>{const det=checked(a*d-b*c,"Determinant");const m11=checked(d/det,"Inverse value"),m12=checked(-b/det,"Inverse value"),m21=checked(-c/det,"Inverse value"),m22=checked(a/det,"Inverse value");return{m11,m12,m21,m22,determinant:det,steps:[`det = ad - bc = ${det}`,`A⁻¹ = (1/${det})[[${d}, ${-b}],[${-c}, ${a}]]`,`A⁻¹ = [[${m11}, ${m12}],[${m21}, ${m22}]]`]};},
 formulas:[{id:"inverse-2x2",expression:"A⁻¹=(1/(ad-bc))[[d,-b],[-c,a]]",description:"Computes the inverse of a non-singular 2×2 matrix."}],
 sources:[{label:"CalcuMint deterministic linear-algebra engine",note:"Standard 2×2 matrix inverse identity."}],
 examples:[{label:"Inverse of [[4,7],[2,6]]",input:{a:4,b:7,c:2,d:6},expected:{m11:.6,m12:-.7,m21:-.2,m22:.4,determinant:10,steps:["det = ad - bc = 10","A⁻¹ = (1/10)[[6, -7],[-2, 4]]","A⁻¹ = [[0.6, -0.7],[-0.2, 0.4]]"]}}],
 goldenTests:[{label:"Inverse of [[4,7],[2,6]]",input:{a:4,b:7,c:2,d:6},expected:{m11:.6,m12:-.7,m21:-.2,m22:.4,determinant:10,steps:["det = ad - bc = 10","A⁻¹ = (1/10)[[6, -7],[-2, 4]]","A⁻¹ = [[0.6, -0.7],[-0.2, 0.4]]"]}}]
};

export type ComplexOutput={real:number;imaginary:number;magnitude:number;argument:number;display:string;steps:readonly string[]};
export const complexNumberCalculator:CalculatorDefinition<{a:number;b:number;c:number;d:number;operation:"add"|"subtract"|"multiply"|"divide"},ComplexOutput>={
 id:"advanced-math.complex-number",slug:"complex-number-calculator",title:"Complex Number Calculator",category:"advanced-math-graphing",version:1,riskClass:"standard",reviewStatus:"certified",
 inputSchema:z.object({a:finite,b:finite,c:finite,d:finite,operation:z.enum(["add","subtract","multiply","divide"])}).refine(v=>v.operation!=="divide"||v.c!==0||v.d!==0,"Cannot divide by zero"),
 calculate:({a,b,c,d,operation})=>{let real=0,imaginary=0;if(operation==="add"){real=a+c;imaginary=b+d}else if(operation==="subtract"){real=a-c;imaginary=b-d}else if(operation==="multiply"){real=a*c-b*d;imaginary=a*d+b*c}else{const den=c*c+d*d;real=(a*c+b*d)/den;imaginary=(b*c-a*d)/den}real=checked(real,"Real component");imaginary=checked(imaginary,"Imaginary component");const magnitude=checked(Math.hypot(real,imaginary),"Magnitude"),argument=Math.atan2(imaginary,real);const display=`${real} ${imaginary<0?"-":"+"} ${Math.abs(imaginary)}i`;return{real,imaginary,magnitude,argument,display,steps:[`Operation: ${operation}`,`Result = ${display}`,`|z| = ${magnitude}`]};},
 formulas:[{id:"complex-arithmetic",expression:"(a+bi) ⊕ (c+di)",description:"Applies deterministic complex addition, subtraction, multiplication or division and reports rectangular and polar properties."}],
 sources:[{label:"CalcuMint deterministic complex-arithmetic engine",note:"Standard complex-number arithmetic identities."}],
 examples:[{label:"(1+2i)+(3+4i)",input:{a:1,b:2,c:3,d:4,operation:"add"},expected:{real:4,imaginary:6,magnitude:Math.hypot(4,6),argument:Math.atan2(6,4),display:"4 + 6i",steps:["Operation: add","Result = 4 + 6i",`|z| = ${Math.hypot(4,6)}`]}}],
 goldenTests:[{label:"(1+2i)+(3+4i)",input:{a:1,b:2,c:3,d:4,operation:"add"},expected:{real:4,imaginary:6,magnitude:Math.hypot(4,6),argument:Math.atan2(6,4),display:"4 + 6i",steps:["Operation: add","Result = 4 + 6i",`|z| = ${Math.hypot(4,6)}`]}}]
};
export const advancedMathBatch6Definitions=[systemOfEquationsCalculator,matrixInverseCalculator,complexNumberCalculator] as const;
