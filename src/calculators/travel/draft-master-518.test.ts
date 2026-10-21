import {describe,it,expect} from 'vitest';
import {sleepDurationCalculator as c, type SleepDurationInput} from './draft-master-518';
const input:SleepDurationInput={sleepStart:'2026-01-01T23:00Z',wakeEnd:'2026-01-02T07:00Z',awakeMinutes:30};
const run=(i:SleepDurationInput)=>c.calculate(i,{});
describe('518 elapsed instants, minute precision',()=>{
 // Independently checked with Python datetime.fromisoformat subtraction (UTC conversion).
 it.each([
  [input.sleepStart,input.wakeEnd,480],
  ['2026-03-08T01:30-05:00','2026-03-08T03:30-04:00',60],
  ['2026-11-01T01:30-04:00','2026-11-01T01:30-05:00',60],
  ['2024-02-29T23:30+05:45','2024-03-01T00:30+05:45',60],
 ])('uses UTC instants %s to %s',(sleepStart,wakeEnd,elapsedMinutes)=>expect(run({sleepStart,wakeEnd,awakeMinutes:30})).toMatchObject({elapsedMinutes,estimatedSleepMinutes:elapsedMinutes-30}));
 it('allows zero elapsed and all time awake',()=>{expect(run({...input,wakeEnd:input.sleepStart,awakeMinutes:0}).estimatedSleepMinutes).toBe(0);expect(run({...input,awakeMinutes:480}).estimatedSleepMinutes).toBe(0);});
 it.each(['2026-02-29T12:00Z','2026-04-31T12:00Z','2026-01-01T24:00Z','2026-01-01T23:00','2026-01-01T23:00:00Z','2026-01-01T23:00+24:00','2026-01-01T23:00-00:00','0000-01-01T00:00Z'])('rejects invalid/ambiguous/minute-contract endpoint %s',sleepStart=>expect(()=>run({...input,sleepStart})).toThrow());
 it.each([-1,481,0.5,NaN,Infinity])('rejects invalid awake minutes %s',awakeMinutes=>expect(()=>run({...input,awakeMinutes})).toThrow());
 it('validates century leap rules and early years without year-1900 coercion',()=>{expect(run({...input,sleepStart:'0099-12-31T23:00Z',wakeEnd:'0100-01-01T00:00Z',awakeMinutes:0}).elapsedMinutes).toBe(60);expect(()=>run({...input,sleepStart:'1900-02-29T00:00Z'})).toThrow();expect(run({...input,sleepStart:'2000-02-29T00:00Z',wakeEnd:'2000-02-29T01:00Z',awakeMinutes:0}).elapsedMinutes).toBe(60);});
 it('recognizes equivalent instants with different local dates',()=>expect(run({...input,sleepStart:'2026-01-01T23:00-02:00',wakeEnd:'2026-01-02T01:00Z',awakeMinutes:0}).elapsedMinutes).toBe(0));
 it('rejects backwards instants',()=>expect(()=>run({...input,wakeEnd:'2026-01-01T22:59Z'})).toThrow());
});
