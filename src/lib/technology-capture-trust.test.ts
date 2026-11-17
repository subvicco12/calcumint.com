import {it,expect} from 'vitest';
import hazards from '../../docs/cohort22-closure-20261109/technology/hazard-witnesses.json';
import defaults from '../../tests/execution-recovery-20261109/technology-cases.json';
import {calculatorRegistry} from '@/calculators/registry';
import {screenPpiCalculator} from '@/calculators/technology-computing/catalog-batch-1';
import {batteryRuntimeCalculator,upsRuntimeCalculator,resolutionCalculator,cloudStorageCostCalculator} from '@/calculators/technology-computing/catalog-batch-2';
import {runCalculator} from '@/calculators/engine';
import {createCalculationSnapshot} from './calculation-snapshot';
import {verifyRegisteredSnapshot} from './registered-snapshot-verification';
// Current-capture safety must not rewrite original valid historical engine outputs.
import {validateTechnologyCapture} from './technology-capture-trust';
const cases=[
 [screenPpiCalculator,{widthPixels:1e-200,heightPixels:1e-200,diagonalInches:1e-200},Math.SQRT2],
 [screenPpiCalculator,{widthPixels:1e-160,heightPixels:1e-160,diagonalInches:1e-160},Math.SQRT2],
 [batteryRuntimeCalculator,{capacityWh:1e-300,loadWatts:1e-100,efficiencyPercent:1e-100},1e-302],
 [upsRuntimeCalculator,{batteryWh:1e-300,loadWatts:1e-100,efficiencyPercent:1e-100},1e-302],
] as const;
for(const [definition,input,independent] of cases)it(`refuses unstable current ${definition.id} capture while retaining exact historical replay`,()=>{
 const output=runCalculator(definition as never,input as never).output as {value:number};
 expect(Math.abs(output.value-independent)/independent).toBeGreaterThan(1e-7);
 expect(()=>validateTechnologyCapture(definition.id,input,output)).toThrow(/precision|underflow|range/i);
 const snapshot=createCalculationSnapshot({calculatorSlug:definition.slug,calculatorVersion:definition.version,input,output});
 expect(verifyRegisteredSnapshot(snapshot).snapshot.output).toEqual(output);
});
it('refuses false zero and subnormal products but preserves exact allowed zero',()=>{
 for(const [definition,input]of [[resolutionCalculator,{widthPixels:1e-200,heightPixels:1e-200}],[cloudStorageCostCalculator,{storageGb:1e-200,pricePerGbMonth:1e-200}]] as const){const output=runCalculator(definition as never,input as never).output as {value:number};expect(output.value).toBe(0);expect(()=>validateTechnologyCapture(definition.id,input,output)).toThrow();}
 expect(()=>validateTechnologyCapture(cloudStorageCostCalculator.id,{storageGb:0,pricePerGbMonth:1},{value:0})).not.toThrow();
 expect(()=>validateTechnologyCapture(resolutionCalculator.id,{widthPixels:1e-160,heightPixels:1e-160},{value:1e-320})).toThrow();
});
it('permits normal registered examples and refuses unknown future scopes',()=>{
 for(const definition of [screenPpiCalculator,batteryRuntimeCalculator,upsRuntimeCalculator,resolutionCalculator,cloudStorageCostCalculator]){const input=definition.examples[0].input;const output=runCalculator(definition as never,input as never).output as {value:number};expect(()=>validateTechnologyCapture(definition.id,input,output)).not.toThrow();}
 expect(()=>validateTechnologyCapture('technology.unreviewed',{}, {value:1})).toThrow();
});

for(const [index,witness]of hazards.cases.entries())it(`retains immutable witness${index} for #${witness.masterId} but refuses new capture`,()=>{
 const row=defaults.rows.find(row=>row.masterId===witness.masterId)!;const definition=calculatorRegistry.getBySlug(row.slug)!;
 const output=runCalculator(definition,witness.input).output as {value:number};expect(output).toEqual(witness.actual);
 expect(()=>validateTechnologyCapture(definition.id,witness.input,output)).toThrow(/precision|range/i);
 const snapshot=createCalculationSnapshot({calculatorSlug:row.slug,calculatorVersion:row.version,input:witness.input,output});
 expect(verifyRegisteredSnapshot(snapshot).snapshot).toEqual(snapshot);
});
