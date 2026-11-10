import {validateTechnologyCapture} from './technology-capture-trust';
/** New captures only. Immutable engines and historical replay readers are not changed. */
export function validateTechnologyNextCapture(id:string,input:Readonly<Record<string,unknown>>,output:{value:number}):void{
 for(const value of Object.values(input))if(typeof value==='number'&&(!Number.isFinite(value)||(value!==0&&Math.abs(value)<2**-1022)))throw Error('Numeric input is outside the finite normal capture boundary');
 validateTechnologyCapture(id,input,output);
}
