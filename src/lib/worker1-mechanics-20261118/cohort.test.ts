import {expect,it} from 'vitest';
import {readFileSync} from 'node:fs';
import {mechanicsContracts,mechanicsWorkflows,verifyMechanicsSnapshot,prepareMechanicsRecovery} from './cohort';
import {factoryDownload} from '@/lib/calculator-factory/completion/exports';
const cases: [Record<string,string>,number][]=[
 [{distance:'9',time:'2'},4.5],[{displacement:'-9',time:'2'},-4.5],
 [{initialVelocity:'4',finalVelocity:'-2',time:'3'},-2],[{speed:'3',time:'4'},12],
 [{mass:'3',acceleration:'-2'},-6],[{force:'10',distance:'3',angleDegrees:'180'},-30],
 [{work:'-12',time:'3'},-4],[{mass:'4',velocity:'3'},18],[{mass:'2',gravity:'10',height:'-3'},-60],[{mass:'4',velocity:'-3'},-12],
];
it.each(mechanicsContracts)('verifies SI golden, immutable replay and delivery for #$catalogId',c=>{
 const [raw,result]=cases[c.catalogId-302], flow=mechanicsWorkflows(c.catalogId),packet=flow.execute(raw);
 expect(readFileSync('data/catalog/master-catalog-2026.csv','utf8')).toContain(`"${c.catalogId}","Physics","${c.title}"`);
 expect(c.version).toBe(1);
 expect(packet.snapshot.output.value).toBe(result);
 expect(verifyMechanicsSnapshot(packet.snapshot).snapshot).toEqual(packet.snapshot);
 expect(()=>verifyMechanicsSnapshot({...packet.snapshot,calculatorVersion:2})).toThrow();
 expect(()=>flow.verify({...packet,snapshot:{...packet.snapshot,output:{...packet.snapshot.output,value:999}}})).toThrow();
 expect(()=>flow.exportPacket(packet,'json','free')).toThrow();
 for(const plan of ['pro','business'] as const){
  expect(flow.replay(flow.exportPacket(packet,'json',plan))).toEqual(packet);
  expect(flow.exportPacket(packet,'csv',plan)).toContain(c.unit);
  expect(factoryDownload(flow,packet,'pdf',plan,c.title).bytes.length).toBeGreaterThan(100);
  expect(flow.scenario([], 'A',packet,'',plan)).toHaveLength(1);
 }
 expect(flow.batch([raw,{...raw,[c.fields[0].key]:''}]).map(r=>!!r.packet)).toEqual([true,false]);
});
it('preserves historical perpendicular-work residual and refuses new captures',()=>{
 const c=mechanicsContracts.find(c=>c.catalogId===307)!;
 const input={force:10,distance:3,angleDegrees:90},output=c.engine.calculate(input,{});
 expect(output.value).not.toBe(0);
 expect(()=>mechanicsWorkflows(307).execute({force:'10',distance:'3',angleDegrees:'90'})).toThrow(/exactly zero/);
 const snapshot={calculatorSlug:c.slug,calculatorVersion:1,input,output};
 expect(prepareMechanicsRecovery(snapshot)).toMatchObject({snapshot,currentCaptureAvailable:false});
 expect(mechanicsWorkflows(307).execute({force:'0',distance:'3',angleDegrees:'90'}).snapshot.output.value).toBe(0);
});
it('accepts valid zeroes and rejects zero denominators and range loss',()=>{
 expect(mechanicsWorkflows(305).execute({speed:'10',time:'0'}).snapshot.output.value).toBe(0);
 expect(()=>mechanicsWorkflows(302).execute({distance:'10',time:'0'})).toThrow();
 expect(()=>mechanicsWorkflows(309).execute({mass:'1e-200',velocity:'1e-200'})).toThrow(/magnitude/);
});
