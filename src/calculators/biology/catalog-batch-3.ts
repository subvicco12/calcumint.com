import { z } from "zod";
import type { CalculatorDefinition } from "../types";

const allele=z.string().regex(/^[A-Za-z]$/,"Allele must be one letter");
const genotype=z.string().regex(/^[A-Za-z]{2}$/,"Genotype must contain exactly two allele letters");
const source={label:"OpenStax Biology 2e — Laws of Inheritance",url:"https://openstax.org/books/biology-2e/pages/12-3-laws-of-inheritance",note:"Describes Punnett squares as equally likely parental gamete combinations used to determine expected genotype and phenotype proportions."};

type In={parent1:string;parent2:string};
type Out={offspring:readonly string[];genotypeCounts:Record<string,number>;genotypeProbabilities:Record<string,number>;steps:readonly string[]};
const canonical=(a:string,b:string)=>a.toUpperCase()===b.toUpperCase()?(a===a.toUpperCase()?a+b:b+a):(a.toUpperCase()===a?a+b:b+a);
export const punnettSquareCalculator:CalculatorDefinition<In,Out>={
 id:"biology.punnett-square",slug:"punnett-square-calculator",title:"Punnett Square Calculator",category:"biology",version:1,riskClass:"standard",reviewStatus:"draft",
 inputSchema:z.object({parent1:genotype,parent2:genotype}).superRefine(({parent1,parent2},ctx)=>{const letters=(parent1+parent2).toLowerCase();if(![...letters].every(c=>c===letters[0]))ctx.addIssue({code:"custom",message:"This calculator supports one gene represented by one allele letter."});}),
 calculate:({parent1,parent2})=>{allele.parse(parent1[0]);const offspring=[canonical(parent1[0],parent2[0]),canonical(parent1[0],parent2[1]),canonical(parent1[1],parent2[0]),canonical(parent1[1],parent2[1])];const genotypeCounts:Record<string,number>={};for(const child of offspring)genotypeCounts[child]=(genotypeCounts[child]??0)+1;const genotypeProbabilities=Object.fromEntries(Object.entries(genotypeCounts).map(([k,v])=>[k,v/4]));return{offspring,genotypeCounts,genotypeProbabilities,steps:[`Parent 1 gametes: ${parent1[0]}, ${parent1[1]}`,`Parent 2 gametes: ${parent2[0]}, ${parent2[1]}`,`Four equally likely offspring combinations: ${offspring.join(", ")}`]};},
 formulas:[{id:"monohybrid-punnett-square",expression:"P(genotype) = matching Punnett cells / 4",description:"For a single-gene diploid cross, combine each of two parental alleles with each of the other parent's two alleles; the four cells are equally likely under Mendelian segregation."}],
 sources:[source],
 examples:[{label:"Aa × Aa",input:{parent1:"Aa",parent2:"Aa"},expected:{offspring:["AA","Aa","Aa","aa"],genotypeCounts:{AA:1,Aa:2,aa:1},genotypeProbabilities:{AA:.25,Aa:.5,aa:.25},steps:["Parent 1 gametes: A, a","Parent 2 gametes: A, a","Four equally likely offspring combinations: AA, Aa, Aa, aa"]}}],
 goldenTests:[{label:"Aa × Aa",input:{parent1:"Aa",parent2:"Aa"},expected:{offspring:{length:4,items:{0:"AA",1:"Aa",2:"Aa",3:"aa"}},genotypeCounts:{AA:1,Aa:2,aa:1},genotypeProbabilities:{AA:.25,Aa:.5,aa:.25}}}],
 ui:{simpleInputKeys:["parent1","parent2"]}
};

export const biologyBatch3Definitions=[punnettSquareCalculator] as const;
