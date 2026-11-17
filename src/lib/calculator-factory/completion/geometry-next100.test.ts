import {describe,it,expect} from 'vitest';
import {calculateGeometryNext100 as calc,reverseGeometryNext100 as reverse,graphGeometryNext100 as graph,geometryNext100Contracts,type GeometryNext100Id} from './geometry-next100';
const vectors:[GeometryNext100Id,Record<string,number>,number,number,number][]=[
 [254,{a:0,b:0,c:1,d:-1,left:0,right:4},1,2,-2],
 [257,{a:13,b:14,c:15},42,44,15],
 [258,{a:5,b:12},30,60,10],
 [268,{sides:4,side:7},49,100,10],
 [272,{radius:3,height:5},47.1238898038469,94.2477796076938,10],
 [274,{length:2,width:3,height:4},52,62,5],
 [275,{length:2,width:3,height:4},24,30,5],
 [276,{x1:2,y1:3,x2:6,y2:-5},-2,3,15],
 [277,{x1:1,y1:2,x2:6,y2:14},13,13,14],
 [278,{a:20,b:21},29,35,28],
 [279,{degrees:90},1.5707963267948966,3.141592653589793,180],
 [280,{radians:1.5707963267948966},90,180,3.141592653589793],
];
describe('private geometry next100 engineering paths, not canonical acceptance',()=>{
 for(const [id,input,expected,target,inverse] of vectors)it(`captures and replays independent witness ${id}`,()=>{
 const packet=calc(id,input);expect(packet.value).toBeCloseTo(expected,11);const solved=reverse(id,input,target);expect(solved.value).toBeCloseTo(inverse,10);expect(solved.replay.value).toBeCloseTo(target,10);
 expect(Object.isFrozen(packet.snapshot)).toBe(true);expect(Object.isFrozen(packet.snapshot.output)).toBe(true);
 expect(calc(id,JSON.parse(JSON.stringify(packet.snapshot.input))).snapshot.output).toEqual(packet.snapshot.output);
 const c=geometryNext100Contracts.find(c=>c.catalogId===id)!;expect(c.solveFor).toBe(solved.solveFor);
 expect(()=>calc(id,{...input,extra:1})).toThrow();expect(()=>calc(id,{...input,[c.solveFor]:NaN})).toThrow();
 const samples=graph(id,input,[input[c.solveFor],Infinity]);expect(samples[0]).toHaveProperty('y',packet.value);expect(samples[1]).toHaveProperty('error');
 });
 it('uses independent Pythagorean integer families and exact prism products',()=>{
 for(const [a,b,c] of [[3,4,5],[5,12,13],[8,15,17],[7,24,25],[119,120,169]]){
 expect(calc(277,{x1:0,y1:0,x2:a,y2:b}).value).toBe(c);
 expect(calc(278,{a,b}).value).toBe(c);
 expect(calc(258,{a,b}).value).toBe(a*b/2);
 }
 expect(calc(257,{a:13,b:14,c:15}).snapshot.output.area).toBeCloseTo(84,12);
 expect(calc(275,{length:123,width:456,height:789}).value).toBe(Number(123n*456n*789n));
 });
 it('refuses invalid or ambiguous inverse domains and preserves orientation',()=>{
 expect(()=>calc(257,{a:1,b:2,c:3})).toThrow();expect(()=>calc(276,{x1:1,y1:2,x2:1,y2:3})).toThrow();
 expect(()=>calc(254,{a:0,b:1,c:0,d:1,left:-1,right:1})).toThrow();
 expect(()=>reverse(272,{radius:0,height:3},0)).toThrow(/unique/);
 expect(()=>reverse(277,{x1:0,y1:0,x2:3,y2:4},2)).toThrow();
 expect(()=>reverse(278,{a:3,b:4},2)).toThrow();
 expect(()=>reverse(254,{a:0,b:0,c:1,d:-1,left:0,right:2},3)).toThrow();
 expect(calc(276,{x1:2,y1:3,x2:6,y2:-5}).value).toBe(-2);
 expect(calc(279,{degrees:-180}).value).toBeCloseTo(-Math.PI,14);
 expect(()=>graph(279,{degrees:1},Array(102).fill(1))).toThrow();
 });
 it('deeply freezes historical array output and refuses collapsed positive triangles',()=>{
 const packet=calc(254,{a:1,b:0,c:0,d:-2,left:0,right:2});expect(packet.value).toBeCloseTo(1.2599210498948732,10);
 expect(Object.isFrozen(packet.snapshot.output.bracket)).toBe(true);
 expect(()=>calc(258,{a:1e-51,b:1})).toThrow();
 });
});
