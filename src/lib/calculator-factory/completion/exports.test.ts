import {expect,it} from 'vitest';
import {factoryDownload} from './exports';
import {getFactoryWorkflows} from '../registry';
it('exports verified raw provenance and native values in three real file formats',()=>{
 const flows=getFactoryWorkflows(440),packet=flows.execute({value:'0.125',fromUnit:'mhz',toUnit:'hz'});
 const json=factoryDownload(flows,packet,'json','pro','Frequency');
 expect(JSON.parse(new TextDecoder().decode(json.bytes))).toEqual(packet);
 const csv=factoryDownload(flows,packet,'csv','business','Frequency');
 expect(new TextDecoder().decode(csv.bytes)).toContain('125000');
 const pdf=factoryDownload(flows,packet,'pdf','pro','Frequency');
 expect(new TextDecoder().decode(pdf.bytes.slice(0,8))).toContain('%PDF-');
 expect(pdf.filename).toBe('frequency-converter-v1.pdf');
 expect(packet.raw.value).toBe('0.125');
});
it('denies free export and refuses altered output or source identity for every format',()=>{
 const flows=getFactoryWorkflows(218),packet=flows.execute({x:'2'});
 for(const format of ['json','csv','pdf'] as const){
  expect(()=>factoryDownload(flows,packet,format,'free','Square')).toThrow(/Pro/);
  expect(()=>factoryDownload(flows,{...packet,snapshot:{...packet.snapshot,output:{result:5}}},format,'pro','Square')).toThrow();
  expect(()=>factoryDownload(flows,{...packet,identity:{...packet.identity,sourceVersion:'other'}},format,'pro','Square')).toThrow();
 }
});
