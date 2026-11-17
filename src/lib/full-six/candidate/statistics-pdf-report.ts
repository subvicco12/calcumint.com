/** Private candidate report adapter; no registry adoption or professional acceptance. */
import {serializeCalculationPdf} from '@/lib/calculation-export-pdf';
import {createCalculationSnapshot} from '@/lib/calculation-snapshot';
import {createCandidateSnapshot,replayCandidateSnapshot,type CandidateArtifact} from './workflow';
import type {AdvancedStatisticsFinite,ExactRational} from '../statistics/advanced';
import type {AdvancedStatisticsInput} from '../statistics/advanced';

const rational=(value:ExactRational)=>`${value.numerator}/${value.denominator} (decimal approximation: ${value.decimal})`;
/** Caller may supply bounded worker replay. It must check live generation and
 * entitlement before starting replay; this adapter checks returned exact bytes. */
export async function createStatisticsPdfReport(value:CandidateArtifact,replay?:(id:282|283,text:string)=>Promise<CandidateArtifact>):Promise<Uint8Array>{
 const original=await createCandidateSnapshot(value),id=original.artifact.catalogId;
 if(id!==282&&id!==283)throw Error('Statistics PDF requires catalog 282 or 283');
 const verified=replay?await createCandidateSnapshot(await replay(id,JSON.stringify(original))):await replayCandidateSnapshot(JSON.stringify(original),id);
 if(verified.sha256!==original.sha256)throw Error('Exact-revision recomputation mismatch');
 const artifact=verified.artifact,input=artifact.input as AdvancedStatisticsInput,output=artifact.output as AdvancedStatisticsFinite,summary=output.summary;
 const primary=id===282?'standardDeviation':'variance',title=id===282?'Standard deviation':'Variance';
 const units=summary.unit,varianceUnit=units?`${units}^2`:'';
 const snapshot=createCalculationSnapshot({calculatorSlug:`private-candidate-statistics-${id}-${artifact.implementationRevision}`,calculatorVersion:1,input:artifact.input,output:{candidateArtifact:artifact,snapshotSHA256:verified.sha256}});
 const pdf=serializeCalculationPdf(snapshot,{
  title:`${title} | PRIVATE EXPERIMENTAL STATISTICS`,
  methodology:[
   `Private PDF transport identity: private-candidate-statistics-${id}-${artifact.implementationRevision}, transport version 1. The shared PDF header engine-version field denotes this private transport schema only, not a registered statistics engine version. Baseline version ${artifact.baselineVersion} is historical lineage only; no successor version is allocated.`,
   `Catalog ${id}; primary metric ${primary} = ${summary.metrics[primary]} ${primary==='variance'?varianceUnit:units}.`,
   `Mode: ${summary.mode}; encoding: ${summary.encoding}; effective N: ${summary.counts.effectiveN}; denominator: ${summary.denominator}.`,
   'Original decimal tokens and integer frequency strings remain authoritative. No observations are expanded, sampled, display-rounded, or converted to binary floating point by this report.',
   'Descriptive summary: exact integer lattice sufficient statistics with rational final division and Decimal50 half-even square root. Histogram boundaries and contributions retain exact rational numerators/denominators; decimal approximations are labelled.',
   'Histogram uses equal-width exact rational bins; the final right boundary is closed. Tables give the complete textual alternative to the descriptive distribution and contribution charts. Histogram shape establishes neither normality nor representativeness.',
   'Sample mode divides centered M2 by N-1; population mode divides by N. Sample/population is an explicit user choice, not inferred from the values. Missing and zero-frequency dispositions are disclosed for every stored row.',
   'Transform/target analysis, when present, retains its base dataset, authoritative base-plus-transform representation, derived observations, residuals and numerical policy in the complete raw appendix. Sensitivity scenarios are deterministic fixed-dataset scenarios, not causal or uncertainty claims.',
   `Implementation revision: ${artifact.implementationRevision}; algorithm revision: ${output.revision}; contract SHA-256: ${artifact.contractSHA256}; verified snapshot SHA-256: ${verified.sha256}.`,
   'Private experimental engineering artifact. Canonical registration, competent statistical review, source adoption, publication approval, physical-device and independent PDF/UA acceptance remain separate and unverified.',
  ].join(' '),
  sources:[
   {label:'Bound engineering contract; engineering requirements, not professional source adoption',note:`docs/full-six/input/contracts/${id}-${id===282?'standard-deviation':'variance'}-calculator.json | SHA-256 ${artifact.contractSHA256}`},
   {label:'Exact calculation implementation and numerical policy',note:`src/lib/full-six/statistics/decimal-descriptive.ts | ${summary.numericalPolicy.algorithm}; src/lib/full-six/statistics/advanced.ts | ${output.revision}; candidate revision ${artifact.implementationRevision}`},
  ],
  tables:[
   {title:'Summary | exact raw decimal strings',columns:['Metric','Raw value','Unit'],rows:Object.entries(summary.metrics).map(([key,value])=>[key,value,['variance','centeredM2'].includes(key)?varianceUnit:units])},
   {title:'Dataset counts and estimand',columns:['Field','Value'],rows:[['Mode',summary.mode],['Encoding',summary.encoding],['Missing policy',input.dataset.missingPolicy??'reject'],['Denominator',String(summary.denominator)],...Object.entries(summary.counts).map(([key,value])=>[key,String(value)])]},
   {title:'All stored observations | original tokens and dispositions',columns:['Zero-based row','Original value','Original frequency','Disposition'],rows:summary.rows.map(row=>[String(row.index),row.original===null?'null (missing)':JSON.stringify(row.original),input.dataset.rows[row.index].frequency===undefined?'Not supplied':JSON.stringify(input.dataset.rows[row.index].frequency),row.disposition])},
   {title:`Distribution | complete exact rational histogram | observation unit: ${units||'not supplied'}`,columns:['Bin','Lower boundary','Upper boundary','Count'],rows:output.histogram.bins.map((bin,index)=>[String(index+1),rational(bin.lower),rational(bin.upper)+(index===output.histogram.bins.length-1?' (closed)':' (open)'),String(bin.count)])},
   {title:`Contributions | deviation unit: ${output.contributionUnits.deviation||'not supplied'}; squared unit: ${output.contributionUnits.squaredDeviation||'not supplied'}`,columns:['Zero-based row / frequency','Deviation','Squared deviation','Weighted squared deviation'],rows:output.contributions.map(row=>[`${row.index} / ${row.frequency}`,rational(row.deviation),rational(row.squaredDeviation),rational(row.weightedSquaredDeviation)])},
  ],
 });
 if(pdf.byteLength>32_000_000)throw Error('Statistics PDF exceeds 32 MB report budget');
 return pdf;
}
