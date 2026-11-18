import {expect,it} from 'vitest';
import {everydayContracts,everydayWorkflows,verifyEverydaySnapshot,prepareEverydayRecovery} from './cohort';
import {factoryDownload} from '@/lib/calculator-factory/completion/exports';
const ids=[508,513,514,515,519,520,521,523,524];
const inputs:Record<string,string>[]=[
 {transportCost:'10',lodgingCost:'20',foodCost:'30',otherCost:'40'},
 {totalHotelCost:'1200',people:'4'},{totalExpense:'450',people:'3'},{billAmount:'100',tipPercent:'20',people:'4'},
 {electricity:'100',water:'30',gas:'40',internet:'50',other:'20'},
 {transport:'500',packing:'100',labor:'300',storage:'150',other:'50'},
 {distanceKm:'10',timeMinutes:'50'},{distanceKm:'60',timeHours:'2'},{distanceMeters:'1000',timeMinutes:'20'}
];
const values=[100,300,150,30,240,1100,5,30,2];
it.each(ids)('independent literal v1 witness,raw replay,batch,scenarios and exports #%s',id=>{
 const index=ids.indexOf(id),flow=everydayWorkflows(id),packet=flow.execute(inputs[index]);expect(packet.snapshot.output.value).toBe(values[index]);
 expect(verifyEverydaySnapshot(packet.snapshot).snapshot).toEqual(packet.snapshot);
 expect(flow.replay(flow.exportPacket(packet,'json','pro'))).toEqual(packet);
 expect(flow.exportPacket(packet,'csv','business')).toContain(everydayContracts[index].unit);
 expect(factoryDownload(flow,packet,'pdf','pro',everydayContracts[index].title).bytes.length).toBeGreaterThan(100);
 expect(()=>flow.exportPacket(packet,'json','free')).toThrow();expect(flow.scenario([],'A',packet,'','pro')).toHaveLength(1);
 expect(flow.batch([inputs[index],{...inputs[index],[everydayContracts[index].fields[0].key]:''}]).map(x=>!!x.packet)).toEqual([true,false]);
 const corrupt=structuredClone(packet);corrupt.snapshot.output.value=999;expect(()=>flow.replay(JSON.stringify(corrupt))).toThrow();
 expect(()=>verifyEverydaySnapshot({...packet.snapshot,calculatorVersion:2})).toThrow();
});
it.each(ids)('refuses malformed,extra,negative,subnormal and lossy inputs #%s',id=>{
 const index=ids.indexOf(id),flow=everydayWorkflows(id),raw=inputs[index],first=everydayContracts[index].fields[0].key;
 for(const value of ['', 'NaN','Infinity','1x','1e-323','9007199254740993','-1'])expect(()=>flow.execute({...raw,[first]:value})).toThrow();
 expect(()=>flow.execute({...raw,extra:'2'})).toThrow();const packet=flow.execute(raw);const changed={...packet,identity:{...packet.identity,sourceVersion:packet.identity.sourceVersion+'tamper'}};expect(()=>flow.replay(JSON.stringify(changed))).toThrow();
});
it.each([513,514,515])('rejects fractional people in new capture while preserving historical v1 #%s',id=>{
 const c=everydayContracts.find(x=>x.catalogId===id)!;const raw=inputs[ids.indexOf(id)];expect(()=>everydayWorkflows(id).execute({...raw,people:'1.5'})).toThrow(/whole/);
 const input=Object.fromEntries(Object.entries({...raw,people:'1.5'}).map(([k,v])=>[k,Number(v)]));const snapshot={calculatorSlug:c.slug,calculatorVersion:1,input,output:c.engine.calculate(input,{})};
 expect(prepareEverydayRecovery(snapshot)).toMatchObject({snapshot,currentCaptureAvailable:false});expect(verifyEverydaySnapshot(snapshot).snapshot).toEqual(snapshot);
});
it('preserves zero supplied cost totals and refuses zero/false-zero sports captures',()=>{
 const c=everydayContracts[0],raw=Object.fromEntries(c.fields.map(f=>[f.key,'0']));expect(everydayWorkflows(508).execute(raw).snapshot.output.value).toBe(0);
 expect(()=>everydayWorkflows(521).execute({distanceKm:'1',timeMinutes:'0'})).toThrow();
 expect(()=>everydayWorkflows(523).execute({distanceKm:'1e-300',timeHours:'1e100'})).toThrow();
});
