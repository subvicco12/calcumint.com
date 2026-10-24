import {createRoot} from 'react-dom/client';
import {CalculatorInteractive} from '../../src/components/calculator-interactive';
import {useCalculatorPlan} from '../../src/components/use-calculator-plan';
import '../../src/app/globals.css';
function Fixture(){
 const plan=useCalculatorPlan();
 return <main className="container" style={{padding:'1rem',maxWidth:1100,margin:'auto'}}>
  <p>Private synthetic CIDR review. Not certified or published.</p>
  <h1>CIDR address count</h1><output data-testid="resolved-plan">{plan}</output>
  <CalculatorInteractive slug="cidr-calculator"/>
 </main>;
}
createRoot(document.getElementById('root')!).render(<Fixture/>);
