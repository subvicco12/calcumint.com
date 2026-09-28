import { z } from "zod";
export type DateParts={year:number;month:number;day:number};
const ISO=/^(\d{4})-(\d{2})-(\d{2})$/;
export function isLeapYear(y:number){return y%4===0&&(y%100!==0||y%400===0)}
export function daysInMonth(y:number,m:number){return m===2?(isLeapYear(y)?29:28):[4,6,9,11].includes(m)?30:31}
export function parseIsoDate(s:string):DateParts{const m=ISO.exec(s);if(!m)throw new Error("Date must use YYYY-MM-DD");const p={year:+m[1]!,month:+m[2]!,day:+m[3]!};if(p.month<1||p.month>12||p.day<1||p.day>daysInMonth(p.year,p.month))throw new Error("Invalid calendar date");return p}
export function formatIsoDate(p:DateParts){return `${String(p.year).padStart(4,"0")}-${String(p.month).padStart(2,"0")}-${String(p.day).padStart(2,"0")}`}
export function dayNumberBig(p:DateParts){let y=BigInt(p.year),m=BigInt(p.month);if(m<=2n){y--;m+=12n}const era=y>=0n?y/400n:(y-399n)/400n,yoe=y-era*400n,doy=(153n*(m-3n)+2n)/5n+BigInt(p.day)-1n,doe=yoe*365n+yoe/4n-yoe/100n+doy;return era*146097n+doe-719468n}
export function narrowDayNumber(day:bigint){if(day<BigInt(Number.MIN_SAFE_INTEGER)||day>BigInt(Number.MAX_SAFE_INTEGER))throw new Error("Date offset arithmetic exceeds the safe integer range");return Number(day)}
export function dayNumber(p:DateParts){return narrowDayNumber(dayNumberBig(p))}
export function fromDayNumber(d:number):DateParts{if(!Number.isSafeInteger(d))throw new Error("Result is outside the supported four-digit date range");const z=d+719468,era=Math.floor(z/146097),doe=z-era*146097,yoe=Math.floor((doe-Math.floor(doe/1460)+Math.floor(doe/36524)-Math.floor(doe/146096))/365);let y=yoe+era*400;const doy=doe-(365*yoe+Math.floor(yoe/4)-Math.floor(yoe/100)),mp=Math.floor((5*doy+2)/153),day=doy-Math.floor((153*mp+2)/5)+1,month=mp+(mp<10?3:-9);y+=month<=2?1:0;return{year:y,month,day}}
export function assertDateRange(p:DateParts){if(!Number.isFinite(p.year)||!Number.isFinite(p.month)||!Number.isFinite(p.day)||p.year<0||p.year>9999)throw new Error("Result is outside the supported four-digit date range");return p}
export function addDays(s:string,days:number){if(!Number.isSafeInteger(days))throw new Error("Date offsets must be safe integers");const result=assertDateRange(fromDayNumber(narrowDayNumber(dayNumberBig(parseIsoDate(s))+BigInt(days))));return formatIsoDate(result)}
export function isoWeekday(p:DateParts){return ((dayNumber(p)+3)%7+7)%7+1}
export const isoDateString=z.string().refine(v=>{try{parseIsoDate(v);return true}catch{return false}},"Invalid ISO calendar date");
