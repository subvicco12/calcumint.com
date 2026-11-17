import {it,expect} from 'vitest';
import {verifyRegisteredSnapshot} from './registered-snapshot-verification';
import {getFactoryWorkflows} from './calculator-factory/registry';
const cases:[number,string,Record<string,string>][]=[[328,'chemistry.molarity',{moles:'1',solutionVolumeLiters:'2'}],[331,'chemistry.moles',{massGrams:'36',molarMass:'18'}],[332,'chemistry.dilution',{initialConcentration:'2',initialVolume:'1',finalVolume:'4'}]];
for(const [id,engine,raw]of cases){
 it(`dispatches immutable science v1 #${id}`,()=>{const snapshot=getFactoryWorkflows(id).execute(raw).snapshot;const result=verifyRegisteredSnapshot(snapshot);expect(result.snapshot).toEqual(snapshot);expect(result.engineId).toBe(engine);expect(result.engineVersion).toBe(1);});
 it(`rejects altered version, output, shape and identity #${id}`,()=>{const snapshot=getFactoryWorkflows(id).execute(raw).snapshot;for(const bad of [{...snapshot,calculatorVersion:2},{...snapshot,calculatorVersion:0},{...snapshot,output:{...snapshot.output,value:999}},{...snapshot,input:{...snapshot.input,extra:1}},{...snapshot,calculatorSlug:'unapproved-science-calculator'},{...snapshot,extra:true}])expect(()=>verifyRegisteredSnapshot(bad)).toThrow();});
}
