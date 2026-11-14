// @vitest-environment jsdom
import {cleanup,fireEvent,render,screen} from '@testing-library/react';
import {afterEach,expect,it,vi} from 'vitest';
import {CalculatorScenarioWorkspace} from './calculator-scenario-workspace';
import {createCalculationSnapshot} from '@/lib/calculation-snapshot';
afterEach(cleanup);
const cases=[
 {slug:'percentage-of-value-calculator',input:{percentage:20,value:250},output:{result:50}},
 {slug:'unit-conversion-calculator',input:{value:1,fromUnit:'mi',toUnit:'km'},output:{result:1.609344}},
];
it.each(cases.flatMap(calculator=>(['pro','business'] as const).map(plan=>({...calculator,plan}))))('rejects lossy numeric scenario drafts and permits retry for $slug on $plan',({slug,input,output,plan})=>{
 const download=vi.fn();
 const snapshot=createCalculationSnapshot({calculatorSlug:slug,calculatorVersion:1,input,output});
 render(<CalculatorScenarioWorkspace plan={plan} snapshot={snapshot} download={download}/>);
 fireEvent.click(screen.getByRole('button',{name:'Capture baseline A'}));
 const exportCaptures=()=>{fireEvent.click(screen.getByRole('button',{name:'Export scenario set JSON'}));fireEvent.click(screen.getByRole('button',{name:'Export scenario set CSV'}));};
 exportCaptures();
 const original=download.mock.calls.map(call=>call[1]);
 for(const value of ['1e-400','0.10000000000000001','9007199254740993']){
  fireEvent.change(screen.getByRole('spinbutton',{name:'value'}),{target:{value}});
  fireEvent.click(screen.getByRole('button',{name:'Preview edited scenario A'}));
  expect(screen.queryByText(/Re-evaluation preview for scenario A/)).toBeNull();
  expect(screen.getByRole('alert').textContent).toContain('Historical captures remain unchanged');
  fireEvent.change(screen.getByRole('textbox',{name:/Candidate values/}),{target:{value:`1, ${value}`}});
  fireEvent.click(screen.getByRole('button',{name:'Preview sensitivity A'}));
  expect(screen.queryByRole('region',{name:'Sensitivity preview'})).toBeNull();
  expect(screen.getByRole('alert').textContent).toContain('Supply 1–25 valid numeric values');
  exportCaptures();
  expect(download.mock.calls.slice(-2).map(call=>call[1])).toEqual(original);
 }
 fireEvent.change(screen.getByRole('spinbutton',{name:'value'}),{target:{value:'0.1'}});
 fireEvent.click(screen.getByRole('button',{name:'Preview edited scenario A'}));
 expect(screen.getByText(/Re-evaluation preview for scenario A/)).toBeTruthy();
 fireEvent.change(screen.getByRole('textbox',{name:/Candidate values/}),{target:{value:'0, 0.1, 1e-12'}});
 fireEvent.click(screen.getByRole('button',{name:'Preview sensitivity A'}));
 expect(screen.getByRole('region',{name:'Sensitivity preview'})).toBeTruthy();
 exportCaptures();
 expect(download.mock.calls.slice(-2).map(call=>call[1])).toEqual(original);
});
