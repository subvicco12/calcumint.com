// @vitest-environment jsdom
import {Blob as NodeBlob} from 'node:buffer';
import {cleanup, fireEvent, render, screen, waitFor} from '@testing-library/react';
import {afterEach, beforeEach, expect, it, vi} from 'vitest';
import {CanonicalCalculusRecoveryWorkbench} from './canonical-calculus-recovery-workbench';
import {exportCanonicalCalculation} from '../calculators/canonical-calculus-workflow';
import {exportPrivateCalculus} from '../calculators/private-calculus-successor';
import {CANONICAL_HISTORY_KEY} from '../lib/canonical-calculus-history';

beforeEach(() => {
 localStorage.clear();
 vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => setTimeout(() => callback(0), 0));
 vi.stubGlobal('cancelAnimationFrame', clearTimeout);
});
afterEach(() => {cleanup();if(vi.isFakeTimers()){vi.runOnlyPendingTimers();vi.useRealTimers();}vi.unstubAllGlobals();vi.restoreAllMocks();});
function change(label:string,value:string){fireEvent.change(screen.getByLabelText(label),{target:{value}});}
function click(name:string){fireEvent.click(screen.getByRole('button',{name}));}
async function start(){render(<CanonicalCalculusRecoveryWorkbench/>);change('Synthetic review plan','pro');click('Calculate');await waitFor(()=>expect((screen.getByRole('button',{name:'Save history'}) as HTMLButtonElement).disabled).toBe(false));}

it.each(['{',JSON.stringify({calculation:{calculatorVersion:99}})])('keeps the actual verified result when import is rejected: %s',async text=>{
 await start();const result=screen.getByTestId('cc-primary').textContent;
 change('Calculation JSON (internal revisions2 or3)',text);click('Verify and restore calculation');
 expect(screen.getByRole('alert').textContent).toContain('Artifact differs');
 expect(screen.getByTestId('cc-primary').textContent).toBe(result);
 click('Save history');expect(JSON.parse(localStorage.getItem(CANONICAL_HISTORY_KEY)!)[0].calculation.output.core.value).toBe(result);
});

it('retains the last verified artifact separately after input edits and an unsupported calculation',async()=>{
 await start();click('Save comparison scenario');const result=screen.getByTestId('cc-primary').textContent;
 change('Expression in x','1/0');
 expect(screen.queryByTestId('cc-primary')).toBeNull();
 expect(screen.getByTestId('cc-retained').textContent).toBe(result);
 expect((screen.getByRole('button',{name:'Save comparison scenario'}) as HTMLButtonElement).disabled).toBe(true);
 click('Calculate');expect(screen.getByRole('alert').textContent).toContain('divisor');
 expect(screen.getByTestId('cc-retained').textContent).toBe(result);
 click('Save previous result to history');
 expect(JSON.parse(localStorage.getItem(CANONICAL_HISTORY_KEY)!)[0].calculation.input.calculation.expression).toBe('(x^2-1)/(x-1)');
 click('Restore previous verified result');
 expect((screen.getByLabelText('Expression in x') as HTMLInputElement).value).toBe('(x^2-1)/(x-1)');
 expect(screen.getByTestId('cc-primary').textContent).toBe(result);
 expect(screen.queryByTestId('cc-retained')).toBeNull();
 expect(screen.getByTestId('cc-scenarios').textContent).toContain('1 saved');
});

it.each([2,3])('retains revision %s exactly through failed import and export',async version=>{
 const artifact=version===2?exportPrivateCalculus({operation:'integral',expression:'x^2',lower:0,upper:3}):exportCanonicalCalculation({calculation:{operation:'integral',expression:'x^2',lower:'0',upper:'3'},plot:{enabled:false,radius:'1',samples:9}},'pro');
 let blob:NodeBlob|undefined;vi.stubGlobal('Blob',NodeBlob);vi.stubGlobal('URL',{createObjectURL:(value:NodeBlob)=>{blob=value;return 'blob:test';},revokeObjectURL:()=>{}});vi.spyOn(HTMLAnchorElement.prototype,'click').mockImplementation(()=>{});
 await start();change('Calculation JSON (internal revisions2 or3)',JSON.stringify(artifact));click('Verify and restore calculation');
 const forged={...artifact,calculation:{...artifact.calculation,calculatorVersion:99}};
 change('Calculation JSON (internal revisions2 or3)',JSON.stringify(forged));click('Verify and restore calculation');
 vi.useFakeTimers();click('Export immutable JSON');expect(JSON.parse(await blob!.text())).toEqual(artifact);expect(vi.getTimerCount()).toBe(1);vi.advanceTimersByTime(1000);expect(vi.getTimerCount()).toBe(0);
});

it.each(['free','pro','business'])('submits exact decimal inputs with result and error focus on %s',async plan=>{
 render(<CanonicalCalculusRecoveryWorkbench/>);change('Synthetic review plan',plan);change('Operation','derivative');
 change('Expression in x','x^2');change('Target x (exact decimal)','0.123456789012345678');
 fireEvent.submit(screen.getByRole('form',{name:'Calculus calculation'}));
 const primary=screen.getByTestId('cc-primary');expect(primary.textContent).toBe('0.246913578024691356');expect(document.activeElement).toBe(primary);
 change('Expression in x','ln(x)');change('Target x (exact decimal)','-1');fireEvent.submit(screen.getByRole('form',{name:'Calculus calculation'}));
 expect(screen.queryByTestId('cc-primary')).toBeNull();expect(screen.getByTestId('cc-retained').textContent).toBe('0.246913578024691356');
 expect(document.activeElement).toBe(screen.getByRole('alert'));
 expect((screen.getByRole('button',{name:'Export previous immutable JSON'}) as HTMLButtonElement).disabled).toBe(plan==='free');
});

it('focuses repeated identical errors after a user returns to the input',async()=>{
 await start();change('Expression in x','1/0');fireEvent.submit(screen.getByRole('form',{name:'Calculus calculation'}));
 screen.getByLabelText('Expression in x').focus();
 fireEvent.submit(screen.getByRole('form',{name:'Calculus calculation'}));
 expect(document.activeElement).toBe(screen.getByRole('alert'));
});
