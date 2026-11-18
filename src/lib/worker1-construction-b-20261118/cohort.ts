import {roofingCalculator} from '@/calculators/engineering-construction/catalog-batch-1';
import {stairCalculator,fenceCalculator,deckingCalculator,wallpaperCalculator,insulationCalculator} from '@/calculators/engineering-construction/catalog-batch-2';
import {poolVolumeCalculator,waterTankCalculator,pipeVolumeCalculator} from '@/calculators/engineering-construction/catalog-batch-3';
import {rational,add,multiply,divide,type Rational} from '@/calculators/exact-rational';
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
const waste=field('wastePercent','Waste allowance','%');
const length=field('lengthMeters','Length','m'),width=field('widthMeters','Width','m');
const rows=[
 [347,roofingCalculator,'roofing squares',[field('buildingLengthFeet','Building length','ft'),field('buildingWidthFeet','Building width','ft'),field('pitchRisePer12','Rise per 12 units of run','ratio'),waste]],
 [351,stairCalculator,'risers',[field('totalRiseCm','Total rise','cm'),field('targetRiserHeightCm','Target riser height','cm')]],
 [352,fenceCalculator,'panels',[field('fenceLengthMeters','Fence length','m'),field('panelWidthMeters','Panel width','m'),waste]],
 [353,deckingCalculator,'boards',[field('deckAreaSquareMeters','Deck area','m²'),field('boardWidthMeters','Board width','m'),field('boardLengthMeters','Board length','m'),waste]],
 [357,wallpaperCalculator,'rolls',[field('wallAreaSquareMeters','Wall area','m²'),field('rollCoverageSquareMeters','Usable roll coverage','m²'),waste]],
 [358,insulationCalculator,'packs',[field('areaSquareMeters','Area','m²'),field('packCoverageSquareMeters','Pack coverage','m²'),waste]],
 [359,poolVolumeCalculator,'m³',[length,width,field('averageDepthMeters','Average depth','m')]],
 [360,waterTankCalculator,'m³',[length,width,field('heightMeters','Internal height','m')]],
 [361,pipeVolumeCalculator,'m³',[length,field('internalDiameterMeters','Internal diameter','m')]],
] as const;
export const constructionCaptureRevision='worker1-construction-b-20261118.1';
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
  const input=Object.fromEntries(c.fields.map(f=>{if(raw[f.key].trim().length>128)throw Error('Decimal input exceeds capture length');const value=requiredCalculatorNumber(raw[f.key]);if(!Number.isFinite(value)||(value!==0&&Math.abs(value)<2**-1022))throw Error('Complete finite normal decimal inputs required');return [f.key,value];}));
  const parsed=c.engine.inputSchema.parse(input),output=c.engine.calculate(parsed,{});
  // Every selected quantity is mathematically positive. Historical v1 records
  // retain their original zero/underflow behavior in the separate verifier.
  if(!Number.isFinite(output.value)||output.value<2**-1022)throw Error('Quantity outside positive finite normal capture range');
  verifyWholeUnitCeiling(id,raw,output.value);
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
 return {...{primaryResult:{id:'value',label:c.title.replace(' Calculator',''),value:output.value,unit:c.unit},methodology:c.scope,sources:c.engine.sources},warnings:[c.limitations,'Binary64 calculation; original decimal text remains in source-bound JSON. No independent certification or publication approval.']};
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

// The commercial count is the ceiling of the entered decimal quantities.
function exactDecimal(text:string):Rational {
 const match=/^([+-]?)(\d*)(?:\.(\d*))?(?:e([+-]?\d+))?$/i.exec(text.trim());
 if(!match||(!match[2]&&!match[3]))throw Error('Exact decimal quantity required');
 const fraction=match[3]??'', power=Number(match[4]??0)-fraction.length;
 if(!Number.isSafeInteger(power)||Math.abs(power)>512)throw Error('Exact decimal precision outside capture range');
 const n=BigInt((match[2]+fraction)||'0')*(match[1]==='-'?-1n:1n);
 return power>=0?rational(n*10n**BigInt(power)):rational(n,10n**BigInt(-power));
}
function verifyWholeUnitCeiling(id:number,raw:Readonly<Record<string,string>>,output:number) {
 const n=(key:string)=>exactDecimal(raw[key]);
 let ratio:Rational;
 switch(id){
  case 351:ratio=divide(n('totalRiseCm'),n('targetRiserHeightCm'));break;
  case 352:ratio=divide(n('fenceLengthMeters'),n('panelWidthMeters'));break;
  case 353:ratio=divide(n('deckAreaSquareMeters'),multiply(n('boardWidthMeters'),n('boardLengthMeters')));break;
  case 357:ratio=divide(n('wallAreaSquareMeters'),n('rollCoverageSquareMeters'));break;
  case 358:ratio=divide(n('areaSquareMeters'),n('packCoverageSquareMeters'));break;
  default:return;
 }
 if(id!==351)ratio=multiply(ratio,add(rational(1n),divide(n('wastePercent'),rational(100n))));
 const d=BigInt(ratio.denominator),ceiling=(BigInt(ratio.numerator)+d-1n)/d;
 if(!Number.isSafeInteger(output)||BigInt(output)!==ceiling)throw Error('Whole-unit calculation differs from the exact entered-decimal ceiling; historical v1 is preserved');
}
