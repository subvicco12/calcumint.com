import { z } from "zod";
import type { CalculatorDefinition } from "../types";
import { convertUnit } from "../units";

type ConversionUnit = { code: string; factor?: number };
type Output = { result:number };

const nist={label:"NIST Guide to the SI — conversion factors",url:"https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b9",note:"Reference conversion factors for SI and accepted non-SI units."};
const bipm={label:"BIPM — SI Brochure, 9th edition",url:"https://www.bipm.org/en/publications/si-brochure",note:"Authoritative reference for SI units and prefixes."};

function linearDefinition(id:string,slug:string,title:string,units:readonly ConversionUnit[],example:{value:number;fromUnit:string;toUnit:string;expected:number},formula:string):CalculatorDefinition<{value:number;fromUnit:string;toUnit:string},Output>{
 const codes=units.map(x=>x.code);
 const schema=z.object({value:z.number().finite(),fromUnit:z.string().refine(x=>codes.includes(x),"Unsupported source unit"),toUnit:z.string().refine(x=>codes.includes(x),"Unsupported target unit")});
 const map=new Map(units.map(x=>[x.code,x]));
 return {id,slug,title,category:"unit-conversions",version:1,riskClass:"standard",reviewStatus:"draft",inputSchema:schema,
  calculate:({value,fromUnit,toUnit})=>{const from=map.get(fromUnit)!,to=map.get(toUnit)!;if(fromUnit===toUnit)return{result:value};const ratio=(from.factor??1)/(to.factor??1);const result=value*ratio;if(!Number.isFinite(result))throw new Error("Converted result is outside the supported finite range");return{result}},
  formulas:[{id:"conversion",expression:formula,description:"Convert through the family's common base unit using fixed conversion factors."}],
  sources:[nist,bipm],examples:[{label:"Worked example",input:{value:example.value,fromUnit:example.fromUnit,toUnit:example.toUnit},expected:{result:example.expected}}],
  goldenTests:[{label:"Worked example",input:{value:example.value,fromUnit:example.fromUnit,toUnit:example.toUnit},expected:{result:example.expected}}],
  ui:{simpleInputKeys:["value","fromUnit","toUnit"]}};
}

const sharedDefinition=(id:string,slug:string,title:string,codes:readonly string[],example:{value:number;fromUnit:string;toUnit:string;expected:number},formula:string,sources:readonly typeof nist[]):CalculatorDefinition<{value:number;fromUnit:string;toUnit:string},Output>=>{
 const schema=z.object({value:z.number().finite(),fromUnit:z.string().refine(x=>codes.includes(x),"Unsupported source unit"),toUnit:z.string().refine(x=>codes.includes(x),"Unsupported target unit")});
 return {id,slug,title,category:"unit-conversions",version:1,riskClass:"standard",reviewStatus:"draft",inputSchema:schema,
  calculate:({value,fromUnit,toUnit})=>{if(fromUnit===toUnit)return{result:value};const result=convertUnit(value,fromUnit,toUnit);if(!Number.isFinite(result))throw new Error("Converted result is outside the supported finite range");return{result}},
  formulas:[{id:"conversion",expression:formula,description:"Convert through the existing certified shared unit engine."}],sources,
  examples:[{label:"Worked example",input:{value:example.value,fromUnit:example.fromUnit,toUnit:example.toUnit},expected:{result:example.expected}}],
  goldenTests:[{label:"Worked example",input:{value:example.value,fromUnit:example.fromUnit,toUnit:example.toUnit},expected:{result:example.expected}}],ui:{simpleInputKeys:["value","fromUnit","toUnit"]}};
};

export const lengthConverter=linearDefinition("conversion.length","length-converter","Length Converter",[{code:"m",factor:1},{code:"km",factor:1000},{code:"cm",factor:.01},{code:"mm",factor:.001},{code:"in",factor:.0254},{code:"ft",factor:.3048},{code:"yd",factor:.9144},{code:"mi",factor:1609.344}],{value:1,fromUnit:"mi",toUnit:"km",expected:1.609344},"target = source × source metres / target metres");

export const areaConverter=linearDefinition("conversion.area","area-converter","Area Converter",[
 {code:"m2",factor:1},{code:"km2",factor:1e6},{code:"cm2",factor:1e-4},{code:"ft2",factor:.09290304},{code:"yd2",factor:.83612736},{code:"acre",factor:4046.8564224},{code:"ha",factor:10000},{code:"mi2",factor:2589988.110336}
],{value:1,fromUnit:"acre",toUnit:"m2",expected:4046.8564224},"target = source × source square-metres / target square-metres");

export const volumeConverter=linearDefinition("conversion.volume","volume-converter","Volume Converter",[
 {code:"m3",factor:1},{code:"l",factor:.001},{code:"ml",factor:1e-6},{code:"cm3",factor:1e-6},{code:"ft3",factor:.028316846592},{code:"in3",factor:.000016387064},{code:"gal_us",factor:.003785411784},{code:"qt_us",factor:.000946352946}
],{value:1,fromUnit:"gal_us",toUnit:"l",expected:3.785411784},"target = source × source cubic-metres / target cubic-metres");

const temperatureCodes=["c","f","k"] as const;
const temperatureSchema=z.object({value:z.number().finite(),fromUnit:z.string().refine(x=>temperatureCodes.includes(x as typeof temperatureCodes[number]),"Unsupported source unit"),toUnit:z.string().refine(x=>temperatureCodes.includes(x as typeof temperatureCodes[number]),"Unsupported target unit")});
export const temperatureConverter:CalculatorDefinition<{value:number;fromUnit:string;toUnit:string},Output>={id:"conversion.temperature",slug:"temperature-converter",title:"Temperature Converter",category:"unit-conversions",version:1,riskClass:"standard",reviewStatus:"draft",inputSchema:temperatureSchema,
 calculate:({value,fromUnit,toUnit})=>{if(fromUnit===toUnit)return{result:value};let result:number;if(fromUnit==="f"&&toUnit==="k")result=(value+459.67)*5/9;else if(fromUnit==="k"&&toUnit==="f")result=value*9/5-459.67;else if(fromUnit==="c"&&toUnit==="k")result=value+273.15;else if(fromUnit==="k"&&toUnit==="c")result=value-273.15;else if(fromUnit==="f"&&toUnit==="c")result=(value-32)*5/9;else result=value*9/5+32;if(!Number.isFinite(result))throw new Error("Converted result is outside the supported finite range");return{result}},
 formulas:[{id:"conversion",expression:"pair-specific affine temperature conversion",description:"Convert directly between Celsius, Fahrenheit, and Kelvin to preserve exact reference boundaries."}],sources:[bipm],
 examples:[{label:"Worked example",input:{value:32,fromUnit:"f",toUnit:"c"},expected:{result:0}}],goldenTests:[{label:"Worked example",input:{value:32,fromUnit:"f",toUnit:"c"},expected:{result:0}}],ui:{simpleInputKeys:["value","fromUnit","toUnit"]}};

export const speedConverter=linearDefinition("conversion.speed","speed-converter","Speed Converter",[
 {code:"m_s",factor:1},{code:"km_h",factor:1/3.6},{code:"mph",factor:.44704},{code:"ft_s",factor:.3048},{code:"knot",factor:1852/3600}
],{value:60,fromUnit:"mph",toUnit:"km_h",expected:96.56064},"target = source × source metres-per-second / target metres-per-second");

export const conversionBatch1Definitions=[lengthConverter,areaConverter,volumeConverter,temperatureConverter,speedConverter] as const;
