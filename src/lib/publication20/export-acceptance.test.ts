import {describe,it,expect} from 'vitest';
import {execFileSync,spawnSync} from 'node:child_process';
import {mkdtempSync,writeFileSync,rmSync,mkdirSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import Decimal from 'decimal.js';
import {runCalculator} from '@/calculators/engine';
import {publication20Definitions} from './index';
import {createCalculationSnapshot} from '../calculation-snapshot';
import {serializeCalculationSnapshotCsv,serializeCalculationPdf} from '../calculation-export';
import {captureScenario} from '../scenario-set';
import {createScenarioReport,serializeScenarioReportCsv,serializeScenarioReportJson} from '../scenario-report';
import {serializeScenarioReportPdf} from '../scenario-report-pdf';
import {recoverScenarioSetJson} from '../scenario-set-recovery';
import {verifyRegisteredSnapshot} from '../registered-snapshot-replay';
import {frequencyPresentationUnit} from '../frequency-presentation';
import type {ScenarioDisplayMetadata} from '../scenario-display-metadata';

// An independent RFC4180 field reader; does not reuse export implementation.
function readCsv(text:string):string[][] {
 const rows:string[][]=[];let row:string[]=[],cell='',quoted=false;
 for(let i=0;i<text.length;i++){const char=text[i];if(char==='"'){if(quoted&&text[i+1]==='"'){cell+='"';i++;}else quoted=!quoted;}else if(!quoted&&(char===','||char==='\n')){row.push(cell);cell='';if(char==='\n'){rows.push(row);row=[];}}else cell+=char;}
 if(quoted)throw Error('Unclosed CSV field');row.push(cell);rows.push(row);return rows;
}
const cell=(rows:string[][],section:string,field:string)=>{const matches=rows.filter(row=>row[0]===section&&row[1]===field);expect(matches).toHaveLength(1);return matches[0][2];};
const popplerProbe=spawnSync('pdftotext',['-v']);
if(popplerProbe.error&&(popplerProbe.error as NodeJS.ErrnoException).code!=='ENOENT')throw popplerProbe.error;
const popplerAvailable=!popplerProbe.error&&popplerProbe.status===0;
function pdfText(bytes:Uint8Array):string{const directory=mkdtempSync(join(tmpdir(),'calcumint-publication20-'));try{const file=join(directory,'report.pdf');writeFileSync(file,bytes);return execFileSync('pdftotext',['-layout',file,'-'],{encoding:'utf8'});}finally{rmSync(directory,{recursive:true,force:true});}}

// Offline exact-version artifact acceptance, not authenticated persistence,
// competent-review approval, full-domain proof or publication eligibility.
describe('twenty exact registered versions: CSV, independent PDF and local A/B recovery',()=>{
 expect(publication20Definitions.map(entry=>entry.catalogId).sort((a,b)=>a-b)).toEqual([370,371,372,373,374,423,424,425,427,428,429,430,431,432,433,434,437,438,439,440]);
 for(const entry of publication20Definitions){
  const input=Object.fromEntries(entry.fields.map(field=>[field.key,field.kind==='number'?Number(field.defaultValue):field.defaultValue]));
  const varied=entry.fields.find(field=>field.kind==='number')!.key;
  const snapshot=(values:Record<string,unknown>)=>createCalculationSnapshot({calculatorSlug:entry.definition.slug,calculatorVersion:entry.definition.version,input:values,output:runCalculator(entry.definition,values).output});
  const a=snapshot(input),b=snapshot({...input,[varied]:Number(input[varied])+1}),unit=entry.outputUnit(input);
  // Explicit captured presentation fixture, using cohort-declared units. This
  // tests serializers; browser metadata provenance remains separate evidence.
  const metadata:ScenarioDisplayMetadata={schemaVersion:1,calculatorSlug:a.calculatorSlug,calculatorVersion:a.calculatorVersion,inputs:Object.fromEntries(entry.fields.map(field=>[field.key,{label:field.label,...(field.kind==='number'?{unit:field.key==='value'&&typeof input.fromUnit==='string'?input.fromUnit:field.unit??''}:{})}])),outputs:{[entry.primaryKey]:{label:'Recorded result',unit}}};
  const humanUnit=frequencyPresentationUnit(a.calculatorSlug,a.calculatorVersion,unit);
  const rows=captureScenario(captureScenario([],'A',a,'Baseline, "exact"',metadata),'B',b,'Changed numeric input',metadata);
  it(`${entry.catalogId} CSV raw identity/fields and A/B comparison/recovery reject tamper`,()=>{
   expect(a.calculatorVersion).toBe(1);expect(verifyRegisteredSnapshot(a).engineId).toBe(entry.definition.id);
   const csv=readCsv(serializeCalculationSnapshotCsv(a));expect(csv[0]).toEqual(['section','field','value']);
   expect(cell(csv,'identity','calculatorSlug')).toBe(a.calculatorSlug);expect(cell(csv,'identity','calculatorVersion')).toBe('1');
   for(const [key,value] of Object.entries(a.input))expect(cell(csv,'input',key)).toBe(String(value));
   for(const [key,value] of Object.entries(a.output))expect(cell(csv,'output',key)).toBe(value!==null&&typeof value==='object'?JSON.stringify(value):String(value));
   const report=createScenarioReport(rows),metric=report.metrics.find(metric=>metric.field===entry.primaryKey)!;
   expect(metric.unit).toBe(unit);expect(metric.cells.map(cell=>cell.value)).toEqual([a.output[entry.primaryKey],b.output[entry.primaryKey]]);
   expect(metric.cells[1].difference).toBe(new Decimal(String(b.output[entry.primaryKey])).minus(String(a.output[entry.primaryKey])).toNumber());
   expect(metric.cells.every(cell=>cell.unavailable===null)).toBe(true);expect(report.charts.find(chart=>chart.field===entry.primaryKey)?.unit).toBe(unit);
   const comparison=readCsv(serializeScenarioReportCsv(rows)),index=report.metrics.indexOf(metric);
   expect(cell(comparison,'input','calculatorSlug')).toBe(a.calculatorSlug);expect(cell(comparison,'output',`metric[${index}].unit`)).toBe(humanUnit);
   const captured=JSON.parse(cell(comparison,'output','capturedScenarios'));expect(captured[0].notes).toBe('Baseline, "exact"');expect(captured[1].input).toEqual(b.input);expect(captured[1].output).toEqual(b.output);
   const encoded=serializeScenarioReportJson(rows),identity={calculatorSlug:a.calculatorSlug,calculatorVersion:1};expect(recoverScenarioSetJson(encoded,identity)).toEqual(rows);
   const forged=JSON.parse(encoded);forged.scenarios[1].output[entry.primaryKey]+=1;expect(()=>recoverScenarioSetJson(JSON.stringify(forged),identity)).toThrow();
   const comparisonForgery=JSON.parse(encoded);comparisonForgery.comparison.metrics[0].cells[1].difference=999;expect(()=>recoverScenarioSetJson(JSON.stringify(comparisonForgery),identity)).toThrow(/comparison|presentation/);
   expect(()=>recoverScenarioSetJson(encoded,{...identity,calculatorVersion:2})).toThrow(/version/);
   expect(a.input).toEqual(input);expect(rows[0].snapshot).toEqual(a);
   // Opt-in fixture export supports independent shell Poppler acceptance when
   // the runtime forbids Node subprocesses. It never writes repository artifacts.
   const destination=process.env.CALCUMINT_ACCEPTANCE20_EXPORT_DIR;
   if(destination){mkdirSync(destination,{recursive:true});const prefix=join(destination,String(entry.catalogId));
    writeFileSync(`${prefix}-calculation.pdf`,serializeCalculationPdf(a,{title:`Catalog ${entry.catalogId}: exact registered export`,displayMetadata:metadata,sources:entry.definition.sources,formulas:entry.definition.formulas}));
    writeFileSync(`${prefix}-comparison.pdf`,serializeScenarioReportPdf(rows));
    writeFileSync(`${prefix}-expected.json`,JSON.stringify({catalogId:entry.catalogId,slug:a.calculatorSlug,version:a.calculatorVersion,unit,resultA:String(a.output[entry.primaryKey]),resultB:String(b.output[entry.primaryKey])},null,2));
   }
  });
  it.skipIf(!popplerAvailable)(`${entry.catalogId} Poppler reads calculation and A/B PDF raw values, units and immutable version`,()=>{
   const title=`Catalog ${entry.catalogId}: exact registered export`;
   const text=pdfText(serializeCalculationPdf(a,{title,displayMetadata:metadata,sources:entry.definition.sources,formulas:entry.definition.formulas}));
   expect(text).toContain(title);expect(text).toContain(a.calculatorSlug);expect(text).toContain(`output["${entry.primaryKey}"] = ${String(a.output[entry.primaryKey])}`);expect(text).toContain(`[${humanUnit}]`);expect(text).toMatch(/version[^\n]*1/i);
   const comparison=pdfText(serializeScenarioReportPdf(rows));expect(comparison).toContain('SCENARIO COMPARISON');expect(comparison).toContain(a.calculatorSlug);expect(comparison).toContain(`[${humanUnit}]`);expect(comparison).toContain(String(b.output[entry.primaryKey]));expect(comparison).toContain(JSON.stringify('Baseline, "exact"'));expect(comparison).toContain('PDF/UA conformance: UNVERIFIED');
  });
 }
});
