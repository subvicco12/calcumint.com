import {parsePublicationFactoryNumber} from './publication-factory-contracts-input';

/** Current registered caller boundary; original engine and history readers retain their revisions. */
export function requiredCalculatorNumber(text:string):number {
 const parsed=parsePublicationFactoryNumber(text.trim());
 return typeof parsed==='number'?parsed:Number.NaN;
}
