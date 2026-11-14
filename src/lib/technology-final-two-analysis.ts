import {runCalculator} from '@/calculators/engine';
import {ipSubnetCalculator,screenPpiCalculator} from '@/calculators/technology-computing/catalog-batch-1';
import {technologyFinalTwoCatalog} from './native-delivery/technology-final-two-catalog';
import {validateTechnologyNextCapture} from './technology-next-capture-trust';
export const technologyFinalTwoDefinitions=Object.freeze([ipSubnetCalculator,screenPpiCalculator]);
export function technologyFinalTwoDefinition(id:string){const definition=technologyFinalTwoDefinitions.find(d=>d.id===id);if(!definition||definition.version!==1)throw Error('Exact final-two v1 profile unavailable');return definition;}
function domain(id:string,input:Readonly<Record<string,unknown>>){const definition=technologyFinalTwoDefinition(id),row=technologyFinalTwoCatalog.find(r=>r.engineId===id)!;if(!input||typeof input!=='object'||Array.isArray(input)||Object.keys(input).sort().join('|')!==row.fields.map(f=>f[0]).sort().join('|'))throw Error('Provide exactly the declared profile inputs');if(!definition.inputSchema.safeParse(input).success)throw Error('Inputs violate the original registered profile domain');return definition;}
/** New captures only; neither original engine nor recorded-snapshot replay is changed. */
export function validateTechnologyFinalTwoCapture(id:string,input:Readonly<Record<string,unknown>>,output:{value:number}){
 domain(id,input);validateTechnologyNextCapture(id,input,output);
 if(id==='technology.ip-subnet'&&output.value!==2**(32-(input.prefixLength as number)))throw Error('IPv4 prefix address count differs from the original engine');
}
export function runTechnologyFinalTwo(id:string,input:Readonly<Record<string,unknown>>):{value:number;steps:readonly string[]}{const definition=domain(id,input),output=runCalculator(definition as typeof ipSubnetCalculator,input).output;validateTechnologyFinalTwoCapture(id,input,output);return output;}
export function analyzeTechnologyFinalTwo(id:string,input:Readonly<Record<string,unknown>>){const definition=technologyFinalTwoDefinition(id),current=runTechnologyFinalTwo(id,input).value,discrete=id==='technology.ip-subnet',axis=discrete?{key:'prefixLength',label:'IPv4 prefix length',unit:'prefix bits',resultUnit:'addresses',discrete}:{key:'diagonalInches',label:'Supplied diagonal',unit:'inches',resultUnit:'pixels/inch',discrete},base=input[axis.key] as number;
 const samples=discrete?[...new Set([Math.max(0,base-1),base,Math.min(32,base+1)])]:[base/2,base,base*2];
 const points=samples.map(inputValue=>{try{return{label:inputValue===base?'Current':inputValue<base?'Lower':'Higher',inputValue,result:runTechnologyFinalTwo(id,{...input,[axis.key]:inputValue}).value};}catch(error){return{label:'Refused sample',inputValue,error:error instanceof Error?error.message:'Outside supported capture domain'};}});
 return{id,version:definition.version,axis,current,points};
}
/** Supported goal candidates must reproduce the exact target through the immutable forward engine. */
export function solveTechnologyFinalTwo(id:string,input:Readonly<Record<string,unknown>>,target:number){
 runTechnologyFinalTwo(id,input);if(!Number.isFinite(target)||target<=0||target<2**-1022)throw Error('Target must be a finite positive normal result');
 const candidates=id==='technology.ip-subnet'?Array.from({length:33},(_,p)=>p):[runTechnologyFinalTwo(id,{...input,diagonalInches:1}).value/target];const axis=analyzeTechnologyFinalTwo(id,input).axis;
 for(const value of candidates){try{const forwardValue=runTechnologyFinalTwo(id,{...input,[axis.key]:value}).value;if(forwardValue===target)return{label:'Required '+axis.label.toLowerCase(),value,unit:axis.unit,forwardValue};}catch{/* Refuse unproved candidates; never clamp or change engine arithmetic. */}}
 throw Error(id==='technology.ip-subnet'?'No supported integer prefix exactly reproduces the target':'No supported diagonal exactly forward-verifies this target');
}
