import { solarPosition } from './solar-position';
export interface SunEventsInput { date: string; latitude: number; longitude: number; utcOffsetMinutes?: number }
/** Crossings of geometric center elevation -0.833°, on a fixed-offset civil day. */
export function sunEvents(input: SunEventsInput) {
  const {date,latitude,longitude} = input;
  const offset = input.utcOffsetMinutes ?? 0;
  if (!Number.isInteger(offset) || Math.abs(offset)>840) throw new RangeError('UTC offset must be integer minutes [-840,840]');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new RangeError('Date must be YYYY-MM-DD');
  solarPosition({instant:date+'T00:00:00Z',latitude,longitude});
  const start = Date.parse(date+'T00:00:00Z')-offset*60000;
  const height = (t:number) => solarPosition({instant:new Date(t).toISOString(),latitude,longitude}).elevationDegrees+0.833;
  const rises:string[]=[]; const sets:string[]=[];
  let before = height(start), min=before, max=before;
  // One-minute bracketing, then bisection to < 0.1 second. Grazing tangencies are not crossings.
  for(let i=1;i<=1440;i++) {
    const end=start+i*60000, after=height(end);
    min=Math.min(min,after); max=Math.max(max,after);
    if ((before<0 && after>=0)||(before>=0 && after<0)) {
      let lo=end-60000, hi=end;
      for(let j=0;j<20;j++) { const mid=(lo+hi)/2; if((height(mid)>=0)===(before>=0)) lo=mid; else hi=mid; }
      const crossing=(lo+hi)/2;
      if(crossing<start+86400000) (after>before?rises:sets).push(new Date(Math.round(crossing)).toISOString());
    }
    before=after;
  }
  const status = rises.length||sets.length ? 'events' : min>0 ? 'polar-day' : max<0 ? 'polar-night' : 'grazing';
  return {status, sunriseUtc:rises[0]??null, sunsetUtc:sets[0]??null, sunrisesUtc:rises, sunsetsUtc:sets, horizonElevationDegrees:-0.833, utcOffsetMinutes:offset} as const;
}
