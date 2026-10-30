import {describe,it,expect} from 'vitest';
import {uk2026ElectricityComponent,exportUk2026Electricity,importUk2026Electricity} from './uk-2026-electricity';
import {calculatorRegistry} from './registry';
const input={profile:'uk-electricity-scope2-location-2026',year:2026,country:'UK',activity:'purchased_grid_electricity_owned_controlled_sites',unit:'kWh',scope:'Scope2',basis:'location-based',kWh:'123.456'};
const calc=(kWh:string)=>exportUk2026Electricity({...input,kWh}).calculation.output;
// Literal expectations independently derived with decimal arithmetic from native
// UK electricity!E25 / Factors by Category!J3066, published format 0.00000.
const vectors=[
 ['123.456','16.16779776','0.01616779776'],
 ['9007199254740993','1179582814400880.44328','1179582814400.88044328'],
 ['0.0000000000000000001','0.000000000000000000013096','0.000000000000000000000013096'],
 ['999999999999999999999999.999999999999','130959999999999999999999.99999999999986904','130959999999999999999.99999999999999986904'],
 ['0012.3400','1.6160464','0.0016160464'],
 ['2.5','0.3274','0.0003274'],
 ['000.000','0','0'],
] as const;
describe('independent native-bound UK2026 electricity engineering witnesses',()=>{
 it.each(vectors)('calculates %s kWh without binary conversion, GWP multiplication or display rounding',(kWh,kgCO2e,tonnesCO2e)=>expect(calc(kWh)).toMatchObject({kgCO2e,tonnesCO2e}));
 it('supports the declared 1024-character integral boundary exactly',()=>{
  expect(calc('1'+'0'.repeat(1023))).toMatchObject({kgCO2e:'13096'+'0'.repeat(1018),tonnesCO2e:'13096'+'0'.repeat(1015)});
  expect(()=>calc('1'+'0'.repeat(1024))).toThrow();
 });
 it('supports the declared decimal boundary without underflow',()=>{
  expect(calc('0.'+'0'.repeat(1021)+'1')).toMatchObject({kgCO2e:'0.'+'0'.repeat(1022)+'13096',tonnesCO2e:'0.'+'0'.repeat(1025)+'13096'});
 });
 it.each(['-0','-1','+1','1e3','1E3','Infinity','NaN','.5','1.','1_000','1,000','\t1','1\n','１２','0x10'])('rejects unsupported decimal syntax %j',kWh=>expect(()=>calc(kWh)).toThrow());
 it('requires exact activity/year/unit/scope boundaries and rejects caller-supplied factors',()=>{
  for(const patch of [{year:2025},{year:2027},{country:'GB'},{activity:'onsite_generation'},{unit:'MWh'},{scope:'Scope3'},{basis:'market-based'},{profile:'whole-carbon-footprint'},{kWh:123.456},{factor:'0'},{factor:null},{gwp:28},{transmissionLossesIncluded:true}])expect(()=>exportUk2026Electricity({...input,...patch})).toThrow();
 });
 it('pins all source/output metadata in detached immutable replay',()=>{
  const s=exportUk2026Electricity(input);
  expect(exportUk2026Electricity(input,'pro')).toEqual(s);expect(exportUk2026Electricity(input,'business')).toEqual(s);
  expect(Object.isFrozen(s.source)).toBe(true);expect(Object.isFrozen(s.calculation.input)).toBe(true);expect(Object.isFrozen(s.calculation.output)).toBe(true);
  expect(importUk2026Electricity(JSON.parse(JSON.stringify(s)))).toEqual(s);
  for(const mutate of [
   (t:Record<string,unknown>)=>{t.source={blankFactor:0};},
   (t:Record<string,unknown>)=>{t.certified=true;},
   (t:Record<string,unknown>)=>{(t.calculation as {output:Record<string,unknown>}).output.tonnesCO2e='0.0161677977601';},
   (t:Record<string,unknown>)=>{(t.calculation as {input:Record<string,unknown>}).input.kWh='123.457';},
  ]){const t=JSON.parse(JSON.stringify(s));mutate(t);expect(()=>importUk2026Electricity(t)).toThrow();}
 });
 it('exposes only a private component and retains the whole485 canonical block',()=>{
  expect(calculatorRegistry.getById(uk2026ElectricityComponent.id)).toBeUndefined();expect(calculatorRegistry.getBySlug(uk2026ElectricityComponent.slug)).toBeUndefined();
  expect(exportUk2026Electricity(input).governance).toMatchObject({relatedCatalogId:485,canonicalImplementationClass:'CONTRACT_BLOCKED',canonicalAccepted:false,releaseHold:true,certificationAuthorized:false,publicationAuthorized:false});
 });
});
