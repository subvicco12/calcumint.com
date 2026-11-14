import {runCalculator} from '@/calculators/engine';
import {storageConversionCalculator,aspectRatioCalculator} from '@/calculators/technology-computing/catalog-batch-1';
import {resolutionCalculator,dpiCalculator,powerSupplyCalculator,websiteBandwidthCalculator,cloudStorageCostCalculator,cloudDataTransferCostCalculator} from '@/calculators/technology-computing/catalog-batch-2';
import {validateTechnologyNextCapture} from './technology-next-capture-trust';
import {getPublication20Definition} from '@/lib/publication20';
import {validatePublication20Result} from '@/lib/publication20/result-trust';
export const technologyNextDefinitions=[storageConversionCalculator,aspectRatioCalculator,resolutionCalculator,dpiCalculator,powerSupplyCalculator,websiteBandwidthCalculator,cloudStorageCostCalculator,cloudDataTransferCostCalculator] as const;
const axes:Record<string,{key:string;label:string;unit:string;resultUnit:string}>={
 'technology.storage-conversion':{key:'value',label:'Storage quantity',unit:'source unit',resultUnit:'target unit'},
 'technology.aspect-ratio':{key:'width',label:'Width',unit:'same units as height',resultUnit:'ratio'},
 'technology.resolution':{key:'widthPixels',label:'Width',unit:'pixels',resultUnit:'pixels'},
 'technology.dpi':{key:'pixels',label:'Linear pixel count',unit:'pixels',resultUnit:'pixels/inch'},
 'technology.power-supply':{key:'systemLoadWatts',label:'Supplied system load',unit:'W',resultUnit:'W'},
 'technology.website-bandwidth':{key:'monthlyPageViews',label:'Monthly page views',unit:'views',resultUnit:'GB/month'},
 'technology.cloud-storage-cost':{key:'storageGb',label:'Storage quantity',unit:'GB',resultUnit:'currency units/month'},
 'technology.cloud-data-transfer-cost':{key:'transferGb',label:'Transfer quantity',unit:'GB',resultUnit:'currency units'},
};
export function technologyNextDefinition(id:string){const d=technologyNextDefinitions.find(d=>d.id===id);if(!d)throw Error('Unsupported next-cohort identity');return d;}
export function technologyNextAxis(id:string,input:Readonly<Record<string,unknown>>){technologyNextDefinition(id);const axis=axes[id];return id==='technology.storage-conversion'?{...axis,unit:String(input.fromUnit),resultUnit:String(input.toUnit)}:axis;}
export function runTechnologyNext(id:string,input:Readonly<Record<string,unknown>>){const d=technologyNextDefinition(id);const output=runCalculator(d as typeof aspectRatioCalculator,input).output;validateTechnologyNextCapture(id,input,output);const p=getPublication20Definition(d.slug);if(p)validatePublication20Result(p,input,output);return output;}
export type NextAnalysisPoint={label:string;inputValue:number;result?:number;error?:string};
export function analyzeTechnologyNext(id:string,input:Readonly<Record<string,unknown>>){const d=technologyNextDefinition(id),current=runTechnologyNext(id,input).value,axis=technologyNextAxis(id,input),base=input[axis.key] as number;const samples=base===0?[0,1,2]:[base/2,base,base*2];const points=samples.map((inputValue,index):NextAnalysisPoint=>{try{return {label:['Half / zero','Current / one','Double / two'][index],inputValue,result:runTechnologyNext(id,{...input,[axis.key]:inputValue}).value};}catch(e){return {label:['Half / zero','Current / one','Double / two'][index],inputValue,error:e instanceof Error?e.message:'Outside supported domain'};}});return {id,version:d.version,axis,current,points};}
/** One supported variable is solved; all other supplied inputs remain fixed. The original forward engine verifies every answer. */
export function solveTechnologyNext(id:string,input:Readonly<Record<string,unknown>>,target:number):{label:string;unit:string;value?:number;interval?:readonly[number,number];includesZero?:boolean;forwardValue:number}{
 runTechnologyNext(id,input);if(!Number.isFinite(target)||target<0||(target!==0&&Math.abs(target)<2**-1022))throw Error('Enter a finite nonnegative normal target in the displayed result unit');
 const axis=technologyNextAxis(id,input);const coefficient=id==='technology.website-bandwidth'?null:runTechnologyNext(id,{...input,[axis.key]:1}).value;
 if(coefficient===0){if(target!==0)throw Error('No supported input produces this target with a zero unit price');return {label:'Possible quantity (zero or inclusive normal interval)',unit:axis.unit,interval:[2**-1022,1e100],includesZero:true,forwardValue:0};}
 const value=coefficient===null?target*1000/(input.pageSizeMb as number):target/coefficient;const forwardValue=runTechnologyNext(id,{...input,[axis.key]:value}).value;
 const scale=Math.max(Math.abs(target),Math.abs(forwardValue));if(scale!==0&&Math.abs(forwardValue-target)/scale>8*Number.EPSILON)throw Error('Target fails the original-engine forward tolerance');
 return {label:'Required '+axis.label.toLowerCase(),unit:axis.unit,value,forwardValue};
}
