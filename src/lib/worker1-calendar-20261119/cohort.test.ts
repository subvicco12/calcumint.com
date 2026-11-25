import {expect,it} from 'vitest';
import {readFileSync} from 'node:fs';
import {calendarContracts,calendarWorkflows,calendarResult,verifyCalendarSnapshot} from './cohort';
import {factoryDownload} from '@/lib/calculator-factory/completion/exports';
const cases: [Record<string,string>,Record<string,number|string>][]=[
 [{birthDate:'2000-02-29',asOfDate:'2024-02-29'},{years:24,months:0,days:0}],
 [{startDate:'2024-02-28',endDate:'2024-03-01'},{days:2}],
 [{date:'2024-01-31',years:'0',months:'1',days:'0'},{date:'2024-02-29'}],
 [{startDate:'2024-03-01',endDate:'2024-02-28'},{days:-2}],
 [{date:'2000-01-01'},{dayIndex:6,dayName:'Saturday'}],
 [{date:'2021-01-01'},{weekYear:2020,weekNumber:53}],
 [{date:'2024-02-01'},{date:'2024-05-01'}],
 [{date:'2024-02-01'},{date:'2024-03-02'}],
 [{date:'2024-02-01'},{date:'2024-04-01'}],
];
it.each(calendarContracts)('binds catalog and immutable v1 output with replay and exports for #$catalogId',c=>{
 const [raw,expected]=cases[calendarContracts.indexOf(c)],flow=calendarWorkflows(c.catalogId),packet=flow.execute(raw);
 expect(readFileSync('data/catalog/master-catalog-2026.csv','utf8')).toContain(`"${c.catalogId}","Date & Time","${c.title}"`);
 expect(packet.snapshot.calculatorVersion).toBe(1);
 expect(packet.snapshot.output).toEqual(expected);
 expect(calendarResult(packet).primaryResult.value).toBe(expected[c.resultKey]);
 expect(calendarResult(packet).metrics?.length).toBe(Object.keys(expected).length-1);
 expect(verifyCalendarSnapshot(packet.snapshot).snapshot).toEqual(packet.snapshot);
 expect(()=>verifyCalendarSnapshot({...packet.snapshot,calculatorVersion:2})).toThrow();
 expect(()=>flow.verify({...packet,snapshot:{...packet.snapshot,output:{...expected,[c.resultKey]:'forged'}}})).toThrow();
 expect(()=>flow.exportPacket(packet,'json','free')).toThrow();
 for(const plan of ['pro','business'] as const){
  expect(flow.replay(flow.exportPacket(packet,'json',plan))).toEqual(packet);
  expect(flow.exportPacket(packet,'csv',plan)).toContain(c.unit);
  expect(factoryDownload(flow,packet,'pdf',plan,c.title).bytes.length).toBeGreaterThan(100);
  expect(flow.scenario([], 'A',packet,'',plan)).toHaveLength(1);
 }
 expect(flow.batch([raw,{...raw,[c.fields[0].key]:'1900-02-29'}]).map(x=>!!x.packet)).toEqual([true,false]);
});
it('refuses unsafe integer, fractional and malformed offsets and four-digit rollover',()=>{
 const input={date:'2024-01-15',years:'0',months:'0',days:'0'};
 for(const days of ['9007199254740992','1.5','1e1',''])expect(()=>calendarWorkflows(445).execute({...input,days})).toThrow();
 expect(()=>calendarWorkflows(455).execute({date:'9999-12-31'})).toThrow(/range/);
});
it('refuses reverse age, datetime and invalid leap dates while retaining zero elapsed days',()=>{
 expect(()=>calendarWorkflows(443).execute({birthDate:'2024-01-02',asOfDate:'2024-01-01'})).toThrow();
 expect(()=>calendarWorkflows(451).execute({date:'2024-02-29T00:00:00Z'})).toThrow();
 expect(()=>calendarWorkflows(452).execute({date:'2100-02-29'})).toThrow();
 expect(calendarWorkflows(446).execute({startDate:'2000-02-29',endDate:'2000-02-29'}).snapshot.output.days).toBe(0);
});
