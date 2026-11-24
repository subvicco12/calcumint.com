import {expect,it} from 'vitest';
import {mobilityContract,mobilityWorkflows,prepareMobilityRecovery} from './cohort';

it.each([[52,2065520.20],[54,377538.57],[55,108243.22]])('captures and replays retained investment #%i',(id,result)=>{
 const contract=mobilityContract(id), workflow=mobilityWorkflows(id);
 const raw=Object.fromEntries(contract.fields.map(field=>[field.key,String(field.defaultValue)]));
 const packet=workflow.execute(raw);
 expect(packet.snapshot.output[contract.primaryKey]).toBe(result);
 expect(prepareMobilityRecovery(packet.snapshot).currentCaptureAvailable).toBe(true);
 expect(workflow.replay(workflow.exportPacket(packet,'json','pro')).snapshot).toEqual(packet.snapshot);
 expect(workflow.batch([raw,{...raw,[contract.fields[0].key]:''}]).map(row=>!!row.packet)).toEqual([true,false]);
});
it('preserves the retained zero-rate and depletion conventions',()=>{
 const sip=mobilityWorkflows(52);
 expect(sip.execute({monthlyContribution:'10',annualReturnPercent:'0',termMonths:'2',contributionTiming:'end'}).snapshot.output.futureValue).toBe(20);
 const swp=mobilityWorkflows(54);
 expect(swp.execute({initialCorpus:'10',monthlyWithdrawal:'5',annualReturnPercent:'0',termMonths:'2',withdrawalTiming:'end'}).snapshot.output.endingCorpus).toBe(0);
 expect(()=>sip.execute({monthlyContribution:'10',annualReturnPercent:'0',termMonths:'2',contributionTiming:'daily'})).toThrow();
});
