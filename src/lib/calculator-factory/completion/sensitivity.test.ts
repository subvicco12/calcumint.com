import {expect,it} from 'vitest';
import {previewFactorySensitivity} from './sensitivity';
import {getFactoryWorkflows} from '../registry';
it('runs immutable square and unit-scaled converter what-if candidates without changing baseline',()=>{
 const square=getFactoryWorkflows(218).execute({x:'12'}),copy=JSON.stringify(square);
 const result=previewFactorySensitivity(square,'x',['-2','0','3'],'pro');
 expect(result.points.map(row=>row.value)).toEqual([4,0,9]);expect(result.points.map(row=>row.difference)).toEqual([-140,-144,-135]);expect(JSON.stringify(square)).toBe(copy);
 const conversion=getFactoryWorkflows(440).execute({value:'1',fromUnit:'mhz',toUnit:'hz'});
 expect(previewFactorySensitivity(conversion,'value',['0.125','2'],'business').points.map(row=>row.value)).toEqual([125000,2000000]);
});
it('refuses Free previews, wrong fields, mixed-invalid candidates, overflow and tampered baselines',()=>{
 const packet=getFactoryWorkflows(220).execute({x:'4'});
 expect(()=>previewFactorySensitivity(packet,'x',['9'],'free')).toThrow(/Pro/);
 for(const values of [[],[''],['0x10'],['1junk'],['-1'],['1e400'],Array(26).fill('1')])expect(()=>previewFactorySensitivity(packet,'x',values,'pro')).toThrow();
 expect(()=>previewFactorySensitivity(packet,'unapproved',['1'],'pro')).toThrow();
 expect(()=>previewFactorySensitivity({...packet,snapshot:{...packet.snapshot,output:{result:99}}},'x',['9'],'pro')).toThrow();
});
it('exports and replays exact what-if provenance while rejecting altered differences',async()=>{
 const {exportFactorySensitivity,replayFactorySensitivity}=await import('./sensitivity');
 const preview=previewFactorySensitivity(getFactoryWorkflows(218).execute({x:'2'}),'x',['03','4'],'pro');
 const json=exportFactorySensitivity(preview,'json','pro');expect(replayFactorySensitivity(new TextDecoder().decode(json.bytes),'business')).toEqual(preview);
 expect(new TextDecoder().decode(exportFactorySensitivity(preview,'csv','pro').bytes)).toContain('03');
 expect(new TextDecoder().decode(exportFactorySensitivity(preview,'pdf','business').bytes.slice(0,8))).toContain('%PDF-');
 const bad=JSON.parse(new TextDecoder().decode(json.bytes));bad.preview.points[0].difference=99;expect(()=>replayFactorySensitivity(JSON.stringify(bad),'pro')).toThrow();
 expect(()=>exportFactorySensitivity(preview,'json','free')).toThrow();
});
