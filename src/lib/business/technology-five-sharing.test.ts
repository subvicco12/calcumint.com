import {describe,it,expect} from 'vitest';
import {calculatorRegistry} from '@/calculators/registry';
import {runCalculator} from '@/calculators/engine';
import {parseTechnologyFiveShare,readTechnologyFiveSharedSnapshot,parseTechnologyFiveSnapshotJson} from './technology-five-sharing';
const organizationId='11111111-1111-4111-8111-111111111111',projectId='22222222-2222-4222-8222-222222222222',requestId='33333333-3333-4333-8333-333333333333';
const slugs=['base64-size-calculator','bandwidth-calculator','download-time-calculator','upload-time-calculator','data-transfer-calculator'];
const snapshot=(slug=slugs[0])=>{const d=calculatorRegistry.getBySlug(slug)!;return{calculatorSlug:slug,calculatorVersion:1,input:d.examples[0].input as Record<string,unknown>,output:runCalculator(d,d.examples[0].input).output as Record<string,unknown>};};
const request=()=>({organizationId,projectId,requestId,clientWorkspaceId:null,title:'Original values',snapshot:snapshot()});
describe('exact-five Business shared snapshot contract',()=>{
 it.each(slugs)('accepts and deeply freezes exact registered v1 %s',slug=>{const r=parseTechnologyFiveShare({...request(),snapshot:snapshot(slug)});expect(r.snapshot.calculatorSlug).toBe(slug);expect(Object.isFrozen(r.snapshot.input)).toBe(true);expect(Object.isFrozen(r)).toBe(true);});
 it.each([r=>({...r,extraneous:true}),r=>({...r,snapshot:{...r.snapshot,calculatorVersion:2}}),r=>({...r,snapshot:{...r.snapshot,output:{value:42,steps:[]}}}),r=>({...r,snapshot:{...r.snapshot,input:{...r.snapshot.input,unknown:1}}}),r=>({...r,requestId:'not-a-uuid'})] as ((r:ReturnType<typeof request>)=>unknown)[])('refuses forged scope/input/output/envelopes',mutate=>{expect(()=>parseTechnologyFiveShare(mutate(request()))).toThrow();});
 it('refuses unrelated registered identities instead of sharing a wider catalog',()=>{expect(()=>parseTechnologyFiveShare({...request(),snapshot:snapshot('power-calculator')})).toThrow();});
 it('reads stored exact snapshots without upgrading or mutating records',()=>{const s=snapshot();const r=readTechnologyFiveSharedSnapshot({calculator_slug:s.calculatorSlug,calculator_version:1,input_data:s.input,output_data:s.output});expect(r).toEqual(s);expect(Object.isFrozen(r.output)).toBe(true);});
 it('accepts recorded JSON recovery and rejects extra metadata/oversize text',()=>{expect(parseTechnologyFiveSnapshotJson(JSON.stringify(snapshot()))).toEqual(snapshot());expect(()=>parseTechnologyFiveSnapshotJson(JSON.stringify({...snapshot(),trusted:true}))).toThrow();expect(()=>parseTechnologyFiveSnapshotJson(' '.repeat(65537))).toThrow();});
});
