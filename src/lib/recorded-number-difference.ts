import Decimal from 'decimal.js';
// Preserve the existing scenario-report policy over canonical decimal representations.
// 700 significant digits cover the decimal exponent span of all finite binary64 values.
const RecordedDecimal=Decimal.clone({precision:700});
/** Presentation only: never changes recorded operands, engine results or their units. */
export function recordedNumberDifference(value:number,baseline:number):number|null{
 if(!Number.isFinite(value)||!Number.isFinite(baseline))return null;
 const difference=new RecordedDecimal(value).minus(baseline).toNumber();
 return Number.isFinite(difference)?difference:null;
}
