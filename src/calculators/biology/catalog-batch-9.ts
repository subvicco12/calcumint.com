import { z } from "zod";
import type { CalculatorDefinition } from "../types";
import { roundTo } from "../precision";
type In={totalCellsCounted:number;squaresCounted:number;dilutionFactor:number};type Out={averageCellsPerSquare:number;cellsPerMl:number;steps:readonly string[]};
export const cellConcentrationCalculator:CalculatorDefinition<In,Out>={
 id:"biology.cell-concentration",slug:"cell-concentration-calculator",title:"Cell Concentration Calculator",category:"biology",version:1,riskClass:"standard",reviewStatus:"draft",
 inputSchema:z.object({totalCellsCounted:z.number().finite().nonnegative().int().max(1e12),squaresCounted:z.number().finite().positive().int().max(1e6),dilutionFactor:z.number().finite().positive().max(1e9)}),
 calculate:x=>{z.object({totalCellsCounted:z.number().finite().nonnegative().int().max(1e12),squaresCounted:z.number().finite().positive().int().max(1e6),dilutionFactor:z.number().finite().positive().max(1e9)}).parse(x);const averageCellsPerSquare=x.totalCellsCounted/x.squaresCounted;const cellsPerMl=averageCellsPerSquare*x.dilutionFactor*1e4;return{averageCellsPerSquare:roundTo(averageCellsPerSquare,6),cellsPerMl:roundTo(cellsPerMl,6),steps:[`Average cells per large square = ${x.totalCellsCounted} ÷ ${x.squaresCounted} = ${roundTo(averageCellsPerSquare,6)}`,`Cells/mL = ${roundTo(averageCellsPerSquare,6)} × ${x.dilutionFactor} × 10^4 = ${roundTo(cellsPerMl,6)}`]};},
 formulas:[{id:"hemocytometer-cell-concentration",expression:"cells/mL = (total cells counted / large squares counted) × dilution factor × 10^4",description:"Manual hemocytometer concentration using large counting squares, each representing 10^-4 mL."}],
 sources:[{label:"Thermo Fisher Scientific — Countess / hemocytometer cell counting guidance",url:"https://www.thermofisher.com/us/en/home/references/gibco-cell-culture-basics/cell-culture-protocols/counting-cells-in-a-hemocytometer.html",note:"Describes hemocytometer counting and the 10^4 volume conversion used to calculate cells per mL."}],
 examples:[{label:"200 cells across 4 squares at 2× dilution",input:{totalCellsCounted:200,squaresCounted:4,dilutionFactor:2},expected:{averageCellsPerSquare:50,cellsPerMl:1000000,steps:["Average cells per large square = 200 ÷ 4 = 50","Cells/mL = 50 × 2 × 10^4 = 1000000"]}}],
 goldenTests:[{label:"Hemocytometer concentration fixture",input:{totalCellsCounted:200,squaresCounted:4,dilutionFactor:2},expected:{averageCellsPerSquare:50,cellsPerMl:1000000}}],
 ui:{simpleInputKeys:["totalCellsCounted","squaresCounted","dilutionFactor"]}
};export const biologyBatch9Definitions=[cellConcentrationCalculator] as const;
