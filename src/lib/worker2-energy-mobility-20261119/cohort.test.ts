import {expect,it} from 'vitest';
import {factoryDownload} from '@/lib/calculator-factory/completion/exports';
import {chargingRoundedToZero,mobilityContract,mobilityWorkflows,prepareMobilityRecovery,verifyMobilitySnapshot} from './cohort';

const witnesses: Array<{id:number;raw:Record<string,string>;invalid:Record<string,string>;expected:Record<string,number>}>=[
 {id:459,raw:{distanceKm:'200',fuelUsedLiters:'16'},invalid:{fuelUsedLiters:'0'},expected:{value:12.5}},
 {id:460,raw:{distanceMiles:'165',fuelUsedUsGallons:'6'},invalid:{fuelUsedUsGallons:'0'},expected:{value:27.5}},
 {id:461,raw:{distanceKm:'250',fuelConsumptionLitersPer100Km:'7.5'},invalid:{distanceKm:'-1'},expected:{value:18.75}},
 {id:462,raw:{batteryEnergyAddedKwh:'12',electricityRatePerKwh:'0.25',chargingEfficiencyPercent:'75'},invalid:{chargingEfficiencyPercent:'0'},expected:{value:4}},
 {id:463,raw:{energyToAddKwh:'24',averageChargingPowerKw:'8'},invalid:{averageChargingPowerKw:'0'},expected:{value:3}},
 {id:464,raw:{usableBatteryKwh:'72',consumptionKwhPer100Km:'24'},invalid:{consumptionKwhPer100Km:'0'},expected:{value:300}},
 {id:478,raw:{powerWatts:'750',hoursUsed:'4',ratePerKwh:'0.125'},invalid:{hoursUsed:'-1'},expected:{energyKwh:3,cost:0.375}},
 {id:479,raw:{averagePowerWatts:'250',hoursPerDay:'8',days:'14',ratePerKwh:'0.125'},invalid:{hoursPerDay:'25'},expected:{dailyEnergyKwh:2,periodEnergyKwh:28,periodCost:3.5}},
];

it.each(witnesses)('#$id reconciles independent results, replay, refusal, batch and exports',({id,raw,invalid,expected})=>{
 const flow=mobilityWorkflows(id),packet=flow.execute(raw);
 expect(packet.snapshot.output).toMatchObject(expected);
 expect(verifyMobilitySnapshot(packet.snapshot).catalogId).toBe(id);
 expect(()=>verifyMobilitySnapshot({...packet.snapshot,calculatorVersion:2})).toThrow();
 expect(()=>verifyMobilitySnapshot({...packet.snapshot,output:{...packet.snapshot.output,steps:[]}})).toThrow();
 expect(()=>flow.verify({...packet,identity:{...packet.identity,sourceVersion:'unknown'}})).toThrow();
 expect(()=>flow.execute({...raw,extra:'1'})).toThrow();
 expect(flow.batch([raw,{...raw,...invalid}]).map(row=>Boolean(row.packet))).toEqual([true,false]);
 expect(()=>flow.batch(Array.from({length:101},()=>raw))).toThrow();
 expect(flow.replayBatch(flow.exportBatch(flow.batch([raw]),'business'))[0].packet).toEqual(packet);
 expect(flow.scenario([],'A',packet,'','pro')[0].packet).toEqual(packet);
 expect(()=>flow.scenario([],'A',packet,'','free')).toThrow();
 for(const format of ['json','csv','pdf'] as const){
  const artifact=factoryDownload(flow,packet,format,'pro',mobilityContract(id).title);
  const decoded=new TextDecoder().decode(artifact.bytes);
  if(format==='json')expect(flow.replay(decoded)).toEqual(packet);
  if(format==='csv')expect(decoded).toContain('"output","'+mobilityContract(id).primaryKey+'"');
  if(format==='pdf')expect(decoded).toMatch(/^%PDF-/);
  expect(()=>factoryDownload(flow,packet,format,'free',mobilityContract(id).title)).toThrow();
 }
});

it('keeps historically valid below-bound input readable without treating it as new capture',()=>{
 const history={calculatorSlug:'fuel-economy-calculator',calculatorVersion:1,input:{distanceKm:1e-70,fuelUsedLiters:1},output:{value:1e-70,steps:['Fuel economy = 1e-70']}};
 expect(prepareMobilityRecovery(history)).toMatchObject({snapshot:history,currentCaptureAvailable:false});
 expect(()=>mobilityWorkflows(459).execute({distanceKm:'1e-70',fuelUsedLiters:'1'})).toThrow();
});

const roundedZeroCases: Array<{id:number;field:string;raw:Record<string,string>}>= [
 {id:462,field:'batteryEnergyAddedKwh',raw:{batteryEnergyAddedKwh:'1e-7',electricityRatePerKwh:'1',chargingEfficiencyPercent:'100'}},
 {id:463,field:'energyToAddKwh',raw:{energyToAddKwh:'1e-7',averageChargingPowerKw:'1'}},
];

it.each(roundedZeroCases)('#$id distinguishes rounded zero from exact zero without changing replay',({id,field,raw})=>{
 const flow=mobilityWorkflows(id);
 const packet=flow.execute(raw);
 expect(packet.snapshot.output.value).toBe(0);
 expect(chargingRoundedToZero(id,packet.snapshot)).toBe(true);
 expect(chargingRoundedToZero(id,flow.execute({...raw,[field]:'0'}).snapshot)).toBe(false);
 expect(chargingRoundedToZero(id,flow.execute({...raw,[field]:'0.000001'}).snapshot)).toBe(false);
 expect(chargingRoundedToZero(id,{...packet.snapshot,calculatorVersion:2})).toBe(false);
 expect(verifyMobilitySnapshot(packet.snapshot).snapshot).toEqual(packet.snapshot);
 const download=factoryDownload(flow,packet,'json','pro',mobilityContract(id).title);
 expect(flow.replay(new TextDecoder().decode(download.bytes))).toEqual(packet);
});
