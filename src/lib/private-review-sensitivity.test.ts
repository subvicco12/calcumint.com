import {it,expect} from 'vitest';
import {exportScaledContract,allContractAdapters,allContractVectors,getScaledAdapter} from '@/calculators/scaled-contract-adapters';
import {eligiblePrivateSensitivityFields,previewPrivateSensitivity} from './private-review-sensitivity';
const loan=(principal=1200,annualRatePercent=0,termMonths=12)=>exportScaledContract('private.component.3',{currency:'USD',scope:'supplied-fixed-monthly-no-policy',principal,annualRatePercent,termMonths,extraMonthlyPayment:0});
it('previews exact independently known private loan outputs without changing the baseline packet',()=>{
 const baseline=loan(),before=JSON.stringify(baseline),result=previewPrivateSensitivity(baseline,'principal',[1200,2400]);
 expect(result.baseline).toEqual(baseline);expect(result.points.map(p=>p.value)).toEqual([100,200]);expect(result.points.map(p=>p.difference)).toEqual([0,100]);expect(JSON.stringify(baseline)).toBe(before);expect(Object.isFrozen(result.points[0].packet)).toBe(true);
 const historical=previewPrivateSensitivity(loan(210,120,2),'principal',[210,420]);expect(historical.points.map(p=>p.value)).toEqual([121,242]);
});
it('uses identical complete free-plan mathematical packets across all synthetic plan origins',()=>{
 const input={currency:'USD',scope:'supplied-fixed-monthly-no-policy',principal:1200,annualRatePercent:0,termMonths:12,extraMonthlyPayment:0};
 const results=(['free','pro','business'] as const).map(plan=>previewPrivateSensitivity(exportScaledContract('private.component.3',input,plan),'principal',[2400]));expect(results[0]).toEqual(results[1]);expect(results[1]).toEqual(results[2]);
});
it('selects only declared, present top-level finite numeric inputs',()=>{
 expect(eligiblePrivateSensitivityFields(loan())).toEqual(['principal','annualRatePercent','termMonths','extraMonthlyPayment']);
 const nested=exportScaledContract('private.canonical-calculus.246',{calculation:{operation:'derivative',expression:'x^3',x:'2'},plot:{enabled:false,radius:'1',samples:9}});expect(eligiblePrivateSensitivityFields(nested)).toEqual([]);expect(()=>previewPrivateSensitivity(nested,'calculation.x',[3])).toThrow();
 const inventory=allContractAdapters.map(a=>{const witness=allContractVectors.find(v=>v.id===a.catalogId)!.witnesses[0];const p=exportScaledContract(a.key,witness.input);return eligiblePrivateSensitivityFields(p);});expect(inventory.filter(fields=>fields.length).length).toBe(70);expect(inventory.flat().length).toBe(221);
});
it('rejects malformed candidates and unsupported fields atomically, retaining every original packet',()=>{
 const baseline=loan(),before=JSON.stringify(baseline),valid=previewPrivateSensitivity(baseline,'principal',[2400]);
 for(const values of [[],Array(26).fill(2400),[NaN],[Infinity],[2400,-1]])expect(()=>previewPrivateSensitivity(baseline,'principal',values)).toThrow();
 for(const field of ['unknown','currency','principal.x','__proto__'])expect(()=>previewPrivateSensitivity(baseline,field,[2])).toThrow();
 expect(valid.points.map(p=>p.value)).toEqual([200]);expect(JSON.stringify(baseline)).toBe(before);
});
it('rejects source and immutable-version tampering before running a preview',()=>{
 const p=loan();for(const mutate of [(v:typeof p)=>{v.engineVersion=999;},(v:typeof p)=>{v.sourceBinding={} as typeof v.sourceBinding;},(v:typeof p)=>{v.artifact={} as typeof v.artifact;}]){const fake=structuredClone(p);mutate(fake);expect(()=>eligiblePrivateSensitivityFields(fake)).toThrow();expect(()=>previewPrivateSensitivity(fake,'principal',[2400])).toThrow();}
 let called=0;expect(()=>previewPrivateSensitivity({get adapterKey(){called++;return p.adapterKey;}},'principal',[2400])).toThrow();expect(called).toBe(0);
});
it('retains revision2 adapter source identity and complete output packets',()=>{
 const baseline=exportScaledContract('private.remaining.477',{currency:'USD',scope:'supplied-mathematical-scenario',energyKwh:10,tariffPerKwh:2});const p=previewPrivateSensitivity(baseline,'energyKwh',[20]).points[0];expect(p.value).toBe(40);expect(p.packet.validationRevision).toBe(2);expect(p.packet.sourceBinding).toEqual(baseline.sourceBinding);expect(getScaledAdapter(p.packet.adapterKey).getOutput(p.packet.artifact).value).toBe(40);
});
it('replays every eligible supplied numeric field against its unchanged original packet',()=>{
 let profiles=0,fields=0;
 for(const adapter of allContractAdapters){
  const input=allContractVectors.find(vector=>vector.id===adapter.catalogId)!.witnesses[0].input;
  const baseline=exportScaledContract(adapter.key,input),eligible=eligiblePrivateSensitivityFields(baseline);
  if(eligible.length)profiles++;
  const complete=getScaledAdapter(adapter.key).getInput(baseline.artifact) as Record<string,unknown>;
  for(const field of eligible){fields++;const point=previewPrivateSensitivity(baseline,field,[complete[field] as number]).points[0];expect(point.packet).toEqual(baseline);}
 }
 expect(profiles).toBe(70);expect(fields).toBe(221);
});
