import {describe,it,expect} from 'vitest';
import {calculatorRegistry} from '@/calculators/registry';
import {runCalculator} from '@/calculators/engine';
import {technologyNextCatalog} from '@/lib/native-delivery/technology-next-catalog';
import {parseTechnologyNextShare,readTechnologyNextSharedSnapshot} from './technology-next-sharing';
const org='11111111-1111-4111-8111-111111111111',project='22222222-2222-4222-8222-222222222222',request='33333333-3333-4333-8333-333333333333';
const snapshot=(slug:string,input?:Record<string,unknown>)=>{const d=calculatorRegistry.getBySlug(slug)!;const i=input??d.examples[0].input as Record<string,unknown>;return{calculatorSlug:slug,calculatorVersion:d.version,input:i,output:runCalculator(d,i).output as Record<string,unknown>};};
const payload=(s:ReturnType<typeof snapshot>)=>({organizationId:org,projectId:project,requestId:request,clientWorkspaceId:null,title:'Next shared record',snapshot:s});
describe('closed next cohort sharing tuples',()=>{
 it.each(technologyNextCatalog)('accepts exact $catalogId @$version with immutable copied values',entry=>{const result=parseTechnologyNextShare(payload(snapshot(entry.slug)));expect(result.snapshot.calculatorVersion).toBe(entry.version);expect(Object.isFrozen(result.snapshot.input)).toBe(true);});
 it('refuses website v1, unselected old five, forged output and envelope extras',()=>{const s=snapshot('website-bandwidth-calculator');expect(()=>parseTechnologyNextShare(payload({...s,calculatorVersion:1}))).toThrow();expect(()=>parseTechnologyNextShare(payload(snapshot('base64-size-calculator')))).toThrow();expect(()=>parseTechnologyNextShare(payload({...s,output:{value:42,steps:[]}}))).toThrow();expect(()=>parseTechnologyNextShare({...payload(s),trusted:true})).toThrow();});
 it('keeps noninteger resolution in its original declared v1 schema',()=>{const result=parseTechnologyNextShare(payload(snapshot('resolution-calculator',{widthPixels:1.5,heightPixels:2.5})));expect(result.snapshot.output.value).toBe(3.75);});
 it('refuses subnormal new captures but keeps original exact historical replay',()=>{const s=snapshot('aspect-ratio-calculator',{width:1e-320,height:1});expect(()=>parseTechnologyNextShare(payload(s))).toThrow();expect(readTechnologyNextSharedSnapshot({calculator_slug:s.calculatorSlug,calculator_version:s.calculatorVersion,input_data:s.input,output_data:s.output})).toEqual(s);});
});
