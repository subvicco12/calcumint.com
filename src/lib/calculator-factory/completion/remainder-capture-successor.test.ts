import {expect,it} from 'vitest';
import {calculateNext100Math} from './math-next100';
import {launchDefinitions} from '@/calculators/launch-portfolio';
import {calculateRemainderCaptureSuccessor as calculate,getRemainderCaptureWorkflows,exactBinary64Multiple,remainderCaptureSuccessorContract} from './remainder-capture-successor';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {getFactoryWorkflows} from '../registry';
import {verifyRegisteredSnapshot} from '@/lib/registered-snapshot-verification';
import {factoryDownload} from './exports';

it.each([[1.5,.5],[-1.5,.5],[2**60,2**54],[1e308,1]])('captures exact zero for binary64 multiples %s / %s without changing historical capture',(a,b)=>{
 const engine=launchDefinitions.find(e=>e.slug==='remainder-calculator'&&e.version===1)!;
 expect(engine.calculate({a,b},{}).result===0).toBe(true);
 expect(()=>calculateNext100Math(226,{a,b})).toThrow(/normal capture/);
 const result=calculate({a,b});
 expect(result.snapshot.output.result===0).toBe(true);
 expect(result.snapshot.calculatorVersion).toBe(1);
 expect(result.captureRevision).not.toBe('private.math-next100.20261114.1');
});

it('proves dyadic divisibility independently across a bounded rational grid',()=>{
 for(let a=-32;a<=32;a++)for(let b=-8;b<=8;b++)if(b!==0){
  expect(exactBinary64Multiple(a/8,b/8)).toBe(BigInt(a)%BigInt(b)===0n);
 }
 // Rounded division looks integral; the represented numbers are not multiples.
 expect(1/.1).toBe(10);expect(exactBinary64Multiple(1,.1)).toBe(false);
 expect(exactBinary64Multiple(.3,.1)).toBe(false);
});

it('retains refusal boundaries, signed ordinary results and strict input copying',()=>{
 for(const input of [{a:1,b:0},{a:1,b:-0},{a:Infinity,b:1},{a:NaN,b:1},{a:Number.MIN_VALUE,b:1},{a:3*2**-1023,b:2**-1022},{a:1,b:2,extra:1},null])expect(()=>calculate(input)).toThrow();
 for(const [a,b,result] of [[-17,5,-2],[17,-5,2],[1,.1,1%.1]])expect(calculate({a,b}).snapshot.output.result).toBe(result);
 expect(exactBinary64Multiple(Infinity,1)).toBe(false);expect(exactBinary64Multiple(1,0)).toBe(false);
 expect(()=>calculate(Object.defineProperty({b:1},'a',{enumerable:true,get(){throw Error('Getter must not execute');}}))).toThrow(/Unsupported calculation field/);
});

it('keeps historical packets and engine replay separate from the capture successor',()=>{
 const old=getFactoryWorkflows(226),current=getRemainderCaptureWorkflows();
 const oldPacket=old.execute({a:'-17',b:'5'}),newPacket=current.execute({a:'-1.5',b:'.5'});
 expect(old.replay(old.exportPacket(oldPacket,'json','business'))).toEqual(oldPacket);
 expect(()=>old.verify(newPacket)).toThrow(/source version/);expect(()=>current.verify(oldPacket)).toThrow(/source version/);
 expect(current.replay(current.exportPacket(newPacket,'json','pro'))).toEqual(newPacket);
 expect(verifyRegisteredSnapshot(newPacket.snapshot)).toBeTruthy();
 const changed=JSON.parse(JSON.stringify(newPacket));changed.snapshot.output.result=9;expect(()=>current.verify(changed)).toThrow();
 for(const format of ['json','csv','pdf'] as const){
  expect(()=>factoryDownload(current,newPacket,format,'free','Remainder')).toThrow(/Pro/);
  expect(factoryDownload(current,newPacket,format,'business','Remainder').bytes.length).toBeGreaterThan(0);
 }
 const batch=current.batch([{a:'1.5',b:'.5'},{a:'1',b:'0'},{a:'-17',b:'5'}]);
 expect(batch.map(r=>Boolean(r.packet))).toEqual([true,false,true]);expect(()=>current.exportBatch(batch,'pro')).toThrow(/Correct/);
 const good=current.batch([batch[0].raw,batch[2].raw]);expect(current.replayBatch(current.exportBatch(good,'pro'))).toEqual(good);
 const a=current.scenario([],'A',newPacket,'exact zero','pro');const ab=current.scenario(a,'B',current.execute({a:'17',b:'5'}),'signed remainder','business');
 expect(ab.map(r=>r.packet.snapshot.output.result)).toEqual([-0,2]);
});

it('binds new exact-zero captures to an explicit private source revision',()=>{
 const flows=getRemainderCaptureWorkflows(),packet=flows.execute({a:'1.5',b:'0.5'});
 expect(packet.identity.sourceVersion).toContain('private.remainder-exact-zero.20261114.2');
 expect(flows.replay(flows.exportPacket(packet,'json','pro'))).toEqual(packet);
});

it('binds retained TC39 source bytes without granting applicability or adoption',()=>{
 const contract=remainderCaptureSuccessorContract;
 expect(contract.calculatorVersion).toBe(1);expect(contract.captureAdopted).toBe(false);
 expect(contract.canonicalApproved).toBe(false);expect(contract.publicationAuthorized).toBe(false);
 expect(contract.source.applicabilityApproved).toBe(false);
 expect(createHash('sha256').update(readFileSync(contract.source.path)).digest('hex')).toBe(contract.source.sha256);
});

it('retains the exact baseline mathematical engine source object',()=>{
 const original=execFileSync('git',['show','dc8544422dbb4ebccfc96e03431e64ebcf871fc9:src/calculators/launch-portfolio.ts']);
 expect(readFileSync('src/calculators/launch-portfolio.ts').equals(original)).toBe(true);
});
