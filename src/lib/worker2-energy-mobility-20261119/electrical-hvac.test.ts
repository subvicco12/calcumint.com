import {expect,it} from 'vitest';
import {mobilityContract,mobilityWorkflows,prepareMobilityRecovery} from './cohort';

it.each([[363,0.4],[364,24],[365,1500],[366,7],[486,80]])('captures, restores and replays #%i', (id,value)=>{
 const contract=mobilityContract(id), workflow=mobilityWorkflows(id);
 const raw=Object.fromEntries(contract.fields.map(field=>[field.key,String(field.defaultValue)]));
 const packet=workflow.execute(raw);
 expect(packet.snapshot.output[contract.primaryKey]).toBe(value);
 expect(prepareMobilityRecovery(packet.snapshot).currentCaptureAvailable).toBe(true);
 expect(workflow.replay(workflow.exportPacket(packet,'json','pro')).snapshot).toEqual(packet.snapshot);
 expect(workflow.batch([raw,{...raw,[contract.fields[0].key]:'-1'}]).map(row=>!!row.packet)).toEqual([true,false]);
});
it('checks whole solar-panel counts against the exact input arithmetic',()=>{
 const workflow=mobilityWorkflows(366);
 const raw={dailyEnergyKwh:'1',panelWatts:'250',peakSunHours:'4',systemEfficiencyPercent:'100'};
 expect(workflow.execute(raw).snapshot.output.value).toBe(1);
 expect(()=>workflow.execute({...raw,dailyEnergyKwh:'1.0000000000000002'})).toThrow(/Whole-panel/);
});
