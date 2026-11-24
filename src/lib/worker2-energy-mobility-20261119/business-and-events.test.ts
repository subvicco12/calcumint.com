import {expect,it} from 'vitest';
import {factoryDownload} from '@/lib/calculator-factory/completion/exports';
import {privateOwnerBusinessCore} from '@/calculators/private-owner-business-core';
import {privateOwnerBusinessImpact} from '@/calculators/private-owner-business-impact';
import {mobilityContract,mobilityWorkflows,prepareMobilityRecovery} from './cohort';

it.each([156,161,194,195])('delivers and replays every immutable mode of #%i',id=>{
 const engine=[...privateOwnerBusinessCore,...privateOwnerBusinessImpact].find(row=>row.masterId===id)!.definition;
 const contract=mobilityContract(id),workflow=mobilityWorkflows(id);
 for(const example of engine.examples){
  const input=example.input as Record<string,unknown>;
  const raw=Object.fromEntries(Object.entries(input).map(([key,value])=>[key,Array.isArray(value)?JSON.stringify(value):String(value)]));
  const packet=workflow.execute(raw);
  expect(packet.snapshot.output).toEqual(engine.calculate(input,{}));
  expect(prepareMobilityRecovery(packet.snapshot).currentCaptureAvailable).toBe(true);
  expect(workflow.replay(workflow.exportPacket(packet,'json','pro')).snapshot).toEqual(packet.snapshot);
  expect(new TextDecoder().decode(factoryDownload(workflow,packet,'pdf','pro',contract.title).bytes)).toMatch(/^%PDF-/);
  expect(()=>workflow.execute({...raw,unexpected:'1'})).toThrow();
  expect(contract.fields.filter(field=>!field.visibilityModes||field.visibilityModes.includes(raw.mode)).map(field=>field.key).sort()).toEqual(Object.keys(raw).sort());
 }
});

it('keeps real event timestamps distinct from polar absence and preserves the supplied offset',()=>{
 const w=mobilityWorkflows(535);
 const raw={latitude:'80',longitude:'0',utcOffsetMinutes:'60',date:'2024-12-21'};
 const polar=w.execute(raw);
 expect(polar.snapshot.output).toMatchObject({status:'polar-night',sunriseUtc:null,sunsetUtc:null,utcOffsetMinutes:60});
 const events=w.execute({...raw,latitude:'0'});
 expect(events.snapshot.output).toMatchObject({status:'events',sunriseUtc:expect.any(String),sunsetUtc:expect.any(String)});
 expect(prepareMobilityRecovery(polar.snapshot).currentCaptureAvailable).toBe(true);
 expect(w.replay(w.exportPacket(events,'json','pro')).snapshot).toEqual(events.snapshot);
 expect(()=>w.execute({...raw,date:'2051-01-01'})).toThrow();
});
