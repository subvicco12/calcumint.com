import {expect,it} from 'vitest';
import {mobilityWorkflows,verifyMobilitySnapshot} from './cohort';

it('captures corn yield as a supplied kernel-to-bushel estimate',()=>{
 const flow=mobilityWorkflows(421);
 const raw={earsPerAcre:'24000',kernelRowsPerEar:'14',kernelsPerRow:'40',kernelsPerBushel:'84000'};
 const packet=flow.execute(raw);
 expect(packet.snapshot.output).toMatchObject({bushelsPerAcre:160,kernelsPerAcre:13440000});
 expect(()=>flow.execute({...raw,kernelsPerBushel:'0'})).toThrow();
 expect(verifyMobilitySnapshot(packet.snapshot).catalogId).toBe(421);
 expect(flow.replay(flow.exportPacket(packet,'json','pro'))).toEqual(packet);
});

it('scales a fixed-width row sample and rejects fractional observed counts',()=>{
 const flow=mobilityWorkflows(422);
 const raw={plantCount:'35',sampleRowLengthFeet:'20',rowSpacingInches:'24'};
 const packet=flow.execute(raw);
 expect(packet.snapshot.output).toMatchObject({plantsPerAcre:38115,sampleAreaSquareFeet:40});
 expect(()=>flow.execute({...raw,plantCount:'35.5'})).toThrow();
 expect(()=>flow.execute({...raw,sampleRowLengthFeet:'1e-10'})).toThrow(/round/i);
 expect(verifyMobilitySnapshot(packet.snapshot).catalogId).toBe(422);
 expect(flow.replay(flow.exportPacket(packet,'json','pro'))).toEqual(packet);
});
