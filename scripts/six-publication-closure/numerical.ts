/** Actual-engine witnesses; no QA-decision, certification or publication writer. */
import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {calculatorRegistry} from '../../src/calculators/registry';
import {runCalculator} from '../../src/calculators/engine';
import {createCalculationSnapshot,serializeCalculationJson} from '../../src/lib/calculation-snapshot';
import {verifyRegisteredSnapshot} from '../../src/lib/registered-snapshot-verification';
import {captureScenario} from '../../src/lib/scenario-set';
import {serializeScenarioReportJson} from '../../src/lib/scenario-report';
import {recoverScenarioSetJson} from '../../src/lib/scenario-set-recovery';
import {sixCandidatePrecisionError} from '../../src/lib/six-candidate-numeric-safety';
const identities=[{id:276,slug:'slope-calculator',version:2},{id:283,slug:'variance-calculator',version:1},{id:282,slug:'standard-deviation-calculator',version:1},{id:275,slug:'volume-calculator',version:1},{id:251,slug:'function-plotter-2d',version:1},{id:235,slug:'graphing-calculator',version:1}];
const hash=(s:string)=>createHash('sha256').update(s).digest('hex');
const rows=[];
for(const identity of identities){
 const definition=calculatorRegistry.getBySlug(identity.slug)!;assert.equal(definition.version,identity.version);
 const observations:Record<string,unknown>[]=[];
 const witness=(name:string,input:Record<string,unknown>,expected:Record<string,number>)=>{
  const output=runCalculator(definition,input).output as Record<string,unknown>;
  for(const [field,value]of Object.entries(expected)){assert.equal(typeof output[field],'number');const actual=output[field] as number;assert(Math.abs(actual-value)<=Math.max(Number.MIN_VALUE,Math.abs(value)*1e-12),`${identity.slug}:${name}:${field}`);}
  const snapshot=createCalculationSnapshot({calculatorSlug:identity.slug,calculatorVersion:identity.version,input,output});
  const bytes=serializeCalculationJson(snapshot);assert.deepEqual(verifyRegisteredSnapshot(JSON.parse(bytes)).snapshot,snapshot);
  let scenarios=captureScenario([],'A',snapshot,'baseline');scenarios=captureScenario(scenarios,'B',snapshot,'repeat');
  const report=serializeScenarioReportJson(scenarios);assert.equal(serializeScenarioReportJson(recoverScenarioSetJson(report,snapshot)),report);
  const tampered=JSON.parse(bytes);tampered.output.steps=['tampered'];assert.throws(()=>verifyRegisteredSnapshot(tampered));
  const version=JSON.parse(bytes);version.calculatorVersion=identity.version+1;assert.throws(()=>verifyRegisteredSnapshot(version));
  observations.push({name,input,output,expected,artifactSha256:hash(bytes),scenarioSha256:hash(report),exactReplay:true,tamperRejected:true,versionMismatchRejected:true,scope:'Bounded independent numerical witness and artifact agreement; no approval'});
  return output;
 };
 const reject=(name:string,input:unknown)=>{assert.throws(()=>runCalculator(definition,input));observations.push({name,expected:'REJECTED',observed:'REJECTED'});};
 if(identity.id===276){
  witness('rational slope',{x1:-2,y1:5,x2:2,y2:-3},{value:-2,dx:4,dy:-8});
  witness('horizontal true zero',{x1:0,y1:7,x2:2,y2:7},{value:0,dx:2,dy:0});
  witness('bounded maximum coordinates',{x1:-1e100,y1:-1e100,x2:1e100,y2:1e100},{value:1,dx:2e100,dy:2e100});
  witness('equal subnormal deltas',{x1:0,y1:0,x2:Number.MIN_VALUE,y2:Number.MIN_VALUE},{value:1,dx:Number.MIN_VALUE,dy:Number.MIN_VALUE});
  reject('vertical',{x1:0,y1:0,x2:0,y2:1});reject('nonfinite',{x1:0,y1:0,x2:Infinity,y2:1});reject('ratio overflow',{x1:0,y1:0,x2:Number.MIN_VALUE,y2:1});
 }else if(identity.id===275){
  witness('integer rectangular prism',{length:2,width:3,height:4},{volume:24,surfaceArea:52});
  witness('positive fractional dimensions',{length:.5,width:1.5,height:2},{volume:1.5,surfaceArea:9.5});
  witness('large finite dimensions',{length:1e100,width:1e100,height:1e100},{volume:1e300,surfaceArea:6e200});
  witness('small representable product',{length:1e-100,width:1e-100,height:1e-100},{volume:1e-300,surfaceArea:6e-200});
  reject('zero dimension',{length:0,width:1,height:1});reject('negative dimension',{length:-1,width:1,height:1});reject('above bound',{length:1e101,width:1,height:1});
 }else if(identity.id===282||identity.id===283){
  witness('population independent textbook dataset',{values:[2,4,4,4,5,5,7,9],kind:'population'},{count:8,mean:5,variance:4,standardDeviation:2});
  witness('sample independent rational witness',{values:[1,2,3],kind:'sample'},{count:3,mean:2,variance:1,standardDeviation:1});
  witness('constant true zero',{values:[1e-200,1e-200],kind:'population'},{count:2,mean:1e-200,variance:0,standardDeviation:0});
  witness('maximum magnitude dispersion',{values:[-1e100,1e100],kind:'population'},{count:2,mean:0,variance:1e200,standardDeviation:1e100});
  witness('maximum count',{values:Array(10000).fill(1),kind:'sample'},{count:10000,mean:1,variance:0,standardDeviation:0});
  reject('empty',{values:[],kind:'population'});reject('sample singleton',{values:[1],kind:'sample'});reject('count overflow',{values:Array(10001).fill(1),kind:'population'});reject('nonfinite',{values:[Infinity,1],kind:'population'});reject('invalid kind',{values:[1,2],kind:'unknown'});
 }else{
  const output=witness('parabola exact dyadic samples',{expression:'x^2',minX:-5,maxX:5},{minimum:0,maximum:25});
  const points=output.points as {x:number;y:number}[];assert.equal(points.length,81);for(let i=0;i<81;i++){const x=(i-40)/8;assert.deepEqual(points[i],{x,y:x*x});}
  witness('constant zero',{expression:'0',minX:-1,maxX:1},{minimum:0,maximum:0});
  const reciprocal=witness('omitted reciprocal singularity',{expression:'1/x',minX:-5,maxX:5},{minimum:-8,maximum:8});assert.equal((reciprocal.points as unknown[]).length,80);
  reject('unordered domain',{expression:'x',minX:1,maxX:0});reject('above domain bound',{expression:'x',minX:0,maxX:1e10});reject('unsupported parser token',{expression:'process.exit()',minX:-1,maxX:1});reject('no finite points',{expression:'1/0',minX:-1,maxX:1});
 }
 let legacyBoundary:null|Record<string,unknown>=null;
 if(identity.id===276||identity.id===275||identity.id===282||identity.id===283){
  const input=identity.id===276?{x1:0,y1:0,x2:1e100,y2:1e-300}:identity.id===275?{length:1e-200,width:1e-200,height:1e-200}:{values:[1e-200,2e-200],kind:'population'};
  const output=runCalculator(definition,input).output as Record<string,unknown>;assert(sixCandidatePrecisionError(identity.slug,input,output));
  const snapshot=createCalculationSnapshot({calculatorSlug:identity.slug,calculatorVersion:identity.version,input,output});assert.deepEqual(verifyRegisteredSnapshot(snapshot).snapshot,snapshot);
  legacyBoundary={input,output,newCallerCapture:'REFUSED_PRECISION_LOSS',historicalReplay:'PRESERVED_EXACT_FORWARD_AGREEMENT',mathematicsChanged:false};
 }
 rows.push({...identity,engineId:definition.id,observations,legacyBoundary,qaDecision:'pending',canonicalAccepted:false,eligible:false});
}
const result={kind:'VERSION_SPECIFIC_SOFTWARE_WITNESSES_NOT_QA_DECISIONS',rows,scope:'No source/reviewer/QA approval or full-domain proof',releaseHold:true};
const file='docs/full-product-six-closure/numerical.json',text=JSON.stringify(result,null,2)+'\n';
if(process.argv.includes('--check'))assert.equal(await readFile(file,'utf8'),text);else await writeFile(file,text);
console.log(JSON.stringify({identities:rows.length,witnesses:rows.reduce((n,r)=>n+r.observations.length,0),legacyPrecisionFailures:4,eligible:0}));
