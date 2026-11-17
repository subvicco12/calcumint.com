import {runCalculator} from '@/calculators/engine';
import {cidrCalculator,raidCapacityCalculator} from '@/calculators/technology-computing/catalog-batch-1';
import {batteryRuntimeCalculator,upsRuntimeCalculator,passwordEntropyCalculator} from '@/calculators/technology-computing/catalog-batch-2';
import {technologyNextFiveCatalog} from './native-delivery/technology-next-five-catalog';
import {validateTechnologyNextCapture} from './technology-next-capture-trust';
export const technologyNextFiveDefinitions=Object.freeze([cidrCalculator,raidCapacityCalculator,batteryRuntimeCalculator,upsRuntimeCalculator,passwordEntropyCalculator]);
export function technologyNextFiveDefinition(id:string){const d=technologyNextFiveDefinitions.find(d=>d.id===id);if(!d||d.version!==1)throw Error('Unsupported exact next-five identity');return d;}
export type NextFiveAxis=Readonly<{key:string;label:string;unit:string;resultUnit:string;discrete:boolean}>;
const axes:Readonly<Record<string,NextFiveAxis>>={
 'technology.cidr':{key:'prefixLength',label:'IPv4 prefix length',unit:'prefix bits',resultUnit:'addresses',discrete:true},
 'technology.raid-capacity':{key:'diskSizeGb',label:'Equal disk size',unit:'GB',resultUnit:'GB',discrete:false},
 'technology.battery-runtime':{key:'capacityWh',label:'Supplied capacity',unit:'Wh',resultUnit:'hours',discrete:false},
 'technology.ups-runtime':{key:'batteryWh',label:'Supplied battery energy',unit:'Wh',resultUnit:'hours',discrete:false},
 'technology.password-entropy':{key:'length',label:'Independent random-symbol length',unit:'symbols',resultUnit:'bits',discrete:true}
};
for(const axis of Object.values(axes))Object.freeze(axis);Object.freeze(axes);
export function technologyNextFiveAxis(id:string,_input?:Readonly<Record<string,unknown>>):NextFiveAxis{void _input;technologyNextFiveDefinition(id);return axes[id];}
function domain(id:string,input:Readonly<Record<string,unknown>>){const d=technologyNextFiveDefinition(id),descriptor=technologyNextFiveCatalog.find(row=>row.engineId===id)!;if(!input||typeof input!=='object'||Array.isArray(input)||Object.keys(input).sort().join('|')!==descriptor.fields.map(f=>f[0]).sort().join('|'))throw Error('Provide exactly the declared inputs');const parsed=d.inputSchema.safeParse(input);if(!parsed.success)throw Error('Inputs are outside the original registered domain');return d;}
/** New captures only. Original engine schemas and historical replay remain unchanged. */
export function validateTechnologyNextFiveCapture(id:string,input:Readonly<Record<string,unknown>>,output:{value:number}):void{
 domain(id,input);if(id==='technology.cidr'){if(!Number.isInteger(output.value)||output.value!==2**(32-(input.prefixLength as number)))throw Error('CIDR capture differs from its exact registered address count');return;}
 validateTechnologyNextCapture(id,input,output);
}
export function runTechnologyNextFive(id:string,input:Readonly<Record<string,unknown>>):{value:number;steps:readonly string[]}{const d=domain(id,input);const output=runCalculator(d as typeof cidrCalculator,input).output;validateTechnologyNextFiveCapture(id,input,output);return output;}
export type NextFiveAnalysisPoint={label:string;inputValue:number;result?:number;error?:string};
export function analyzeTechnologyNextFive(id:string,input:Readonly<Record<string,unknown>>){const d=technologyNextFiveDefinition(id),current=runTechnologyNextFive(id,input).value,axis=technologyNextFiveAxis(id,input),base=input[axis.key] as number;const samples=axis.discrete?[...new Set([Math.max(id==='technology.cidr'?0:1,base-1),base,Math.min(id==='technology.cidr'?32:10000,base+1)])]:[base/2,base,base*2];const points=samples.map((inputValue):NextFiveAnalysisPoint=>{try{return{label:inputValue===base?'Current':inputValue<base?'Lower':'Higher',inputValue,result:runTechnologyNextFive(id,{...input,[axis.key]:inputValue}).value};}catch(e){return{label:'Refused sample',inputValue,error:e instanceof Error?e.message:'Outside current capture boundary'};}});return{id,version:d.version,axis,current,points};}
/** Candidate inversion is bounded; only exact original-forward target equality is accepted. No target is rounded. */
export function solveTechnologyNextFive(id:string,input:Readonly<Record<string,unknown>>,target:number):{label:string;unit:string;value:number;forwardValue:number}{
 runTechnologyNextFive(id,input);if(!Number.isFinite(target)||target<=0||target<2**-1022)throw Error('Target must be finite positive normal in the displayed unit');const axis=technologyNextFiveAxis(id,input);
 let candidates:number[];
 if(id==='technology.cidr')candidates=Array.from({length:33},(_,p)=>p);
 else if(id==='technology.password-entropy'){const coefficient=runTechnologyNextFive(id,{...input,length:1}).value,nearest=Math.round(target/coefficient);candidates=[nearest-1,nearest,nearest+1].filter(n=>Number.isInteger(n)&&n>=1&&n<=10000);}
 else if(id==='technology.raid-capacity'){const coefficient=runTechnologyNextFive(id,{...input,diskSizeGb:1}).value;candidates=[target/coefficient];}
 else{const factor=(input.efficiencyPercent as number)/100,usable=target*(input.loadWatts as number);if(!Number.isFinite(usable)||usable<2**-1022)throw Error('Inverse candidate intermediate is outside the supported normal range');candidates=[usable/factor];}
 for(const value of candidates){try{const forwardValue=runTechnologyNextFive(id,{...input,[axis.key]:value}).value;if(forwardValue===target)return{label:'Required '+axis.label.toLowerCase(),unit:axis.unit,value,forwardValue};}catch{/* An unproved candidate is refused, never clamped into the domain. */}}
 throw Error(axis.discrete?'No supported integer input exactly reproduces this target':'Computed inverse does not exactly reproduce this target in the original engine');
}
