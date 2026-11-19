import {expect,it} from 'vitest';
import {factoryDownload} from '@/lib/calculator-factory/completion/exports';
import {resourceContract,resourceWorkflows,prepareResourceRecovery,verifyResourceSnapshot} from './cohort';

const witnesses: Array<{
 id:number;raw:Record<string,string>;invalid:Record<string,string>;expected:Record<string,number>;unit:string;
}>=[
 {id:482,raw:{capacityWh:'1200',loadWatts:'300',efficiencyPercent:'75'},invalid:{loadWatts:'0'},expected:{value:3},unit:'h'},
 {id:483,raw:{dailyEnergyKwh:'6',backupDays:'2',depthOfDischargePercent:'75',systemEfficiencyPercent:'80'},invalid:{depthOfDischargePercent:'0'},expected:{value:20},unit:'kWh'},
 {id:486,raw:{rate:'7.5',minutes:'12'},invalid:{rate:'-1'},expected:{result:90},unit:'supplied volume unit'},
 {id:489,raw:{quantity:'8',wattsPerLight:'25',hoursUsed:'5'},invalid:{quantity:'1.5'},expected:{energyKwh:1},unit:'kWh'},
];

it.each(witnesses)('#$id reconciles independent results, exact replay, refusal, batch and exports',({id,raw,invalid,expected,unit})=>{
 const flow=resourceWorkflows(id),packet=flow.execute(raw),contract=resourceContract(id);
 for(const [key,value] of Object.entries(expected))expect(packet.snapshot.output[key]).toBeCloseTo(value,12);
 expect(contract.unit).toBe(unit);
 expect(verifyResourceSnapshot(packet.snapshot).catalogId).toBe(id);
 expect(()=>verifyResourceSnapshot({...packet.snapshot,calculatorVersion:2})).toThrow();
 expect(()=>verifyResourceSnapshot({...packet.snapshot,output:{...packet.snapshot.output,[contract.primaryKey]:-1}})).toThrow();
 expect(()=>flow.verify({...packet,identity:{...packet.identity,sourceVersion:'unknown'}})).toThrow();
 expect(()=>flow.execute({...raw,extra:'1'})).toThrow();
 expect(flow.batch([raw,{...raw,...invalid}]).map(row=>Boolean(row.packet))).toEqual([true,false]);
 expect(()=>flow.batch(Array.from({length:101},()=>raw))).toThrow();
 expect(flow.replayBatch(flow.exportBatch(flow.batch([raw]),'business'))[0].packet).toEqual(packet);
 expect(flow.scenario([],'A',packet,'','pro')[0].packet).toEqual(packet);
 expect(()=>flow.scenario([],'A',packet,'','free')).toThrow();
 for(const format of ['json','csv','pdf'] as const){
  const artifact=factoryDownload(flow,packet,format,'pro',contract.title),text=new TextDecoder().decode(artifact.bytes);
  if(format==='json')expect(flow.replay(text)).toEqual(packet);
  if(format==='csv')expect(text).toContain(unit);
  if(format==='pdf')expect(text).toMatch(/^%PDF-/);
  expect(()=>factoryDownload(flow,packet,format,'free',contract.title)).toThrow();
 }
});

it('keeps the historical water result below the new capture boundary readable without upgrading it',()=>{
 const history={calculatorSlug:'water-usage-calculator',calculatorVersion:1,input:{rate:1e-70,minutes:1},output:{result:1e-70}};
 expect(prepareResourceRecovery(history)).toMatchObject({snapshot:history,currentCaptureAvailable:false});
 expect(()=>resourceWorkflows(486).execute({rate:'1e-70',minutes:'1'})).toThrow();
 expect(resourceWorkflows(486).execute({rate:'1e-50',minutes:'1'}).snapshot.output.result).toBe(1e-50);
 expect(resourceWorkflows(486).execute({rate:'0',minutes:'2'}).snapshot.output.result).toBe(0);
});

it('retains percentage and whole-count upper boundaries',()=>{
 expect(()=>resourceWorkflows(482).execute({capacityWh:'100',loadWatts:'10',efficiencyPercent:'101'})).toThrow();
 expect(()=>resourceWorkflows(483).execute({dailyEnergyKwh:'10',backupDays:'2',depthOfDischargePercent:'100',systemEfficiencyPercent:'101'})).toThrow();
 expect(resourceWorkflows(489).execute({quantity:'1000000',wattsPerLight:'1000',hoursUsed:'1'}).snapshot.output.energyKwh).toBe(1e6);
 expect(()=>resourceWorkflows(489).execute({quantity:'1000001',wattsPerLight:'1000',hoursUsed:'1'})).toThrow();
});
