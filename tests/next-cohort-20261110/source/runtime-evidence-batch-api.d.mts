export interface RuntimeEvidenceBatchReader {
 (path:string):Buffer;
 (path:string,encoding:'utf8'|'utf-8'):string;
}
/** Synchronous callback only; returned promises/values and escaped readers fail closed. */
export function withRuntimeEvidenceBatch(paths:readonly string[],run:(read:RuntimeEvidenceBatchReader)=>void):void;
