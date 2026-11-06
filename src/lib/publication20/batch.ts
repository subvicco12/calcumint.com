import {runCalculator} from '@/calculators/engine';
import {getPublication20Definition} from './index';
import {requiredCalculatorNumber} from '@/lib/registered-input-successor';
import {validatePublication20Result} from './result-trust';
import {createCalculationSnapshot,type CalculationSnapshot} from '@/lib/calculation-snapshot';
import {verifyRegisteredSnapshot} from '@/lib/registered-snapshot-verification';
export type ConversionBatch=Readonly<{schemaVersion:1;calculatorSlug:string;fromUnit:string;toUnit:string;rows:readonly Readonly<{raw:string;snapshot?:CalculationSnapshot;error?:string}>[]}>;
export function evaluateConversionBatch(slug:string,draft:string,fromUnit:string,toUnit:string):ConversionBatch{
 const entry=getPublication20Definition(slug);
 if(!entry||!entry.definition.id.startsWith('conversion.'))throw Error('Unsupported conversion profile.');
 if(new TextEncoder().encode(draft).length>65536)throw Error('Batch input exceeds the 64 KiB engineering limit.');
 const values=draft.split('\n');if(values.length<1||values.length>100)throw Error('Enter 1–100 rows (engineering limit).');
 const rows=values.map(raw=>{try{
  if(raw.length>4096)throw Error('Row exceeds the 4096-character engineering limit.');
  const input={value:requiredCalculatorNumber(raw),fromUnit,toUnit};
  const parsed=entry.definition.inputSchema.safeParse(input);if(!parsed.success)throw Error('Enter a complete finite decimal and offered source/target units without losing entered digits.');
  const output=runCalculator(entry.definition,input).output;validatePublication20Result(entry,input,output);
  return Object.freeze({raw,snapshot:createCalculationSnapshot({calculatorSlug:slug,calculatorVersion:entry.definition.version,input,output})});
 }catch(error){return Object.freeze({raw,error:error instanceof Error?error.message:'Invalid row.'});}});
 return Object.freeze({schemaVersion:1,calculatorSlug:slug,fromUnit,toUnit,rows:Object.freeze(rows)});
}
export function serializeConversionBatch(batch:ConversionBatch):string{
 if(batch.rows.some(row=>!row.snapshot||row.error))throw Error('Correct every row before exporting; partial exports are unavailable.');
 return JSON.stringify(batch,null,2);
}
/** Unsigned numeric consistency only, never authentication or source approval. */
export function replayConversionBatch(bytes:string):ConversionBatch{
 if(new TextEncoder().encode(bytes).length>524288)throw Error('Replay exceeds the 512 KiB engineering limit.');
 const raw:unknown=JSON.parse(bytes);
 const keys=(value:unknown,expected:string[])=>{if(!value||typeof value!=='object'||Array.isArray(value)||Object.keys(value).sort().join('|')!==expected.sort().join('|'))throw Error('Invalid batch schema.');};
 keys(raw,['schemaVersion','calculatorSlug','fromUnit','toUnit','rows']);const b=raw as ConversionBatch;
 if(b.schemaVersion!==1||typeof b.calculatorSlug!=='string'||typeof b.fromUnit!=='string'||typeof b.toUnit!=='string'||!Array.isArray(b.rows)||b.rows.length<1||b.rows.length>100)throw Error('Invalid batch identity or rows.');
 for(const row of b.rows){keys(row,['raw','snapshot']);if(typeof row.raw!=='string'||row.raw.includes('\n'))throw Error('Invalid raw row.');verifyRegisteredSnapshot(row.snapshot);}
 const checked=evaluateConversionBatch(b.calculatorSlug,b.rows.map(r=>r.raw).join('\n'),b.fromUnit,b.toUnit);
 // Compare structural values independently of JSON key order.
  for(let i=0;i<checked.rows.length;i++){const expected=checked.rows[i].snapshot,actual=b.rows[i].snapshot;if(!expected||!actual||actual.calculatorSlug!==expected.calculatorSlug||actual.calculatorVersion!==expected.calculatorVersion||Object.keys(actual.input).length!==3||actual.input.value!==expected.input.value||actual.input.fromUnit!==expected.input.fromUnit||actual.input.toUnit!==expected.input.toUnit||JSON.stringify(actual.output)!==JSON.stringify(expected.output))throw Error('Batch replay does not match the recorded raw input and exact v1 result.');}
 return checked;
}
