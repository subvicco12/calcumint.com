import {expect,it} from 'vitest';
import {mobilityContract,mobilityWorkflows,prepareMobilityRecovery} from './cohort';
import {factoryDownload} from '@/lib/calculator-factory/completion/exports';

it.each([80,81,84,488,469])('captures and exports the immutable example for #%i',id=>{
 const contract=mobilityContract(id),workflow=mobilityWorkflows(id);
 const raw=Object.fromEntries(contract.fields.map(field=>[field.key,String(field.defaultValue)]));
 const packet=workflow.execute(raw);
 expect(packet.snapshot.output).toEqual(contract.engine.examples[0].expected);
 expect(prepareMobilityRecovery(packet.snapshot).currentCaptureAvailable).toBe(true);
 expect(workflow.replay(workflow.exportPacket(packet,'json','pro')).snapshot).toEqual(packet.snapshot);
 for(const format of ['json','csv','pdf'] as const)expect(factoryDownload(workflow,packet,format,'pro',contract.title).bytes.length).toBeGreaterThan(0);
 expect(workflow.batch([raw,{...raw,unrecognized:'0'}]).map(row=>!!row.packet)).toEqual([true,false]);
});

it('preserves annual depreciation modes, floor and complete schedule export',()=>{
 const workflow=mobilityWorkflows(467);
 const raw={mode:'straightLine',currency:'USD',initial:'100',floor:'20',years:'3',annualAmount:'30'};
 const packet=workflow.execute(raw);
 expect(packet.snapshot.output.schedule).toEqual([{year:1,value:70},{year:2,value:40},{year:3,value:20}]);
 const percent=workflow.execute({mode:'percentDecline',currency:'USD',initial:'100',floor:'20',years:'2',annualRatePercent:'50'});
 expect(percent.snapshot.output.schedule).toEqual([{year:1,value:50},{year:2,value:25}]);
 expect(workflow.replay(workflow.exportPacket(percent,'json','pro')).snapshot).toEqual(percent.snapshot);
 expect(factoryDownload(workflow,percent,'pdf','pro','Depreciation').bytes.length).toBeGreaterThan(0);
 expect(()=>workflow.execute({...raw,floor:'101'})).toThrow();
 expect(()=>workflow.execute({...raw,years:'1.5'})).toThrow();
});

it('refuses invalid heat boundary, and preserves losses and absent payback',()=>{
 const contract=mobilityContract(488),workflow=mobilityWorkflows(488);
 const raw=Object.fromEntries(contract.fields.map(field=>[field.key,String(field.defaultValue)]));
 expect(workflow.execute(raw).snapshot.output.annualSavings).toEqual({numerator:'200',denominator:'1'});
 const loss=workflow.execute({...raw,electricityTariff:'1'});
 expect(loss.snapshot.output).toMatchObject({annualSavings:{numerator:'-2800',denominator:'1'},simplePaybackYears:null});
 expect(()=>workflow.execute({...raw,scop:'0'})).toThrow();
 expect(()=>workflow.execute({...raw,heatBoundary:'different-heat'})).toThrow();
});
