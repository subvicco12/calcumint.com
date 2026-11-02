import {launchDefinitions,getLaunchSpec} from '@/calculators/launch-portfolio';
import {runCalculator} from '@/calculators/engine';
import type {CalculatorDefinition} from '@/calculators/types';
import {createCalculationSnapshot,copyCalculationData,type CalculationSnapshot} from '@/lib/calculation-snapshot';

const legacy=launchDefinitions.find(d=>d.id==='launch-polygon-area-calculator'&&d.version===1)!;
const spec=getLaunchSpec('polygon-area-calculator')!;
if(!legacy||!spec)throw Error('Exact regular-polygon predecessor unavailable');
/** Unregistered proposed technical successor. No canonical routing or certification. */
export const polygonAreaSuccessor:CalculatorDefinition<Record<string,number>,{result:number}>=Object.freeze({
 id:legacy.id,slug:legacy.slug,title:legacy.title,category:legacy.category,version:2,riskClass:'standard',reviewStatus:'draft',
 inputSchema:legacy.inputSchema,
 calculate(input:Record<string,number>){
  const direct=spec.compute(input);
  if(Number.isFinite(direct))return {result:direct}; // Preserve every accepted predecessor result bit-for-bit.
  const halfSide=input.side/2;
  const apothem=halfSide/Math.tan(Math.PI/input.sides);
  const result=(input.sides*halfSide)*apothem;
  if(!Number.isFinite(result)||result<=0)throw Error('Calculated result is outside the supported finite range');
  return {result};
 },
 formulas:legacy.formulas,
 sources:[{label:'Regular-polygon formula retained from the exact predecessor',note:'Same n*s^2/(4*tan(pi/n)); fallback is n*(s/2)*((s/2)/tan(pi/n)). Numerical review and canonical scope remain pending.'}],
 examples:legacy.examples,
});
/** Uses only explicit allowed revisions; no registry/latest fallback and no historical writes. */
export function createPolygonSnapshot(input:unknown,version:number):CalculationSnapshot{
 if(version!==1&&version!==2)throw Error('Unknown polygon version');
 const output=runCalculator(version===1?legacy:polygonAreaSuccessor,input);
 return createCalculationSnapshot({calculatorSlug:output.slug,calculatorVersion:output.version,input:output.input,output:output.output});
}
export function replayPolygonSnapshot(text:string):CalculationSnapshot{
 if(text.length>2000000)throw Error('Polygon snapshot size bound');
 const raw=copyCalculationData({value:JSON.parse(text)},{}).input.value as CalculationSnapshot;
 if(!raw||typeof raw!=='object'||Object.keys(raw).sort().join(',')!=='calculatorSlug,calculatorVersion,input,output'||raw.calculatorSlug!==legacy.slug)throw Error('Polygon replay identity mismatch');
 const actual=createPolygonSnapshot(raw.input,raw.calculatorVersion);
 if(!raw.input||!raw.output||Object.keys(raw.input).sort().join(',')!=='side,sides'||Object.keys(raw.output).join(',')!=='result'||!Object.is(raw.input.side,actual.input.side)||!Object.is(raw.input.sides,actual.input.sides)||!Object.is(raw.output.result,actual.output.result))throw Error('Polygon replay input/output mismatch');
 return actual;
}
