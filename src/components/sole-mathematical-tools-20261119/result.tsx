import {FinalResultPresentation} from '../final-result-presentation';
import {mathContract,verifyMathematicalToolsPacket} from '@/lib/sole-mathematical-tools-20261119/cohort';
import type {StructuredCalculationResult} from '@/calculators/final-framework/types';
import type {FactoryExecutionPacket} from '@/lib/calculator-factory/workflows';
import type {CalcuMintPlan} from '@/lib/entitlements';
import type {MatrixOutput} from '@/calculators/advanced-math/catalog-final';
import type {SeriesOutput} from '@/calculators/advanced-math/catalog-batch-10';
import type {TriangleOutput} from '@/calculators/geometry/catalog-completion';

type Row = readonly (string | number)[];
type Display = Pick<StructuredCalculationResult,'primaryResult'|'metrics'> & {caption:string;columns:readonly string[];rows:readonly Row[]};

function presentation(id:number,packet:FactoryExecutionPacket):Display {
 const output=packet.snapshot.output;
 switch(id){
  case 240:{
   const r=output as MatrixOutput;
   return {primaryResult:{id:'determinant',label:'Result determinant',value:r.determinant},
    metrics:[{id:'trace',label:'Result trace',value:r.trace}],caption:'Result matrix',columns:['Row','Column 1','Column 2'],rows:r.matrix.map((row,i)=>[i+1,...row])};
  }
  case 250:{
   const r=output as SeriesOutput;
   const start=Number(packet.snapshot.input.start);
   return {primaryResult:{id:'sum',label:'Finite sum',value:r.sum},
    caption:r.terms.length>30?'First 30 terms — full result in exports':'Terms and partial sums',columns:['Index','Term','Partial sum'],
    rows:r.terms.slice(0,30).map((term,i)=>[start+i,term,r.partialSums[i]])};
  }
  case 257:
  case 258:{
   const r=output as TriangleOutput;
   return {primaryResult:{id:'area',label:'Area',value:r.area,unit:'square units'},
    metrics:[{id:'perimeter',label:'Perimeter',value:r.perimeter,unit:'input units'}],
    caption:'Angles',columns:['Vertex','Degrees'],rows:[['A',r.angleA],['B',r.angleB],['C',r.angleC]]};
  }
  case 301:
   return {primaryResult:{id:'odds',label:'Odds in favour',value:Number(output.odds)},
    metrics:[{id:'probability',label:'Probability',value:Number(output.probability)}],
    caption:'Conversion',columns:['Method','Direction'],rows:[['Input',output.direction==='odds-to-probability'?'Odds to probability':'Probability to odds']]};
  default:throw Error('Mathematical result unavailable');
 }
}

export function MathResult({packet,plan}:{packet:FactoryExecutionPacket;plan:CalcuMintPlan}){
 const verified=verifyMathematicalToolsPacket(packet);
 const c=mathContract(verified.identity.catalogId!);
 const {primaryResult,metrics,caption,columns,rows}=presentation(c.catalogId,verified);
 const steps=verified.snapshot.output.steps as readonly string[];
 return <>
  <FinalResultPresentation plan={plan} result={{primaryResult,metrics,methodology:c.scope,sources:c.engine.sources,warnings:[c.limitations,'Uses the registered v1 numerical model. Competent scope and precision review remains pending.']}}/>
  <section aria-label="Exact mathematical details">
   <table style={{width:'100%',tableLayout:'fixed'}}><caption>{caption}</caption>
    <thead><tr>{columns.map(column=><th key={column} scope="col">{column}</th>)}</tr></thead>
    <tbody>{rows.map(([name,...values])=><tr key={name}><th scope="row">{name}</th>{values.map((value,i)=><td key={columns[i+1]}>{value}</td>)}</tr>)}</tbody>
   </table>
   <details><summary>Calculation steps</summary><ol>{steps.map((step,i)=><li key={i}>{step}</li>)}</ol></details>
  </section>
 </>;
}
