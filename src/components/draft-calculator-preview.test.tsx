// @vitest-environment jsdom
import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import {serializeCalculationCsv} from '@/lib/calculation-export';
import { DraftCalculatorPreview } from './draft-calculator-preview';
import { calculateDraftPreview,draftPreviewScenarioMetadata,draftPreviewDefinitions } from '@/calculators/final-framework/draft-preview-catalog';
afterEach(() => { cleanup(); localStorage.clear(); });
it.each(Array.from({ length: 14 }, (_, i) => i))('calculates example %i through private form', index => { const definition = draftPreviewDefinitions[index]; render(<DraftCalculatorPreview initialMasterId={definition.masterId}/>); fireEvent.click(screen.getByRole('button', { name: 'Calculate' })); expect(document.querySelector('.result-box')).toBeTruthy(); });
it('invalidates current capture on edit and recovers', () => { render(<DraftCalculatorPreview />); fireEvent.click(screen.getByRole('button', { name: 'Calculate' })); const input = document.querySelector('input')!; fireEvent.change(input, { target: { value: '' } }); expect(document.querySelector('.result-box')).toBeNull(); fireEvent.click(screen.getByRole('button', { name: 'Calculate' })); expect(screen.getAllByRole('alert').length).toBeGreaterThan(0); fireEvent.click(screen.getByRole('button', { name: 'Load example' })); fireEvent.click(screen.getByRole('button', { name: 'Calculate' })); expect(document.querySelector('.result-box')).toBeTruthy(); });
it('retains a valid capture after download failure and isolates owner changes', () => { const download = vi.fn(() => { throw Error('blocked'); }); const view = render(<DraftCalculatorPreview ownerScope="alice" download={download}/>); fireEvent.change(screen.getByLabelText('Preview plan'), { target: { value: 'pro' } }); fireEvent.click(screen.getByRole('button', { name: 'Calculate' })); fireEvent.click(screen.getByRole('button', { name: 'Export calculation JSON' })); expect(screen.getByRole('alert').textContent).toMatch(/download/i); expect(document.querySelector('.result-box')).toBeTruthy(); view.rerender(<DraftCalculatorPreview ownerScope="bob" download={download}/>); expect(document.querySelector('.result-box')).toBeNull(); });
it('gates exports and scenarios using preview plan', () => { render(<DraftCalculatorPreview />); fireEvent.click(screen.getByRole('button', { name: 'Calculate' })); expect((screen.getByRole('button', { name: 'Export calculation JSON' }) as HTMLButtonElement).disabled).toBe(true); fireEvent.change(screen.getByLabelText('Preview plan'), { target: { value: 'business' } }); expect((screen.getByRole('button', { name: 'Export calculation JSON' }) as HTMLButtonElement).disabled).toBe(false); });
it('keeps local history across invalid edits while separating reviewers', () => { const view = render(<DraftCalculatorPreview ownerScope="reviewer-a"/>); fireEvent.click(screen.getByRole('button', { name: 'Calculate' })); fireEvent.click(screen.getByRole('button', { name: 'Retain snapshot locally' })); fireEvent.change(screen.getByLabelText('Left decimal'), { target: { value: '' } }); fireEvent.click(screen.getByRole('button', { name: 'Reopen saved snapshot' })); expect((screen.getByLabelText('Left decimal') as HTMLInputElement).value).toBe('0.1'); expect(document.querySelector('.result-box')).toBeTruthy(); view.rerender(<DraftCalculatorPreview ownerScope="reviewer-b"/>); fireEvent.click(screen.getByRole('button', { name: 'Reopen saved snapshot' })); expect(document.querySelector('.result-box')).toBeNull(); expect(screen.getByText(/No saved snapshot/)).toBeTruthy(); });
it('supports caller-defined grade bands and explicit missing scores', () => { render(<DraftCalculatorPreview initialMasterId={517}/>); fireEvent.click(screen.getByRole('button', { name: 'Add grade band' })); fireEvent.change(screen.getByLabelText('Band 1 minimum score'), { target: { value: '0' } }); fireEvent.change(screen.getByLabelText('Band 1 label'), { target: { value: 'Caller band' } }); fireEvent.click(screen.getByRole('button', { name: 'Calculate' })); expect(document.querySelector('.result-box')).toBeTruthy(); expect(document.body.textContent).toContain('Caller band'); fireEvent.click(screen.getAllByLabelText('Missing score')[0]); fireEvent.click(screen.getByRole('button', { name: 'Calculate' })); expect(document.querySelector('.result-box')).toBeNull(); fireEvent.change(screen.getByLabelText('Missing assessment policy'), { target: { value: 'exclude' } }); fireEvent.click(screen.getByRole('button', { name: 'Calculate' })); expect(document.querySelector('.result-box')).toBeTruthy(); });
it('preserves draft and result when local storage is denied', () => { render(<DraftCalculatorPreview />); fireEvent.click(screen.getByRole('button', { name: 'Calculate' })); const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw Error('denied'); }); fireEvent.click(screen.getByRole('button', { name: 'Retain snapshot locally' })); expect(screen.getByRole('alert').textContent).toMatch(/storage unavailable/); expect(document.querySelector('.result-box')).toBeTruthy(); expect((screen.getByLabelText('Left decimal') as HTMLInputElement).value).toBe('0.1'); spy.mockRestore(); });
it('switches grade to unweighted without requiring manual weight removal',()=>{render(<DraftCalculatorPreview initialMasterId={517}/>);fireEvent.change(screen.getByLabelText('Weighting mode'),{target:{value:'unweighted'}});fireEvent.click(screen.getByRole('button',{name:'Calculate'}));expect(document.querySelector('.result-box')).toBeTruthy();});
it('supports removing the last optional grade band',()=>{render(<DraftCalculatorPreview initialMasterId={517}/>);fireEvent.click(screen.getByRole('button',{name:'Add grade band'}));fireEvent.click(screen.getByRole('button',{name:'Remove band 1'}));fireEvent.click(screen.getByRole('button',{name:'Calculate'}));expect(document.querySelector('.result-box')).toBeTruthy();});

it.each(draftPreviewDefinitions)('completes private workflow for $masterId across all plans',definition=>{
 const downloads:{name:string;content:string;mime:string}[]=[];
 const expected=calculateDraftPreview(definition.masterId,definition.initialInput);
 const metadata=draftPreviewScenarioMetadata(definition.masterId,expected);
 render(<DraftCalculatorPreview initialMasterId={definition.masterId} ownerScope="workflow-reviewer" download={(name,content,mime)=>downloads.push({name,content,mime})}/>);
 const click=(name:string)=>fireEvent.click(screen.getByRole('button',{name}));
 const plan=(value:string)=>fireEvent.change(screen.getByLabelText('Preview plan'),{target:{value}});
 click('Calculate');const freeResult=document.querySelector('.result-box')!.textContent;
 expect((screen.getByRole('button',{name:'Export calculation JSON'}) as HTMLButtonElement).disabled).toBe(true);
 fireEvent.click(screen.getByText('Your A/B/C scenarios'));
 expect((screen.getByRole('button',{name:'Capture baseline A'}) as HTMLButtonElement).disabled).toBe(true);
 click('Retain snapshot locally');
 for(const tier of ['pro','business']){
  plan(tier);expect(document.querySelector('.result-box')!.textContent).toBe(freeResult);
  click('Export calculation JSON');click('Export calculation CSV');
  const json=JSON.parse(downloads.at(-2)!.content);
  expect(json).toEqual(JSON.parse(JSON.stringify(expected.snapshot)));
  expect(downloads.at(-1)!.content).toBe(serializeCalculationCsv(expected.snapshot.input,expected.snapshot.output));
 }
 click('Capture baseline A');click('Capture scenario B');click('Capture scenario C');
 const outputTable=screen.getByRole('region',{name:'Captured engine outputs comparison'});
 expect(within(outputTable).getAllByRole('columnheader').map(cell=>cell.textContent)).toEqual(['Engine output field','A (baseline)','B','C']);
 for(const [key,context] of Object.entries(metadata.inputs)){
  const inputTable=screen.getByRole('region',{name:'Captured inputs comparison'});
  const row=within(inputTable).getAllByRole('rowheader').find(cell=>cell.textContent?.startsWith(context.label));
  expect(row,`input context for ${key}`).toBeTruthy();
  if(context.unit)expect(row!.textContent).toContain(`Unit: ${context.unit}`);
 }
 for(const [key,context] of Object.entries(metadata.outputs)){
  const row=within(outputTable).getAllByRole('rowheader').find(cell=>cell.textContent?.includes(`Raw field: ${key}`));
  expect(row).toBeTruthy();expect(row!.textContent).toContain(context.label);if(context.unit)expect(row!.textContent).toContain(`Unit: ${context.unit}`);
 }
 click('Export scenario set JSON');const set=JSON.parse(downloads.at(-1)!.content);
 expect(set.scenarios.map((scenario:{output:unknown})=>scenario.output)).toEqual(Array.from({length:3},()=>JSON.parse(JSON.stringify(expected.snapshot.output))));
 const firstInput=document.querySelector('form input')!;
 fireEvent.change(firstInput,{target:{value:''}});
 expect(document.querySelector('.result-box')).toBeNull();
 expect((screen.getByRole('button',{name:'Export calculation JSON'}) as HTMLButtonElement).disabled).toBe(true);
 expect((screen.getByRole('button',{name:'Replace baseline A'}) as HTMLButtonElement).disabled).toBe(true);
 expect(screen.getByRole('region',{name:'Captured engine outputs comparison'})).toBeTruthy();
 click('Export scenario set JSON');expect(JSON.parse(downloads.at(-1)!.content)).toEqual(set);
 click('Reopen saved snapshot');expect(document.querySelector('.result-box')!.textContent).toBe(freeResult);
 click('Export calculation JSON');expect(JSON.parse(downloads.at(-1)!.content).output).toEqual(JSON.parse(JSON.stringify(expected.snapshot.output)));
 plan('free');expect(document.querySelector('.result-box')!.textContent).toBe(freeResult);
 expect((screen.getByRole('button',{name:'Export calculation JSON'}) as HTMLButtonElement).disabled).toBe(true);
});
it('associates invalid grade-scale inputs with their error context',()=>{render(<DraftCalculatorPreview initialMasterId={517}/>);fireEvent.change(screen.getByLabelText('Minimum score'),{target:{value:''}});fireEvent.click(screen.getByRole('button',{name:'Calculate'}));const minimum=screen.getByLabelText('Minimum score');expect(minimum.getAttribute('aria-invalid')).toBe('true');expect(minimum.getAttribute('aria-describedby')).toBe('draft-517-scale-hint');expect(document.getElementById(minimum.getAttribute('aria-describedby')!)?.textContent).toContain('supported value');});

import { act, waitFor } from '@testing-library/react';
import type { DraftAuthenticatedPersistence } from '@/lib/draft-persistence-contract';
function account(overrides: Partial<DraftAuthenticatedPersistence> = {}): DraftAuthenticatedPersistence {
 return { ownerId: 'account-a', plan: 'pro', records: [], save: vi.fn(async () => ({id:'saved-a'})), reopen: vi.fn(async () => ({masterId:205,snapshot:calculateDraftPreview(205,getDefinition(205).initialInput).snapshot})), ...overrides };
}
function getDefinition(id:number){return draftPreviewDefinitions.find(item=>item.masterId===id)!;}
it.each(draftPreviewDefinitions.flatMap(definition => (['pro','business'] as const).map(plan => ({...definition,plan}))))('saves and reopens authenticated $masterId on $plan using captured math',async definition=>{
 const expected=calculateDraftPreview(definition.masterId,definition.initialInput);
 const persistence=account({plan:definition.plan,reopen:vi.fn(async()=>({masterId:definition.masterId,snapshot:expected.snapshot}))});
 const download=vi.fn();render(<DraftCalculatorPreview persistence={persistence} initialMasterId={definition.masterId} download={download}/>);
 expect(screen.queryByLabelText('Preview plan')).toBeNull();expect(screen.queryByText('Retain snapshot locally')).toBeNull();
 fireEvent.click(screen.getByRole('button',{name:'Calculate'}));fireEvent.click(screen.getByRole('button',{name:'Save to account'}));
 await waitFor(()=>expect(screen.getByText('Snapshot saved to your account.')).toBeTruthy());
 expect(persistence.save).toHaveBeenCalledWith(definition.masterId,expected.snapshot,expect.any(String));
 fireEvent.click(screen.getByRole('button',{name:'Load example'}));fireEvent.click(screen.getByRole('button',{name:'Reopen account snapshot'}));
 await waitFor(()=>expect(screen.getByText('Reopened saved account snapshot.')).toBeTruthy());
 fireEvent.click(screen.getByRole('button',{name:'Export calculation JSON'}));expect(JSON.parse(download.mock.calls[0][1])).toEqual(JSON.parse(JSON.stringify(expected.snapshot)));
});
it('locks concurrent account saves and retains the same request after uncertain failure',async()=>{
 let reject!:(reason:Error)=>void;const save=vi.fn().mockImplementationOnce(()=>new Promise((_resolve,no)=>{reject=no;})).mockResolvedValue({id:'retry'});
 render(<DraftCalculatorPreview persistence={account({save})}/>);fireEvent.click(screen.getByRole('button',{name:'Calculate'}));
 const button=screen.getByRole('button',{name:'Save to account'});fireEvent.click(button);fireEvent.click(button);expect(save).toHaveBeenCalledTimes(1);
 await act(async()=>reject(Error('uncertain')));expect(screen.getByRole('alert').textContent).toContain('not confirmed');expect(document.querySelector('.result-box')).toBeTruthy();
 fireEvent.click(button);await waitFor(()=>expect(save).toHaveBeenCalledTimes(2));expect(save.mock.calls[0][2]).toBe(save.mock.calls[1][2]);
});
it('does not overwrite edits when a reopen finishes late and rejects unsupported saved versions',async()=>{
 let resolve!:(value:unknown)=>void;
 const reference={id:'old',masterId:205,source:'history' as const,label:'Old capture',createdAt:'2026-10-20'};
 const reopen=vi.fn().mockImplementationOnce(()=>new Promise(yes=>{resolve=yes;})).mockResolvedValue({masterId:205,snapshot:{...calculateDraftPreview(205,getDefinition(205).initialInput).snapshot,calculatorVersion:999}});
 render(<DraftCalculatorPreview persistence={account({records:[reference],reopen})}/>);
 fireEvent.change(screen.getByLabelText('Saved account snapshot'),{target:{value:'history:old'}});fireEvent.click(screen.getByRole('button',{name:'Reopen account snapshot'}));
 fireEvent.change(screen.getByLabelText('Left decimal'),{target:{value:'7'}});
 await act(async()=>resolve({masterId:205,snapshot:calculateDraftPreview(205,getDefinition(205).initialInput).snapshot}));expect((screen.getByLabelText('Left decimal') as HTMLInputElement).value).toBe('7');expect(document.querySelector('.result-box')).toBeNull();
 fireEvent.click(screen.getByRole('button',{name:'Reopen account snapshot'}));await waitFor(()=>expect(screen.getByRole('alert').textContent).toContain('saved version'));expect((screen.getByLabelText('Left decimal') as HTMLInputElement).value).toBe('7');
});
it('resets account state immediately and revokes exports when authoritative plan changes',()=>{
 const persistence=account();const view=render(<DraftCalculatorPreview persistence={persistence}/>);fireEvent.click(screen.getByRole('button',{name:'Calculate'}));
 view.rerender(<DraftCalculatorPreview persistence={{...persistence,plan:'free'}}/>);expect((screen.getByRole('button',{name:'Export calculation JSON'}) as HTMLButtonElement).disabled).toBe(true);expect(document.querySelector('.result-box')).toBeTruthy();
 view.rerender(<DraftCalculatorPreview persistence={{...persistence,ownerId:'account-b'}}/>);expect(document.querySelector('.result-box')).toBeNull();
});
it('shows Free save limitations and preserves the capture after a failed account save',async()=>{
 render(<DraftCalculatorPreview persistence={account({plan:'free',save:vi.fn(async()=>{throw Error('atomic quota unavailable');})})}/>);
 fireEvent.click(screen.getByRole('button',{name:'Calculate'}));const before=document.querySelector('.result-box')!.textContent;
 fireEvent.click(screen.getByRole('button',{name:'Save to account'}));await waitFor(()=>expect(screen.getByRole('alert').textContent).toContain('not confirmed'));
 expect(document.querySelector('.result-box')!.textContent).toBe(before);expect(screen.getByText(/atomic quota enforcement/)).toBeTruthy();expect(document.activeElement).toBe(screen.getByRole('alert'));
});
it('ignores pending account responses after account and calculator switches',async()=>{
 let resolve!:(value:{id:string})=>void;const persistence=account({save:vi.fn(()=>new Promise<{id:string}>(yes=>{resolve=yes;}))});
 const view=render(<DraftCalculatorPreview persistence={persistence}/>);fireEvent.click(screen.getByRole('button',{name:'Calculate'}));fireEvent.click(screen.getByRole('button',{name:'Save to account'}));
 view.rerender(<DraftCalculatorPreview persistence={{...persistence,ownerId:'different'}}/>);await act(async()=>resolve({id:'old-owner-save'}));expect(screen.queryByText('Snapshot saved to your account.')).toBeNull();expect(screen.getAllByRole('option').some(option=>option.getAttribute('value')==='old-owner-save')).toBe(false);
 fireEvent.click(screen.getByRole('button',{name:'Calculate'}));fireEvent.click(screen.getByRole('button',{name:'Save to account'}));fireEvent.change(screen.getByLabelText('DRAFT calculator'),{target:{value:'206'}});await act(async()=>resolve({id:'old-master-save'}));expect(screen.queryByText('Snapshot saved to your account.')).toBeNull();expect(document.querySelector('.result-box')).toBeNull();
});
it('does not announce a stale save after the authoritative plan changes',async()=>{
 let resolve!:(value:{id:string})=>void;const persistence=account({save:vi.fn(()=>new Promise<{id:string}>(yes=>{resolve=yes;}))});
 const view=render(<DraftCalculatorPreview persistence={persistence}/>);fireEvent.click(screen.getByRole('button',{name:'Calculate'}));fireEvent.click(screen.getByRole('button',{name:'Save to account'}));
 view.rerender(<DraftCalculatorPreview persistence={{...persistence,plan:'free'}}/>);await act(async()=>resolve({id:'pre-downgrade'}));expect(screen.queryByText('Snapshot saved to your account.')).toBeNull();expect((screen.getByRole('button',{name:'Export calculation JSON'}) as HTMLButtonElement).disabled).toBe(true);
});
it('selects an owned deep-linked snapshot without automatically reopening and fails closed for unknown references',async()=>{
 const reference={id:'linked',masterId:205,source:'history' as const,label:'Linked capture',createdAt:'2026-10-20'};
 const persistence=account({records:[reference],initialRecordId:'linked'});const view=render(<DraftCalculatorPreview persistence={persistence}/>);
 expect((screen.getByLabelText('Saved account snapshot') as HTMLSelectElement).value).toBe('history:linked');expect(persistence.reopen).not.toHaveBeenCalled();
 fireEvent.click(screen.getByRole('button',{name:'Reopen account snapshot'}));await waitFor(()=>expect(persistence.reopen).toHaveBeenCalledWith(reference));
 view.rerender(<DraftCalculatorPreview persistence={{...persistence,ownerId:'unknown-reference-account',initialRecordId:'unknown'}}/>);
 expect((screen.getByRole('button',{name:'Reopen account snapshot'}) as HTMLButtonElement).disabled).toBe(true);
});
it('preserves history and scenario references with the same UUID as separate selections',async()=>{
 const history={id:'shared-uuid',masterId:205,source:'history' as const,label:'History copy',createdAt:'2026-10-20'};
 const scenario={...history,source:'scenario' as const,label:'Scenario copy'};
 const reopen=vi.fn(async (record:typeof history|typeof scenario)=>({masterId:205,snapshot:calculateDraftPreview(205,{...getDefinition(205).initialInput,left:record.source==='scenario'?'8':'3'}).snapshot}));
 const persistence=account({records:[history,scenario],reopen});render(<DraftCalculatorPreview persistence={persistence}/>);
 const selector=screen.getByLabelText('Saved account snapshot');
 const option=within(selector).getByRole('option',{name:/Scenario copy/});
 fireEvent.change(selector,{target:{value:option.getAttribute('value')}});fireEvent.click(screen.getByRole('button',{name:'Reopen account snapshot'}));
 await waitFor(()=>expect((screen.getByLabelText('Left decimal') as HTMLInputElement).value).toBe('8'));expect(persistence.reopen).toHaveBeenCalledWith(scenario);
 const historyOption=within(selector).getByRole('option',{name:/History copy/});fireEvent.change(selector,{target:{value:historyOption.getAttribute('value')}});fireEvent.click(screen.getByRole('button',{name:'Reopen account snapshot'}));
 await waitFor(()=>expect((screen.getByLabelText('Left decimal') as HTMLInputElement).value).toBe('3'));expect(persistence.reopen).toHaveBeenLastCalledWith(history);
});
it('requires a source for ambiguous deep-linked IDs and selects an explicit scenario source',()=>{
 const history={id:'same',masterId:205,source:'history' as const,label:'History',createdAt:'2026-10-20'};const scenario={...history,source:'scenario' as const,label:'Scenario'};
 const persistence=account({records:[history,scenario],initialRecordId:'same'});const view=render(<DraftCalculatorPreview persistence={persistence}/>);
 expect((screen.getByRole('button',{name:'Reopen account snapshot'}) as HTMLButtonElement).disabled).toBe(true);
 view.rerender(<DraftCalculatorPreview persistence={{...persistence,ownerId:'explicit-source',initialRecordSource:'scenario'}}/>);
 expect((screen.getByLabelText('Saved account snapshot') as HTMLSelectElement).value).toBe('scenario:same');expect(persistence.reopen).not.toHaveBeenCalled();
});
