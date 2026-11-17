import type {CalculationSnapshot} from './calculation-snapshot';
import type {ScenarioDisplayMetadata} from './scenario-display-metadata';
/** Current presentation only. Engine outputs and retained historical display metadata are immutable. */
export function technologyCurrentPresentation<T extends {label:string;unit:string}>(engineId:string,version:number,fallback:T):T|{label:string;unit:string}{return engineId==='technology.dpi'&&version===1?{label:'Linear pixel density',unit:'pixels/inch'}:fallback;}
/** Derived metadata for a new current shared view/export, never an edit to an old stored record. */
export function technologyDpiDisplayMetadata(snapshot:CalculationSnapshot):ScenarioDisplayMetadata|undefined{
 if(snapshot.calculatorSlug!=='dpi-calculator'||snapshot.calculatorVersion!==1)return undefined;
 return {schemaVersion:1,calculatorSlug:snapshot.calculatorSlug,calculatorVersion:snapshot.calculatorVersion,inputs:{pixels:{label:'Pixels',unit:'pixels'},lengthInches:{label:'Length',unit:'in'}},outputs:{value:{label:'Linear pixel density',unit:'pixels/inch'}}};
}
