// @vitest-environment jsdom
import {cleanup,fireEvent,render,screen} from '@testing-library/react';import {afterEach,expect,it,vi} from 'vitest';import {CalculatorScenarioWorkspace} from './calculator-scenario-workspace';import {createCalculationSnapshot} from '@/lib/calculation-snapshot';
afterEach(cleanup);const snapshot=createCalculationSnapshot({calculatorSlug:'sip-calculator',calculatorVersion:1,input:{monthlyInvestment:1,months:1000},output:{value:.001,rows:[{period:1,value:0}]}});
it.each(['pro','business'] as const)('captures A/B/C actual values and exports full ordered snapshots on %s',plan=>{const download=vi.fn();const view=render(<CalculatorScenarioWorkspace plan={plan} snapshot={snapshot} download={download}/>);fireEvent.click(screen.getByRole('button',{name:'Capture baseline A'}));view.rerender(<CalculatorScenarioWorkspace plan={plan} snapshot={{...snapshot,input:{monthlyInvestment:2},output:{value:.002}}} download={download}/>);fireEvent.click(screen.getByRole('button',{name:'Capture scenario B'}));expect(screen.getByRole('table',{name:'Captured engine outputs'}).textContent).toContain('0.001');fireEvent.click(screen.getByRole('button',{name:'Export scenario set JSON'}));const payload=JSON.parse(download.mock.calls[0][1]);expect(payload.scenarios[0].input).toEqual(snapshot.input);expect(payload.scenarios[0].output).toEqual(snapshot.output);expect(payload.scenarios[1].output.value).toBe(.002);});
it('locks Free capture and blocks invalid replacement while retaining earlier snapshots',()=>{const download=vi.fn();const view=render(<CalculatorScenarioWorkspace plan="free" snapshot={snapshot} download={download}/>);expect((screen.getByRole('button',{name:'Capture baseline A'}) as HTMLButtonElement).disabled).toBe(true);view.rerender(<CalculatorScenarioWorkspace plan="pro" snapshot={snapshot} download={download}/>);fireEvent.click(screen.getByRole('button',{name:'Capture baseline A'}));view.rerender(<CalculatorScenarioWorkspace plan="pro" snapshot={null} download={download}/>);expect((screen.getByRole('button',{name:'Replace baseline A'}) as HTMLButtonElement).disabled).toBe(true);expect(screen.getByRole('table',{name:'Captured engine outputs'}).textContent).toContain('0.001');fireEvent.click(screen.getByRole('button',{name:'Clear scenario set'}));expect(screen.queryByRole('table')).toBeNull();});

it('replaces baseline without recalculating alternatives and exposes bounded exact field pages',()=>{const download=vi.fn();const output=Object.fromEntries(Array.from({length:51},(_,i)=>[`field${i}`,i===0?-0:i===1?-1e-12:i]));const view=render(<CalculatorScenarioWorkspace plan="pro" snapshot={{...snapshot,output}} download={download}/>);fireEvent.click(screen.getByRole('button',{name:'Capture baseline A'}));fireEvent.click(screen.getByRole('button',{name:'Capture scenario B'}));expect(screen.getByRole('table',{name:'Captured engine outputs'}).querySelectorAll('tbody tr')).toHaveLength(25);fireEvent.click(screen.getByRole('button',{name:'Next scenario output page'}));expect(screen.getByRole('table',{name:'Captured engine outputs'}).textContent).toContain('field25');view.rerender(<CalculatorScenarioWorkspace plan="pro" snapshot={{...snapshot,output:{value:0}}} download={download}/>);fireEvent.click(screen.getByRole('button',{name:'Replace baseline A'}));fireEvent.click(screen.getByRole('button',{name:'Export scenario set JSON'}));const payload=JSON.parse(download.mock.calls[0][1]);expect(payload.scenarios[0].output).toEqual({value:0});expect(payload.scenarios[1].output.field1).toBe(-1e-12);expect(screen.getByRole('table',{name:'Captured engine outputs'}).textContent).toContain('Not present in this snapshot');view.rerender(<CalculatorScenarioWorkspace plan="free" snapshot={snapshot} download={download}/>);expect(screen.queryByRole('button',{name:'Export scenario set JSON'})).toBeNull();expect(screen.queryByRole('table')).toBeNull();});

it('shows explicit labels/units with exact signed precision and treats different units as unavailable comparisons',()=>{const download=vi.fn();const metadata={schemaVersion:1 as const,calculatorSlug:snapshot.calculatorSlug,calculatorVersion:1,inputs:{},outputs:{value:{label:'Authoritative value',unit:'kg'}}};const current={...snapshot,output:{value:-1e-12,zero:-0,nullable:null}};const view=render(<CalculatorScenarioWorkspace plan="pro" snapshot={current} displayMetadata={metadata} download={download}/>);fireEvent.click(screen.getByRole('button',{name:'Capture baseline A'}));expect(screen.getByRole('table',{name:'Captured engine outputs'}).textContent).toContain('Authoritative value');expect(screen.getByRole('table',{name:'Captured engine outputs'}).textContent).toContain('-1e-12');expect(screen.getByRole('table',{name:'Captured engine outputs'}).textContent).toContain('Unit: kg');view.rerender(<CalculatorScenarioWorkspace plan="pro" snapshot={{...current,output:{value:0}}} displayMetadata={{...metadata,outputs:{value:{label:'Authoritative value',unit:'lb'}}}} download={download}/>);fireEvent.click(screen.getByRole('button',{name:'Capture scenario B'}));expect(screen.getByRole('alert').textContent).toContain('No unit conversion');expect(screen.getByRole('table',{name:'Captured engine outputs'}).textContent).toContain('Display context differs');fireEvent.click(screen.getByRole('button',{name:'Export scenario set JSON'}));const exported=JSON.parse(download.mock.calls[0][1]);expect(exported.scenarios[0].displayMetadata.outputs.value.unit).toBe('kg');expect(exported.scenarios[1].displayMetadata.outputs.value.unit).toBe('lb');expect(exported.scenarios[0].output.value).toBe(-1e-12);expect(exported.scenarios[1].output.value).toBe(0);});
it('blocks malformed or mismatched display metadata and preserves earlier valid captures',()=>{const download=vi.fn();const metadata={schemaVersion:1 as const,calculatorSlug:snapshot.calculatorSlug,calculatorVersion:1,inputs:{},outputs:{value:{label:'Future value'}}};const view=render(<CalculatorScenarioWorkspace plan="pro" snapshot={snapshot} displayMetadata={metadata} download={download}/>);fireEvent.click(screen.getByRole('button',{name:'Capture baseline A'}));view.rerender(<CalculatorScenarioWorkspace plan="pro" snapshot={snapshot} displayMetadata={{...metadata,calculatorVersion:2}} download={download}/>);fireEvent.click(screen.getByRole('button',{name:'Replace baseline A'}));expect(screen.getByRole('alert').textContent).toContain('Earlier valid snapshots');fireEvent.click(screen.getByRole('button',{name:'Export scenario set JSON'}));expect(JSON.parse(download.mock.calls[0][1]).scenarios[0].displayMetadata.calculatorVersion).toBe(1);view.rerender(<CalculatorScenarioWorkspace plan="pro" snapshot={snapshot} displayMetadata={metadata} download={download}/>);fireEvent.click(screen.getByRole('button',{name:'Replace baseline A'}));expect(screen.queryByRole('alert')).toBeNull();});

it('shows explicit empty-record states without inventing zero fields',()=>{render(<CalculatorScenarioWorkspace plan="pro" snapshot={{...snapshot,input:{},output:{}}} download={vi.fn()}/>);fireEvent.click(screen.getByRole('button',{name:'Capture baseline A'}));expect(screen.getByText('No engine output fields were captured.')).toBeTruthy();expect(screen.getByText('No input fields were captured.')).toBeTruthy();expect(screen.queryByRole('table')).toBeNull();});

it('previews edited eligible percentage inputs without changing captured history or exports',()=>{
 const download=vi.fn();
 const percentage=createCalculationSnapshot({calculatorSlug:'percentage-of-value-calculator',calculatorVersion:1,input:{percentage:20,value:250},output:{result:50}});
 render(<CalculatorScenarioWorkspace plan="pro" snapshot={percentage} download={download}/>);
 fireEvent.click(screen.getByRole('button',{name:'Capture baseline A'}));
 fireEvent.change(screen.getByRole('spinbutton',{name:'percentage'}),{target:{value:'30'}});
 fireEvent.click(screen.getByRole('button',{name:'Preview edited scenario A'}));
 expect(screen.getByText(/Re-evaluation preview for scenario A/)).toBeTruthy();
 expect(screen.getByText(/"result": 75/)).toBeTruthy();
 expect(screen.getByRole('table',{name:'Captured engine outputs'}).textContent).toContain('50');
 fireEvent.click(screen.getByRole('button',{name:'Export scenario set JSON'}));
 expect(JSON.parse(download.mock.calls[0][1]).scenarios[0].output).toEqual({result:50});
 fireEvent.change(screen.getByRole('spinbutton',{name:'percentage'}),{target:{value:''}});
 expect(screen.queryByText(/Re-evaluation preview for scenario A/)).toBeNull();
 fireEvent.click(screen.getByRole('button',{name:'Preview edited scenario A'}));
 expect(screen.getByRole('alert').textContent).toContain('Historical captures remain unchanged');
});
it('does not offer what-if controls for excluded mortgage captures',()=>{
 const mortgage=createCalculationSnapshot({calculatorSlug:'mortgage-calculator',calculatorVersion:1,input:{principal:100,termMonths:12},output:{monthlyPayment:10}});
 render(<CalculatorScenarioWorkspace plan="pro" snapshot={mortgage} download={vi.fn()}/>);
 fireEvent.click(screen.getByRole('button',{name:'Capture baseline A'}));
 expect(screen.queryByRole('button',{name:/Preview edited scenario/})).toBeNull();
});

it('previews certified unit conversion with complete editable inputs while preserving original evidence',()=>{
 const download=vi.fn();
 const conversion=createCalculationSnapshot({calculatorSlug:'unit-conversion-calculator',calculatorVersion:1,input:{value:1,fromUnit:'mi',toUnit:'km'},output:{result:1.609344}});
 render(<CalculatorScenarioWorkspace plan="pro" snapshot={conversion} download={download}/>);
 fireEvent.click(screen.getByRole('button',{name:'Capture baseline A'}));
 fireEvent.change(screen.getByRole('spinbutton',{name:'value'}),{target:{value:'2'}});
 fireEvent.click(screen.getByRole('button',{name:'Preview edited scenario A'}));
 expect(screen.getByText(/"result": 3.218688/)).toBeTruthy();
 fireEvent.click(screen.getByRole('button',{name:'Export scenario set JSON'}));
 expect(JSON.parse(download.mock.calls[0][1]).scenarios[0].output).toEqual({result:1.609344});
 fireEvent.change(screen.getByRole('textbox',{name:'toUnit'}),{target:{value:'kg'}});
 fireEvent.click(screen.getByRole('button',{name:'Preview edited scenario A'}));
 expect(screen.getByRole('alert').textContent).toContain('Historical captures remain unchanged');
});

it('keeps scenario editing unavailable on Free and supports keyboard-accessible labeled inputs on paid plans',()=>{
 const percentage=createCalculationSnapshot({calculatorSlug:'percentage-of-value-calculator',calculatorVersion:1,input:{percentage:20,value:250},output:{result:50}});
 const download=vi.fn();
 const view=render(<CalculatorScenarioWorkspace plan="free" snapshot={percentage} download={download}/>);
 expect(screen.queryByRole('button',{name:/Preview edited scenario/})).toBeNull();
 expect((screen.getByRole('button',{name:'Capture baseline A'}) as HTMLButtonElement).disabled).toBe(true);
 view.rerender(<CalculatorScenarioWorkspace plan="business" snapshot={percentage} download={download}/>);
 fireEvent.click(screen.getByRole('button',{name:'Capture baseline A'}));
 const field=screen.getByRole('spinbutton',{name:'percentage'}) as HTMLInputElement;
 expect(field.labels?.length).toBeGreaterThan(0);
 expect((screen.getByRole('button',{name:'Preview edited scenario A'}) as HTMLButtonElement).disabled).toBe(false);
 fireEvent.change(field,{target:{value:'40'}});
 fireEvent.click(screen.getByRole('button',{name:'Preview edited scenario A'}));
 expect(screen.getByText(/"result": 100/)).toBeTruthy();
 view.rerender(<CalculatorScenarioWorkspace plan="free" snapshot={percentage} download={download}/>);
 expect(screen.queryByRole('button',{name:/Preview edited scenario/})).toBeNull();
 expect(screen.queryByText(/Re-evaluation preview for scenario A/)).toBeNull();
});

it('groups eligible what-if inputs in a named scenario fieldset',()=>{
 const percentage=createCalculationSnapshot({calculatorSlug:'percentage-of-value-calculator',calculatorVersion:1,input:{percentage:20,value:250},output:{result:50}});
 render(<CalculatorScenarioWorkspace plan="pro" snapshot={percentage} download={vi.fn()}/>);
 fireEvent.click(screen.getByRole('button',{name:'Capture baseline A'}));
 const group=screen.getByRole('group',{name:/What-if preview for scenario A/});
 expect(group.querySelectorAll('input[type="number"]')).toHaveLength(2);
 expect(group.textContent).toContain('original capture stays unchanged');
 expect(screen.getByRole('spinbutton',{name:'percentage'})).toBeTruthy();
});

it('keeps historical JSON and CSV exports identical after what-if preview and invalid edits',()=>{
 const download=vi.fn();
 const percentage=createCalculationSnapshot({calculatorSlug:'percentage-of-value-calculator',calculatorVersion:1,input:{percentage:20,value:250},output:{result:50}});
 render(<CalculatorScenarioWorkspace plan="business" snapshot={percentage} download={download}/>);
 fireEvent.click(screen.getByRole('button',{name:'Capture baseline A'}));
 fireEvent.click(screen.getByRole('button',{name:'Export scenario set JSON'}));
 fireEvent.click(screen.getByRole('button',{name:'Export scenario set CSV'}));
 const originalJson=download.mock.calls[0][1],originalCsv=download.mock.calls[1][1];
 fireEvent.change(screen.getByRole('spinbutton',{name:'percentage'}),{target:{value:'40'}});
 fireEvent.click(screen.getByRole('button',{name:'Preview edited scenario A'}));
 expect(screen.getByText(/"result": 100/)).toBeTruthy();
 fireEvent.click(screen.getByRole('button',{name:'Export scenario set JSON'}));
 fireEvent.click(screen.getByRole('button',{name:'Export scenario set CSV'}));
 expect(download.mock.calls[2][1]).toBe(originalJson);
 expect(download.mock.calls[3][1]).toBe(originalCsv);
 fireEvent.change(screen.getByRole('spinbutton',{name:'percentage'}),{target:{value:''}});
 fireEvent.click(screen.getByRole('button',{name:'Preview edited scenario A'}));
 expect(screen.getByRole('alert').textContent).toContain('Historical captures remain unchanged');
 fireEvent.click(screen.getByRole('button',{name:'Export scenario set JSON'}));
 fireEvent.click(screen.getByRole('button',{name:'Export scenario set CSV'}));
 expect(download.mock.calls[4][1]).toBe(originalJson);
 expect(download.mock.calls[5][1]).toBe(originalCsv);
});

it('previews deterministic sensitivity in the shared workspace without changing captured JSON or CSV',()=>{
 const download=vi.fn();
 const percentage=createCalculationSnapshot({calculatorSlug:'percentage-of-value-calculator',calculatorVersion:1,input:{percentage:20,value:250},output:{result:50}});
 render(<CalculatorScenarioWorkspace plan="pro" snapshot={percentage} download={download}/>);
 fireEvent.click(screen.getByRole('button',{name:'Capture baseline A'}));
 fireEvent.click(screen.getByRole('button',{name:'Export scenario set JSON'}));
 fireEvent.click(screen.getByRole('button',{name:'Export scenario set CSV'}));
 const json=download.mock.calls[0][1],csv=download.mock.calls[1][1];
 fireEvent.change(screen.getByRole('textbox',{name:/Candidate values/}),{target:{value:'10, 20, 30'}});
 fireEvent.click(screen.getByRole('button',{name:'Preview sensitivity A'}));
 const table=screen.getByRole('table',{name:/Sensitivity preview for scenario A/});
 expect(screen.getByRole('region',{name:'Sensitivity preview'}).getAttribute('tabindex')).toBe('0');
 expect(table.textContent).toContain('Baseline delta');
 expect(table.textContent).toContain('25');
 expect(table.textContent).toContain('50');
 expect(table.textContent).toContain('75');
 fireEvent.click(screen.getByRole('button',{name:'Export scenario set JSON'}));
 fireEvent.click(screen.getByRole('button',{name:'Export scenario set CSV'}));
 expect(download.mock.calls[2][1]).toBe(json);
 expect(download.mock.calls[3][1]).toBe(csv);
 fireEvent.change(screen.getByRole('textbox',{name:/Candidate values/}),{target:{value:'not-a-number'}});
 fireEvent.click(screen.getByRole('button',{name:'Preview sensitivity A'}));
 expect(screen.getByRole('alert').textContent).toContain('captured history is unchanged');
 expect(screen.queryByRole('table',{name:/Sensitivity preview for scenario A/})).toBeNull();
});

it('rejects empty, non-finite and oversized sensitivity series while retaining captured comparison and exports',()=>{
 const download=vi.fn();
 const percentage=createCalculationSnapshot({calculatorSlug:'percentage-of-value-calculator',calculatorVersion:1,input:{percentage:20,value:250},output:{result:50}});
 render(<CalculatorScenarioWorkspace plan="business" snapshot={percentage} download={download}/>);
 fireEvent.click(screen.getByRole('button',{name:'Capture baseline A'}));
 const input=screen.getByRole('textbox',{name:/Candidate values/});
 for(const invalid of ['', '10,,20', 'Infinity', Array(26).fill('1').join(',')]){
  fireEvent.change(input,{target:{value:invalid}});
  fireEvent.click(screen.getByRole('button',{name:'Preview sensitivity A'}));
  expect(screen.getByRole('alert').textContent).toContain('captured history is unchanged');
  expect(screen.queryByRole('table',{name:/Sensitivity preview for scenario A/})).toBeNull();
 }
 expect(screen.getByRole('table',{name:'Captured engine outputs'}).textContent).toContain('50');
 fireEvent.click(screen.getByRole('button',{name:'Export scenario set JSON'}));
 expect(JSON.parse(download.mock.calls[0][1]).scenarios[0].output).toEqual({result:50});
});
it('never exposes sensitivity previews to Free or excluded mortgage engines',()=>{
 const percentage=createCalculationSnapshot({calculatorSlug:'percentage-of-value-calculator',calculatorVersion:1,input:{percentage:20,value:250},output:{result:50}});
 const view=render(<CalculatorScenarioWorkspace plan="free" snapshot={percentage} download={vi.fn()}/>);
 expect(screen.queryByRole('button',{name:/Preview sensitivity/})).toBeNull();
 const mortgage=createCalculationSnapshot({calculatorSlug:'mortgage-calculator',calculatorVersion:1,input:{principal:100,termMonths:12},output:{monthlyPayment:10}});
 view.rerender(<CalculatorScenarioWorkspace plan="pro" snapshot={mortgage} download={vi.fn()}/>);
 fireEvent.click(screen.getByRole('button',{name:'Capture baseline A'}));
 expect(screen.queryByRole('button',{name:/Preview sensitivity/})).toBeNull();
});
