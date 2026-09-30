import { z } from "zod";
import type { CalculatorDefinition } from "../types";

type Out={value:number;steps:readonly string[]};
const finite=(value:number)=>{if(!Number.isFinite(value))throw new Error("Calculated result is outside the supported finite range");return value};
const fraction=z.number().finite().min(0).max(1);
const openstax={label:"OpenStax Biology 2e — Population Evolution",url:"https://openstax.org/books/biology-2e/pages/19-1-population-evolution",note:"Defines the two-allele Hardy-Weinberg relationships p + q = 1 and p² + 2pq + q² = 1."};

type HwIn={allelePFrequency:number}; type HwOut={p:number;q:number;p2:number;twoPq:number;q2:number;steps:readonly string[]};
export const hardyWeinbergCalculator:CalculatorDefinition<HwIn,HwOut>={
 id:"biology.hardy-weinberg",slug:"hardy-weinberg-calculator",title:"Hardy-Weinberg Calculator",category:"biology",version:1,riskClass:"standard",reviewStatus:"draft",
 inputSchema:z.object({allelePFrequency:fraction}),
 calculate:({allelePFrequency:p})=>{const q=finite(1-p),p2=finite(p*p),twoPq=finite(2*p*q),q2=finite(q*q);return{p,q,p2,twoPq,q2,steps:[`q = 1 - p = ${q}`,`p² = ${p2}; 2pq = ${twoPq}; q² = ${q2}`]};},
 formulas:[{id:"hardy-weinberg-two-allele",expression:"q = 1 - p; genotype frequencies = p², 2pq, q²",description:"Two-allele Hardy-Weinberg equilibrium frequencies from a supplied p allele frequency."}],
 sources:[openstax],examples:[{label:"p = 0.6",input:{allelePFrequency:.6},expected:{p:.6,q:.4,p2:.36,twoPq:.48,q2:.16,steps:["q = 1 - p = 0.4","p² = 0.36; 2pq = 0.48; q² = 0.16000000000000003"]}}],
 goldenTests:[{label:"p = 0.6",input:{allelePFrequency:.6},expected:{p:.6,q:.4,p2:.36,twoPq:.48,q2:.16}}],ui:{simpleInputKeys:["allelePFrequency"]}
};

export const biologyBatch2Definitions=[hardyWeinbergCalculator] as const;
