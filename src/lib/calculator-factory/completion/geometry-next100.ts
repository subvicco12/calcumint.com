import {launchDefinitions,launchSpecs} from '../../../calculators/launch-portfolio';
import {triangleCalculator,rightTriangleCalculator,surfaceAreaCalculator,volumeCalculator,slopeCalculator,distanceCalculator} from '../../../calculators/geometry/catalog-completion';
import {rootFinderCalculator} from '../../../calculators/advanced-math/catalog-batch-8';
import {copyCalculationData,createCalculationSnapshot} from '../../calculation-snapshot';

const launch=(slug:string)=>{const engine=launchDefinitions.find(e=>e.slug===slug&&e.version===1);if(!engine)throw Error('Missing exact geometry engine');return engine;};
const rows=[
 [254,rootFinderCalculator,['a','b','c','d','left','right'],'root','d','Bracketed polynomial root only'],
 [257,triangleCalculator,['a','b','c'],'perimeter','a','SSS triangles; reverse targets perimeter'],
 [258,rightTriangleCalculator,['a','b'],'area','a','Positive perpendicular legs; reverse targets area'],
 [268,launch('polygon-area-calculator'),['sides','side'],'result','side','Regular polygons only'],
 [272,launch('cone-volume-calculator'),['radius','height'],'result','height','Right circular cone volume'],
 [274,surfaceAreaCalculator,['length','width','height'],'surfaceArea','height','Rectangular prisms only'],
 [275,volumeCalculator,['length','width','height'],'volume','height','Rectangular prisms only'],
 [276,slopeCalculator,['x1','y1','x2','y2'],'value','y2','Coordinate slope; vertical lines refused'],
 [277,distanceCalculator,['x1','y1','x2','y2'],'value','y2','Coordinate distance; reverse selects y2 >= y1'],
 [278,launch('pythagorean-theorem-calculator'),['a','b'],'result','a','Nonnegative perpendicular legs'],
 [279,launch('degrees-to-radians-calculator'),['degrees'],'result','degrees','Signed angles; no periodic normalization'],
 [280,launch('radians-to-degrees-calculator'),['radians'],'result','radians','Signed angles; no periodic normalization'],
] as const;
export type GeometryNext100Id=typeof rows[number][0];
function outputUnit(id:GeometryNext100Id){return id===258||id===268||id===274?'square units':id===272||id===275?'cubic units':id===279?'radians':id===280?'degrees':id===276?'rise/run':id===254?'root coordinate':'length units';}
export const geometryNext100CaptureRevision='private.geometry-next100.20261114.1';
export const geometryNext100Contracts=Object.freeze(rows.map(([catalogId,engine,keys,primaryKey,solveFor,scope])=>Object.freeze({catalogId,slug:engine.slug,engineId:engine.id,version:engine.version,title:engine.title,registered:catalogId!==277&&catalogId!==276,primaryKey,unit:outputUnit(catalogId),solveFor,scope,formula:engine.formulas.map(f=>f.expression).join('; '),fields:Object.freeze(keys.map(key=>Object.freeze({key,label:key,kind:'number' as const,defaultValue:launchSpecs.find(s=>s.slug===engine.slug)?.fields.find(f=>f.key===key)?.defaultValue??(engine.examples[0].input as Record<string,number>)[key]}))),sourceEvidence:Object.freeze(['docs/calculator-first/authority-catalog.json','docs/milestone100-20261114/geometry/source-excerpts.json',engine.id.startsWith('launch-')?'src/calculators/launch-portfolio.ts':catalogId===254?'src/calculators/advanced-math/catalog-batch-8.ts':'src/calculators/geometry/catalog-completion.ts']),limitations:Object.freeze(['Private engineering scope; HOLD remains.','Finite binary64 inputs bounded to |x| <= 1e50; nonzero magnitudes >= 1e-50.','Reverse replay may refuse numerically unresolved or nonunique targets.'])})));
function binding(id:GeometryNext100Id){const row=rows.find(r=>r[0]===id);const contract=geometryNext100Contracts.find(r=>r.catalogId===id);if(!row||!contract)throw Error('Unsupported geometry identity');return{row,contract};}
function bounded(n:number){return Number.isFinite(n)&&Math.abs(n)<=1e50&&(n===0||Math.abs(n)>=1e-50);}
/** Validate before calling immutable historical engines, then copy and deeply freeze the capture. */
export function calculateGeometryNext100(id:GeometryNext100Id,input:unknown){
 if(input&&typeof input==='object'&&!Array.isArray(input))input=copyCalculationData(input as Record<string,unknown>,{}).input;
 const {row,contract}=binding(id);const [,engine,keys]=row;
 if(!input||typeof input!=='object'||Array.isArray(input)||Object.keys(input).length!==keys.length||Object.keys(input).some(k=>!(keys as readonly string[]).includes(k)))throw Error('Exact geometry fields required');
 const values=input as Record<string,number>;
 if(Object.values(values).some(v=>typeof v!=='number'||!bounded(v)))throw Error('Outside bounded geometry input domain');
 const parsed=engine.inputSchema.parse(input);
 // The heterogeneous engines share record inputs; the schema above establishes their exact domain.
 const output=(engine.calculate as (v:unknown,context:Record<string,never>)=>Record<string,unknown>)(parsed,{});
 for(const [key,value] of Object.entries(output))if(typeof value==='number'&&(!Number.isFinite(value)||(value!==0&&Math.abs(value)<2**-1022)))throw Error(`Unrepresentable geometry output: ${key}`);
 if((id===257||id===258)&&(['area','angleA','angleB','angleC'].some(k=>(output[k] as number)<=0)))throw Error('Unresolved triangle geometry');
 if(id===254){const bracket=output.bracket as number[];if(output.residual!==0&&bracket[1]-bracket[0]>1e-12*Math.max(1,Math.abs(output.root as number)))throw Error('Root iteration limit did not converge');}
 const snapshot=createCalculationSnapshot({calculatorSlug:engine.slug,calculatorVersion:engine.version,input:parsed as Record<string,unknown>,output});
 return Object.freeze({snapshot,captureRevision:geometryNext100CaptureRevision,formula:contract.formula,steps:Object.freeze([Object.freeze({expression:contract.formula,value:output[contract.primaryKey] as number})]),unit:outputUnit(id),primaryKey:contract.primaryKey,value:output[contract.primaryKey] as number,scope:contract.scope});
}
export function reverseGeometryNext100(id:GeometryNext100Id,input:Record<string,number>,target:number){
 calculateGeometryNext100(id,input);if(!bounded(target))throw Error('Target outside bounded geometry domain');
 const {contract}=binding(id);let value:number;
 switch(id){
 case 254:if(target<input.left||target>input.right)throw Error('Target outside root bracket');value=-((input.a*target+input.b)*target+input.c)*target;break;
 case 257:value=target-input.b-input.c;break;
 case 258:value=2*target/input.b;break;
 case 268:value=Math.sqrt(target*4*Math.tan(Math.PI/input.sides)/input.sides);break;
 case 272:if(input.radius===0)throw Error('Zero radius has no unique height');value=target/input.radius/input.radius*3/Math.PI;break;
 case 274:value=(target/2-input.length*input.width)/(input.length+input.width);break;
 case 275:value=target/input.length/input.width;break;
 case 276:value=input.y1+target*(input.x2-input.x1);break;
 case 277:{const dx=Math.abs(input.x2-input.x1);if(target<dx)throw Error('Distance below fixed horizontal separation');value=input.y1+(target===0?0:target*Math.sqrt((1-dx/target)*(1+dx/target)));break;}
 case 278:if(target<input.b)throw Error('Hypotenuse below fixed leg');value=target===0?0:target*Math.sqrt((1-input.b/target)*(1+input.b/target));break;
 case 279:value=target/Math.PI*180;break;
 case 280:value=target/180*Math.PI;break;
 }
 const candidate=Object.freeze({...input,[contract.solveFor]:value});const replay=calculateGeometryNext100(id,candidate);
 if(Math.abs(replay.value-target)> (id===254?2e-12:64*Number.EPSILON)*Math.max(Math.abs(target),Math.abs(replay.value),Number.MIN_VALUE))throw Error('Reverse target does not reconcile');
 return Object.freeze({solveFor:contract.solveFor,value,input:candidate,replay});
}
export function graphGeometryNext100(id:GeometryNext100Id,input:Record<string,number>,samples:readonly number[]){
 calculateGeometryNext100(id,input);if(!Array.isArray(samples)||samples.length>101)throw Error('At most 101 explicit graph samples required');const {contract}=binding(id);
 return Object.freeze(samples.map(x=>{try{return Object.freeze({x,y:calculateGeometryNext100(id,{...input,[contract.solveFor]:x}).value});}catch(error){return Object.freeze({x,error:error instanceof Error?error.message:'Refused sample'});}}));
}
