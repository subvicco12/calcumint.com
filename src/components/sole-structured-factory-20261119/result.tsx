import {FinalCalculatorRenderer} from '../final-calculator-renderer';
import {structuredContract,verifyStructuredFactoryPacket} from '@/lib/sole-structured-factory-20261119/cohort';
import type {FactoryExecutionPacket} from '@/lib/calculator-factory/workflows';
import type {CalcuMintPlan} from '@/lib/entitlements';

function display(value:unknown):string{
 if(value===null)return 'Undefined';
 if(typeof value==='string')return value;
 if(Object.is(value,-0))return '−0';
 if(typeof value==='number')return String(value);
 return JSON.stringify(value);
}
const detailLabels:Record<string,string>={matrix:'Result matrix',determinant:'Determinant',trace:'Trace',dot:'Dot product',
 cross:'Cross product',angleRadians:'Angle (rad)',magnitudeA:'Magnitude A',magnitudeB:'Magnitude B',real:'Real component',
 imaginary:'Imaginary component',display:'Rectangular form',magnitude:'Magnitude',argument:'Argument (rad)',result:'Converted distance',
 currentDiameterMm:'Current diameter (mm)',newDiameterMm:'New diameter (mm)',diameterDifferencePercent:'Diameter difference (%)',
 hours:'Hours',minutes:'Remaining minutes',totalMinutes:'Net minutes'};

export function StructuredResult({packet,plan}:{packet:FactoryExecutionPacket;plan:CalcuMintPlan}){
 const checked=verifyStructuredFactoryPacket(packet),profile=structuredContract(checked.identity.catalogId!);
 const raw=profile.result(checked);
 const result=profile.catalogId===534?{...raw,primaryResult:{...raw.primaryResult,unit:String(checked.snapshot.input.toUnit)}}:raw;
 const {steps,...values}=checked.snapshot.output;
 return <section aria-label="Calculation result">
  <FinalCalculatorRenderer result={result} presentation={profile.presentation} plan={plan}/>
  <section aria-label="Exact structured details">
   <p>Technical version {checked.identity.calculatorVersion}. Source revision {checked.identity.sourceVersion}.</p>
   <table style={{width:'100%',tableLayout:'fixed'}}><caption>Exact engine output</caption>
    <thead><tr><th scope="col">Measure</th><th scope="col">Value</th></tr></thead>
    <tbody>{Object.entries(values).map(([key,value])=><tr key={key}>
     <th scope="row">{detailLabels[key]??key}</th><td>{display(value)}</td>
    </tr>)}</tbody>
   </table>
   {Array.isArray(steps)&&<details><summary>Calculation steps</summary><ol>{steps.map((step,index)=><li key={index}>{String(step)}</li>)}</ol></details>}
  </section>
 </section>;
}
