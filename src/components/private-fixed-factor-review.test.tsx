// @vitest-environment jsdom
import {Blob as NodeBlob} from 'node:buffer';
import {renderToString} from 'react-dom/server';
import {render,screen,cleanup,fireEvent,within} from '@testing-library/react';
import {it,expect,afterEach,beforeEach,vi} from 'vitest';
import {PrivateFixedFactorReview} from './private-fixed-factor-review';
import {fixedFactorWorkspaces as definitions,fixedFactorWorkspaceStorageKey as key,importFixedFactorWorkspace} from '../lib/conversion-successor/fixed-factor-workspace';
beforeEach(()=>localStorage.clear());
afterEach(()=>{cleanup();localStorage.clear();vi.restoreAllMocks();vi.unstubAllGlobals();});
const click=(name:string)=>fireEvent.click(screen.getByRole('button',{name}));
function value(raw:string){fireEvent.change(screen.getByLabelText('Conversion value'),{target:{value:raw}});}
const exact=()=>screen.getByTestId('private-factor-exact-result').textContent;
const json=()=>screen.getByLabelText('Workspace JSON for export or recovery') as HTMLTextAreaElement;
it('does not read browser storage or expose saved results during server rendering',()=>{
 const read=vi.spyOn(Storage.prototype,'getItem');
 const markup=renderToString(<PrivateFixedFactorReview/>);
 expect(markup).toContain('Loading private converter workspace');expect(read).not.toHaveBeenCalled();
});

it.each([
 [definitions[0],6894.757293168362,'Pa'],[definitions[1],16.018463373960138,'kg/m³'],[definitions[2],1.3558179483314003,'N·m']
] as const)('runs $0.catalogId through accessible raw controls and the real Final renderer',(definition,expected,unit)=>{
 render(<PrivateFixedFactorReview/>);
 fireEvent.change(screen.getByLabelText('Private converter'),{target:{value:definition.engine.id}});
 click('Calculate private proposal');expect(exact()).toBe(String(expected));
 const result=screen.getByRole('region',{name:'Verified private result'});
 expect(within(result).getAllByRole('status').some(node=>node.textContent?.includes(unit))).toBe(true);
 expect(within(result).getByText('Methodology')).toBeTruthy();expect(within(result).getByText('Sources')).toBeTruthy();
 expect(screen.getByText(/Source applicability: PENDING/)).toBeTruthy();
 expect(JSON.parse(screen.getByTestId('private-factor-artifact').textContent!).artifact.privateId).toBe(definition.engine.id);
 expect(screen.queryByRole('link',{name:/publish|certify|adopt/i})).toBeNull();
});
it('keeps unfinished raw text recoverable, clears stale output and handles signed zero and negative input',()=>{
 render(<PrivateFixedFactorReview/>);click('Calculate private proposal');expect(exact()).toBe('6894.757293168362');
 for(const raw of ['','1e','9007199254740993','1e308','5e-324']){
  value(raw);expect(screen.queryByTestId('private-factor-exact-result')).toBeNull();
  expect((screen.getByRole('button',{name:'Save current to history'}) as HTMLButtonElement).disabled).toBe(true);
  click('Calculate private proposal');expect(screen.getAllByRole('alert').length).toBeGreaterThan(0);
  expect((screen.getByLabelText('Conversion value') as HTMLInputElement).value).toBe(raw);
 }
 value('-0');click('Calculate private proposal');expect(exact()).toBe('0');
 value('-1');click('Calculate private proposal');expect(exact()).toBe('-6894.757293168362');
});
it('uses both live unit selectors and distinguishes the finite identity exemption from a bounded conversion',()=>{
 render(<PrivateFixedFactorReview/>);fireEvent.change(screen.getByLabelText('From unit'),{target:{value:'pa'}});
 value('5e-324');click('Calculate private proposal');expect(exact()).toBe('5e-324');
 fireEvent.change(screen.getByLabelText('To unit'),{target:{value:'psi'}});expect(screen.queryByTestId('private-factor-exact-result')).toBeNull();
 click('Calculate private proposal');expect(screen.getByRole('alert').textContent).toContain('bounded normal domain');
 value('1000');click('Calculate private proposal');expect(exact()).toBe(String(definitions[0].engine.calculate({value:1000,fromUnit:'pa',toUnit:'psi'}).result));
});
it.each(definitions)('keeps $catalogId immutable artifacts and core results across all three synthetic plans',definition=>{
 render(<PrivateFixedFactorReview/>);fireEvent.change(screen.getByLabelText('Private converter'),{target:{value:definition.engine.id}});value('1.00');click('Calculate private proposal');click('Export workspace JSON');
 const original=json().value,artifact=screen.getByTestId('private-factor-artifact').textContent;
 const originalValue=exact();
 for(const plan of ['free','pro','business']){
  fireEvent.change(screen.getByLabelText('Synthetic presentation plan'),{target:{value:plan}});click('Export workspace JSON');
  expect(json().value).toBe(original);expect(screen.getByTestId('private-factor-artifact').textContent).toBe(artifact);expect(exact()).toBe(originalValue);
 }
});
it('preserves detached A/B scenarios, raw history and atomic export/recovery after malformed or tampered JSON',()=>{
 render(<PrivateFixedFactorReview/>);value('1.00');click('Calculate private proposal');click('Save current to history');click('Capture scenario A');
 value('2.00');click('Calculate private proposal');click('Capture scenario B');click('Compare saved scenarios');
 const comparison=screen.getByRole('table',{name:'Private A/B conversion scenarios'}).textContent;
 click('Export workspace JSON');const original=json().value,originalStorage=localStorage.getItem(key);
 const exported=importFixedFactorWorkspace(original);expect(exported.scenarios.A?.draft.value).toBe('1.00');
 value('3');click('Calculate private proposal');click('Restore history 1');expect((screen.getByLabelText('Conversion value') as HTMLInputElement).value).toBe('1.00');
 click('Clear scenarios');expect((screen.getByRole('button',{name:'Restore scenario A'}) as HTMLButtonElement).disabled).toBe(true);
 fireEvent.change(json(),{target:{value:original}});click('Recover verified workspace');click('Compare saved scenarios');
 expect(screen.getByRole('table',{name:'Private A/B conversion scenarios'}).textContent).toBe(comparison);
 const recoveredStorage=localStorage.getItem(key);expect(recoveredStorage).toBe(originalStorage);
 for(const bad of ['{unfinished',JSON.stringify({...exported,coreRevision:'other'}),JSON.stringify({...exported,scenarios:{...exported.scenarios,B:{...exported.scenarios.B,draft:{...definitions[0].example,value:'999'}}}})]){
  fireEvent.change(json(),{target:{value:bad}});click('Recover verified workspace');
  expect(json().value).toBe(bad);expect(localStorage.getItem(key)).toBe(recoveredStorage);
  expect(screen.getByRole('table',{name:'Private A/B conversion scenarios'}).textContent).toBe(comparison);
 }
 click('Restore scenario B');expect(exact()).toBe('13789.514586336723');
});
it('refuses comparison across private identities or output units without changing saved A',()=>{
 render(<PrivateFixedFactorReview/>);click('Calculate private proposal');click('Capture scenario A');
 fireEvent.change(screen.getByLabelText('Private converter'),{target:{value:definitions[1].engine.id}});click('Calculate private proposal');click('Capture scenario B');click('Compare saved scenarios');
 expect(screen.getByRole('alert').textContent).toContain('same private converter');expect(screen.queryByRole('table')).toBeNull();
 click('Restore scenario A');fireEvent.change(screen.getByLabelText('To unit'),{target:{value:'kpa'}});click('Calculate private proposal');click('Capture scenario B');click('Compare saved scenarios');
 expect(screen.getByRole('alert').textContent).toContain('same private converter');click('Restore scenario A');expect(exact()).toBe('6894.757293168362');
});
it('restores verified browser history after remount without converting its identity or raw text',()=>{
 const view=render(<PrivateFixedFactorReview/>);value('01.00');click('Calculate private proposal');click('Save current to history');
 fireEvent.change(screen.getByLabelText('Private converter'),{target:{value:definitions[2].engine.id}});value('2.00');click('Calculate private proposal');view.unmount();
 render(<PrivateFixedFactorReview/>);expect((screen.getByLabelText('Private converter') as HTMLSelectElement).value).toBe(definitions[2].engine.id);
 expect((screen.getByLabelText('Conversion value') as HTMLInputElement).value).toBe('2.00');click('Restore history 1');
 expect((screen.getByLabelText('Private converter') as HTMLSelectElement).value).toBe(definitions[0].engine.id);expect((screen.getByLabelText('Conversion value') as HTMLInputElement).value).toBe('01.00');
});
it('retains corrupt browser bytes for manual recovery and does not overwrite on mount',()=>{
 const bad='{unverified';localStorage.setItem(key,bad);render(<PrivateFixedFactorReview/>);
 expect(json().value).toBe(bad);expect(localStorage.getItem(key)).toBe(bad);expect(screen.getByRole('alert').textContent).toContain('Nothing was overwritten');
 click('Recover verified workspace');expect(localStorage.getItem(key)).toBe(bad);expect(screen.queryByTestId('private-factor-exact-result')).toBeNull();
});
it('keeps successful calculations exportable when browser storage refuses writes',()=>{
 vi.spyOn(Storage.prototype,'setItem').mockImplementation(()=>{throw new Error('quota');});render(<PrivateFixedFactorReview/>);
 click('Calculate private proposal');expect(exact()).toBe('6894.757293168362');expect(screen.getByText(/Browser storage is unavailable/)).toBeTruthy();
 click('Export workspace JSON');expect(importFixedFactorWorkspace(json().value).current?.artifact.snapshot.output.result).toBe(6894.757293168362);
});
it('downloads complete replayable JSON through the real export control',async()=>{
 vi.useFakeTimers({toFake:['setTimeout','clearTimeout']});let blob:NodeBlob|undefined;
 vi.stubGlobal('Blob',NodeBlob);vi.stubGlobal('URL',{createObjectURL:(value:NodeBlob)=>{blob=value;return 'blob:private-converter';},revokeObjectURL:vi.fn()});
 vi.spyOn(HTMLAnchorElement.prototype,'click').mockImplementation(()=>{});
 try{render(<PrivateFixedFactorReview/>);click('Calculate private proposal');click('Capture scenario A');click('Download workspace JSON');
  const exported=importFixedFactorWorkspace(await blob!.text());expect(exported.scenarios.A?.artifact.privateId).toBe(definitions[0].engine.id);
  expect(json().value+'\n').toBe(await blob!.text());
 }finally{vi.runOnlyPendingTimers();vi.useRealTimers();}
});
