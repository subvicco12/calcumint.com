import {z} from 'zod';
import type {CalculatorDefinition} from './types';
import {decimal,divide,multiply,subtract,type Rational} from './exact-rational';
import {add} from './exact-rational';
import {runCalculator} from './engine';
import {copyCalculationData,createCalculationSnapshot} from '../lib/calculation-snapshot';

const quantity=z.string().regex(/^(0|[1-9]\d{0,11})(\.\d{1,6})?$/);
const positive=quantity.refine(value=>decimal(value).numerator!=='0','Positive quantity required');
const efficiency=positive.refine(value=>{
 const r=decimal(value);return BigInt(r.numerator)<=BigInt(r.denominator);
},'Conventional efficiency must not exceed one');
const inputSchema=z.object({
 methodSnapshot:z.literal('2026-10-29'),
 // A supplied currency label only; this does not perform currency conversion.
 currency:z.string().regex(/^[A-Z]{3}$/),
 heatBoundary:z.literal('same-annual-space-heat'),
 auxiliaryBoundary:z.literal('outside-scop-only'),
 usefulHeatKwh:quantity,existingEfficiency:efficiency,scop:positive,
 outsideAuxiliaryKwh:quantity,fuelTariff:quantity,electricityTariff:quantity,
 incrementalInstalledCost:quantity,
}).strict();
type HeatInput=z.infer<typeof inputSchema>;
type HeatOutput={
 currency:string;existingInputKwh:Rational;heatPumpBaseKwh:Rational;
 heatPumpTotalKwh:Rational;existingCost:Rational;heatPumpCost:Rational;
 annualSavings:Rational;simplePaybackYears:Rational|null;
 paybackStatus:'positive-savings'|'zero-cost'|'no-positive-savings';
};
const source=Object.freeze({
 id:'etl-air-water-scop',
 url:'https://etl.energysecurity.gov.uk/products/heat-pumps/air-water-heat-pumps',
 // Hash of retained extracted Markdown, including one final newline, not HTTP bytes.
 sha256:'a77934e6fa74930eac269dea61d5c1276d6975358cd0c7f8bfafd7de6d751ae3',
});
const sources=Object.freeze([Object.freeze({id:source.id,sha256:source.sha256})]);

export const annualHeatComparison:CalculatorDefinition<HeatInput,HeatOutput>=Object.freeze({
 id:'private.profile.annual-heat-comparison',slug:'private-profile-annual-heat-comparison',
 title:'Supplied annual space-heating comparison',category:'private-source-bound-profiles',
 version:1,riskClass:'standard',reviewStatus:'draft',inputSchema,
 calculate(raw:HeatInput):HeatOutput{
  const p=inputSchema.parse(raw);
  const heat=decimal(p.usefulHeatKwh);
  const existingInputKwh=divide(heat,decimal(p.existingEfficiency));
  const heatPumpBaseKwh=divide(heat,decimal(p.scop));
  const heatPumpTotalKwh=add(heatPumpBaseKwh,decimal(p.outsideAuxiliaryKwh));
  const existingCost=multiply(existingInputKwh,decimal(p.fuelTariff));
  const heatPumpCost=multiply(heatPumpTotalKwh,decimal(p.electricityTariff));
  const annualSavings=subtract(existingCost,heatPumpCost);
  const cost=decimal(p.incrementalInstalledCost);
  const positiveSavings=BigInt(annualSavings.numerator)>0n;
  return {currency:p.currency,existingInputKwh,heatPumpBaseKwh,heatPumpTotalKwh,
   existingCost,heatPumpCost,annualSavings,
   simplePaybackYears:positiveSavings?divide(cost,annualSavings):null,
   paybackStatus:!positiveSavings?'no-positive-savings':cost.numerator==='0'?'zero-cost':'positive-savings',
  };
 },
 formulas:Object.freeze([Object.freeze({id:'annual-heat-balance',
  expression:'existing=Q/eta; heatPump=Q/SCOP+outsideAuxiliary; savings=existing*fuelTariff-heatPump*electricityTariff; simplePayback=incrementalCost/positiveSavings',
  description:'Caller supplies compatible annual space-heat boundaries, conventional efficiency, SCOP, tariffs and outside-SCOP auxiliary. No equipment or climate applicability decision; no cooling/hot water, hybrid, maintenance, incentives, escalation, tax, discounting or monetary rounding. Simple payback assumes unchanged annual savings. RELEASE HOLD.',
 })]),
 sources:Object.freeze([Object.freeze({label:'ETL section 1.4.1 SCOP definition',url:source.url,
  note:`Extracted Markdown SHA256 ${source.sha256}; not publisher HTTP bytes. Normative version/effective dates unverified. Cost/payback algebra is a declared engineering scenario, not an ETL savings claim.`,
 })]),examples:Object.freeze([]),
});

export function exportAnnualHeatComparison(input:unknown,plan:'free'|'pro'|'business'='free'){
 z.enum(['free','pro','business']).parse(plan);
 const d=annualHeatComparison,run=runCalculator(d,input);
 return Object.freeze({schemaVersion:1 as const,profileId:d.id,sources,
  calculation:createCalculationSnapshot({calculatorSlug:d.slug,calculatorVersion:d.version,
   input:run.input,output:run.output}),
 });
}
const envelope=z.object({
 schemaVersion:z.literal(1),profileId:z.literal('private.profile.annual-heat-comparison'),
 sources:z.tuple([z.object({id:z.literal(source.id),sha256:z.literal(source.sha256)}).strict()]),
 calculation:z.object({calculatorSlug:z.literal('private-profile-annual-heat-comparison'),
  calculatorVersion:z.literal(1),input:inputSchema,output:z.record(z.string(),z.unknown()),
 }).strict(),
}).strict();
function equal(a:unknown,b:unknown):boolean{
 if(a===b)return true;
 if(a===null||b===null||typeof a!=='object'||typeof b!=='object'||Array.isArray(a)!==Array.isArray(b))return false;
 const keys=Object.keys(a);
 return keys.length===Object.keys(b).length&&keys.every(key=>Object.hasOwn(b,key)&&equal((a as Record<string,unknown>)[key],(b as Record<string,unknown>)[key]));
}
export function importAnnualHeatComparison(raw:unknown){
 const supplied=envelope.parse(copyCalculationData({envelope:raw},{}).input.envelope);
 const expected=exportAnnualHeatComparison(supplied.calculation.input);
 if(!equal(supplied,expected))throw Error('Annual heat snapshot does not match pinned source/version/engine');
 return expected;
}
