import {expect,it} from 'vitest';
import {factoryDownload} from '@/lib/calculator-factory/completion/exports';
import {mobilityContract,mobilityWorkflows,prepareMobilityRecovery,verifyMobilitySnapshot} from './cohort';

const cases = [
 [50,'totalAmount',11000],
 [51,'futureValue',16470.09],
 [64,'roiPercent',21],
 [99,'netWorth',75],
 [103,'fundingGap',250],
 [138,'breakEvenUnits',500],
 [168,'value',104],
 [172,'value',150],
 [184,'value',500],
 [191,'value',5],
] as const;

it.each(cases)('#%i runs the exact private capture, exports and replay', (id,key,expected)=>{
 const contract=mobilityContract(id);
 const flow=mobilityWorkflows(id);
 const raw=Object.fromEntries(contract.fields.map(field=>[field.key,String(field.defaultValue)]));
 const packet=flow.execute(raw);
 expect(packet.snapshot.output[key]).toBe(expected);
 expect(verifyMobilitySnapshot(packet.snapshot).catalogId).toBe(id);
 expect(prepareMobilityRecovery(packet.snapshot).currentCaptureAvailable).toBe(true);
 expect(flow.batch([raw,{...raw,extra:'7'}]).map(row=>!!row.packet)).toEqual([true,false]);
 expect(flow.scenario([],'A',packet,'','pro')[0].packet).toEqual(packet);
 expect(()=>flow.exportPacket(packet,'csv','free')).toThrow();
 for(const format of ['json','csv','pdf'] as const){
  const text=new TextDecoder().decode(factoryDownload(flow,packet,format,'pro',contract.title).bytes);
  if(format==='json')expect(flow.replay(text)).toEqual(packet);
  if(format==='csv')expect(text).toContain('"output","'+key+'"');
  if(format==='pdf')expect(text).toMatch(/^%PDF-/);
 }
});

it('keeps itemization and accepts a meaningful debt-only balance',()=>{
 const workflow=mobilityWorkflows(99);
 const packet=workflow.execute({assets:'[]',liabilities:'[{"name":"Loan","amount":25}]'});
 expect(packet.snapshot.output).toMatchObject({netWorth:-25,debtToAssetPercent:null});
 expect(packet.snapshot.input.liabilities).toEqual([{name:'Loan',amount:25}]);
 expect(()=>workflow.execute({assets:'[{"name":"Asset","amount":-1}]',liabilities:'[]'})).toThrow();
});
