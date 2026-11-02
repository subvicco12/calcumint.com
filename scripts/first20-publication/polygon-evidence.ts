import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import Decimal from 'decimal.js';
import {runCalculator} from '../../src/calculators/engine';
import {launchDefinitions} from '../../src/calculators/launch-portfolio';
import {calculatorRegistry} from '../../src/calculators/registry';
import {polygonAreaSuccessor} from '../../src/lib/first20/polygon-successor';
import fixtures from '../../tests/first20-publication/polygon-oracle.json';
const D=Decimal.clone({precision:140}),legacy=launchDefinitions.find(d=>d.id===polygonAreaSuccessor.id)!;
function bits(x:number){const a=new DataView(new ArrayBuffer(8));a.setFloat64(0,x);return a.getBigUint64(0);}
const evaluations=fixtures.cases.map(c=>{
 let legacyOutput:number|null=null;try{legacyOutput=runCalculator(legacy,c.input).output.result;}catch{}
 let actual:number|null=null;try{actual=runCalculator(polygonAreaSuccessor,c.input).output.result;}catch{}
 if(c.expectedFinite){if(actual===null)throw Error('False successor rejection');if(legacyOutput!==null&&!Object.is(legacyOutput,actual))throw Error('Accepted predecessor output changed');if(new D(actual.toString()).minus(c.reference).abs().div(c.reference).gt('1e-14'))throw Error('Engineering witness budget exceeded');}
 else if(actual!==null)throw Error('Unrepresentable result accepted');
 const distance=actual===null||c.nearestBinary64===null?null:bits(actual)-bits(c.nearestBinary64);
 return {...c,legacyOutput,successorOutput:actual,legacyFalseOverflowCorrected:legacyOutput===null&&actual!==null,relativeError:actual===null?null:new D(actual.toString()).minus(c.reference).abs().div(c.reference).toString(),ulpDistance:distance===null?null:(distance<0n?-distance:distance).toString()};
});
if(calculatorRegistry.getBySlug(legacy.slug)?.version!==1)throw Error('Registry no longer preserves v1');
const paths=['src/lib/first20/polygon-successor.ts','src/calculators/launch-portfolio.ts','tests/first20-publication/polygon-oracle.py','tests/first20-publication/polygon-oracle.json'];
const out={kind:'UNREGISTERED_POLYGON_SUCCESSOR_ENGINEERING_WITNESSES_NOT_APPROVAL',masterId:268,engineId:legacy.id,proposedVersion:2,registeredVersion:1,sourceHashes:Object.fromEntries(paths.map(p=>[p,createHash('sha256').update(readFileSync(p)).digest('hex')])),evaluations,summary:{cases:evaluations.length,legacyFalseOverflowsCorrected:evaluations.filter(e=>e.legacyFalseOverflowCorrected).length,unrepresentableRejected:evaluations.filter(e=>e.successorOutput===null).length},governingFullDomainToleranceApproved:false,engineeringFixtureRelativeBudget:'1e-14',publicationEligible:false,releaseHold:true};
const text=JSON.stringify(out,null,2)+'\n',dest='docs/first20-publication/polygon-evidence.json';if(process.argv.includes('--check')){if(readFileSync(dest,'utf8')!==text)throw Error('Polygon receipt drift');}else writeFileSync(dest,text);console.log(JSON.stringify(out.summary));
