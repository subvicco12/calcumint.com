/** @vitest-environment jsdom */
import React from 'react';
import {afterEach,expect,it,vi} from 'vitest';
import {cleanup,fireEvent,render,screen} from '@testing-library/react';
const state=vi.hoisted(()=>({props:null as null|Record<string,unknown>}));
vi.mock('@/components/calculator-account-actions',()=>({CalculatorAccountActions:(p:Record<string,unknown>)=>{state.props=p;return null;}}));
import {CalculatorInteractive} from './calculator-interactive';
afterEach(()=>{cleanup();state.props=null;});
const cases=[
 {slug:'volume-calculator',fields:{Length:'1e-200',Width:'1e-200',Height:'1e-200'},recover:{Length:'2',Width:'3',Height:'4'}},
 {slug:'standard-deviation-calculator',fields:{Dataset:'1e-200, 2e-200'},recover:{Dataset:'1, 2, 3'}},
 {slug:'variance-calculator',fields:{Dataset:'1e-200, 2e-200'},recover:{Dataset:'1, 2, 3'}},
 {slug:'slope-calculator',fields:{x1:'0',y1:'0',x2:'1e100',y2:'1e-300'},recover:{x2:'2',y2:'4'}},
];
it.each(cases)('$slug withholds underflowed positive/nonzero results and recovers',({slug,fields,recover})=>{
 const {container}=render(<CalculatorInteractive slug={slug}/>);
 for(const [label,value] of Object.entries(fields))fireEvent.change(screen.getByLabelText(label),{target:{value}});
 expect(state.props!.output).toBeNull();expect(container.querySelector('.final-calculator-renderer')).toBeNull();expect(screen.getByRole('alert').textContent).toMatch(/numeric precision/i);
 for(const [label,value] of Object.entries(recover))fireEvent.change(screen.getByLabelText(label),{target:{value}});
 expect(state.props!.output).not.toBeNull();expect(container.querySelector('.final-calculator-renderer')).not.toBeNull();
});
it.each(['standard-deviation-calculator','variance-calculator'])('%s preserves genuine constant zero',slug=>{
 render(<CalculatorInteractive slug={slug}/>);fireEvent.change(screen.getByLabelText('Dataset'),{target:{value:'1e-200, 1e-200'}});expect(state.props!.output).toMatchObject({variance:0,standardDeviation:0});
});
it('preserves genuine horizontal slope zero',()=>{render(<CalculatorInteractive slug='slope-calculator'/>);fireEvent.change(screen.getByLabelText('y2'),{target:{value:'0'}});expect(state.props!.output).toMatchObject({value:0,dy:0});});
