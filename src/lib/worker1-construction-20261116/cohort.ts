import {concreteCalculator,squareFootageCalculator,paintCalculator,flooringCalculator,tileCalculator,drywallCalculator,lumberCalculator} from '@/calculators/engineering-construction/catalog-batch-1';
import {gravelCalculator,asphaltCalculator,excavationCalculator} from '@/calculators/engineering-construction/catalog-batch-2';
import {rational,add,multiply,divide,type Rational} from '@/calculators/exact-rational';
import type {CalculatorDefinition} from '@/calculators/types';
import type {StructuredCalculationResult} from '@/calculators/final-framework/types';
import {concreteResult} from '@/calculators/final-framework/concrete-adapter';
import {squareFootageResult} from '@/calculators/final-framework/square-footage-adapter';
import {flooringResult} from '@/calculators/final-framework/flooring-adapter';
import {lumberResult} from '@/calculators/final-framework/lumber-adapter';
import {createFactoryWorkflows,type FactoryRaw,type FactoryExecutionPacket} from '@/lib/calculator-factory/workflows';
import {serializeCalculationCsv} from '@/lib/calculation-export';
import type {CalcuMintPlan} from '@/lib/entitlements';
import {requiredCalculatorNumber} from '@/lib/registered-input-successor';
import {copyCalculationData,createCalculationSnapshot} from '@/lib/calculation-snapshot';
import {equalCompletionJson} from '@/calculators/completion-contracts';
import type {FactoryWorkbenchField} from '@/components/calculator-factory-workbench';

type Engine=CalculatorDefinition<Record<string,number>,{value:number;steps:readonly string[]}>;
const field=(key:string,label:string,unit:string):FactoryWorkbenchField=>Object.freeze({key,label,unit,kind:'number'});
const lengths=[field('lengthMeters','Length','m'),field('widthMeters','Width','m')];
const waste=field('wastePercent','Explicit waste allowance','%');
const rows=[
 [343,concreteCalculator,'m³',[...lengths,field('depthMeters','Depth','m'),waste]],
 [344,squareFootageCalculator,'ft²',[field('lengthFeet','Length','ft'),field('widthFeet','Width','ft'),field('quantity','Quantity','integer')]],
 [345,paintCalculator,'L',[field('wallAreaSquareMeters','Paintable area','m²'),field('coats','Coats','integer'),field('coverageSquareMetersPerLiter','Supplied product coverage','m²/L'),waste]],
 [346,flooringCalculator,'m²',[...lengths,waste]],
 [348,tileCalculator,'tiles',[field('areaSquareMeters','Surface area','m²'),field('tileLengthCm','Tile length','cm'),field('tileWidthCm','Tile width','cm'),waste]],
 [349,drywallCalculator,'sheets',[field('surfaceAreaSquareFeet','Surface area','ft²'),field('sheetLengthFeet','Sheet length','ft'),field('sheetWidthFeet','Sheet width','ft'),waste]],
 [350,lumberCalculator,'board feet',[field('thicknessInches','Thickness','in'),field('widthInches','Width','in'),field('lengthFeet','Length','ft'),field('quantity','Quantity','integer')]],
 [354,gravelCalculator,'m³',[...lengths,field('depthMeters','Depth','m'),waste]],
 [355,asphaltCalculator,'kg',[...lengths,field('depthMeters','Depth','m'),field('densityKgPerCubicMeter','Supplied compacted density','kg/m³'),waste]],
 [356,excavationCalculator,'m³',[...lengths,field('depthMeters','In-situ depth','m'),field('bulkingPercent','Supplied bulking allowance','%')]],
] as const;
export const constructionCaptureRevision='worker1-construction-20261116.1';
export const constructionContracts=Object.freeze(rows.map(([catalogId,definition,unit,fields])=>{
 const engine=definition as unknown as Engine;
 return Object.freeze({catalogId,engineId:engine.id,slug:engine.slug,version:engine.version,title:engine.title,unit,engine,scope:engine.formulas.map(f=>f.description).join(' '),fields:Object.freeze(fields.map(f=>Object.freeze({...f,defaultValue:engine.examples[0].input[f.key]}))),limitations:'Supplied dimensions and allowances only. Not structural design, material specification, site survey or code compliance. Canonical applicability and competent review remain pending.'});
}));
export function constructionContract(id:number){const row=constructionContracts.find(x=>x.catalogId===id);if(!row)throw Error('Construction profile unavailable');return row;}
function exactFields(input:Record<string,unknown>,fields:readonly FactoryWorkbenchField[]){
 if(Object.keys(input).length!==fields.length||fields.some(f=>!Object.hasOwn(input,f.key)))throw Error('Exact construction input fields required');
}
export function constructionWorkflows(id:number){
 const c=constructionContract(id);
 const flow=createFactoryWorkflows({identity:{catalogId:id,engineId:c.engineId,calculatorSlug:c.slug,calculatorVersion:c.version,sourceVersion:`${constructionCaptureRevision}/${c.engineId}@${c.version}`},execute:(raw:FactoryRaw)=>{
  exactFields(raw,c.fields);
  const input=Object.fromEntries(c.fields.map(f=>{const value=requiredCalculatorNumber(raw[f.key]);if(!Number.isFinite(value)||(value!==0&&Math.abs(value)<2**-1022))throw Error('Complete finite normal decimal inputs required');return [f.key,value];}));
  const parsed=c.engine.inputSchema.parse(input),output=c.engine.calculate(parsed,{});
  // Every selected quantity is mathematically positive. Historical v1 records
  // retain their original zero/underflow behavior in the separate verifier.
  if(!Number.isFinite(output.value)||output.value<2**-1022)throw Error('Quantity outside positive finite normal capture range');
  if(id===348||id===349)verifyWholeUnitCeiling(id,parsed,output.value);
  return createCalculationSnapshot({calculatorSlug:c.slug,calculatorVersion:c.version,input:parsed,output});
 }});
 return Object.freeze({...flow,exportPacket:(packet:FactoryExecutionPacket,format:'json'|'csv',plan:CalcuMintPlan):string=>{
  const original=flow.exportPacket(packet,format,plan); // retained entitlement and exact packet checks
  if(format==='json')return original;
  const checked=flow.verify(packet);
  return serializeCalculationCsv({identity:checked.identity,raw:checked.raw,input:checked.snapshot.input,inputUnits:Object.fromEntries(c.fields.map(f=>[f.key,f.unit??'']))},{...checked.snapshot.output,outputUnit:c.unit});
 }});
}
export function verifyConstructionPacket(value:unknown){
 const clean=copyCalculationData({value},{}).input.value as FactoryExecutionPacket;
 if(!clean||typeof clean.identity?.catalogId!=='number')throw Error('Exact construction packet required');
 return constructionWorkflows(clean.identity.catalogId).verify(clean);
}
/** Historical numerical verification is deliberately independent of new capture limits. */
export function verifyConstructionSnapshot(value:unknown){
 const clean=copyCalculationData({value},{}).input.value;
 if(!clean||typeof clean!=='object'||Array.isArray(clean)||Object.keys(clean).sort().join(',')!=='calculatorSlug,calculatorVersion,input,output')throw Error('Exact construction snapshot fields required');
 const snapshot=createCalculationSnapshot(clean as Parameters<typeof createCalculationSnapshot>[0]);
 const c=constructionContracts.find(row=>row.slug===snapshot.calculatorSlug&&row.version===snapshot.calculatorVersion);
 if(!c)throw Error('Exact immutable construction version unavailable');
 exactFields(snapshot.input,c.fields);
 const parsed=c.engine.inputSchema.parse(snapshot.input),expected=c.engine.calculate(parsed,{});
 if(!equalCompletionJson(parsed,snapshot.input)||!equalCompletionJson(expected,snapshot.output))throw Error('Construction snapshot differs from immutable engine');
 return Object.freeze({catalogId:c.catalogId,engineId:c.engineId,engineVersion:c.version,scope:c.scope,snapshot});
}
export function constructionResult(packet:FactoryExecutionPacket):StructuredCalculationResult{
 const checked=verifyConstructionPacket(packet),c=constructionContract(checked.identity.catalogId!);
 const output=checked.snapshot.output as unknown as {value:number;steps:readonly string[]};
 const adapt=c.catalogId===343?concreteResult:c.catalogId===344?squareFootageResult:c.catalogId===346?flooringResult:c.catalogId===350?lumberResult:undefined;
 return {...(adapt?adapt(output):{primaryResult:{id:'value',label:c.title.replace(' Calculator',''),value:output.value,unit:c.unit},methodology:c.scope,sources:c.engine.sources}),warnings:[c.limitations,'Binary64 calculation; original decimal text remains in source-bound JSON. No independent certification or publication approval.']};
}
/** A readable immutable record need not qualify as a new capture. */
export function prepareConstructionRecovery(value:unknown){
 const verified=verifyConstructionSnapshot(value);
 const raw=Object.fromEntries(Object.entries(verified.snapshot.input).map(([k,v])=>[k,typeof v==='number'&&Object.is(v,-0)?'-0':String(v)]));
 let current:FactoryExecutionPacket;
 try{current=constructionWorkflows(verified.catalogId).execute(raw);}catch{return {...verified,currentCaptureAvailable:false as const};}
 if(!equalCompletionJson(current.snapshot,verified.snapshot))throw Error('Historical construction result differs from current capture');
 return {...verified,currentCaptureAvailable:true as const};
}

/** Independent exact arithmetic is a refusal witness, never a replacement
 * engine/output. It evaluates the retained ceil formula on normalized binary64
 * inputs and preserves old snapshots when v1 rounding disagrees. */
function binary64Rational(value:number):Rational{
 if(!Number.isFinite(value)||value<0)throw Error('Nonnegative finite witness input required');
 if(value===0)return rational(0n);
 const view=new DataView(new ArrayBuffer(8));view.setFloat64(0,value);const bits=view.getBigUint64(0),exponent=Number((bits>>52n)&2047n),fraction=bits&((1n<<52n)-1n);
 const significand=exponent===0?fraction:(1n<<52n)|fraction,power=exponent===0?-1074:exponent-1075;
 return power>=0?rational(significand<<BigInt(power)):rational(significand,1n<<BigInt(-power));
}
function verifyWholeUnitCeiling(id:348|349,input:Record<string,number>,output:number){
 const n=binary64Rational;
 const unitArea=id===348?divide(multiply(n(input.tileLengthCm),n(input.tileWidthCm)),rational(10000n)):multiply(n(input.sheetLengthFeet),n(input.sheetWidthFeet));
 const count=multiply(divide(n(id===348?input.areaSquareMeters:input.surfaceAreaSquareFeet),unitArea),add(rational(1n),divide(n(input.wastePercent),rational(100n))));
 const numerator=BigInt(count.numerator),denominator=BigInt(count.denominator),ceiling=(numerator+denominator-1n)/denominator;
 if(!Number.isSafeInteger(output)||ceiling>BigInt(Number.MAX_SAFE_INTEGER))throw Error('Safe whole-unit capture range required');
 if(BigInt(output)!==ceiling)throw Error('Whole-unit rounding differs from exact normalized-input ceiling; historical v1 is preserved');
}
