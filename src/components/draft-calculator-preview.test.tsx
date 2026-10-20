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
