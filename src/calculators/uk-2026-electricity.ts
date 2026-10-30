import {z} from 'zod';
import type {CalculatorDefinition} from './types';
import {runCalculator} from './engine';
import {rational,multiply,divide,formatRational} from './exact-rational';
import {copyCalculationData,createCalculationSnapshot} from '../lib/calculation-snapshot';
import {equalCompletionJson} from './completion-contracts';
import nativeBinding from '../../docs/authority485/native-source-binding.json';

const factor=z.literal('0.13096').parse(nativeBinding.factor.value);
z.literal('kgCO2e/kWh').parse(nativeBinding.factor.unit);
z.literal(5).parse(nativeBinding.factor.publishedDecimalPlaces);
z.literal('0.00000').parse(nativeBinding.factor.nativeNumberFormat);
const expectedFiles:Record<string,string>={
 'ghg-conversion-factors-2026-full-set.xlsx':'b5c4f2f86cdc74707337b2fb013b44ded189a1b528f5e29ea99856ba65ae0205',
 'ghg-conversion-factors-2026-flat-format-revised.xlsx':'a9a455ab396dae226d510c7be6233748416d490c41a5d20f3dc7a0c45feecd5e'
};
if(nativeBinding.files.length!==2||new Set(nativeBinding.files.map(f=>f.filename)).size!==2||nativeBinding.files.some(f=>expectedFiles[f.filename]!==f.sha256))throw Error('Unpinned native emission source');
const source=copyCalculationData({source:nativeBinding},{}).input.source as typeof nativeBinding;
const decimalString=z.string().regex(/^[0-9]+(?:\.[0-9]+)?$/);
const inputSchema=z.object({profile:z.literal('uk-electricity-scope2-location-2026'),year:z.literal(2026),country:z.literal('UK'),activity:z.literal('purchased_grid_electricity_owned_controlled_sites'),unit:z.literal('kWh'),scope:z.literal('Scope2'),basis:z.literal('location-based'),kWh:decimalString.max(1024)}).strict();
type Input=z.infer<typeof inputSchema>;
export const electricity2026OutputSchema=z.object({normalizedKWh:decimalString,kgCO2e:decimalString,tonnesCO2e:decimalString,factor:z.literal(factor),factorUnit:z.literal('kgCO2e/kWh'),sourceYear:z.literal(2026),boundary:z.literal('Scope2/location-based')}).strict();
type Output=z.infer<typeof electricity2026OutputSchema>;
const methodology=copyCalculationData({methodology:{expression:'kgCO2e = exactDecimal(kWh) * 0.13096; tonnesCO2e = kgCO2e / 1000',rounding:'No intermediate or display rounding; canonical exact decimal strings relative to the published five-decimal factor.',inputLimit:'At most1024 quantity characters; nonnegative decimal string only. This is a resource bound, not an emissions/applicability limit.',factorPrecision:'Native OOXML stores0.13095999999999999 with number format0.00000 in both originals. Apply published0.13096; preserve the stored tail as provenance, not extra factor precision.',period:'Calendar-year2026 UK activity only; no majority/blended reporting-year policy inferred.',applicability:'Only purchased UK grid electricity at organisation owned/controlled sites, Scope2 location-based. No determination of statutory obligation or qualified inventory boundary.',excluded:['Market-based electricity','Scope3 transmission/distribution or WTT','Onsite generation','NonUK and other activity years','Other footprint activities and full household/company/lifecycle totals','Additional GWP multiplication of an alreadyCO2e factor'],attribution:'Department for Energy Security and Net Zero,2026 UK Government GHG Conversion Factors for Company Reporting. Methodology publication states Crown copyright2026,Open Government Licence v3.0 except where otherwise stated; third-party/permitted-use and qualified applicability review are not granted by this engineering component.',sourceURL:nativeBinding.publication.url}},{}).input.methodology;
const governance=Object.freeze({relatedCatalogId:485,canonicalImplementationClass:'CONTRACT_BLOCKED',canonicalAccepted:false,canonicalMappingApproved:false,fullCarbonFootprintComplete:false,qualifiedApplicability:'UNRESOLVED',releaseHold:true,certificationAuthorized:false,publicationAuthorized:false});
export const uk2026ElectricityComponent:CalculatorDefinition<Input,Output>=Object.freeze({
 id:'private.component.uk-electricity-scope2-location.2026',slug:'private-uk-2026-electricity-scope2',title:'UK2026 purchased electricity — bounded private component',category:'private-source-components',version:1,riskClass:'standard',reviewStatus:'draft',inputSchema,
 calculate:(raw:Input)=>{const p=inputSchema.parse(raw),[whole,fraction='']=p.kWh.split('.');const quantity=rational(BigInt(whole+fraction),10n**BigInt(fraction.length));const kg=multiply(quantity,rational(13096n,100000n));return electricity2026OutputSchema.parse({normalizedKWh:formatRational(quantity),kgCO2e:formatRational(kg),tonnesCO2e:formatRational(divide(kg,rational(1000n))),factor,factorUnit:'kgCO2e/kWh',sourceYear:2026,boundary:'Scope2/location-based'});},
 formulas:Object.freeze([{id:'source-bound-electricity',expression:'kgCO2e=kWh*0.13096; tonnesCO2e=kgCO2e/1000',description:'Exact decimal calculation using the verified published five-decimal value; no GWP double conversion. Source row7_400_4000_5_1; full UK electricity E25 and revised flat Factors by Category J3066. Only UK calendar2026 purchased grid electricity at owned/controlled sites, Scope2 location-based. Full Carbon Footprint calculator remains CONTRACT_BLOCKED. RELEASE HOLD.'}]),
 sources:Object.freeze([{label:'DESNZ — Greenhouse gas reporting: conversion factors2026',url:nativeBinding.publication.url,note:'Full setv1.0; revised flatv1.2 internally10July2026,publicly31July2026. Native uploaded bytes and selected cell hashes pinned in docs/authority485/native-source-binding.json; independently downloaded publisher-byte identity is not claimed.'}]),examples:Object.freeze([])
});
export const electricity2026Example:Input=Object.freeze({profile:'uk-electricity-scope2-location-2026',year:2026,country:'UK',activity:'purchased_grid_electricity_owned_controlled_sites',unit:'kWh',scope:'Scope2',basis:'location-based',kWh:'100'});
export function exportUk2026Electricity(input:unknown,plan:'free'|'pro'|'business'='free'){
 z.enum(['free','pro','business']).parse(plan);const run=runCalculator(uk2026ElectricityComponent,input);const envelope={schemaVersion:1,profileId:uk2026ElectricityComponent.id,source,methodology,governance,calculation:createCalculationSnapshot({calculatorSlug:run.slug,calculatorVersion:run.version,input:run.input,output:run.output})};return copyCalculationData({envelope},{}).input.envelope as typeof envelope;
}
export function importUk2026Electricity(raw:unknown){const supplied=copyCalculationData({envelope:raw},{}).input.envelope as ReturnType<typeof exportUk2026Electricity>;if(!supplied?.calculation)throw Error('Invalid electricity snapshot');const expected=exportUk2026Electricity(supplied.calculation.input);if(!equalCompletionJson(supplied,expected))throw Error('Snapshot differs from its immutable source,scope,version or actual engine result');return expected;}
