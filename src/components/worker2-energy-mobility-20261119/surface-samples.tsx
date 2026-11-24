export function SurfaceSamples({output}:{output:Record<string,unknown>}){
 const points=output.points as readonly {x:number;y:number;z:number}[];
 const mins=[Math.min(...points.map(p=>p.x)),Math.min(...points.map(p=>p.y)),Number(output.minimum)];
 const maxs=[Math.max(...points.map(p=>p.x)),Math.max(...points.map(p=>p.y)),Number(output.maximum)];
 // Scale each axis before subtraction so opposite finite extremes cannot overflow.
 const scales=maxs.map((max,axis)=>Math.max(Math.abs(max),Math.abs(mins[axis]))||1);
 const origins=mins.map((min,axis)=>min/scales[axis]);
 const extents=maxs.map((max,axis)=>max/scales[axis]-origins[axis]);
 const normalize=(value:number,axis:number)=>extents[axis]===0?0:(value/scales[axis]-origins[axis])/extents[axis]-0.5;
 return <figure aria-label="Sampled function surface">
  <svg viewBox="0 0 100 100" aria-hidden="true" className="mx-auto block w-full max-w-sm">
   {points.map(({x,y,z},index)=>{
    const px=normalize(x,0),py=normalize(y,1),pz=normalize(z,2);
    return <circle key={index} cx={50+34*(px-py)} cy={53-17*(px+py)-30*pz} r={0.8} fill="currentColor"/>;
   })}
  </svg>
  <figcaption>{points.length} finite samples from a {String(output.gridSize)} by {String(output.gridSize)} grid. Sampled z range: {String(output.minimum)} to {String(output.maximum)}.</figcaption>
  <details><summary>Show sampled coordinates</summary>
   <table><caption>Finite surface samples in grid order</caption>
    <thead><tr><th scope="col">x</th><th scope="col">y</th><th scope="col">z</th></tr></thead>
    <tbody>{points.map(({x,y,z},index)=><tr key={index}><td>{x}</td><td>{y}</td><td>{z}</td></tr>)}</tbody>
   </table>
  </details>
 </figure>;
}
