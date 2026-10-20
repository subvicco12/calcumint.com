import {expect,it} from 'vitest';
import {readPersistedCalculationSnapshot} from './persisted-calculation';

it('reads legacy stored output into detached immutable data without interpreting it as current coordinates',()=>{
 const row={id:'old-row',created_at:'2025-01-01',calculator_slug:'slope-calculator',calculator_version:1,input_data:{rise:-6,run:3},output_data:{result:-1.999}};
 const snapshot=readPersistedCalculationSnapshot(row);
 row.output_data.result=42;
 expect(snapshot).toEqual({calculatorSlug:'slope-calculator',calculatorVersion:1,input:{rise:-6,run:3},output:{result:-1.999}});
 expect(Object.isFrozen(snapshot)).toBe(true);expect(Object.isFrozen(snapshot.input)).toBe(true);expect(Object.isFrozen(snapshot.output)).toBe(true);
});
it('retains retired non-Slope revisions and complete nested results independently of the registry',()=>{
 const row={calculator_slug:'retired-definition',calculator_version:11,input_data:{values:[-1,0]},output_data:{result:null,details:{text:'recorded'}}};
 const snapshot=readPersistedCalculationSnapshot(row);
 expect(snapshot.calculatorVersion).toBe(11);expect(snapshot.output).toEqual(row.output_data);
 expect(Object.isFrozen(snapshot.output.details)).toBe(true);
});
it.each(['calculator_slug','calculator_version','input_data','output_data'])('rejects a row missing %s instead of defaulting to a current revision',field=>{
 const row:Record<string,unknown>={calculator_slug:'retired-definition',calculator_version:1,input_data:{},output_data:{value:0}};
 delete row[field];expect(()=>readPersistedCalculationSnapshot(row)).toThrow();
});
it('rejects a corrupt generic row without repairing its numeric data',()=>{
 const row={calculator_slug:'retired-definition',calculator_version:1,input_data:{x:1},output_data:{value:NaN}};
 expect(()=>readPersistedCalculationSnapshot(row)).toThrow();expect(Number.isNaN(row.output_data.value)).toBe(true);
});
