// @vitest-environment jsdom
import {cleanup,fireEvent,render,screen} from '@testing-library/react';
import {afterEach,expect,it} from 'vitest';
import {EverydayPublicCalculator,getEverydayPublicCalculator} from './calculator';

afterEach(cleanup);
const cases=[
 [508,'trip-cost-calculator',{transportCost:'300',lodgingCost:'500',foodCost:'200',otherCost:'100'},'1,100'],
 [513,'hotel-cost-split-calculator',{totalHotelCost:'420',people:'3'},'140'],
 [514,'group-expense-split-calculator',{totalExpense:'360',people:'4'},'90'],
 [515,'tip-split-calculator',{billAmount:'100',tipPercent:'20',people:'4'},'30'],
 [519,'household-utility-cost-calculator',{electricity:'50',water:'20',gas:'15',internet:'10',other:'5'},'100'],
 [520,'moving-cost-calculator',{transport:'400',packing:'100',labor:'300',storage:'50',other:'25'},'875'],
 [521,'running-pace-calculator',{distanceKm:'5',timeMinutes:'25'},'5'],
 [523,'cycling-speed-calculator',{distanceKm:'48',timeHours:'2'},'24'],
 [524,'swimming-pace-calculator',{distanceMeters:'400',timeMinutes:'8'},'2'],
] as const;
it.each(cases)('renders catalog %i, refuses missing input and calculates on form submit',(id,slug,inputs,expected)=>{
 const definition=getEverydayPublicCalculator(slug);
 expect(definition?.catalogId).toBe(id);
 const screenRoot=render(<EverydayPublicCalculator calculatorSlug={slug}/>);
 const form=screen.getByRole('form',{name:'Calculator inputs'});
 for(const [key,value] of Object.entries(inputs)){
  const input=screenRoot.container.querySelector('input[name="'+key+'"]') as HTMLInputElement;
  expect(input.labels?.[0]?.textContent).toBeTruthy();
  fireEvent.change(input,{target:{value}});
 }
 fireEvent.submit(form);
 expect(screen.getByRole('status').querySelector('strong')?.textContent).toMatch(new RegExp('^'+expected+' '));
 const first=screenRoot.container.querySelector('input')!;
 fireEvent.change(first,{target:{value:''}});
 expect(screen.queryByLabelText('Calculation result')).toBeNull();
 fireEvent.submit(form);
 expect(screen.getByRole('alert')).toBeTruthy();
 expect(document.activeElement).toBe(first);
});
it('refuses fractional people for new results and does not dispatch other calculator slugs',()=>{
 expect(getEverydayPublicCalculator('travel-time-calculator')).toBeUndefined();
 const {container}=render(<EverydayPublicCalculator calculatorSlug="hotel-cost-split-calculator"/>);
 fireEvent.change(container.querySelector('input[name=people]')!,{target:{value:'2.5'}});
 fireEvent.click(screen.getByRole('button',{name:'Calculate'}));
 expect(screen.getByRole('alert').textContent).toContain('whole people');
 expect(screen.queryByLabelText('Calculation result')).toBeNull();
});
