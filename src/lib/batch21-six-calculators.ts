import type {StructuredCalculationResult} from '@/calculators/final-framework/types';
import type {CoordinateOutput,SurfaceOutput} from '@/calculators/geometry/catalog-completion';
import {scenarioMetadataForResult} from './scenario-display-metadata';

type Point=Readonly<{x:number;y:number}>;
/** Split only missing samples on the registered graph engines' 81-position grid.
 * Finite samples do not establish continuity between grid positions. */
export function segmentSampledGraph(points:readonly Point[],minX:number,maxX:number):Point[][]{
 if(!Number.isFinite(minX)||!Number.isFinite(maxX)||minX>=maxX)throw new Error('Invalid graph range');
 const step=(maxX-minX)/80;
 if(!Number.isFinite(step)||step<=0)throw new Error('Graph sample grid cannot be represented at this scale');
 const tolerance=Math.max(Math.abs(minX),Math.abs(maxX),Math.abs(step))*Number.EPSILON*32;
 const segments:Point[][]=[];
 let previousIndex=-1;
 for(const point of points){
  if(!Number.isFinite(point.x)||!Number.isFinite(point.y))throw new Error('Invalid graph point');
  const index=Math.round((point.x-minX)/step);
  const expected=minX+step*index;
  if(!Number.isInteger(index)||index<0||index>80||index<=previousIndex||Math.abs(point.x-expected)>tolerance)throw new Error('Graph points must follow the registered sample grid');
  if(previousIndex<0||index>previousIndex+1)segments.push([]);
  segments[segments.length-1].push(point);
  previousIndex=index;
 }
 return segments;
}

export function slopeWorkflowResult(output:CoordinateOutput,input?:Readonly<{x1:number;y1:number;x2:number;y2:number}>):StructuredCalculationResult{
 if(input&&![input.x1,input.y1,input.x2,input.y2].every(Number.isFinite))throw new Error('Selected coordinates must be finite');
 return {primaryResult:{id:'slope',label:'Slope',value:output.value},metrics:[{id:'dx',label:'Δx',value:output.dx},{id:'dy',label:'Δy',value:output.dy}],journey:output.steps,...(input?{series:[{id:'selected-coordinates',label:'Selected coordinates',points:[{x:input.x1,y:input.y1},{x:input.x2,y:input.y2}]}]}:{}),methodology:'Slope between two non-vertical coordinate points, using the registered engine result and coordinate differences. Any selected-coordinate visualization contains only the supplied endpoints; it does not infer an infinite line.'};
}

export function prismWorkflowResult(output:SurfaceOutput):StructuredCalculationResult{
 return {primaryResult:{id:'volume',label:'Volume',value:output.volume,unit:'cubic units'},metrics:[{id:'surface',label:'Surface area',value:output.surfaceArea,unit:'square units'}],journey:output.steps,methodology:'Rectangular-prism dimensions must use compatible linear units. Surface area uses square units; volume uses cubic units. No unit conversion is applied.'};
}

type Identity={slug:string;version:number};
const bindings:Record<string,{inputs:Record<string,string>;outputs:Record<string,string>} >={
 'graphing-calculator':{inputs:{expression:'f(x)',minX:'Minimum x',maxX:'Maximum x'},outputs:{minimum:'minimum',maximum:'maximum'}},
 'function-plotter-2d':{inputs:{expression:'f(x)',minX:'Minimum x',maxX:'Maximum x'},outputs:{minimum:'minimum',maximum:'maximum'}},
 'volume-calculator':{inputs:{length:'Length (compatible linear units)',width:'Width (compatible linear units)',height:'Height (compatible linear units)'},outputs:{volume:'volume',surfaceArea:'surface'}},
 'slope-calculator':{inputs:{x1:'x1',y1:'y1',x2:'x2',y2:'y2'},outputs:{value:'slope',dx:'dx',dy:'dy'}},
 'standard-deviation-calculator':{inputs:{values:'Dataset',kind:'Dataset type'},outputs:{count:'count',mean:'mean',variance:'variance',standardDeviation:'sd'}},
 'variance-calculator':{inputs:{values:'Dataset',kind:'Dataset type'},outputs:{count:'count',mean:'mean',variance:'variance',standardDeviation:'sd'}},
};
/** Display bindings only: caller supplies existing engine data and its result adapter. */
export function sixScenarioMetadata(identity:Identity,input:Record<string,unknown>,output:Record<string,unknown>,result:Pick<StructuredCalculationResult,'primaryResult'|'metrics'>){
 const binding=bindings[identity.slug];
 if(!binding||identity.version!==(identity.slug==='slope-calculator'?2:1))throw new Error('Unsupported six-calculator binding');
 return scenarioMetadataForResult(identity,input,output,result,binding);
}
