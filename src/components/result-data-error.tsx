import type { InvalidResultSurface } from '@/calculators/final-framework/result-inspection';
const labels:Record<InvalidResultSurface,string>={composition:'Overview',ranges:'Reference range',series:'Trend',schedule:'Schedule',trust:'Methodology and sources',warnings:'Warnings'};
export function ResultDataError({surface,issues}:{surface?:InvalidResultSurface;issues?:readonly string[]}){
 return <p className="result-warning" role="alert">{surface?`${labels[surface]} data is unavailable because it is invalid.`:'Calculation result is unavailable because its data is invalid.'}{issues?.length?` ${issues.join(' ')}`:null}</p>;
}
