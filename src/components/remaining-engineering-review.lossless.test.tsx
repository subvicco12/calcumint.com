// @vitest-environment jsdom
import {afterEach,describe,expect,it,vi} from 'vitest';
import {Blob as NodeBlob} from 'node:buffer';
import {cleanup,fireEvent,render,screen} from '@testing-library/react';
import {RemainingEngineeringReview} from './remaining-engineering-review';
import {remainingExamples,exportRemainingContract} from '../calculators/remaining-contracts';
afterEach(()=>{if(vi.isFakeTimers()){vi.runOnlyPendingTimers();vi.useRealTimers();}cleanup();vi.restoreAllMocks();vi.unstubAllGlobals();});
const click=(name:string)=>fireEvent.click(screen.getByRole('button',{name}));
const change=(label:string,value:string)=>fireEvent.change(screen.getByLabelText(label),{target:{value}});
const lossy=(text:string)=>text.replace(/-?\d+(?:\.\d+)?(?=[,}\]])/,n=>Number(n)===0?'1e-400':n+(n.includes('.')?'00000000000000000001':'.00000000000000000001'));
describe('51 remaining private review numeric text boundaries',()=>{
 it.each(Object.keys(remainingExamples).map(Number))('rejects changed raw numeric digits before calculating #%i',id=>{
  render(<RemainingEngineeringReview/>);change('Find catalog identity',String(id));
  click('Calculate');expect(screen.getByTestId('remaining-result')).toBeTruthy();
  const canonical=JSON.stringify(remainingExamples[id]),draft=lossy(canonical);
  expect(draft).not.toBe(canonical);expect(JSON.parse(draft)).toEqual(JSON.parse(canonical));
  change('Scenario JSON',draft);click('Calculate');
  expect(screen.queryByTestId('remaining-result')).toBeNull();expect(screen.getByRole('alert')).toBeTruthy();
  expect((screen.getByLabelText('Scenario JSON') as HTMLTextAreaElement).value).toBe(draft);
  expect(screen.queryByRole('button',{name:'Export JSON'})).toBeNull();
 });
 it.each(['masterId','schemaVersion','calculatorVersion'])('rejects rounded %s tokens before immutable replay',field=>{
  const snapshot=exportRemainingContract(477,remainingExamples[477]),text=JSON.stringify(snapshot);
  const draft=text.replace(new RegExp('("'+field+'":)(\\d+)'),(_,key,n)=>key+n+'.00000000000000001');
  expect(JSON.parse(draft)).toEqual(snapshot);
  render(<RemainingEngineeringReview/>);change('Snapshot JSON',draft);click('Verify and restore snapshot');
  expect(screen.queryByTestId('remaining-result')).toBeNull();expect(screen.getByRole('alert')).toBeTruthy();
 });
 it('exports actual snapshot bytes and restores quoted digits and canonical historical subnormals',async()=>{
  vi.useFakeTimers({toFake:['setTimeout','clearTimeout']});
  let artifact:NodeBlob|undefined;
  vi.stubGlobal('Blob',NodeBlob);vi.stubGlobal('URL',{createObjectURL:(b:NodeBlob)=>{artifact=b;return 'blob:shared';},revokeObjectURL:()=>{}});
  vi.spyOn(HTMLAnchorElement.prototype,'click').mockImplementation(()=>{});
  render(<RemainingEngineeringReview/>);change('Find catalog identity','477');click('Calculate');click('Export JSON');
  const bytes=await artifact!.text();vi.advanceTimersByTime(1000);change('Snapshot JSON',bytes);click('Verify and restore snapshot');
  expect(screen.getByTestId('remaining-result').textContent).toBe('20');
  const historical=exportRemainingContract(477,{...remainingExamples[477],currency:'9007199254740993',energyKwh:5e-324,tariffPerKwh:1});
  change('Snapshot JSON',JSON.stringify(historical));click('Verify and restore snapshot');
  expect(screen.queryByRole('alert')).toBeNull();
  expect((screen.getByLabelText('Scenario JSON') as HTMLTextAreaElement).value).toContain('5e-324');
  expect((screen.getByLabelText('Scenario JSON') as HTMLTextAreaElement).value).toContain('"9007199254740993"');
 });
 it('keeps saved history, recovers canonical artifacts and retains plan math after a rejected draft',()=>{
  render(<RemainingEngineeringReview/>);change('Find catalog identity','477');click('Calculate');
  const output=screen.getByTestId('remaining-output').textContent;click('Save scenario');
  change('Scenario JSON',lossy(JSON.stringify(remainingExamples[477])));click('Calculate');
  expect(screen.queryByTestId('remaining-result')).toBeNull();
  expect(screen.getByTestId('remaining-history').textContent).toContain('20');
  click('Restore scenario 1');expect(screen.getByTestId('remaining-output').textContent).toBe(output);
  for(const plan of ['pro','business','free']){change('Review plan',plan);click('Calculate');expect(screen.getByTestId('remaining-output').textContent).toBe(output);}
  const canonical=JSON.stringify(exportRemainingContract(477,remainingExamples[477]));
  change('Snapshot JSON',canonical);click('Verify and restore snapshot');
  expect(screen.queryByRole('alert')).toBeNull();expect(screen.getByTestId('remaining-result').textContent).toBe('20');
 });
});
