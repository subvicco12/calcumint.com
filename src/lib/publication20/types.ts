import type {CalculatorDefinition} from '@/calculators/types';
export type Publication20Field={key:string;label:string;kind:'number'|'select';unit?:string;options?:readonly string[];defaultValue:string};
export type Publication20Definition={catalogId:number;definition:CalculatorDefinition<Record<string,unknown>,Record<string,unknown>>;fields:readonly Publication20Field[];primaryKey:'result'|'value';outputUnit:(input:Record<string,unknown>)=>string;scope:string};
