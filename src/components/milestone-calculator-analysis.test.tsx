// @vitest-environment jsdom
import {afterEach,expect,it} from 'vitest';
import {cleanup,fireEvent,render,screen} from '@testing-library/react';
import {MilestoneCalculatorAnalysis} from './milestone-calculator-analysis';
import {getFactoryWorkflows} from '@/lib/calculator-factory/registry';
afterEach(cleanup);
it('exposes finite geometry steps, accessible samples, paid reverse and unchanged engine results',()=>{
 const packet=getFactoryWorkflows(259).execute({length:'10',width:'5'});
 const view=render(<MilestoneCalculatorAnalysis packet={packet} plan="pro" onRestore={()=>{}}/>);
 expect(screen.getByRole('table',{name:'Geometry arithmetic'}).textContent).toContain('50');
 fireEvent.change(screen.getByLabelText('Dimension samples'),{target:{value:'0,12,-1'}});fireEvent.click(screen.getByRole('button',{name:'Sample dimensions'}));
 expect(screen.getByRole('img',{name:'Geometry sample plot'}).querySelectorAll('circle')).toHaveLength(2);expect(screen.getByRole('table',{name:'Dimension samples'}).textContent).toContain('120');expect(screen.getByRole('table',{name:'Dimension samples'}).textContent).toContain('Refused');
 fireEvent.change(screen.getByLabelText('Target geometry result'),{target:{value:'120'}});fireEvent.click(screen.getByRole('button',{name:'Solve dimension'}));expect(screen.getByRole('status').textContent).toContain('12');
 view.rerender(<MilestoneCalculatorAnalysis packet={packet} plan="free" onRestore={()=>{}}/>);expect((screen.getByRole('button',{name:'Solve dimension'}) as HTMLButtonElement).disabled).toBe(true);expect(screen.queryByRole('status')).toBeNull();
});
it('preserves raw decimals when exchanging units and restoring a target',()=>{
 const packet=getFactoryWorkflows(429).execute({value:'01.25',fromUnit:'bar',toUnit:'pa'}),restored:unknown[]=[];
 render(<MilestoneCalculatorAnalysis packet={packet} plan="business" onRestore={value=>restored.push(value)}/>);
 expect(screen.getByRole('table',{name:'Offered conversion targets'}).textContent).toContain('125000');
 fireEvent.click(screen.getByRole('button',{name:'Exchange offered units'}));expect(restored[0]).toEqual(getFactoryWorkflows(429).execute({value:'01.25',fromUnit:'pa',toUnit:'bar'}).snapshot);
 expect(screen.getByText(/approximately/)).toBeTruthy();
});
it('refuses a substituted artifact before rendering mathematical analysis',()=>{
 const packet=getFactoryWorkflows(265).execute({radius:'5'});const bad=JSON.parse(JSON.stringify(packet));bad.snapshot.output.result=99;
 render(<MilestoneCalculatorAnalysis packet={bad} plan="pro" onRestore={()=>{}}/>);expect(screen.getByRole('alert').textContent).toContain('verified');expect(screen.queryByRole('table')).toBeNull();
});
