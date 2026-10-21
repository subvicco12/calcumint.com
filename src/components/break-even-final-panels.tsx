"use client";
import {useId} from 'react';
import {buildBreakEvenProjection,solveBreakEvenTargetProfit} from '@/calculators/final-framework/break-even-experience';
import {displayFinalValue} from '@/calculators/final-framework/renderer-display';
import './break-even-final-panels.css';
type Input={fixedCosts:number;pricePerUnit:number;variableCostPerUnit:number};
const quantity=(value:number)=>value.toLocaleString(undefined,{maximumSignificantDigits:12});

/** The SVG and accessible table consume the same deterministic projection rows. */
export function BreakEvenCrossoverPanel({input}:{input:Input}){
 const description=useId();
 let projection:ReturnType<typeof buildBreakEvenProjection>;
 try{projection=buildBreakEvenProjection(input);}catch{return <p role="alert">Crossover projection unavailable for these values. The core result is unchanged.</p>;}
 const points=projection.points;
 const maxUnits=Math.max(...points.map(p=>p.units)),maxAmount=Math.max(...points.flatMap(p=>[p.revenue,p.cost]));
 const x=(value:number)=>50+value/maxUnits*500,y=(value:number)=>210-value/maxAmount*180;
 const line=(field:'revenue'|'cost')=>points.map(p=>`${x(p.units)},${y(p[field])}`).join(' ');
 return <section className="result-panel crossover-panel" aria-label="Break-even crossover">
  <h3>Cost and revenue crossover</h3>
  <p id={description}>Revenue and total cost at continuous quantities, including the unrounded crossover. All amounts use the same currency or amount unit as your inputs.</p>
  <svg viewBox="0 0 600 260" role="img" aria-label="Cost and revenue crossover" aria-describedby={description}>
   <line x1="50" y1="210" x2="550" y2="210" stroke="currentColor"/><line x1="50" y1="30" x2="50" y2="210" stroke="currentColor"/>
   <polyline points={line('revenue')} fill="none" stroke="#1456b8" strokeWidth="3"/>
   <polyline points={line('cost')} fill="none" stroke="#b23728" strokeWidth="3" strokeDasharray="9 5"/>
   <text x="300" y="245" textAnchor="middle">Quantity (units)</text><text x="55" y="20">Amount</text>
  </svg>
  <p><span>Solid line: revenue.</span> <span>Dashed line: total cost.</span></p>
  <p>Core break-even units and revenue are independently rounded to two decimal places. Samples use unrounded continuous quantities; no whole-unit sales assumption is made.</p>
  <details open><summary>Crossover data</summary><div className="schedule-scroll" role="region" aria-label="Cost and revenue data" tabIndex={0}>
   <table className="result-table"><caption>Cost and revenue at modeled quantities</caption><thead><tr><th scope="col">Quantity (units)</th><th scope="col">Revenue (amount)</th><th scope="col">Total cost (amount)</th><th scope="col">Profit (amount)</th></tr></thead>
    <tbody>{points.map((p,index)=><tr key={index}><th scope="row">{quantity(p.units)}</th><td>{displayFinalValue(p.revenue)}</td><td>{displayFinalValue(p.cost)}</td><td>{displayFinalValue(p.profit)}</td></tr>)}</tbody>
   </table>
  </div></details>
 </section>;
}
export function BreakEvenTargetProfitPanel({input,targetProfit}:{input:Input;targetProfit:number}){
 let solved:ReturnType<typeof solveBreakEvenTargetProfit>|null=null;
 try{solved=solveBreakEvenTargetProfit({...input,targetProfit});}catch{/* Optional target failure never removes the valid core answer. */}
 return <section className="result-panel crossover-panel" role="region" aria-label="Target profit analysis"><h3>Target profit analysis</h3>
  {solved?<><dl aria-live="polite" aria-atomic="true"><div><dt>Required continuous quantity</dt><dd><strong>{solved.requiredUnits.toLocaleString(undefined,{maximumFractionDigits:6})} units</strong></dd></div><div><dt>Modeled profit</dt><dd>{displayFinalValue(solved.profit)}</dd></div><div><dt>Modeled revenue</dt><dd>{displayFinalValue(solved.revenue)}</dd></div><div><dt>Modeled total cost</dt><dd>{displayFinalValue(solved.cost)}</dd></div></dl>
  <p>The existing target-profit engine rounds continuous quantities to six decimal places. Quantities are not rounded up to whole items. Modeled profit uses that returned quantity and can differ from the requested target.</p>
  {solved.residual!==0?<p>Modeled profit minus target: {displayFinalValue(solved.residual)}.</p>:null}</>:<p role="alert">Enter a supported nonnegative target profit and input amounts within the target-profit engine range (at most 10¹⁵). The target must be representable at six-decimal quantity precision.</p>}
 </section>;
}
