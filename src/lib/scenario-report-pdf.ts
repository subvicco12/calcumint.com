import {calculatorRegistry} from '@/calculators/registry';
import {createCalculationSnapshot} from './calculation-snapshot';
import {serializeCalculationPdf} from './calculation-export-pdf';
import {createScenarioReport,scenarioNumber} from './scenario-report';
import type {CapturedScenario} from './scenario-set';

/** Existing engine results and identity-matched registry trust context only. */
export function serializeScenarioReportPdf(rows:readonly CapturedScenario[]):Uint8Array {
 const report=createScenarioReport(rows),{captures,metrics,charts}=report;
 const definition=calculatorRegistry.getBySlug(captures.calculatorSlug);
 const trust=definition?.version===captures.calculatorVersion?definition:undefined;
 const snapshot=createCalculationSnapshot({calculatorSlug:captures.calculatorSlug,calculatorVersion:captures.calculatorVersion,input:{baseline:'A'},output:{capturedScenarios:captures.scenarios}});
 return serializeCalculationPdf(snapshot,{
  title:`${captures.calculatorSlug} | SCENARIO COMPARISON`,
  methodology:[...captures.scenarios.flatMap(row=>row.methodology?[`Scenario ${row.slot} captured methodology and limitations: ${row.methodology}`]:[]),'Historical captured A/B/C outputs are authoritative. Differences are presentation-only subtraction from A in the captured units, without re-evaluation, currency conversion or display rounding. Missing/incompatible/nonfinite differences are unavailable. Raw snapshot appendices remain complete. Numeric charts are normalized; use exact table values for small differences.'].join(' | '),
  ...(trust?{sources:trust.sources,formulas:trust.formulas}:{}),
  tables:metrics.map(metric=>({title:`${metric.label}${metric.unit===undefined?'':` [${metric.unit}]`} | Raw field: ${metric.field}`,columns:['Scenario','Captured value','Difference from A','Availability'],rows:metric.cells.map(cell=>[cell.slot,cell.value===null?'Unavailable':`${scenarioNumber(cell.value)}${cell.unit===undefined?'':` [${cell.unit}]`}`,cell.difference===null?'Unavailable':scenarioNumber(cell.difference),`${cell.unavailable??'Comparable'} | Captured label: ${cell.label??'Raw field'} | Unit: ${cell.unit??'Not supplied'}`])})),
  charts,
 });
}
