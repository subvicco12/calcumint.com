import {expect,it} from 'vitest';
import {mobilityContract,mobilityWorkflows,prepareMobilityRecovery} from './cohort';

it.each([214,237,238,239,240,241,242,243,244,245])('preserves immutable engine output and exact replay for #%i',id=>{
 const contract=mobilityContract(id),workflow=mobilityWorkflows(id);
 const raw=Object.fromEntries(contract.fields.map(field=>[field.key,String(field.defaultValue)]));
 const packet=workflow.execute(raw);
 expect(packet.snapshot.output).toEqual(contract.engine.calculate(packet.snapshot.input as never,{}));
 expect(prepareMobilityRecovery(packet.snapshot)).toMatchObject({catalogId:id,currentCaptureAvailable:true});
 expect(workflow.replay(workflow.exportPacket(packet,'json','pro')).snapshot).toEqual(packet.snapshot);
 expect(workflow.batch([raw,{...raw,[contract.fields[0].key]:''}]).map(row=>!!row.packet)).toEqual([true,false]);
});

it('refuses unsupported structures while keeping complex roots and zero-vector absence',()=>{
 expect(()=>mobilityWorkflows(214).execute({decimal:'9008',precision:'12'})).toThrow();
 expect(()=>mobilityWorkflows(237).execute({a:'0',b:'0'})).toThrow();
 expect(mobilityWorkflows(238).execute({a:'1',b:'0',c:'1'}).snapshot.output).toMatchObject({root1:null,root2:null,root1Text:expect.stringContaining('i')});
 expect(()=>mobilityWorkflows(242).execute({a:'1',b:'2',c:'1',d:'2'})).toThrow();
 expect(mobilityWorkflows(245).execute({ax:'0',ay:'0',az:'0',bx:'1',by:'0',bz:'0'}).snapshot.output.angleRadians).toBeNull();
});
