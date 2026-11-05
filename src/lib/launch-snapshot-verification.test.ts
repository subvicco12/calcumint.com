import {expect,it} from 'vitest';
import source from '../../docs/first20-publication/input/publication-readiness-register-44.json';
import {getLaunchSpec,launchDefinitions} from '@/calculators/launch-portfolio';
import {runCalculator} from '@/calculators/engine';
import {verifyRegisteredSnapshot} from './registered-snapshot-verification';
import {recoverScenarioSet} from './scenario-set-recovery';
const rows=source.rows.filter(row=>![214,217,268].includes(row.masterId));
it('pins the 41 selected identities and leaves three blocked contracts excluded',()=>{expect(rows).toHaveLength(41);});
it.each(rows)('$masterId restores only its exact immutable launch v1 calculation and separate scenarios',row=>{
 const spec=getLaunchSpec(row.slug)!,definition=launchDefinitions.find(d=>d.id===row.engineId)!;
 const input=Object.fromEntries(spec.fields.map(f=>[f.key,f.defaultValue]));const output=runCalculator(definition,input).output;
 const snapshot={calculatorSlug:row.slug,calculatorVersion:row.version,input,output};const original=JSON.stringify(snapshot);
 expect(verifyRegisteredSnapshot(snapshot)).toMatchObject({engineId:row.engineId,engineVersion:1,snapshot});
 expect(verifyRegisteredSnapshot({...snapshot,input:Object.fromEntries(Object.entries(input).reverse())})).toMatchObject({snapshot:{input}});
 const payload={schemaVersion:1,calculatorSlug:row.slug,calculatorVersion:1,baseline:'A',scenarios:[{slot:'A',notes:'Recovered copy',input,output}]};
 const copies=recoverScenarioSet(payload,snapshot);expect(copies).toHaveLength(1);expect(copies[0].snapshot.input).toEqual(input);expect(JSON.stringify(snapshot)).toBe(original);
 for(const bad of [{...snapshot,calculatorVersion:2},{...snapshot,calculatorVersion:0},{...snapshot,input:{...input,extra:1}},{...snapshot,input:{}},{...snapshot,output:{result:output.result+1}},{...snapshot,output:{...output,extra:1}},{...snapshot,approval:'certified'}])expect(()=>verifyRegisteredSnapshot(bad)).toThrow();
 expect(()=>recoverScenarioSet({...payload,scenarios:[{slot:'A',notes:'forged',input,output:{result:output.result+1}}]},snapshot)).toThrow();
});
it.each(source.rows.filter(row=>[214,217,268].includes(row.masterId)))('does not adopt blocked $masterId or change its history',row=>{
 const spec=getLaunchSpec(row.slug)!,definition=launchDefinitions.find(d=>d.slug===row.slug)!;const input=Object.fromEntries(spec.fields.map(f=>[f.key,f.defaultValue]));const snapshot={calculatorSlug:row.slug,calculatorVersion:1,input,output:runCalculator(definition,input).output};expect(()=>verifyRegisteredSnapshot(snapshot)).toThrow();expect(definition.version).toBe(1);
});
