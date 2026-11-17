import {runCalculator} from '@/calculators/engine';
import {bandwidthCalculator,downloadTimeCalculator,uploadTimeCalculator,dataTransferCalculator} from '@/calculators/technology-computing/catalog-batch-1';
import {base64SizeCalculator} from '@/calculators/technology-computing/catalog-batch-2';
import {getPublication20Definition} from '@/lib/publication20';
import {validatePublication20Result} from '@/lib/publication20/result-trust';
import {validateTechnologyCapture} from '@/lib/technology-capture-trust';
const definitions=[bandwidthCalculator,downloadTimeCalculator,uploadTimeCalculator,dataTransferCalculator,base64SizeCalculator] as const;
export type TechnologyFiveId=typeof definitions[number]['id'];
export type AnalysisPoint={label:string;inputValue:number;result?:number;error?:string};
export type FiveAnalysis={id:string;version:number;variable:string;variableUnit:string;resultUnit:string;points:AnalysisPoint[];base64?:{padding:number;overheadBytes:number;overheadPercent:number|null}};
const maximumRaw=1e15;
/** Two multiply/divide operations plus the composed inverse are allowed eight binary64 epsilons.
 * This is a forward residual check, not an assertion of a full-domain decimal precision envelope. */
export const TECHNOLOGY_TARGET_RELATIVE_TOLERANCE=8*Number.EPSILON;
function definition(id:string){const d=definitions.find(x=>x.id===id);if(!d)throw Error('Unsupported five-calculator analysis identity');return d;}
function compute(id:string,input:Record<string,unknown>):number{
 const d=definition(id);
 // Each definition owns its schema. Never manufacture an alternative calculation engine.
 const output=runCalculator(d as typeof bandwidthCalculator,input).output;
 validateTechnologyCapture(id,input,output);
 const entry=getPublication20Definition(d.slug);if(entry)validatePublication20Result(entry,input,output);
 return output.value;
}
function axes(id:string){
 if(id==='technology.base64-size')return {key:'inputBytes',variable:'Raw payload size',variableUnit:'bytes',resultUnit:'encoded bytes'};
 if(id==='technology.download-time'||id==='technology.upload-time')return {key:'bandwidthMbps',variable:'Bandwidth',variableUnit:'Mbps',resultUnit:'seconds'};
 return {key:'timeSeconds',variable:'Duration',variableUnit:'seconds',resultUnit:id==='technology.bandwidth'?'Mbps':'MB'};
}
export function analyzeTechnologyFive(id:string,input:Record<string,unknown>):FiveAnalysis{
 const value=compute(id,input),d=definition(id),axis=axes(id),base=input[axis.key] as number;
 const samples=id==='technology.base64-size'?[...new Set([-3,-2,-1,0,1,2,3].map(offset=>Math.max(0,Math.min(maximumRaw,base+offset))))]:[base/2,base,base*2];
 const points=samples.map((inputValue,index):AnalysisPoint=>{const label=id==='technology.base64-size'?String(inputValue):['Half','Current','Double'][index];try{return {label,inputValue,result:compute(id,{...input,[axis.key]:inputValue})};}catch(cause){return {label,inputValue,error:cause instanceof Error?cause.message:'Outside supported domain'};}});
 const result:FiveAnalysis={id,version:d.version,variable:axis.variable,variableUnit:axis.variableUnit,resultUnit:axis.resultUnit,points};
 if(id==='technology.base64-size')result.base64={padding:(3-base%3)%3,overheadBytes:value-base,overheadPercent:base===0?null:(value-base)/base*100};
 return result;
}
export function solveTechnologyFive(id:string,input:Record<string,unknown>,target:number):{label:string;unit:string;value?:number;interval?:readonly[number,number];forwardValue:number}{
 compute(id,input);
 if(!Number.isFinite(target))throw Error('Enter a finite target in the displayed result unit');
 if(id==='technology.base64-size'){
  if(!Number.isSafeInteger(target)||target<0||target%4!==0||target>compute(id,{inputBytes:maximumRaw}))throw Error('Padded encoded target must be a multiple of four within the supported domain');
  const groups=BigInt(target)/4n;const lo=target===0?0n:3n*groups-2n;const hi=target===0?0n:3n*groups;const upper=hi>BigInt(maximumRaw)?BigInt(maximumRaw):hi;
  if(lo>upper)throw Error('No supported raw payload produces this target');
  const interval=[Number(lo),Number(upper)] as const;
  if(interval.some(inputBytes=>compute(id,{inputBytes})!==target))throw Error('Target forward verification failed');
  return {label:'Possible raw payload interval (inclusive)',unit:'bytes',interval,forwardValue:target};
 }
 if(target<=0)throw Error('Target must be positive');
 let key:string,value:number;
 if(id==='technology.bandwidth'){key='timeSeconds';value=compute('technology.download-time',{dataMegabytes:input.dataMegabytes,bandwidthMbps:target});}
 else if(id==='technology.download-time'||id==='technology.upload-time'){key='bandwidthMbps';value=compute('technology.bandwidth',{dataMegabytes:input.dataMegabytes,timeSeconds:target});}
 else{key='timeSeconds';value=compute('technology.download-time',{dataMegabytes:target,bandwidthMbps:input.bandwidthMbps});}
 const forwardValue=compute(id,{...input,[key]:value});
 if(Math.abs(forwardValue-target)/Math.max(Math.abs(forwardValue),Math.abs(target))>TECHNOLOGY_TARGET_RELATIVE_TOLERANCE)throw Error('Target is outside the supported forward verification tolerance');
 return {label:key==='timeSeconds'?'Required duration':'Required bandwidth',unit:key==='timeSeconds'?'seconds':'Mbps',value,forwardValue};
}
