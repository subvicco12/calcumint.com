import {createRoot,type Root} from 'react-dom/client';
import {CalculatorInteractive} from '../../src/components/calculator-interactive';
let root:Root|null=null;
/** Actual caller in an existing authenticated loopback fixture; never a public route. */
export function mountTechnology(slug:string){
 if(!root){document.querySelector<HTMLElement>('#root')!.hidden=true;const element=document.createElement('main');element.id='recovery-technology';element.style.cssText='padding:12px;max-width:1100px;margin:auto;overflow-wrap:anywhere';document.body.append(element);root=createRoot(element);}
 root.render(<CalculatorInteractive slug={slug}/>);
}
