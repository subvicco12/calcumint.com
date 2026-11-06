import {describe,it,expect} from 'vitest';
import {calculateFullSlope,solveFullSlope,clipFullSlopeLine,sweepFullSlope} from './slope';

describe('private full-scope slope candidate, never historical routing',()=>{
 it('evaluates all five selected modes against independently worked line y=2x+1',()=>{
  const cases=[{mode:'two_points',x1:'1',y1:'3',x2:'4',y2:'9'},{mode:'rise_run',rise:'6',run:'3',x0:'1',y0:'3'},{mode:'point_slope',x0:'1',y0:'3',orientation:'finite',m:'2'},{mode:'slope_intercept',m:'2',b:'1'},{mode:'general_line',A:'-2',B:'1',C:'1'}];
  for(const input of cases){const result=calculateFullSlope(input);expect(result.status).toBe('finite');expect(result.values.slope).toBe(2);expect(result.values.yIntercept).toBe(1);expect(result.values.xIntercept).toBe(-.5);}
 });
 it('classifies vertical, coincident, zero-coefficient identity and empty plane exactly',()=>{
  expect(calculateFullSlope({mode:'two_points',x1:'2',y1:'1',x2:'2',y2:'3'}).status).toBe('vertical-line');
  expect(calculateFullSlope({mode:'two_points',x1:'2',y1:'1',x2:'2',y2:'1'}).status).toBe('degenerate');
  expect(calculateFullSlope({mode:'general_line',A:'0',B:'0',C:'0'}).status).toBe('underdetermined');
  expect(calculateFullSlope({mode:'general_line',A:'0',B:'0',C:'1'}).status).toBe('no-solution');
  expect(calculateFullSlope({mode:'two_points',x1:'1',x2:'1',y1:'1',y2:'1.00000000000001'}).status).toBe('vertical-line');
  expect(calculateFullSlope({mode:'two_points',y1:'1',y2:'1',x1:'1',x2:'1.00000000000001'}).status).toBe('finite');
 });
 it('keeps an unanchored rise/run as direction rather than inventing a line or intercept',()=>{
  const r=calculateFullSlope({mode:'rise_run',rise:'3',run:'2'});expect(r.values.slope).toBe(1.5);expect(r.line).toBeNull();expect(r.values.yIntercept).toBeUndefined();
 });
 it('preserves original decimal text and normalizes coordinate units before deltas',()=>{
  const r=calculateFullSlope({mode:'two_points',x1:'0',y1:'0',x2:' 100 ',y2:'100',xUnit:'m',yUnit:'cm',x2Unit:'cm'});
  expect(r.status).toBe('finite');expect(r.values.slope).toBe(100);expect(r.values.normalizedRatio).toBe(1);expect(r.values.gradePercent).toBe(100);expect(r.values.angleRadians).toBeCloseTo(Math.PI/4,14);expect(r.inputs.x2.original).toBe(' 100 ');expect(r.units.slope).toBe('cm/m');
  const speed=calculateFullSlope({mode:'rise_run',rise:'3',run:'2',xUnit:'s',yUnit:'m'});expect(speed.values.slope).toBe(1.5);expect(speed.values.gradePercent).toBeUndefined();expect(speed.values.angleRadians).toBeUndefined();
  const converted=calculateFullSlope({mode:'two_points',x1:'0',y1:'0',x2:'1e-13',x2Unit:'km',y2:'1',xUnit:'m'});expect(converted.status).toBe('finite');expect(converted.values.dx).toBe(1e-10);expect(converted.values.slope).toBe(1e10);
 });
 it('does not collapse exact distinct decimals or accept ill conditioning',()=>{
  expect(calculateFullSlope({mode:'two_points',x1:'1',x2:'1.00000000000001',y1:'0',y2:'1'}).status).toBe('precision-unavailable');
  expect(calculateFullSlope({mode:'two_points',x1:'1',x2:'1.0000000000000001',y1:'0',y2:'1'}).status).toBe('precision-unavailable');
 });
 it('rejects malformed, contradictory, unknown and mismatched dimensional input without coercion',()=>{
  for(const value of ['', ' ', '0x10','1foo','Infinity','NaN','1,2',true,null,{}])expect(calculateFullSlope({mode:'slope_intercept',m:value,b:'1'}).status).toBe('domain-error');
  expect(calculateFullSlope({mode:'point_slope',orientation:'vertical',x0:'1',y0:'2',m:'3'}).status).toBe('domain-error');
  expect(calculateFullSlope({mode:'rise_run',rise:'1',run:'2',x0:'3'}).status).toBe('domain-error');
  expect(calculateFullSlope({mode:'two_points',x1:'0',y1:'0',x2:'1',y2:'1',xUnit:'m',x2Unit:'s'}).status).toBe('domain-error');
  expect(calculateFullSlope({mode:'slope_intercept',m:'1',b:'0',approved:true}).status).toBe('domain-error');
 });
 it('refuses explicit numeric envelopes and never silently underflows a nonzero input',()=>{
  for(const b of ['1e13','1e-13','1e-9999','1e-999999','1234567890123456'])expect(calculateFullSlope({mode:'slope_intercept',m:'1',b}).status).toBe('precision-unavailable');
 });
 it('clips a straight line analytically with no sampling, including vertical and offscreen lines',()=>{
  const box={xmin:-1,xmax:2,ymin:0,ymax:5};
  expect(clipFullSlopeLine(calculateFullSlope({mode:'slope_intercept',m:'2',b:'1'}),box)).toEqual({status:'segment',points:[{x:-.5,y:0},{x:2,y:5}]});
  expect(clipFullSlopeLine(calculateFullSlope({mode:'point_slope',orientation:'vertical',x0:'1',y0:'2'}),box)).toEqual({status:'segment',points:[{x:1,y:0},{x:1,y:5}]});
  expect(clipFullSlopeLine(calculateFullSlope({mode:'slope_intercept',m:'0',b:'8'}),box).status).toBe('offscreen');
 });
 it('solves every declared inverse with an independent expected point or direction',()=>{
  const cases=[['y2',{x1:'1',y1:'3',x2:'4',m:'2'},9],['y1',{x1:'1',x2:'4',y2:'9',m:'2'},3],['x2',{x1:'1',y1:'3',y2:'9',m:'2'},4],['x1',{x2:'4',y1:'3',y2:'9',m:'2'},1],['rise',{run:'3',m:'2'},6],['run',{rise:'6',m:'2'},3],['intercept_b',{x0:'1',y0:'3',m:'2'},1]] as const;
  for(const [target,operands,value] of cases){const r=solveFullSlope({target,...operands});expect(r.status).toBe('unique');expect(r.value).toBe(value);expect(r.forwardResidual).toBe(0);}
  const line={mode:'slope_intercept',m:'2',b:'1'};
  expect(solveFullSlope({target:'line_y',line,x:'4'}).value).toBe(9);expect(solveFullSlope({target:'line_x',line,y:'9'}).value).toBe(4);
 });
 it('does not confuse a generated inverse roundtrip with overprecise user input',()=>{
  const result=solveFullSlope({target:'run',rise:'1',m:'3'});expect(result.status).toBe('unique');expect(result.value).toBeCloseTo(1/3,14);expect(result.forwardResidual).toBeLessThan(1e-11);
  expect(calculateFullSlope({mode:'rise_run',rise:'1',run:'0.3333333333333333'}).status).toBe('precision-unavailable');
 });
 it('rejects cross-multiplied coincident inverse solutions and preserves infinite/no solution branches',()=>{
  expect(solveFullSlope({target:'y2',x1:'1',y1:'3',x2:'1',m:'2'}).status).toBe('no-solution');
  expect(solveFullSlope({target:'x2',x1:'1',y1:'3',y2:'3',m:'2'}).status).toBe('no-solution');
  expect(solveFullSlope({target:'run',rise:'0',m:'0'}).status).toBe('underdetermined');
  expect(solveFullSlope({target:'run',rise:'1',m:'0'}).status).toBe('no-solution');
  const vertical={mode:'general_line',A:'1',B:'0',C:'2'};
  expect(solveFullSlope({target:'line_y',line:vertical,x:'2'}).status).toBe('underdetermined');
  expect(solveFullSlope({target:'line_y',line:vertical,x:'3'}).status).toBe('no-solution');
  expect(solveFullSlope({target:'line_x',line:vertical,y:'999'}).value).toBe(2);
 });
 it('preserves sweep singularities by calling the same forward path for every selected value',()=>{
  const baseline={mode:'two_points',x1:'0',y1:'0',x2:'1',y2:'1'};
  const r=sweepFullSlope(baseline,'x2',['-1','0','1']);
  expect(r.map(x=>x.result.status)).toEqual(['finite','vertical-line','finite']);expect(r[2].result).toEqual(calculateFullSlope(baseline));
 });
});
