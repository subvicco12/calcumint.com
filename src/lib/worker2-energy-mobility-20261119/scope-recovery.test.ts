import {expect,it} from 'vitest';
import {mobilityContract,mobilityWorkflows,prepareMobilityRecovery} from './cohort';
import {factoryDownload} from '@/lib/calculator-factory/completion/exports';

it.each([96,362,498])('delivers and replays retained #%i',id=>{
 const contract=mobilityContract(id),workflow=mobilityWorkflows(id);
 const raw=Object.fromEntries(contract.fields.map(field=>[field.key,String(field.defaultValue)]));
 const packet=workflow.execute(raw);
 expect(packet.snapshot.output).toEqual(contract.engine.examples[0].expected);
 expect(prepareMobilityRecovery(packet.snapshot).currentCaptureAvailable).toBe(true);
 expect(workflow.replay(workflow.exportPacket(packet,'json','pro')).snapshot).toEqual(packet.snapshot);
 expect(factoryDownload(workflow,packet,'pdf','pro',contract.title).bytes.length).toBeGreaterThan(0);
 expect(workflow.batch([raw,{...raw,unknown:'0'}]).map(row=>!!row.packet)).toEqual([true,false]);
});
it('converts only supplied density in both directions and refuses zero density',()=>{
 const workflow=mobilityWorkflows(498);
 expect(workflow.execute({value:'120',direction:'volumeToMass',densityGPerMl:'0.75'}).snapshot.output.convertedValue).toBe(90);
 expect(()=>workflow.execute({value:'120',direction:'volumeToMass',densityGPerMl:'0'})).toThrow();
});
it('retains the supplied vesting and tranche checks',()=>{
 const contract=mobilityContract(96),workflow=mobilityWorkflows(96);
 const raw=Object.fromEntries(contract.fields.map(field=>[field.key,String(field.defaultValue)]));
 expect(()=>workflow.execute({...raw,tranches:'[]'})).toThrow();
 expect(()=>workflow.execute({...raw,steps:'[{"returnRate":"0","employeeContribution":"10","tranches":[{"id":"a","contribution":"0","vestedFraction":"0.4"}]}]'})).toThrow();
});
