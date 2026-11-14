import {it,expect} from 'vitest';
import {readFileSync} from 'node:fs';import {createHash} from 'node:crypto';
import {calculatorRegistry} from '@/calculators/registry';import {runCalculator} from '@/calculators/engine';
import {technologyReplayBindings,verifyTechnologySnapshot} from './technology-snapshot-verification';
import {verifyRegisteredSnapshot} from './registered-snapshot-verification';
it('pins the two immutable source modules and all14 explicit replay identities',()=>{
 for(const [path,sha] of Object.entries({'src/calculators/technology-computing/catalog-batch-1.ts':'31f347fc286cc0b22cd888b9f53719e4733ffa17ab8323aa4f6dc5bc497079f6','src/calculators/technology-computing/catalog-batch-2.ts':'d352f40f8aef2cbd22afd8c09e577f28fc4eda1b925a928ec65c1ea25f4393d7'}))expect(createHash('sha256').update(readFileSync(path)).digest('hex')).toBe(sha);
 expect(technologyReplayBindings.map(row=>row.slug)).toEqual(['ip-subnet-calculator','raid-capacity-calculator','screen-ppi-calculator','aspect-ratio-calculator','resolution-calculator','dpi-calculator','battery-runtime-calculator','ups-runtime-calculator','power-supply-calculator','website-bandwidth-calculator','cloud-storage-cost-calculator','cloud-data-transfer-cost-calculator','base64-size-calculator','password-entropy-calculator']);
 expect(technologyReplayBindings.filter(row=>row.version!==1)).toEqual([{slug:'website-bandwidth-calculator',engineId:'technology.website-bandwidth',version:2}]);
});
for(const binding of technologyReplayBindings)it(`verifies/rejects exact ${binding.slug}@${binding.version} without upgrading historical data`,()=>{
 const definition=calculatorRegistry.getBySlug(binding.slug)!;const input=definition.examples[0].input as Record<string,unknown>;const output=runCalculator(definition,input).output as Record<string,unknown>;
 const original={calculatorSlug:binding.slug,calculatorVersion:binding.version,input,output},text=JSON.stringify(original);
 const checked=verifyRegisteredSnapshot(original);expect(checked.engineId).toBe(binding.engineId);expect(checked.snapshot).toEqual(original);expect(Object.isFrozen(checked.snapshot.input)).toBe(true);expect(JSON.stringify(original)).toBe(text);
 for(const version of [binding.version+1,binding.version===2?1:0])expect(()=>verifyTechnologySnapshot({...original,calculatorVersion:version})).toThrow();
 expect(()=>verifyTechnologySnapshot({...original,input:{...input,providerRule:'invented'}})).toThrow();
 expect(()=>verifyTechnologySnapshot({...original,output:{...output,value:123456789}})).toThrow();
 expect(()=>verifyTechnologySnapshot({...original,output:{...output,steps:['forged']}})).toThrow();
 expect(()=>verifyTechnologySnapshot({...original,unexpected:'field'})).toThrow();
});
it('does not expose an arbitrary registry fallback or private proposed calculator',()=>{
 for(const slug of ['slope-calculator','conversion.pressure.source-factor-private','retired'])expect(()=>verifyTechnologySnapshot({calculatorSlug:slug,calculatorVersion:1,input:{},output:{}})).toThrow();
});
