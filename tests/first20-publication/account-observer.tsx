import React,{useLayoutEffect} from 'react';
import {CalculatorAccountActions as Actual} from '../../src/components/calculator-account-actions';
export type ObservedActionSnapshot={calculatorSlug:string;calculatorVersion:number;input:unknown;output:unknown};
declare global{interface Window{__first20Snapshot:ObservedActionSnapshot|undefined}}
/** Read-only observation of actual caller props; the original action component still renders. */
export function CalculatorAccountActions(props:React.ComponentProps<typeof Actual>){
 const {calculatorSlug,calculatorVersion,input,output}=props;
 useLayoutEffect(()=>{window.__first20Snapshot={calculatorSlug,calculatorVersion,input:structuredClone(input),output:structuredClone(output)};},[calculatorSlug,calculatorVersion,input,output]);
 return <Actual {...props}/>;
}
