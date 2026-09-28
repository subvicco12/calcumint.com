import { z } from "zod";
import type { CalculatorDefinition } from "../types";

type TireInput={currentWidthMm:number;currentAspectRatio:number;currentRimInches:number;newWidthMm:number;newAspectRatio:number;newRimInches:number};
type TireOut={currentDiameterMm:number;newDiameterMm:number;diameterDifferencePercent:number;steps:string[]};
type HorsepowerInput={kilowatts:number};
type HorsepowerOut={horsepower:number;steps:string[]};
type EngineHorsepowerInput={torqueLbFt:number;rpm:number};
type EngineHorsepowerOut={horsepower:number;steps:string[]};

const positive=z.number().finite().positive().max(1e9);
const tireWidth=z.number().finite().positive().max(1000);
const aspect=z.number().finite().positive().max(100);
const rim=z.number().finite().positive().max(100);
const global={category:"everyday",version:1,riskClass:"standard" as const,reviewStatus:"draft" as const,jurisdictions:[{country:"GLOBAL"}]};

const tireSource={label:"Tire Rack — How Do I Calculate Tire Dimensions?",url:"https://www.tirerack.com/upgrade-garage/how-do-i-calculate-tire-dimensions",note:"Nominal dimensions are estimates from the marked tire size; actual manufacturer dimensions can differ."};
const nistSource={label:"NIST Guide to the SI — conversion factors",url:"https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b8",note:"NIST lists mechanical horsepower (550 ft·lbf/s) as 745.6999 W."};
const engineSource={label:"Hot Rod — How to Read a Dyno Sheet",url:"https://www.hotrod.com/how-to/reading-dyno-sheet",note:"Dyno torque in lb-ft and engine speed in rpm are related to horsepower by hp = rpm × torque ÷ 5252."};

function finite(value:number){if(!Number.isFinite(value))throw new Error("Calculated result is outside the supported finite range");return value;}
function diameterMm(width:number,ratio:number,rimInches:number){return finite(2*width*(ratio/100)+rimInches*25.4);}

export const tireSizeCalculator:CalculatorDefinition<TireInput,TireOut>={
 ...global,id:"automotive.tire-size",slug:"tire-size-calculator",title:"Tire Size Calculator",
 inputSchema:z.object({currentWidthMm:tireWidth,currentAspectRatio:aspect,currentRimInches:rim,newWidthMm:tireWidth,newAspectRatio:aspect,newRimInches:rim}),
 calculate:(input)=>{const currentDiameterMm=diameterMm(input.currentWidthMm,input.currentAspectRatio,input.currentRimInches);const newDiameterMm=diameterMm(input.newWidthMm,input.newAspectRatio,input.newRimInches);const diameterDifferencePercent=finite((newDiameterMm-currentDiameterMm)/currentDiameterMm*100);return{currentDiameterMm,newDiameterMm,diameterDifferencePercent,steps:[`Current nominal diameter = ${currentDiameterMm} mm`,`New nominal diameter = ${newDiameterMm} mm`,`Diameter difference = ${diameterDifferencePercent}%`]};},
 formulas:[{id:"nominal-tire-diameter",expression:"diameter mm = 2 × width mm × aspect ratio / 100 + rim inches × 25.4",description:"Estimate nominal overall diameter from metric tire width, aspect ratio and rim diameter."},{id:"diameter-difference",expression:"difference % = (new diameter − current diameter) ÷ current diameter × 100",description:"Compare the nominal overall diameters of two tire sizes."}],
 sources:[tireSource],
 examples:[{label:"225/45R17 to 245/40R18",input:{currentWidthMm:225,currentAspectRatio:45,currentRimInches:17,newWidthMm:245,newAspectRatio:40,newRimInches:18},expected:{currentDiameterMm:634.3,newDiameterMm:653.2,diameterDifferencePercent:2.979662620211258,steps:["Current nominal diameter = 634.3 mm","New nominal diameter = 653.2 mm","Diameter difference = 2.979662620211258%"]}}],
 goldenTests:[{label:"225/45R17 nominal diameter",input:{currentWidthMm:225,currentAspectRatio:45,currentRimInches:17,newWidthMm:245,newAspectRatio:40,newRimInches:18},expected:{currentDiameterMm:634.3,newDiameterMm:653.2}}]
};

export const horsepowerCalculator:CalculatorDefinition<HorsepowerInput,HorsepowerOut>={
 ...global,id:"automotive.horsepower",slug:"horsepower-calculator",title:"Horsepower Calculator",
 inputSchema:z.object({kilowatts:z.number().finite().nonnegative().max(1e9)}),
 calculate:(input)=>{const horsepower=finite(input.kilowatts*1000/745.6999);return{horsepower,steps:[`Mechanical horsepower = ${horsepower}`]};},
 formulas:[{id:"kw-to-mechanical-hp",expression:"hp = kW × 1000 ÷ 745.6999",description:"Convert SI power in kilowatts to mechanical horsepower using the NIST conversion factor."}],
 sources:[nistSource],
 examples:[{label:"100 kW",input:{kilowatts:100},expected:{horsepower:134.1022140476948,steps:["Mechanical horsepower = 134.1022140476948"]}}],
 goldenTests:[{label:"NIST conversion",input:{kilowatts:100},expected:{horsepower:134.1022140476948}}]
};

export const engineHorsepowerCalculator:CalculatorDefinition<EngineHorsepowerInput,EngineHorsepowerOut>={
 ...global,id:"automotive.engine-horsepower",slug:"engine-horsepower-calculator",title:"Engine Horsepower Calculator",
 inputSchema:z.object({torqueLbFt:z.number().finite().nonnegative().max(1e9),rpm:positive}),
 calculate:(input)=>{const horsepower=finite(input.torqueLbFt*input.rpm/5252);return{horsepower,steps:[`Engine horsepower = ${horsepower}`]};},
 formulas:[{id:"torque-rpm-hp",expression:"hp = torque (lb-ft) × rpm ÷ 5252",description:"Calculate engine horsepower from measured torque and engine speed."}],
 sources:[engineSource,nistSource],
 examples:[{label:"400 lb-ft at 5252 rpm",input:{torqueLbFt:400,rpm:5252},expected:{horsepower:400,steps:["Engine horsepower = 400"]}}],
 goldenTests:[{label:"torque and horsepower equality at 5252 rpm",input:{torqueLbFt:400,rpm:5252},expected:{horsepower:400}}]
};

export const automotiveEngineeringBatch2Definitions=[tireSizeCalculator,horsepowerCalculator,engineHorsepowerCalculator] as const;
