import {frequencyPresentationUnit} from './frequency-presentation';
import { createCalculationSnapshot,type CalculationSnapshot,copyCalculationData } from "./calculation-snapshot";
export { serializeCalculationPdf, type CalculationPdfOptions } from './calculation-export-pdf';
/** Export raw engine values; formatting and on-screen sampling do not affect CSV. */
export function serializeCalculationCsv(input: Record<string, unknown>, output: Record<string, unknown>): string {
  ({input,output}=copyCalculationData(input,output));
  const text = (value: unknown): string => {
    if (typeof value === "number") {
      if (!Number.isFinite(value)) throw new Error("Non-finite export value");
      return Object.is(value, -0) ? "-0" : String(value);
    }
    if (typeof value === "string") return /^[\s]*[=+\-@]/u.test(value) ? `'${value}` : value;
    if (value === null) return "null";
    if (typeof value === "boolean") return String(value);
    const encoded = JSON.stringify(value, (_key, cell: unknown) => {
      if (typeof cell === "number" && !Number.isFinite(cell)) throw new Error("Non-finite export value");
      if (typeof cell === "undefined" || typeof cell === "bigint" || typeof cell === "function" || typeof cell === "symbol") throw new Error("Unsupported export value");
      return cell;
    });
    if (encoded === undefined) throw new Error("Unsupported export value");
    return encoded;
  };
  const rows = [["section", "field", "value"], ...Object.entries(input).map(([key, value]) => ["input", text(key), text(value)]), ...Object.entries(output).map(([key, value]) => ["output", text(key), text(value)])];
  return rows.map(row => row.map(cell => `"${cell.replaceAll('"', '""')}"`).join(",")).join("\n");
}

/** Stored fields stay in their original sections; identity is additional CSV context. */
export function serializeCalculationSnapshotCsv(snapshot:CalculationSnapshot):string{
 const saved=createCalculationSnapshot(snapshot),csv=serializeCalculationCsv(saved.input,saved.output);
 const quote=(value:string)=>`"${value.replaceAll('"','""')}"`;
 const text=(value:string)=>/^[\s]*[=+\-@]/u.test(value)?`'${value}`:value;
 const presentation=['fromUnit','toUnit'].flatMap(key=>{const raw=saved.input[key];if(typeof raw!=='string')return [];const unit=frequencyPresentationUnit(saved.calculatorSlug,saved.calculatorVersion,raw);return unit===raw?[]:[['presentation',key,unit]];});
 const identity=[['identity','calculatorSlug',text(saved.calculatorSlug)],['identity','calculatorVersion',String(saved.calculatorVersion)],...presentation].map(row=>row.map(quote).join(',')).join('\n');
 const line=csv.indexOf('\n');
 return line<0?`${csv}\n${identity}`:`${csv.slice(0,line)}\n${identity}\n${csv.slice(line+1)}`;
}
