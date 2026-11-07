/** Human presentation only. Registered unit IDs, arithmetic and captured artifacts stay unchanged. */
const symbols:Readonly<Record<string,string>>=Object.freeze({hz:'Hz',khz:'kHz',mhz:'MHz',ghz:'GHz'});
export function frequencyUnitSymbol(code:string):string{return Object.hasOwn(symbols,code)?symbols[code]:code;}
export function frequencyPresentationUnit(slug:string,version:number,code:string):string{return slug==='frequency-converter'&&version===1?frequencyUnitSymbol(code):code;}
/** HTTP presentation metadata is separate from JSON so replay/audit result hashes stay stable. */
export function frequencySymbolHeaders(input:{fromUnit:string;toUnit:string}){return{'X-Input-Unit-Symbol':frequencyUnitSymbol(input.fromUnit),'X-Output-Unit-Symbol':frequencyUnitSymbol(input.toUnit)};}
export function frequencyUnitLegend(){return Object.entries(symbols).map(([id,symbol])=>`${id} = ${symbol}`).join(', ');}
