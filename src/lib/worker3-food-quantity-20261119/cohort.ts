import {bakersPercentageCalculator,doughHydrationCalculator} from '@/calculators/food/catalog-batch-1';
import {recipeScalingCalculator,servingSizeCalculator,nutritionScalingCalculator,coffeeRatioCalculator,waterToRiceRatioCalculator} from '@/calculators/food/catalog-batch-2';
import {cakePanConversionCalculator} from '@/calculators/food/catalog-batch-3';
import type {CalculatorDefinition} from '@/calculators/types';
import type {StructuredCalculationResult} from '@/calculators/final-framework/types';
import {createFactoryWorkflows,type FactoryRaw,type FactoryExecutionPacket} from '@/lib/calculator-factory/workflows';
import {serializeCalculationCsv} from '@/lib/calculation-export';
import type {CalcuMintPlan} from '@/lib/entitlements';
import {requiredCalculatorNumber} from '@/lib/registered-input-successor';
import {copyCalculationData,createCalculationSnapshot} from '@/lib/calculation-snapshot';
import {equalCompletionJson} from '@/calculators/completion-contracts';
import type {FactoryWorkbenchField} from '@/components/calculator-factory-workbench';
type Engine=CalculatorDefinition<Record<string,number>,{value:number;steps:readonly string[]}>;
const field=(key:string,label:string,unit:string):FactoryWorkbenchField=>Object.freeze({key,label,unit,kind:'number'});
export const foodRoundedQuantityKeys:Readonly<Record<number,string>>={496:'originalQuantity',497:'totalQuantity',499:'ingredientWeightGrams',500:'waterWeightGrams',501:'originalIngredientQuantity',503:'nutrientAmountPerServing',504:'waterGrams',505:'riceAmount'};
const positiveTerms:Readonly<Record<number,readonly string[]>>={496:['originalQuantity','targetServings'],497:['totalQuantity'],499:['ingredientWeightGrams'],500:['waterWeightGrams'],501:['originalIngredientQuantity'],503:['nutrientAmountPerServing','servings'],504:['waterGrams'],505:['riceAmount','waterPerRiceUnit']};
const rows=[
 [496,recipeScalingCalculator,'same entered quantity unit',[field('originalServings','Original servings','servings'),field('targetServings','Target servings','servings'),field('originalQuantity','Original quantity','entered unit')]],
 [497,servingSizeCalculator,'entered quantity unit/serving',[field('totalQuantity','Total quantity','entered unit'),field('servings','Servings','servings')]],
 [499,bakersPercentageCalculator,'%',[field('ingredientWeightGrams','Ingredient weight','g'),field('flourWeightGrams','Flour weight','g')]],
 [500,doughHydrationCalculator,'%',[field('waterWeightGrams','Water weight','g'),field('flourWeightGrams','Flour weight','g')]],
 [501,cakePanConversionCalculator,'same entered ingredient unit',[field('originalPanArea','Original pan area','same area unit'),field('targetPanArea','Target pan area','same area unit'),field('originalIngredientQuantity','Original ingredient quantity','entered unit')]],
 [503,nutritionScalingCalculator,'same entered nutrient unit',[field('nutrientAmountPerServing','Nutrient amount per serving','entered unit/serving'),field('servings','Servings','servings')]],
 [504,coffeeRatioCalculator,'g',[field('waterGrams','Water weight','g'),field('waterToCoffeeRatio','Water to coffee ratio','g/g')]],
 [505,waterToRiceRatioCalculator,'same entered water unit',[field('riceAmount','Rice quantity','entered rice unit'),field('waterPerRiceUnit','Water per rice unit','water units/rice unit')]],
] as const;
export const foodCaptureRevision='worker3-food-quantity-20261119.1';
export const foodContracts=Object.freeze(rows.map(([catalogId,definition,unit,fields])=>{
 const engine=definition as unknown as Engine;
 return Object.freeze({catalogId,engineId:engine.id,slug:engine.slug,version:engine.version,title:engine.title,unit,engine,scope:engine.formulas.map(f=>f.description).join(' '),fields:Object.freeze(fields.map(f=>Object.freeze({...f,defaultValue:engine.examples[0].input[f.key]}))),limitations:'Supplied quantities and ratios only; use compatible entered units. Original v1 rounds to six decimal places. Not a prescribed recipe, diet, cooking process or food-safety assessment. Canonical source, precision and QA approval remain pending.'});
}));
export function foodContract(id:number){const row=foodContracts.find(x=>x.catalogId===id);if(!row)throw Error('Food profile unavailable');return row;}
function exactFields(input:Record<string,unknown>,fields:readonly FactoryWorkbenchField[]){
 if(Object.keys(input).length!==fields.length||fields.some(f=>!Object.hasOwn(input,f.key)))throw Error('Exact food input fields required');
}
export function foodWorkflows(id:number){
 const c=foodContract(id);
 const flow=createFactoryWorkflows({identity:{catalogId:id,engineId:c.engineId,calculatorSlug:c.slug,calculatorVersion:c.version,sourceVersion:`${foodCaptureRevision}/${c.engineId}@${c.version}`},execute:(raw:FactoryRaw)=>{
  exactFields(raw,c.fields);
  const input=Object.fromEntries(c.fields.map(f=>{if(raw[f.key].trim().length>128)throw Error('Decimal input exceeds capture length');const value=requiredCalculatorNumber(raw[f.key]);if(!Number.isFinite(value)||(value!==0&&Math.abs(value)<2**-1022))throw Error('Complete finite normal decimal inputs required');return [f.key,value];}));
  const parsed=c.engine.inputSchema.parse(input),output=c.engine.calculate(parsed,{});
  const positiveExpected=positiveTerms[id].every(key=>parsed[key]>0);
  if(positiveExpected&&output.value===0)throw Error('Positive quantity rounds to zero in immutable v1; new capture refused, historical record preserved');
  if(!Number.isFinite(output.value)||output.value<0||(output.value!==0&&output.value<2**-1022))throw Error('Result outside supported normal capture range');
  return createCalculationSnapshot({calculatorSlug:c.slug,calculatorVersion:c.version,input:parsed,output});
 }});
 return Object.freeze({...flow,exportPacket:(packet:FactoryExecutionPacket,format:'json'|'csv',plan:CalcuMintPlan):string=>{
  const original=flow.exportPacket(packet,format,plan); // retained entitlement and exact packet checks
  if(format==='json')return original;
  const checked=flow.verify(packet);
  return serializeCalculationCsv({identity:checked.identity,raw:checked.raw,input:checked.snapshot.input,inputUnits:Object.fromEntries(c.fields.map(f=>[f.key,f.unit??'']))},{...checked.snapshot.output,outputUnit:c.unit});
 }});
}
export function verifyFoodPacket(value:unknown){
 const clean=copyCalculationData({value},{}).input.value as FactoryExecutionPacket;
 if(!clean||typeof clean.identity?.catalogId!=='number')throw Error('Exact food packet required');
 return foodWorkflows(clean.identity.catalogId).verify(clean);
}
/** Historical numerical verification is deliberately independent of new capture limits. */
export function verifyFoodSnapshot(value:unknown){
 const clean=copyCalculationData({value},{}).input.value;
 if(!clean||typeof clean!=='object'||Array.isArray(clean)||Object.keys(clean).sort().join(',')!=='calculatorSlug,calculatorVersion,input,output')throw Error('Exact food snapshot fields required');
 const snapshot=createCalculationSnapshot(clean as Parameters<typeof createCalculationSnapshot>[0]);
 const c=foodContracts.find(row=>row.slug===snapshot.calculatorSlug&&row.version===snapshot.calculatorVersion);
 if(!c)throw Error('Exact immutable food version unavailable');
 exactFields(snapshot.input,c.fields);
 const parsed=c.engine.inputSchema.parse(snapshot.input),expected=c.engine.calculate(parsed,{});
 if(!equalCompletionJson(parsed,snapshot.input)||!equalCompletionJson(expected,snapshot.output))throw Error('Food snapshot differs from immutable engine');
 return Object.freeze({catalogId:c.catalogId,engineId:c.engineId,engineVersion:c.version,scope:c.scope,snapshot});
}
export function foodResult(packet:FactoryExecutionPacket):StructuredCalculationResult{
 const checked=verifyFoodPacket(packet),c=foodContract(checked.identity.catalogId!);
 const output=checked.snapshot.output as unknown as {value:number;steps:readonly string[]};
 return {...{primaryResult:{id:'value',label:c.title.replace(' Calculator',''),value:output.value,unit:c.unit},methodology:c.scope,sources:c.engine.sources},warnings:[c.limitations,'Binary64 calculation with original six-decimal output rounding; original decimal text remains in source-bound JSON. No independent certification or publication approval.']};
}
/** A readable immutable record need not qualify as a new capture. */
export function prepareFoodRecovery(value:unknown){
 const verified=verifyFoodSnapshot(value);
 const raw=Object.fromEntries(Object.entries(verified.snapshot.input).map(([k,v])=>[k,typeof v==='number'&&Object.is(v,-0)?'-0':String(v)]));
 let current:FactoryExecutionPacket;
 try{current=foodWorkflows(verified.catalogId).execute(raw);}catch{return {...verified,currentCaptureAvailable:false as const};}
 if(!equalCompletionJson(current.snapshot,verified.snapshot))throw Error('Historical food result differs from current capture');
 return {...verified,currentCaptureAvailable:true as const};
}

