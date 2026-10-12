import type {CalculatorDefinition} from '../types';
import type {StructuredCalculationResult} from './types';
export type RegisteredValueDefinition=Pick<CalculatorDefinition<unknown,unknown>,'slug'|'version'|'formulas'|'sources'>;
/** Presentation only: preserve caller context and expose the same registered source/formula metadata. */
export function registeredValueResult(definition:RegisteredValueDefinition,output:{value:number},presentation:{label:string;unit?:string;methodology:string;warnings?:readonly string[]}):StructuredCalculationResult{
 const formulas=definition.formulas.map(formula=>`${formula.description}\n${formula.expression}`).join('\n\n');
 return {primaryResult:{id:'result',label:presentation.label,value:output.value,unit:presentation.unit},methodology:[presentation.methodology,formulas].filter(text=>text.length>0).join('\n\n'),sources:definition.sources,...(presentation.warnings?{warnings:presentation.warnings}:{})};
}
