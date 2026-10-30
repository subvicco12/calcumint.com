import {it,expect} from 'vitest';
import {runCalculator} from './engine';
import {uk2026ElectricityComponent,electricity2026Example,exportUk2026Electricity,importUk2026Electricity,electricity2026OutputSchema} from './uk-2026-electricity';
const calculate=(kWh:string)=>runCalculator(uk2026ElectricityComponent,{...electricity2026Example,kWh}).output;
it.each([['0','0','0'],['100','13.096','0.013096'],['1000','130.96','0.13096'],['0001.000','0.13096','0.00013096'],['0.000001','0.00000013096','0.00000000013096']])('computes exact decimal %s without intermediate rounding',(kWh,kgCO2e,tonnesCO2e)=>expect(calculate(kWh)).toMatchObject({kgCO2e,tonnesCO2e}));
it.each(['-1','NaN','Infinity','1e3','+1','.1','1.',' 1','1,000','0x10','', '1'.repeat(1025)])('rejects invalid/oversized quantity %s',kWh=>expect(()=>calculate(kWh)).toThrow());
it('rejects floats and unsupported year,country,activity,unit,scope,basis and caller factors',()=>{
 for(const change of [{kWh:100},{year:2025},{year:2027},{country:'US'},{unit:'MWh'},{activity:'onsite_generation'},{scope:'Scope3'},{basis:'market-based'},{profile:'whole-carbon-footprint'},{factor:''},{factor:0},{gwp:28},{startDate:'2025-12-31'}])expect(()=>exportUk2026Electricity({...electricity2026Example,...change})).toThrow();
});
it('keeps plan math equal, freezes all metadata and verifies the whole envelope',()=>{
 const s=exportUk2026Electricity(electricity2026Example);expect(exportUk2026Electricity(electricity2026Example,'pro')).toEqual(s);expect(exportUk2026Electricity(electricity2026Example,'business')).toEqual(s);expect(importUk2026Electricity(JSON.parse(JSON.stringify(s)))).toEqual(s);expect(Object.isFrozen(s.source)).toBe(true);expect(Object.isFrozen(s.calculation.output)).toBe(true);
 for(const field of ['profileId','source','methodology','calculation']){const t=JSON.parse(JSON.stringify(s));t[field]={tampered:true};expect(()=>importUk2026Electricity(t)).toThrow();}
 const t=JSON.parse(JSON.stringify(s));t.calculation.output.kgCO2e='0';expect(()=>importUk2026Electricity(t)).toThrow();const v=JSON.parse(JSON.stringify(s));v.calculation.calculatorVersion=2;expect(()=>importUk2026Electricity(v)).toThrow();
});
it('retains the canonical485block and does not claim full footprint acceptance',()=>{expect(uk2026ElectricityComponent.reviewStatus).toBe('draft');const s=exportUk2026Electricity(electricity2026Example);expect(s.governance).toMatchObject({relatedCatalogId:485,canonicalImplementationClass:'CONTRACT_BLOCKED',canonicalAccepted:false,releaseHold:true,certificationAuthorized:false,publicationAuthorized:false});expect(electricity2026OutputSchema.safeParse({...s.calculation.output,unexpected:true}).success).toBe(false);});
