/** New caller controls only. Historical converter arithmetic and registration stay immutable. */
import {z} from 'zod';
import {conversionPublicationDefinitions} from '@/lib/publication20/conversions';
import {cookingMeasurementConverter} from '@/calculators/conversion/catalog-batch-4';
import {draftMaster435Calculator} from '@/calculators/conversion/draft-master-435';
import {draftMaster441Calculator} from '@/calculators/conversion/draft-master-441';
import {requiredCalculatorNumber} from '@/lib/registered-input-successor';
import {createCalculationSnapshot} from '@/lib/calculation-snapshot';
import {createFactoryWorkflows,type FactoryRaw} from '../workflows';
import {conversionCompletionSource} from './conversion-contracts';
import type {FactoryContract} from '../registry';
const specs=[
 {catalogId:429,units:['pa','kpa','mpa','bar','atm','psi'],scope:'Fixed scalar pressure; Pa, decimal prefixes, bar and standard atmosphere; psi retains legacy 6894.757293168 Pa, approximately 6.2e-14 relative to the UCUM definition. No gauge/absolute offset.'},
 {catalogId:435,units:['km_per_l','l_per_100km','mpg_us','mpg_imp'],scope:'Private exact rational positive fuel-economy conversion; international mile and explicit US/imperial gallons. One final 34 significant digit half-even rounding; no trip or cost model.'},
 {catalogId:436,units:['ml','l','tsp_us','tbsp_us','fl_oz_us','cup_us','pint_us','quart_us','gallon_us'],scope:'Approximate household US liquid capacities using frozen v1 decimal millilitre factors, within 4e-7 relative to UCUM derived units. No ingredient mass, metric cup, imperial capacities or precision metrology.'},
 {catalogId:437,units:['kg_m3','g_cm3','kg_l','lb_ft3'],scope:'Scalar density; international avoirdupois pound per cubic international foot retains legacy 16.01846337396 kg/m³, within 9e-14 relative to UCUM definitions. No material or temperature model.'},
 {catalogId:439,units:['n_m','kn_m','lbf_ft','lbf_in'],scope:'Scalar torque; conventional pound-force × international foot retains legacy 1.3558179483314 N·m, within 1e-15 relative to UCUM definitions; inch factor is the existing foot factor /12. No calibration or tool applicability.'},
 {catalogId:441,units:['dpi','dpcm','dppx'],scope:'Private CSS resolution density only; dpcm=2.54 dpi and dppx=96 dpi. Exact rational intermediates with final 34 significant digit half-even rounding. Physical device density and image/print sizes excluded. CSS retained full-text source applicability remains unestablished.'},
] as const;
export const conversionNextContracts:readonly FactoryContract[]=Object.freeze(specs.map(spec=>{
 const entry=conversionPublicationDefinitions.find(row=>row.catalogId===spec.catalogId);
 const engine=entry?.definition??(spec.catalogId===435?draftMaster435Calculator:spec.catalogId===441?draftMaster441Calculator:cookingMeasurementConverter);
 const exact=spec.catalogId===435||spec.catalogId===441;
 const fields=[{key:'value',label:'Value',kind:'number' as const,defaultValue:'1'},...['fromUnit','toUnit'].map((key,index)=>({key,label:index?'To unit':'From unit',kind:'select' as const,options:[...spec.units],defaultValue:spec.units[index]}))];
 const rawSchema=z.object({value:z.string().min(1).max(exact?160:4096),fromUnit:z.enum(spec.units),toUnit:z.enum(spec.units)}).strict();
 return Object.freeze({catalogId:spec.catalogId,engineId:engine.id,slug:engine.slug,version:1,title:engine.title,registered:!exact,...(exact?{privateRevision:'milestone60-20261113.1'}:{}),primaryKey:'result',fields,scope:spec.scope,
  outputUnit:(input:Record<string,unknown>)=>String(input.toUnit),sourceEvidence:spec.catalogId===441?['src/calculators/conversion/draft-master-441.ts']:[conversionCompletionSource.path],
  limitations:['Engineering evidence only; canonical adoption and human acceptance remain pending.',...(spec.catalogId===441?['Retained W3C full-text source evidence required.']:[])],
  execute:(raw:FactoryRaw)=>{
   const parsed=rawSchema.parse(raw);
   if(spec.catalogId===435){const input=draftMaster435Calculator.inputSchema.parse(parsed);return createCalculationSnapshot({calculatorSlug:engine.slug,calculatorVersion:1,input,output:draftMaster435Calculator.calculate(input,{})});}
   if(spec.catalogId===441){const input=draftMaster441Calculator.inputSchema.parse(parsed);return createCalculationSnapshot({calculatorSlug:engine.slug,calculatorVersion:1,input,output:draftMaster441Calculator.calculate(input,{})});}
   const input={...parsed,value:requiredCalculatorNumber(parsed.value)};
   if(input.value!==0&&Math.abs(input.value)<2**-1022)throw Error('Subnormal input outside supported precision');
   const numericEngine=entry?.definition??cookingMeasurementConverter;
   const output=numericEngine.calculate(input,{});const result=output.result;
   if(typeof result!=='number'||!Number.isFinite(result)||(input.value!==0&&result===0)||(result!==0&&Math.abs(result)<2**-1022))throw Error('Result outside supported finite normal precision');
   return createCalculationSnapshot({calculatorSlug:engine.slug,calculatorVersion:1,input,output});
  }});
}));
export function getConversionNextWorkflows(catalogId:number){const contract=conversionNextContracts.find(row=>row.catalogId===catalogId);if(!contract)throw Error('Unsupported next conversion identity');return createFactoryWorkflows({identity:{catalogId,engineId:contract.engineId,calculatorSlug:contract.slug,calculatorVersion:1,sourceVersion:`milestone60-20261113.1/${contract.engineId}@1`},execute:contract.execute});}
export const conversionNextFixtures=Object.freeze(specs.map(spec=>Object.freeze({catalogId:spec.catalogId,input:{value:'1',fromUnit:spec.units[0],toUnit:spec.units[1]},edit:{value:'2',fromUnit:spec.units[0],toUnit:spec.units[1]}})));
export const area424Applicability=Object.freeze({catalogId:424,status:'SOURCE_ESTABLISHED_INTERNATIONAL_ACRE_MAPPING',supported:'NIST revised unit conversion factors explicitly names acre=43560 international square feet=4046.8564224 m² exact; SI square units, international foot/yard/mile squared and hectare=100 ar retain UCUM support.',source:'docs/milestone60-20261113/sources/nist-international-acre-manifest.json',remaining:'Individual delivery evidence, formal source/scope adoption, competent acceptance and certification remain pending. No full424 completion granted.'});
