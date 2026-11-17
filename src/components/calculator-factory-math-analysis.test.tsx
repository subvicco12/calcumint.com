// @vitest-environment jsdom
import {afterEach,expect,it} from 'vitest';
import {cleanup,fireEvent,render,screen,within} from '@testing-library/react';
import {CalculatorFactoryMathAnalysis} from './calculator-factory-math-analysis';
afterEach(cleanup);
it('shows arithmetic steps and both square inverse branches without changing current result',()=>{
 render(<CalculatorFactoryMathAnalysis catalogId={218} x={-12} plan="pro"/>);
 expect(screen.getByRole('table',{name:'Arithmetic steps'}).textContent).toContain('144');
 fireEvent.change(screen.getByLabelText('Target output'),{target:{value:'25'}});
 fireEvent.submit(screen.getByRole('form',{name:'Reverse solve'}));
 expect(screen.getByRole('status').textContent).toContain('-5, 5');
 expect(screen.getByRole('table',{name:'Arithmetic steps'}).textContent).toContain('144');
});
it('graphs refused samples as gaps with textual table alternative',()=>{
 render(<CalculatorFactoryMathAnalysis catalogId={220} x={4}/>);
 fireEvent.change(screen.getByLabelText('Graph minimum x'),{target:{value:'-1'}});
 fireEvent.change(screen.getByLabelText('Graph maximum x'),{target:{value:'1'}});
 fireEvent.change(screen.getByLabelText('Graph sample count'),{target:{value:'3'}});
 fireEvent.submit(screen.getByRole('form',{name:'Graph sampling'}));
 const table=screen.getByRole('table',{name:'Graph samples'});
 expect(within(table).getByText(/Refused:/)).toBeTruthy();
 expect(screen.getByRole('img',{name:'Sampled scalar relationship'}).querySelectorAll('circle')).toHaveLength(2);
});
it('rejects unbounded counts and malformed inputs then recovers',()=>{
 render(<CalculatorFactoryMathAnalysis catalogId={219} x={2} plan="pro"/>);
 fireEvent.change(screen.getByLabelText('Graph sample count'),{target:{value:'102'}});
 fireEvent.submit(screen.getByRole('form',{name:'Graph sampling'}));
 expect(screen.getByRole('alert').textContent).toContain('2–101');
 fireEvent.change(screen.getByLabelText('Graph sample count'),{target:{value:'3'}});
 fireEvent.submit(screen.getByRole('form',{name:'Graph sampling'}));
 expect(screen.queryByRole('alert')).toBeNull();
 fireEvent.change(screen.getByLabelText('Target output'),{target:{value:'1junk'}});
 fireEvent.submit(screen.getByRole('form',{name:'Reverse solve'}));
 expect(screen.getByRole('alert')).toBeTruthy();
});
it('clears reverse and graph sessions when current input changes',()=>{
 const view=render(<CalculatorFactoryMathAnalysis catalogId={218} x={2} plan="pro"/>);
 fireEvent.change(screen.getByLabelText('Target output'),{target:{value:'9'}});
 fireEvent.submit(screen.getByRole('form',{name:'Reverse solve'}));
 view.rerender(<CalculatorFactoryMathAnalysis catalogId={218} x={3} plan="pro"/>);
 expect(screen.queryByRole('status')).toBeNull();
 expect((screen.getByLabelText('Target output') as HTMLInputElement).value).toBe('');
});

it.each([218,219,220])('keeps Free %s forward steps/graph but disables reverse Goal Solver',catalogId=>{
 render(<CalculatorFactoryMathAnalysis catalogId={catalogId} x={4}/>);
 expect((screen.getByRole('button',{name:'Solve target'}) as HTMLButtonElement).disabled).toBe(true);
 expect((screen.getByLabelText('Target output') as HTMLInputElement).disabled).toBe(true);
 expect((screen.getByRole('button',{name:'Sample graph'}) as HTMLButtonElement).disabled).toBe(false);
 expect(screen.getByRole('table',{name:'Arithmetic steps'})).toBeTruthy();
 expect(screen.getByText('Reverse solve requires Pro or Business.')).toBeTruthy();
 fireEvent.submit(screen.getByRole('form',{name:'Reverse solve'}));
 expect(screen.queryByText(/Candidate input values:/)).toBeNull();
});
it.each(['pro','business'] as const)('%s retains all three unchanged reverse solutions',plan=>{
 for(const [catalogId,target,expected] of [[218,'25','-5, 5'],[219,'-27','-3'],[220,'3','9']] as const){
  const view=render(<CalculatorFactoryMathAnalysis catalogId={catalogId} x={4} plan={plan}/>);
  expect((screen.getByRole('button',{name:'Solve target'}) as HTMLButtonElement).disabled).toBe(false);
  fireEvent.change(screen.getByLabelText('Target output'),{target:{value:target}});fireEvent.submit(screen.getByRole('form',{name:'Reverse solve'}));
  expect(screen.getByRole('status').textContent).toContain(`Candidate input values: ${expected}.`);view.unmount();
 }
});
it('removes a paid reverse solution when the rendered plan becomes Free',()=>{
 const view=render(<CalculatorFactoryMathAnalysis catalogId={218} x={4} plan="pro"/>);fireEvent.change(screen.getByLabelText('Target output'),{target:{value:'25'}});fireEvent.submit(screen.getByRole('form',{name:'Reverse solve'}));expect(screen.getByRole('status').textContent).toContain('-5, 5');
 view.rerender(<CalculatorFactoryMathAnalysis catalogId={218} x={4} plan="free"/>);expect(screen.queryByText(/Candidate input values:/)).toBeNull();expect((screen.getByRole('button',{name:'Solve target'}) as HTMLButtonElement).disabled).toBe(true);expect((screen.getByRole('button',{name:'Sample graph'}) as HTMLButtonElement).disabled).toBe(false);
});
