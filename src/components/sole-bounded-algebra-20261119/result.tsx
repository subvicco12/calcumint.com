import {FinalResultPresentation} from '../final-result-presentation';
import {algebraContract,verifyBoundedAlgebraPacket} from '@/lib/sole-bounded-algebra-20261119/cohort';
import type {StructuredCalculationResult} from '@/calculators/final-framework/types';
import type {FactoryExecutionPacket} from '@/lib/calculator-factory/workflows';
import type {CalcuMintPlan} from '@/lib/entitlements';
import type {RrefOutput,SequenceOutput,VectorOutput} from '@/calculators/advanced-math/catalog-batch-7';
import type {CubicOutput,EquationOutput} from '@/calculators/advanced-math/catalog-batch-8';

type AlgebraDisplay = Pick<StructuredCalculationResult,'primaryResult'|'metrics'> & {
 caption:string;
 columns:readonly string[];
 rows:readonly (readonly (number|string)[])[];
};

function display(id:number,output:FactoryExecutionPacket['snapshot']['output']):AlgebraDisplay {
 switch(id){
  case 236:{
   const result=output as EquationOutput;
   return {primaryResult:{id:'degree',label:'Equation degree',value:result.degree},caption:'Solutions',
    columns:['Solution','Value'],rows:result.solutions.map((value,index)=>[index+1,value])};
  }
  case 243:{
   const result=output as RrefOutput;
   return {primaryResult:{id:'rank',label:'Matrix rank',value:result.rank},caption:'Reduced matrix',
    columns:['Row','Column 1','Column 2','Column 3'],rows:result.matrix.map((row,index)=>[index+1,...row])};
  }
  case 245:{
   const result=output as VectorOutput;
   return {primaryResult:{id:'dot',label:'Dot product',value:result.dot},
    metrics:[{id:'magnitudeA',label:'Magnitude of A',value:result.magnitudeA},{id:'magnitudeB',label:'Magnitude of B',value:result.magnitudeB},
     {id:'angle',label:'Angle',value:result.angleRadians??'Undefined',unit:result.angleRadians===null?undefined:'rad'}],
    caption:'Cross product',columns:['Component','Value'],rows:Object.entries(result.cross)};
  }
  case 249:{
   const result=output as SequenceOutput;
   return {primaryResult:{id:'nth',label:'Nth term',value:result.nth},metrics:[{id:'sum',label:'Finite sum',value:result.sum}],
    caption:'First terms (up to 20)',columns:['Term','Value'],rows:result.terms.map((term,index)=>[index+1,term])};
  }
  case 253:{
   const result=output as CubicOutput;
   return {primaryResult:{id:'rootCount',label:'Distinct real roots',value:result.roots.length},
    metrics:[{id:'discriminant',label:'Depressed cubic discriminant',value:result.discriminant}],
    caption:'Real roots',columns:['Root','Value'],rows:result.roots.map((root,index)=>[index+1,root])};
  }
  default:throw Error('Bounded algebra result unavailable');
 }
}

export function AlgebraResult({packet,plan}:{packet:FactoryExecutionPacket;plan:CalcuMintPlan}){
 const verified=verifyBoundedAlgebraPacket(packet);
 const c=algebraContract(verified.identity.catalogId!);
 const {primaryResult,metrics,caption,columns,rows}=display(c.catalogId,verified.snapshot.output);
 const steps=verified.snapshot.output.steps as readonly string[];
 return <>
  <FinalResultPresentation plan={plan} result={{primaryResult,metrics,methodology:c.scope,sources:c.engine.sources,
   warnings:[c.limitations,'The existing v1 Binary64 model is retained. Competent scope and precision review remains pending.']}}/>
  <section aria-label="Exact algebra details">
   <table style={{width:'100%',tableLayout:'fixed'}}>
    <caption>{caption}</caption>
    <thead><tr>{columns.map(column=><th key={column} scope="col">{column}</th>)}</tr></thead>
    <tbody>{rows.map(([name,...values])=><tr key={name}>
     <th scope="row">{name}</th>
     {values.map((value,index)=><td key={columns[index+1]}>{value}</td>)}
    </tr>)}</tbody>
   </table>
   <details><summary>Calculation steps</summary><ol>{steps.map((step,index)=><li key={index}>{step}</li>)}</ol></details>
  </section>
 </>;
}
