import {computeDecimalStatistics,type DecimalStatisticsInput} from '@/lib/full-six/statistics/decimal-descriptive';
import {immutableFullSixArtifact,type FullSixArtifact} from './result-contract';
import {createFullSixSnapshot,readFullSixSnapshot,verifyFullSixRecomputation,type FullSixBinding,type FullSixSnapshot} from '@/lib/full-six-snapshot';

/** These are engineering contract hashes; no successor engine version is allocated here. */
const contracts={282:'795e1092bc2028862639615ef82c96941d96e3222eac679dfe24c25113f8a79b',283:'c38d9350101aae237395e3828a3ebafa57ed8a871c896ee2607ac7d85266a0b7'} as const;
const implementationRevision='exact-integer-lattice-rational-decimal50-v1';
export function statisticsBinding(catalogId:282|283):FullSixBinding{
 return {catalogId,engineId:catalogId===282?'statistics.standard-deviation':'statistics.variance',baselineVersion:1,implementationRevision,contractSHA256:contracts[catalogId]};
}
export function computeStatisticsArtifact(catalogId:282|283,input:DecimalStatisticsInput):FullSixArtifact{
 const result=computeDecimalStatistics(input);
 const binding=statisticsBinding(catalogId);
 const modes={mode:input.mode,encoding:input.encoding,missingPolicy:input.missingPolicy??'reject',unit:input.unit??''};
 const inputs=Object.fromEntries(input.rows.map((row,index)=>[String(index),JSON.stringify({value:row.value??null,...(row.frequency!==undefined?{frequency:row.frequency}:{}),...(row.missing!==undefined?{missing:row.missing}:{})})]));
 let outcome:FullSixArtifact['outcome'];
 if(result.status==='error')outcome={status:'domain-error',message:`${result.code}: ${result.message}${result.row===undefined?'':` (row ${result.row+1})`}`};
 else{
  const values:Record<string,{raw:string;unit:string;label:string}>={};
  for(const [key,raw] of Object.entries(result.metrics)){
   const unit=key==='variance'||key==='centeredM2'?(result.unit?`${result.unit}^2`:''):result.unit;
   values[key]={raw,unit,label:key};
  }
  for(const [key,n] of Object.entries(result.counts))values[key]={raw:String(n),unit:'',label:key};
  values.denominator={raw:String(result.denominator),unit:'',label:'denominator'};
  // Separate identities share arithmetic, not their authoritative primary result or units.
  const primary=catalogId===282?'standardDeviation':'variance';
  values.primary={...values[primary],label:catalogId===282?'Standard deviation':'Variance'};
  outcome={status:'finite',values,warnings:['Private experimental result; full canonical review and successor allocation pending.','Descriptive statistics do not establish normality or representativeness.']};
 }
 return immutableFullSixArtifact({protocol:'full-six-artifact-1',scope:'PRIVATE_EXPERIMENTAL',...binding,inputs,modes,
  sources:[{sourceId:'NIST-SCALE',contentSHA256:'f534c231c9a18207ae0dc8d977fe1b045afbeef94ae17c98e9f6a79895ba7aa8',clause:'Supplied retrieval: Measures of Scale; sample dispersion and squared/original units; no new publisher authentication claimed.'}],
  numericPolicy:{revision:implementationRevision,precisionDigits:50,rounding:'half-even'},outcome});
}
export async function snapshotStatistics(catalogId:282|283,input:DecimalStatisticsInput):Promise<FullSixSnapshot>{
 const artifact=computeStatisticsArtifact(catalogId,input);
 if(artifact.outcome.status!=='finite')throw Error('Cannot save a non-successful calculation');
 return createFullSixSnapshot(artifact);
}
/** Explicit experimental replay: exact ID, algorithm and contract only, no current/latest fallback. */
export async function replayStatistics(text:string,catalogId:282|283):Promise<FullSixSnapshot>{
 const binding=statisticsBinding(catalogId),snapshot=await readFullSixSnapshot(text,binding);
 await verifyFullSixRecomputation(snapshot,binding,artifact=>{
  const rows=Object.entries(artifact.inputs).sort(([a],[b])=>Number(a)-Number(b)).map(([,row])=>JSON.parse(row));
  return computeStatisticsArtifact(catalogId,{mode:artifact.modes.mode as DecimalStatisticsInput['mode'],encoding:artifact.modes.encoding as DecimalStatisticsInput['encoding'],missingPolicy:artifact.modes.missingPolicy as DecimalStatisticsInput['missingPolicy'],unit:artifact.modes.unit,rows});
 });
 return snapshot;
}
