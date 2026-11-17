import {expect,it} from 'vitest';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {getFactoryWorkflows,getFactoryContract} from '../registry';
import {verifyRegisteredSnapshot} from '@/lib/registered-snapshot-verification';
import {factoryDownload} from './exports';
import {next100MathContracts} from './math-next100';

// Independent literal witnesses; no expected value is obtained from the engine.
const rows=[
 [213,{numerator:'-3',denominator:'4'},-.75],
 [221,{x:'-125'},-5],
 [223,{base:'3',exponent:'4'},81],
 [224,{x:'8',base:'2'},3],
 [225,{x:'-4'},-.25],
 [226,{a:'-17',b:'5'},-2],
 [227,{a:'12',b:'18'},36],
 [228,{a:'48',b:'18'},6],
 [229,{number:'97'},97],
 [230,{value:'-1.25',decimals:'1'},-1.2],
 [231,{coefficient:'3.2',exponent:'6'},3200000],
] as const;

it.each(rows)('retains exact identity, source capture and local workflow evidence for #%s',(id,values,expected)=>{
 const contract=getFactoryContract(id)!,flows=getFactoryWorkflows(id);
 const raw:Record<string,string>=Object.fromEntries(Object.entries(values).map(([k,v])=>[k,` ${v} `]));
 const packet=flows.execute(raw);
 expect(packet.snapshot.output.result).toBe(expected);
 expect(packet.raw).toEqual(raw);expect(packet.identity.catalogId).toBe(id);
 expect(packet.identity.engineId).toBe(contract.engineId);expect(packet.snapshot.calculatorVersion).toBe(1);
 expect(packet.identity.sourceVersion).toContain('private.math-next100.20261114.1');
 expect(verifyRegisteredSnapshot(packet.snapshot)).toBeTruthy();
 const capture=JSON.parse(readFileSync('docs/milestone100-20261114/math/source-applicability.json','utf8')).rows.find((r:{catalogId:number})=>r.catalogId===id);
 expect(capture.sourceApprovalGranted).toBe(false);expect(capture.scopeApprovalGranted).toBe(false);
 for(const source of capture.independentSources)expect(createHash('sha256').update(readFileSync(source.path)).digest('hex')).toBe(source.sha256);
 expect(next100MathContracts.find(c=>c.catalogId===id)?.slug).toBe(packet.identity.calculatorSlug);
 // These plan arguments exercise local affordances, not authenticated accounts.
 for(const plan of ['pro','business'] as const){
  expect(flows.execute(raw).snapshot).toEqual(packet.snapshot);
  expect(flows.replay(flows.exportPacket(packet,'json',plan))).toEqual(packet);
  const scenarios=flows.scenario(flows.scenario([],'A',packet,'original',plan),'B',packet,'repeat',plan);
  expect(scenarios.map(s=>s.packet.snapshot)).toEqual([packet.snapshot,packet.snapshot]);
  for(const format of ['json','csv','pdf'] as const){
   const artifact=factoryDownload(flows,packet,format,plan,contract.title);
   if(format==='json')expect(JSON.parse(new TextDecoder().decode(artifact.bytes))).toEqual(packet);
   if(format==='csv')expect(new TextDecoder().decode(artifact.bytes)).toContain(String(expected));
   if(format==='pdf'){
    const text=execFileSync('pdftotext',['-','-'],{input:artifact.bytes,encoding:'utf8',timeout:10000});
    expect(text).toContain(String(expected));expect(text).toContain(contract.title);
   }
  }
 }
 expect(flows.execute(raw).snapshot).toEqual(packet.snapshot);
 expect(()=>flows.exportPacket(packet,'json','free')).toThrow(/Pro/);
 expect(()=>flows.scenario([],'A',packet,'','free')).toThrow(/Pro/);
 const bad=JSON.parse(JSON.stringify(packet));bad.snapshot.output.result=expected+1;
 expect(()=>flows.verify(bad)).toThrow();
 const changedVersion=JSON.parse(JSON.stringify(packet));changedVersion.identity.calculatorVersion=2;
 expect(()=>flows.verify(changedVersion)).toThrow(/version/);
 const batch=flows.batch([raw,Object.fromEntries(Object.keys(raw).map(k=>[k,'']))]);
 expect(batch[0].packet).toEqual(packet);expect(batch[1].error).toBeTruthy();
 expect(()=>flows.exportBatch(batch,'business')).toThrow(/Correct/);
 expect(flows.replayBatch(flows.exportBatch(flows.batch([raw]),'business'))[0].packet).toEqual(packet);
});
