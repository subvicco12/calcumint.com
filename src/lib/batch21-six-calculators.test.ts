import {describe,expect,it} from 'vitest';
import {runCalculator} from '@/calculators/engine';
import {graphingCalculator,functionPlotter2dCalculator} from '@/calculators/advanced-math/catalog-batch-10';
import {volumeCalculator,slopeCalculator} from '@/calculators/geometry/catalog-completion';
import {standardDeviationCalculator,varianceCalculator} from '@/calculators/statistics/catalog-batch-1';
import {standardDeviationResult} from '@/calculators/final-framework/standard-deviation-adapter';
import {varianceResult} from '@/calculators/final-framework/variance-adapter';
import {createCalculationSnapshot} from './calculation-snapshot';
import {validateScenarioDisplayMetadata} from './scenario-display-metadata';
import {segmentSampledGraph,slopeWorkflowResult,prismWorkflowResult,sixScenarioMetadata} from './batch21-six-calculators';

describe('batch21 bounded actual-engine graph evidence',()=>{
 it.each([graphingCalculator,functionPlotter2dCalculator])('retains $id v1 samples without rounding or inventing points',definition=>{
  const input={expression:'x^2',minX:-5,maxX:5};
  const output=runCalculator(definition,input).output;
  expect(definition.version).toBe(1);expect(output.points).toHaveLength(81);
  const independentlyExpected=Array.from({length:81},(_,index)=>{const n=index-40;return {x:n/8,y:n*n/64};});
  expect(output.points).toEqual(independentlyExpected);
  expect(output.points[40]).toEqual({x:0,y:0});expect(output.minimum).toBe(0);expect(output.maximum).toBe(25);
  expect(segmentSampledGraph(output.points,input.minX,input.maxX)).toEqual([output.points]);
 });
 it('breaks only an omitted-grid-sample gap using actual engine points',()=>{
  const output=runCalculator(graphingCalculator,{expression:'1/x',minX:-5,maxX:5}).output;
  const segments=segmentSampledGraph(output.points,-5,5);
  expect(output.points).toHaveLength(80);expect(segments.map(p=>p.length)).toEqual([40,40]);
  expect(segments[0].at(-1)).toEqual({x:-0.125,y:-8});expect(segments[1][0]).toEqual({x:0.125,y:8});
  expect(segments.flat()).toEqual(output.points);
 });
 it('does not claim to detect an asymptote between finite grid samples',()=>{
  const output=runCalculator(graphingCalculator,{expression:'1/(x-0.01)',minX:-5,maxX:5}).output;
  expect(segmentSampledGraph(output.points,-5,5)).toEqual([output.points]);
 });
 it('rejects reordered, nonfinite and off-grid data instead of repairing it',()=>{
  for(const points of [[{x:1,y:1},{x:0,y:0}],[{x:0,y:Infinity}],[{x:0.01,y:1}]])expect(()=>segmentSampledGraph(points,-5,5)).toThrow();
  expect(()=>segmentSampledGraph([],5,-5)).toThrow();
 });
});

describe('batch21 bounded actual-engine geometry evidence',()=>{
 it('labels only compatible dimensions and consumes the unchanged prism output',()=>{
  const output=runCalculator(volumeCalculator,{length:2,width:3,height:4}).output;
  expect(output).toMatchObject({surfaceArea:52,volume:24});
  const result=prismWorkflowResult(output);
  expect(result.primaryResult).toMatchObject({value:24,unit:'cubic units'});
  expect(result.metrics).toContainEqual(expect.objectContaining({id:'surface',value:52,unit:'square units'}));
  expect(result.methodology).toContain('compatible linear units');
  expect(()=>runCalculator(volumeCalculator,{length:0,width:3,height:4})).toThrow();
 });
 it('preserves slope v2 raw deltas, steps and vertical rejection',()=>{
  const output=runCalculator(slopeCalculator,{x1:-2,y1:5,x2:2,y2:-3}).output;
  const result=slopeWorkflowResult(output);
  expect(slopeCalculator.version).toBe(2);expect(result.primaryResult.value).toBe(-2);
  expect(result.metrics).toEqual(expect.arrayContaining([{id:'dx',label:'Δx',value:4},{id:'dy',label:'Δy',value:-8}]));
  expect(result.journey).toEqual(output.steps);
  expect(()=>runCalculator(slopeCalculator,{x1:1,y1:0,x2:1,y2:4})).toThrow();
 });
 it.each([{x1:1,y1:2,x2:4,y2:8},{x1:4,y1:8,x2:1,y2:2}])('shows only supplied coordinate endpoints in their supplied order',input=>{
  const output=runCalculator(slopeCalculator,input).output,before=structuredClone(output);
  const result=slopeWorkflowResult(output,input);
  expect(result.series).toEqual([{id:'selected-coordinates',label:'Selected coordinates',points:[{x:input.x1,y:input.y1},{x:input.x2,y:input.y2}]}]);
  expect(result.primaryResult.value).toBe(2);expect(output).toEqual(before);
  expect(result.metrics).toEqual(expect.arrayContaining([{id:'dx',label:'Δx',value:input.x2-input.x1},{id:'dy',label:'Δy',value:input.y2-input.y1}]));
  expect(slopeWorkflowResult(output).series).toBeUndefined();
  expect(()=>slopeWorkflowResult(output,{...input,x1:Infinity})).toThrow();
 });
});

describe('batch21 independent dispersion goldens and boundaries',()=>{
 it.each([standardDeviationCalculator,varianceCalculator])('$id retains population/sample contracts',definition=>{
  expect(definition.version).toBe(1);
  const population=runCalculator(definition,{values:[1,2,3],kind:'population'}).output;
  const sample=runCalculator(definition,{values:[1,2,3],kind:'sample'}).output;
  expect(population).toMatchObject({count:3,mean:2,variance:2/3,standardDeviation:Math.sqrt(2/3),kind:'population'});
  expect(sample).toMatchObject({count:3,mean:2,variance:1,standardDeviation:1,kind:'sample'});
  expect(runCalculator(definition,{values:[7],kind:'population'}).output.variance).toBe(0);
  for(const input of [{values:[7],kind:'sample'},{values:[],kind:'population'},{values:[Infinity],kind:'population'},{values:[1e101],kind:'population'},{values:Array(10001).fill(1),kind:'population'}])expect(()=>runCalculator(definition,input)).toThrow();
 });
 it('uses existing snapshot and metadata validation with exact slope version',()=>{
  const input={x1:0,y1:0,x2:2,y2:4},output=runCalculator(slopeCalculator,input).output;
  const snapshot=createCalculationSnapshot({calculatorSlug:slopeCalculator.slug,calculatorVersion:slopeCalculator.version,input,output});
  const metadata=sixScenarioMetadata(slopeCalculator,input,output,slopeWorkflowResult(output));
  expect(validateScenarioDisplayMetadata(metadata,snapshot)).toEqual(metadata);
  expect(metadata.calculatorVersion).toBe(2);expect(metadata.outputs.value.label).toBe('Slope');
  expect(metadata.inputs.x1.unit).toBeUndefined();expect(metadata.outputs.dx.unit).toBeUndefined();
  expect(()=>validateScenarioDisplayMetadata({...metadata,calculatorVersion:1},snapshot)).toThrow();
 });
 it.each([standardDeviationCalculator,varianceCalculator])('binds $id dispersion fields by existing adapter IDs',definition=>{
  const input={values:[1,2,3],kind:'sample' as const},output=runCalculator(definition,input).output;
  const result=definition===standardDeviationCalculator?standardDeviationResult(output):varianceResult(output);
  const metadata=sixScenarioMetadata(definition,input,output,result);
  const snapshot=createCalculationSnapshot({calculatorSlug:definition.slug,calculatorVersion:definition.version,input,output});
  expect(validateScenarioDisplayMetadata(metadata,snapshot)).toEqual(metadata);
  expect(metadata.outputs.standardDeviation).toEqual({label:'Standard deviation'});
  expect(metadata.outputs.variance).toEqual({label:'Variance'});
  expect(metadata.inputs.kind).toEqual({label:'Dataset type'});
  expect(snapshot.output).toEqual(output);expect(snapshot.input).toEqual(input);
  expect(snapshot.output).not.toBe(output);
 });
});
it('refuses a finite range whose 81-position grid step underflows instead of inferring positions from NaN indices',()=>{
 expect(()=>segmentSampledGraph([{x:0,y:1}],0,Number.MIN_VALUE)).toThrow();
});
