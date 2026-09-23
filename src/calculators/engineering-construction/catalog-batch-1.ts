import { z } from "zod";
import type { CalculatorDefinition } from "../types";

const nonnegative=z.number().finite().min(0).max(1e100);
const positive=z.number().finite().positive().max(1e100);
const waste=z.number().finite().min(0).max(100);
type Out={value:number;steps:readonly string[]};
const checked=(v:number)=>{if(!Number.isFinite(v))throw new Error("Calculated result is outside the supported finite range");return v};
function def<I>(x:CalculatorDefinition<I,Out>){return x}
const mk=<I>(id:string,slug:string,title:string,schema:z.ZodType<I>,calc:(x:I)=>number,expression:string,description:string,example:I,expected:number)=>{
 const label=title.replace(" Calculator","");
 return def({id,slug,title,category:"engineering-construction",version:1,riskClass:"standard",reviewStatus:"certified",inputSchema:schema,
 calculate:(input:I)=>{const value=checked(calc(input));return{value,steps:[label+" = "+value]};},
 formulas:[{id,expression,description}],sources:[{label:"CalcuMint deterministic engineering & construction engine"}],
 examples:[{label:"Verified example",input:example,expected:{value:expected,steps:[label+" = "+expected]}}],
 goldenTests:[{label:"Verified example",input:example,expected:{value:expected,steps:[label+" = "+expected]}}]});
};

export const concreteCalculator=mk("engineering.concrete","concrete-calculator","Concrete Calculator",
 z.object({lengthMeters:positive,widthMeters:positive,depthMeters:positive,wastePercent:waste}),
 x=>x.lengthMeters*x.widthMeters*x.depthMeters*(1+x.wastePercent/100),
 "V=L×W×D×(1+w/100)","Concrete volume in cubic metres including an explicit waste allowance.",
 {lengthMeters:5,widthMeters:4,depthMeters:0.1,wastePercent:10},2.2);

export const squareFootageCalculator=mk("engineering.square-footage","square-footage-calculator","Square Footage Calculator",
 z.object({lengthFeet:positive,widthFeet:positive,quantity:z.number().finite().int().positive().max(1e9)}),
 x=>x.lengthFeet*x.widthFeet*x.quantity,
 "A=L×W×q","Total rectangular area in square feet across the selected quantity.",
 {lengthFeet:12,widthFeet:10,quantity:2},240);

export const paintCalculator=mk("engineering.paint","paint-calculator","Paint Calculator",
 z.object({wallAreaSquareMeters:positive,coats:z.number().finite().int().positive().max(100),coverageSquareMetersPerLiter:positive,wastePercent:waste}),
 x=>x.wallAreaSquareMeters*x.coats/x.coverageSquareMetersPerLiter*(1+x.wastePercent/100),
 "litres=(area×coats/coverage)×(1+w/100)","Paint required in litres from paintable area, coats, stated coverage and waste allowance.",
 {wallAreaSquareMeters:100,coats:2,coverageSquareMetersPerLiter:10,wastePercent:10},22);

export const flooringCalculator=mk("engineering.flooring","flooring-calculator","Flooring Calculator",
 z.object({lengthMeters:positive,widthMeters:positive,wastePercent:waste}),
 x=>x.lengthMeters*x.widthMeters*(1+x.wastePercent/100),
 "A=L×W×(1+w/100)","Flooring purchase area in square metres including waste allowance.",
 {lengthMeters:5,widthMeters:4,wastePercent:10},22);

export const roofingCalculator=mk("engineering.roofing","roofing-calculator","Roofing Calculator",
 z.object({buildingLengthFeet:positive,buildingWidthFeet:positive,pitchRisePer12:nonnegative,wastePercent:waste}),
 x=>{const slope=Math.sqrt(1+Math.pow(x.pitchRisePer12/12,2));return x.buildingLengthFeet*x.buildingWidthFeet*slope*(1+x.wastePercent/100)/100},
 "squares=(plan area×√(1+(rise/12)²)×(1+w/100))/100","Roofing squares (100 ft² each) for a simple gable-equivalent roof using plan area, pitch and waste.",
 {buildingLengthFeet:40,buildingWidthFeet:30,pitchRisePer12:6,wastePercent:10},14.758048651498612);

export const tileCalculator=mk("engineering.tile","tile-calculator","Tile Calculator",
 z.object({areaSquareMeters:positive,tileLengthCm:positive,tileWidthCm:positive,wastePercent:waste}),
 x=>Math.ceil((x.areaSquareMeters/((x.tileLengthCm/100)*(x.tileWidthCm/100)))*(1+x.wastePercent/100)),
 "tiles=ceil(area/tile area×(1+w/100))","Whole tiles required from surface area, tile dimensions and waste allowance.",
 {areaSquareMeters:20,tileLengthCm:50,tileWidthCm:50,wastePercent:10},88);

export const drywallCalculator=mk("engineering.drywall","drywall-calculator","Drywall Calculator",
 z.object({surfaceAreaSquareFeet:positive,sheetLengthFeet:positive,sheetWidthFeet:positive,wastePercent:waste}),
 x=>Math.ceil((x.surfaceAreaSquareFeet/(x.sheetLengthFeet*x.sheetWidthFeet))*(1+x.wastePercent/100)),
 "sheets=ceil(area/(sheet L×sheet W)×(1+w/100))","Whole drywall sheets required from total surface area, sheet size and waste allowance.",
 {surfaceAreaSquareFeet:1000,sheetLengthFeet:8,sheetWidthFeet:4,wastePercent:10},35);

export const lumberCalculator=mk("engineering.lumber","lumber-calculator","Lumber Calculator",
 z.object({thicknessInches:positive,widthInches:positive,lengthFeet:positive,quantity:z.number().finite().int().positive().max(1e9)}),
 x=>x.thicknessInches*x.widthInches*x.lengthFeet*x.quantity/12,
 "board feet=T(in)×W(in)×L(ft)×q/12","Total lumber volume in board feet.",
 {thicknessInches:2,widthInches:6,lengthFeet:10,quantity:10},100);

export const engineeringConstructionBatch1Definitions=[
 concreteCalculator,squareFootageCalculator,paintCalculator,flooringCalculator,roofingCalculator,tileCalculator,drywallCalculator,lumberCalculator
] as const;
