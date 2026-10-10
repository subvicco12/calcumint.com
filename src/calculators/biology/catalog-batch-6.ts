import { z } from "zod";
import type { CalculatorDefinition } from "../types";
import { roundTo } from "../precision";

const source={label:"OpenStax Microbiology — How Microbes Grow",url:"https://openstax.org/books/microbiology/pages/9-1-how-microbes-grow",note:"Describes serial dilution and viable plate counts; original CFU/mL is reconstructed from colony count, plated volume, and dilution."};
type In={colonyCount:number;dilution:number;platedVolumeMl:number};
type Out={cfuPerMl:number;steps:readonly string[]};
export const microbiologyDilutionCalculator:CalculatorDefinition<In,Out>={
 id:"biology.microbiology-dilution",slug:"microbiology-dilution-calculator",title:"Microbiology Dilution Calculator",category:"biology",version:1,riskClass:"standard",reviewStatus:"draft",
 inputSchema:z.object({colonyCount:z.number().int().nonnegative().max(1e9),dilution:z.number().finite().positive().max(1),platedVolumeMl:z.number().finite().positive().max(1e6)}),
 calculate:({colonyCount,dilution,platedVolumeMl})=>{z.object({colonyCount:z.number().int().nonnegative().max(1e9),dilution:z.number().finite().positive().max(1),platedVolumeMl:z.number().finite().positive().max(1e6)}).parse({colonyCount,dilution,platedVolumeMl});const cfuPerMl=roundTo(colonyCount/(dilution*platedVolumeMl),2);return{cfuPerMl,steps:[`Original CFU/mL = ${colonyCount} ÷ (${dilution} × ${platedVolumeMl} mL) = ${cfuPerMl}`]};},
 formulas:[{id:"viable-plate-count",expression:"CFU/mL = colony count / (total dilution × plated volume in mL)",description:"Reconstructs viable colony-forming units per milliliter in the original suspension from a diluted plate count."}],
 sources:[source],
 examples:[{label:"50 colonies from 1:10,000 dilution, 0.1 mL plated",input:{colonyCount:50,dilution:0.0001,platedVolumeMl:0.1},expected:{cfuPerMl:5000000,steps:["Original CFU/mL = 50 ÷ (0.0001 × 0.1 mL) = 5000000"]}}],
 goldenTests:[{label:"OpenStax serial-dilution example",input:{colonyCount:50,dilution:0.0001,platedVolumeMl:0.1},expected:{cfuPerMl:5000000}}],
 ui:{simpleInputKeys:["colonyCount","dilution","platedVolumeMl"]}
};
export const biologyBatch6Definitions=[microbiologyDilutionCalculator] as const;
