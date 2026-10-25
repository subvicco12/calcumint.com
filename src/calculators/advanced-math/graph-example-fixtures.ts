// Independent analytic fixtures: the declared grids contain exact eighths/quarters,
// so every coordinate and polynomial value is exactly representable in binary64.
// Do not call the expression engine or calculator to construct these expectations.
export const parabolaExample = {
 points:Array.from({length:81},(_,i)=>{const x=(i-40)/8;return{x,y:x*x}}),
 minimum:0,maximum:25,
 steps:["Parse f(x) = x^2","Sample 81 evenly spaced x positions from -5 to 5","Plot 81 finite points from the deterministic expression engine"],
};
export const paraboloidExample = {
 points:Array.from({length:289},(_,i)=>{const x=(i%17-8)/4,y=(Math.floor(i/17)-8)/4;return{x,y,z:x*x+y*y}}),
 minimum:0,maximum:8,gridSize:17,
 steps:["Parse z = x^2+y^2","Sample a 17×17 grid over x=[-2,2], y=[-2,2]","Retain 289 finite surface points"],
};
