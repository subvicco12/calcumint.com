import {expect,it} from 'vitest';
import {mobilityContract,mobilityWorkflows,prepareMobilityRecovery} from './cohort';

it('preserves the supplied rainwater yield, limits and zero efficiency',()=>{
 const c=mobilityContract(487),w=mobilityWorkflows(487);
 const raw={rainfallMm:'40',catchmentAreaM2:'250',collectionEfficiency:'0.6'};
 const packet=w.execute(raw);
 expect(c).toMatchObject({engineId:'energy.rainwater-harvesting',version:1,unit:'L',registered:false});
 expect(packet.snapshot.output).toEqual({theoreticalVolumeM3:10,collectedVolumeM3:6,collectedLiters:6000});
 expect(w.execute({...raw,collectionEfficiency:'0'}).snapshot.output.collectedLiters).toBe(0);
 expect(()=>w.execute({...raw,collectionEfficiency:'1.01'})).toThrow();
 expect(prepareMobilityRecovery(packet.snapshot)).toMatchObject({catalogId:487,currentCaptureAvailable:true});
});
