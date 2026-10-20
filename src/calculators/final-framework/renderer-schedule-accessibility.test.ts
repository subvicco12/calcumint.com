// @vitest-environment jsdom
import {createElement} from 'react';
import {cleanup,render,screen,within} from '@testing-library/react';
import {afterEach,expect,it} from 'vitest';
import {FinalCalculatorRenderer} from '@/components/final-calculator-renderer';
import {referencePresentations} from './reference-presentations';
afterEach(cleanup);
it('renders accessible legacy schedule semantics through the shared responsive table',()=>{
 render(createElement(FinalCalculatorRenderer,{plan:'pro',presentation:referencePresentations.loanEmi,result:{primaryResult:{id:'total',label:'Total',value:3},schedule:[{id:'one',period:1,values:{amount:3}}]}}));
 const table=screen.getByRole('table',{name:'Detailed calculation schedule',hidden:true});
 expect(within(table).getByRole('columnheader',{name:'Period',hidden:true}).getAttribute('scope')).toBe('col');
 expect(within(table).getByRole('rowheader',{name:'1',hidden:true}).getAttribute('scope')).toBe('row');
 const scroll=screen.getByRole('region',{name:'Detailed calculation schedule data',hidden:true});expect(scroll.className).toBe('schedule-scroll');expect(scroll.getAttribute('tabindex')).toBe('0');
});
