import {expect,it} from 'vitest';
import {factoryDownload} from '@/lib/calculator-factory/completion/exports';
import {mobilityContract,mobilityWorkflows,verifyMobilitySnapshot} from './cohort';

const raw={distanceKm:'250',litersPer100Km:'7.5',pricePerLiter:'1.6'};

it('binds #509 to the immutable fuel-only trip cost with explicit units',()=>{
 const contract=mobilityContract(509);
 expect(contract.engineId).toBe('travel.fuel-trip-cost');
 expect(contract.fields.map(field=>field.unit)).toEqual(['km','L/100 km','supplied currency/L']);
 const flow=mobilityWorkflows(509);
 expect(flow.execute(raw).snapshot.output.value).toBe(30);
 expect(flow.execute({...raw,distanceKm:'0'}).snapshot.output.value).toBe(0);
 expect(()=>flow.execute({...raw,pricePerLiter:'-1'})).toThrow();
 expect(()=>flow.execute({...raw,litersPer100Km:''})).toThrow();
});

it('round trips #509 through the bounded batch, export and historical version contracts',()=>{
 const flow=mobilityWorkflows(509);
 const packet=flow.execute(raw);
 expect(verifyMobilitySnapshot(packet.snapshot).catalogId).toBe(509);
 expect(()=>verifyMobilitySnapshot({...packet.snapshot,calculatorVersion:2})).toThrow();
 expect(()=>mobilityWorkflows(461).verify(packet)).toThrow();
 expect(flow.scenario([],'A',packet,'','pro')[0].packet).toEqual(packet);
 expect(()=>flow.scenario([],'A',packet,'','free')).toThrow();
 const rows=flow.batch([raw,{...raw,pricePerLiter:'-1'}]);
 expect(rows.map(row=>Boolean(row.packet))).toEqual([true,false]);
 expect(()=>flow.exportBatch(rows,'business')).toThrow();
 expect(flow.replayBatch(flow.exportBatch(flow.batch([raw]),'business'))[0].packet).toEqual(packet);
 for(const format of ['json','csv','pdf'] as const){
  const artifact=factoryDownload(flow,packet,format,'pro',mobilityContract(509).title);
  const text=new TextDecoder().decode(artifact.bytes);
  if(format==='json')expect(flow.replay(text)).toEqual(packet);
  if(format==='csv')expect(text).toContain('"output","value","30"');
  if(format==='pdf')expect(text).toMatch(/^%PDF-/);
 }
});
