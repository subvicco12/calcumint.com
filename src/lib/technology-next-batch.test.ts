import {it,expect} from 'vitest';
import {evaluateTechnologyNextBatch,serializeTechnologyNextBatch,replayTechnologyNextBatch,technologyNextBatchCsv} from './technology-next-batch';
for(const[id,text,value,version]of [
 ['technology.storage-conversion','2,GiB,MiB',2048,1],['technology.aspect-ratio','16,8',2,1],['technology.resolution','1920,1080',2073600,1],['technology.dpi','3000,10',300,1],['technology.power-supply','500,20',600,1],['technology.website-bandwidth','2,100000',200,2],['technology.cloud-storage-cost','1000,0.02',20,1],['technology.cloud-data-transfer-cost','500,0.09',45,1],
]as const)it(id+' exports original version with exact numeric replay',()=>{const b=evaluateTechnologyNextBatch(id,text);expect(b.rows[0].snapshot?.output.value).toBe(value);expect(b.version).toBe(version);const bytes=serializeTechnologyNextBatch(b);expect(replayTechnologyNextBatch(bytes)).toEqual(b);expect(technologyNextBatchCsv(b)).toContain(String(value));const t=JSON.parse(bytes);t.rows[0].snapshot.output.value=999;expect(()=>replayTechnologyNextBatch(JSON.stringify(t))).toThrow();});
it('keeps row errors, validates enums and denies all partial exports',()=>{const b=evaluateTechnologyNextBatch('technology.storage-conversion','1,GiB,MiB\n1,GB,MB');expect(b.rows[0].snapshot?.output.value).toBe(1024);expect(b.rows[1].error).toBeTruthy();expect(()=>serializeTechnologyNextBatch(b)).toThrow();expect(()=>technologyNextBatchCsv(b)).toThrow();});
it('refuses blank lossy subnormal malformed and oversized rows without losing genuine zero',()=>{for(const text of ['',',1','1e-320,1','9007199254740993,1','1junk,1','1,1,1'])expect(evaluateTechnologyNextBatch('technology.aspect-ratio',text).rows[0].error).toBeTruthy();expect(()=>evaluateTechnologyNextBatch('technology.dpi',Array(101).fill('1,1').join('\n'))).toThrow();expect(()=>evaluateTechnologyNextBatch('technology.dpi','1'.repeat(65537))).toThrow();expect(evaluateTechnologyNextBatch('technology.cloud-storage-cost','0,1').rows[0].snapshot?.output.value).toBe(0);expect(()=>evaluateTechnologyNextBatch('constructor','1,1')).toThrow();});
it('rejects version, entered-text, extra-key and foreign-row replay tampering',()=>{const bytes=serializeTechnologyNextBatch(evaluateTechnologyNextBatch('technology.website-bandwidth','2,100000'));for(const mutate of [(t:{version:number;rows:{raw:string;snapshot:{calculatorSlug:string}}[];extra?:boolean})=>{t.version=1},(t:{version:number;rows:{raw:string;snapshot:{calculatorSlug:string}}[];extra?:boolean})=>{t.rows[0].raw='2,1'},(t:{version:number;rows:{raw:string;snapshot:{calculatorSlug:string}}[];extra?:boolean})=>{t.extra=true},(t:{version:number;rows:{raw:string;snapshot:{calculatorSlug:string}}[];extra?:boolean})=>{t.rows[0].snapshot.calculatorSlug='dpi-calculator'}]){const t=JSON.parse(bytes);mutate(t);expect(()=>replayTechnologyNextBatch(JSON.stringify(t))).toThrow();}});

it.each([
 ['technology.ip-subnet','192.0.2.7,24',256,'addresses'],
 ['technology.cidr','32',1,'addresses'],
 ['technology.raid-capacity','4,1000,10',2000,'GB'],
 ['technology.screen-ppi','3,4,5',1,'pixels/inch'],
 ['technology.battery-runtime','1000,200,90',4.5,'hours'],
 ['technology.ups-runtime','600,300,90',1.8,'hours'],
 ['technology.password-entropy','16,2',16,'bits'],
] as const)('evaluates, exports and verifies the exact %s v1 local profile',(id,raw,value,unit)=>{
 const batch=evaluateTechnologyNextBatch(id,raw);
 expect(batch).toMatchObject({engineId:id,version:1,rows:[{raw,snapshot:{calculatorVersion:1,output:{value}}}]});
 const bytes=serializeTechnologyNextBatch(batch);
 expect(replayTechnologyNextBatch(bytes)).toEqual(batch);
 expect(technologyNextBatchCsv(batch)).toContain(`"${value}","${unit}"`);
 const tampered=JSON.parse(bytes);
 tampered.rows[0].snapshot.calculatorVersion=2;
 expect(()=>replayTechnologyNextBatch(JSON.stringify(tampered))).toThrow();
});

it('keeps the supplied IPv4 text and refuses malformed or partial rows without exporting them',()=>{
 const batch=evaluateTechnologyNextBatch('technology.ip-subnet','192.0.2.7,24\n2001:db8::1,24\n192.0.2.7,24.5');
 expect(batch.rows[0].snapshot?.input.address).toBe('192.0.2.7');
 expect(batch.rows.slice(1).every(row=>row.error&&!row.snapshot)).toBe(true);
 expect(()=>serializeTechnologyNextBatch(batch)).toThrow(/Correct every row/);
});

it.each([
 ['technology.cidr','33'],
 ['technology.raid-capacity','5,1000,10'],
 ['technology.screen-ppi','1e-180,1e-180,1e-150'],
 ['technology.battery-runtime','1000,0,90'],
 ['technology.ups-runtime','600,300,101'],
 ['technology.password-entropy','16.5,2'],
] as const)('keeps existing finite and domain refusals in batch for %s',(id,raw)=>{
 const row=evaluateTechnologyNextBatch(id,raw).rows[0];
 expect(row.raw).toBe(raw);
 expect(row.snapshot).toBeUndefined();
 expect(row.error).toBeTruthy();
});
