import {expect,it} from 'vitest';
import {mobilityContract,mobilityWorkflows,prepareMobilityRecovery} from './cohort';

it('retains the bounded altitude-pressure estimate and its exact replay',()=>{
 const contract=mobilityContract(494),workflow=mobilityWorkflows(494);
 expect(contract.engineId).toBe('private.remaining.494');
 expect(contract.version).toBe(1);
 expect(contract.fields.find(field=>field.key==='altitudeM')?.unit).toBe('m');
 const atSeaLevel=workflow.execute({scope:'supplied-mathematical-scenario',seaLevelPressurePa:'101325',altitudeM:'0'});
 const atAltitude=workflow.execute({scope:'supplied-mathematical-scenario',seaLevelPressurePa:'101325',altitudeM:'1000'});
 expect(atSeaLevel.snapshot.output.value).toBe(101325);
 expect(atAltitude.snapshot.output.value).toBeCloseTo(89874.56,1);
 expect(prepareMobilityRecovery(atAltitude.snapshot)).toMatchObject({catalogId:494,currentCaptureAvailable:true});
 expect(()=>workflow.execute({scope:'supplied-mathematical-scenario',seaLevelPressurePa:'101325',altitudeM:'11000.1'})).toThrow();
 expect(()=>workflow.execute({scope:'supplied-mathematical-scenario',seaLevelPressurePa:'0',altitudeM:'0'})).toThrow();
 expect(()=>mobilityContract(537)).toThrow();
});
