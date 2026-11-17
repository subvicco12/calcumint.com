/** Presentation context from recorded IEC storage enums; never convert or recompute values. */
import type {CalculationSnapshot} from './calculation-snapshot';
import {validateScenarioDisplayMetadata,type ScenarioDisplayMetadata} from './scenario-display-metadata';
const units:readonly string[]=['B','KiB','MiB','GiB','TiB'];
const isStorage=(snapshot:CalculationSnapshot)=>snapshot.calculatorSlug==='storage-conversion-calculator'&&snapshot.calculatorVersion===1;
function recordedUnits(snapshot:CalculationSnapshot){
 const {fromUnit,toUnit}=snapshot.input;
 if(typeof fromUnit!=='string'||typeof toUnit!=='string'||!units.includes(fromUnit)||!units.includes(toUnit))throw Error('Storage scenario units must match the recorded IEC enum fields.');
 return {fromUnit,toUnit};
}
export function recordedStorageScenarioMetadata(snapshot:CalculationSnapshot,existing?:ScenarioDisplayMetadata):ScenarioDisplayMetadata|undefined{
 if(!isStorage(snapshot))return undefined;
 const {fromUnit,toUnit}=recordedUnits(snapshot);
 const metadata=existing===undefined?undefined:validateScenarioDisplayMetadata(existing,snapshot);
 if((metadata?.inputs.value?.unit!==undefined&&metadata.inputs.value.unit!==fromUnit)||(metadata?.outputs.value?.unit!==undefined&&metadata.outputs.value.unit!==toUnit))throw Error('Storage display units differ from the recorded engine inputs.');
 return validateScenarioDisplayMetadata({schemaVersion:1,calculatorSlug:snapshot.calculatorSlug,calculatorVersion:snapshot.calculatorVersion,inputs:{...metadata?.inputs,value:{...metadata?.inputs.value,label:metadata?.inputs.value?.label??'Value',unit:fromUnit}},outputs:{...metadata?.outputs,value:{...metadata?.outputs.value,label:metadata?.outputs.value?.label??'Converted storage',unit:toUnit}}},snapshot);
}
export function getRecordedStorageComparisonKey(snapshot:CalculationSnapshot):string{
 return isStorage(snapshot)?recordedUnits(snapshot).toUnit:'';
}
