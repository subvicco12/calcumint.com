/** Converter-specific controls over immutable v1 engines. No publication authority. */
import {getConversionFactoryDefinition,runConversionFactoryCalculation,replayConversionFactoryCalculation,type ConversionFactoryRequest} from '@/lib/calculator-factory/cohorts/conversions';
import {conversionCompletionSource} from '@/lib/calculator-factory/completion/conversion-contracts';

export const conversionWaveIds=Object.freeze([424,425,427,428,433,434] as const);
export type ConversionWaveId=typeof conversionWaveIds[number];
type UnitDescription=Readonly<{symbol:string;meaning:string}>;
const unit=(symbol:string,meaning:string):UnitDescription=>Object.freeze({symbol,meaning});
export const conversionWaveContracts=Object.freeze({
 424:{units:{m2:unit('m²','square metre'),km2:unit('km²','square kilometre'),cm2:unit('cm²','square centimetre'),ft2:unit('ft²','square international foot'),yd2:unit('yd²','square international yard'),acre:unit('acre','4046.8564224 m²; international acre interpretation'),ha:unit('ha','10000 m²'),mi2:unit('mi²','square international mile')},scope:'Scalar area; no jurisdiction or survey-foot interpretation.',sourceStatus:'PARTIAL_ACRE_MAPPING_REVIEW_REMAINS'},
 425:{units:{m3:unit('m³','cubic metre'),l:unit('L','litre'),ml:unit('mL','millilitre'),cm3:unit('cm³','cubic centimetre'),ft3:unit('ft³','cubic international foot'),in3:unit('in³','cubic international inch'),gal_us:unit('US gal','US liquid gallon = 231 cubic international inches'),qt_us:unit('US qt','one quarter US liquid gallon')},scope:'US liquid gallon/quart only; no imperial or ingredient-density mode.',sourceStatus:'SOURCE_RELATIONSHIPS_ESTABLISHED'},
 427:{units:{c:unit('°C','Celsius temperature value'),f:unit('°F','Fahrenheit temperature value'),k:unit('K','Kelvin temperature value')},scope:'OWN-427 algebraic temperature values, including below absolute zero. No temperature-interval or physical-feasibility mode.',sourceStatus:'SOURCE_RELATIONSHIPS_ESTABLISHED'},
 428:{units:{m_s:unit('m/s','metres per second'),km_h:unit('km/h','kilometres per hour'),mph:unit('mph','international miles per hour'),ft_s:unit('ft/s','international feet per second'),knot:unit('kn','1852 metres per hour')},scope:'Scalar speed; no vector, journey or elapsed-time model.',sourceStatus:'SOURCE_RELATIONSHIPS_ESTABLISHED'},
 433:{units:{rad:unit('rad','radian'),deg:unit('°','degree'),grad:unit('gon','gradian = 0.9 degree'),turn:unit('turn','full revolution')},scope:'Unnormalized scalar angle. Math.PI approximation; no bearing normalization.',sourceStatus:'SOURCE_RELATIONSHIPS_ESTABLISHED'},
 434:{units:{B:unit('B','byte = 8 bits'),KB:unit('kB','1000 bytes; case-sensitive product code KB'),MB:unit('MB','1000000 bytes'),GB:unit('GB','1000000000 bytes'),TB:unit('TB','1000000000000 bytes'),KiB:unit('KiB','1024 bytes'),MiB:unit('MiB','1048576 bytes'),GiB:unit('GiB','1073741824 bytes')},scope:'Decimal and binary bytes only; no bit, compression or pricing mode.',sourceStatus:'SOURCE_RELATIONSHIPS_ESTABLISHED'},
});
export function conversionWaveContract(catalogId:number){
 if(!conversionWaveIds.includes(catalogId as ConversionWaveId))throw Error('Unsupported conversion wave identity');
 const details=conversionWaveContracts[catalogId as ConversionWaveId];
 return Object.freeze({...details,catalogId,source:conversionCompletionSource,numericalPolicy:'Original binary64 output and existing precision refusals. Display rounding never changes snapshots.',reviewStatus:'COMPETENT_REVIEW_PENDING'});
}
function execute(request:ConversionFactoryRequest){conversionWaveContract(request.catalogId);return runConversionFactoryCalculation(request);}
/** One independent engine execution per target; unsupported precision is visible per row. */
export function conversionTargetMatrix(request:ConversionFactoryRequest){
 const initial=execute(request);
 const codes=getConversionFactoryDefinition(request.catalogId)!.fields[1].options!;
 return Object.freeze(codes.map(toUnit=>{
  try{return Object.freeze({toUnit,status:'available' as const,calculation:execute({...request,input:{...request.input,toUnit}})});}
  catch(error){return Object.freeze({toUnit,status:'refused' as const,reason:error instanceof Error?error.message:'Conversion refused'});}
 }).map(row=>Object.freeze({...row,fromUnit:initial.enteredInput.fromUnit})));
}
/** Swap the unit selectors while retaining original entered text, never rounded output. */
export function swapConversionUnits(request:ConversionFactoryRequest){
 execute(request);
 return execute({...request,input:{value:request.input.value,fromUnit:request.input.toUnit,toUnit:request.input.fromUnit}});
}
export type ConversionScenario=Readonly<{label:string;request:ConversionFactoryRequest;calculation:ReturnType<typeof runConversionFactoryCalculation>}>;
/** Atomic verification: a bad scenario yields no partially verified comparison/export. */
export function compareConversionScenarios(requests:readonly {label:string;request:ConversionFactoryRequest}[]):readonly ConversionScenario[]{
 if(requests.length<1||requests.length>20)throw Error('Compare between 1 and 20 conversion scenarios');
 const id=requests[0].request.catalogId;
 return Object.freeze(requests.map(({label,request})=>{
  if(!label.trim()||label.length>120)throw Error('Scenario label must contain 1 to 120 characters');
  if(request.catalogId!==id)throw Error('Compare scenarios from the same converter');
  const calculation=execute(request);
  const preserved=Object.freeze({...request,input:Object.freeze({...request.input})});
  return Object.freeze({label,request:preserved,calculation});
 }));
}
/** JSON keeps raw input and replay snapshots; requires verification on every export. */
export function exportConversionScenarios(scenarios:readonly ConversionScenario[]){
 if(!scenarios.length)throw Error('No conversion scenarios');
 const checked=compareConversionScenarios(scenarios.map(({label,request})=>({label,request})));
 checked.forEach((row,index)=>replayConversionFactoryCalculation(row.request,scenarios[index].calculation.snapshot));
 return JSON.stringify({schemaVersion:1,kind:'PRIVATE_CONVERSION_SCENARIOS',contract:conversionWaveContract(checked[0].request.catalogId),scenarios:checked},null,2);
}
