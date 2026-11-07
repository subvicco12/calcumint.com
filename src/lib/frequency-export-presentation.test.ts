import {execFileSync,spawnSync} from 'node:child_process';
import {mkdtempSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {expect,it} from 'vitest';
import {serializeCalculationSnapshotCsv} from './calculation-export';
import {serializeCalculationPdf} from './calculation-export-pdf';
import {captureScenario} from './scenario-set';
import {recoverScenarioSetJson} from './scenario-set-recovery';
import {createScenarioReport,serializeScenarioReportCsv,serializeScenarioReportJson} from './scenario-report';
import {serializeScenarioReportPdf} from './scenario-report-pdf';
const popplerAvailable=!spawnSync('pdftotext',['-v']).error;
const snapshot={calculatorSlug:'frequency-converter',calculatorVersion:1,input:{value:1234,fromUnit:'hz',toUnit:'khz'},output:{result:1.234}};
const display={schemaVersion:1 as const,calculatorSlug:snapshot.calculatorSlug,calculatorVersion:1,inputs:{value:{label:'Frequency',unit:'hz'}},outputs:{result:{label:'Converted frequency',unit:'khz'}}};
it('adds SI presentation CSV rows while retaining raw unit IDs and numeric values',()=>{
 const csv=serializeCalculationSnapshotCsv(snapshot);
 expect(csv).toContain('"input","fromUnit","hz"');expect(csv).toContain('"output","result","1.234"');
 const parsedRows=csv.split('\n').map(row=>JSON.parse(`[${row}]`));expect(parsedRows).toContainEqual(['presentation','fromUnit','Hz']);
 expect(csv).toContain('"presentation","fromUnit","Hz"');expect(csv).toContain('"presentation","toUnit","kHz"');
 expect(serializeCalculationSnapshotCsv({...snapshot,calculatorVersion:2})).not.toContain('"presentation"');
});
it('presents legacy metadata as SI symbols without mutating captured reports',()=>{
 let rows=captureScenario([],'A',snapshot,'legacy',display);rows=captureScenario(rows,'B',{...snapshot,input:{...snapshot.input,value:2234},output:{result:2.234}},'legacy B',display);
 const before=serializeScenarioReportJson(rows),report=createScenarioReport(rows),csv=serializeScenarioReportCsv(rows);
 expect(report.metrics[0].unit).toBe('khz');expect(report.metrics[0].cells[1].difference).toBe(1);
 expect(csv).toContain('"metric[0].unit","kHz"');expect(csv).toContain('""unit"":""khz""');
 const pdf=new TextDecoder().decode(serializeCalculationPdf(snapshot,{displayMetadata:display}));
 expect(pdf).toContain('Frequency [Hz]');expect(pdf).toContain('Converted frequency [kHz]');
 expect(pdf).toContain('input["fromUnit"] = "hz"');
 const folder=mkdtempSync(join(tmpdir(),'frequency-export-'));
 try{if(popplerAvailable){const single=join(folder,'calculation.pdf');writeFileSync(single,serializeCalculationPdf(snapshot,{displayMetadata:display}));const text=execFileSync('pdftotext',['-layout',single,'-'],{encoding:'utf8'});expect(text).toContain('Frequency [Hz]');expect(text).toContain('Converted frequency [kHz]');expect(text).toContain('fromUnit: Hz');expect(text).toContain('toUnit: kHz');const path=join(folder,'comparison.pdf');writeFileSync(path,serializeScenarioReportPdf(rows));const parsed=execFileSync('pdftotext',['-layout',path,'-'],{encoding:'utf8'});expect(parsed).toContain('Converted frequency [kHz]');expect(parsed).toMatch(/Unit:[\s|]*kHz/);}}finally{rmSync(folder,{recursive:true,force:true});}
 expect(serializeScenarioReportJson(rows)).toBe(before);
 const restored=recoverScenarioSetJson(before,snapshot);expect(restored[0].displayMetadata?.outputs.result.unit).toBe('khz');expect(serializeScenarioReportJson(restored)).toBe(before);
});
