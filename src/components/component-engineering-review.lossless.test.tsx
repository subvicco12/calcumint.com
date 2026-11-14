// @vitest-environment jsdom
import {afterEach,describe,expect,it,vi} from 'vitest';
import {Blob as NodeBlob} from 'node:buffer';
import {cleanup,fireEvent,render,screen} from '@testing-library/react';
import {ComponentEngineeringReview} from './component-engineering-review';
import {componentExamples,exportComponentContract} from '../calculators/component-contracts';
afterEach(()=>{if(vi.isFakeTimers()){vi.runOnlyPendingTimers();vi.useRealTimers();}cleanup();vi.restoreAllMocks();vi.unstubAllGlobals();});
const click=(name:string)=>fireEvent.click(screen.getByRole('button',{name}));
const change=(label:string,value:string)=>fireEvent.change(screen.getByLabelText(label),{target:{value}});
const lossy=(text:string)=>text.replace(/-?\d+(?:\.\d+)?(?=[,}\]])/,n=>Number(n)===0?'1e-400':n+(n.includes('.')?'00000000000000000001':'.00000000000000000001'));
describe('25 component private review numeric text boundaries',()=>{
 it.each(Object.keys(componentExamples).map(Number))('rejects changed raw numeric digits before calculating #%i',id=>{
  render(<ComponentEngineeringReview/>);change('Find catalog identity',String(id));
  click('Calculate');expect(screen.getByTestId('component-result')).toBeTruthy();
  const canonical=JSON.stringify(componentExamples[id]),draft=lossy(canonical);
  expect(draft).not.toBe(canonical);expect(JSON.parse(draft)).toEqual(JSON.parse(canonical));
  change('Scenario JSON',draft);click('Calculate');
  expect(screen.queryByTestId('component-result')).toBeNull();expect(screen.getByRole('alert')).toBeTruthy();
  expect((screen.getByLabelText('Scenario JSON') as HTMLTextAreaElement).value).toBe(draft);
  expect(screen.queryByRole('button',{name:'Export JSON'})).toBeNull();
 });
 it.each(['masterId','schemaVersion','calculatorVersion'])('rejects rounded %s tokens before immutable replay',field=>{
  const snapshot=exportComponentContract(3,componentExamples[3]),text=JSON.stringify(snapshot);
  const draft=text.replace(new RegExp('("'+field+'":)(\\d+)'),(_,key,n)=>key+n+'.00000000000000001');
  expect(JSON.parse(draft)).toEqual(snapshot);
  render(<ComponentEngineeringReview/>);change('Snapshot JSON',draft);click('Verify and restore snapshot');
  expect(screen.queryByTestId('component-result')).toBeNull();expect(screen.getByRole('alert')).toBeTruthy();
 });
 it('preserves detached history, canonical downloads, quoted digits and all-plan math after refusal',async()=>{
  vi.useFakeTimers({toFake:['setTimeout','clearTimeout']});
  let artifact:NodeBlob|undefined;
  const revoke=vi.fn();
  vi.stubGlobal('Blob',NodeBlob);vi.stubGlobal('URL',{createObjectURL:(b:NodeBlob)=>{artifact=b;return 'blob:component';},revokeObjectURL:revoke});
  vi.spyOn(HTMLAnchorElement.prototype,'click').mockImplementation(()=>{});
  render(<ComponentEngineeringReview/>);click('Calculate');
  const output=screen.getByTestId('component-output').textContent;click('Save scenario');click('Export JSON');
  const bytes=await artifact!.text();expect(revoke).not.toHaveBeenCalled();vi.advanceTimersByTime(1000);expect(revoke).toHaveBeenCalledExactlyOnceWith('blob:component');expect(JSON.parse(bytes)).toEqual(exportComponentContract(3,componentExamples[3]));
  change('Scenario JSON',lossy(JSON.stringify(componentExamples[3])));click('Calculate');
  expect(screen.queryByTestId('component-result')).toBeNull();
  click('Restore scenario 1');expect(screen.getByTestId('component-output').textContent).toBe(output);
  for(const plan of ['pro','business','free']){change('Review plan',plan);click('Calculate');expect(screen.getByTestId('component-output').textContent).toBe(output);}
  change('Snapshot JSON',bytes);click('Verify and restore snapshot');expect(screen.queryByRole('alert')).toBeNull();
  const historical=exportComponentContract(3,{...componentExamples[3],currency:'9007199254740993',extraMonthlyPayment:5e-324});
  change('Snapshot JSON',JSON.stringify(historical));click('Verify and restore snapshot');expect(screen.queryByRole('alert')).toBeNull();
  const restored=(screen.getByLabelText('Scenario JSON') as HTMLTextAreaElement).value;
  expect(restored).toContain('5e-324');expect(restored).toContain('"9007199254740993"');
  expect(screen.getByTestId('component-history').querySelectorAll('li')).toHaveLength(1);
 });
});
