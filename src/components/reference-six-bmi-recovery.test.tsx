// @vitest-environment jsdom
import {cleanup,fireEvent,render,screen} from '@testing-library/react';
import {afterEach,expect,it,vi} from 'vitest';
const fixture=vi.hoisted(()=>({plan:'free'}));
vi.mock('@/components/use-calculator-plan',()=>({useCalculatorPlan:()=>fixture.plan}));
vi.mock('@/lib/supabase/browser',()=>({createSupabaseBrowserClient:()=>null}));
import {CalculatorInteractive} from './calculator-interactive';
afterEach(cleanup);
for(const plan of ['free','pro','business'])for(const label of ['Weight (kg)','Height (cm)']){
 it(`${plan}: announces invalid ${label} without retaining a BMI result and recovers the original output`,()=>{
  fixture.plan=plan;
  const {container}=render(<CalculatorInteractive slug="bmi-calculator"/>);
  const result=()=>container.querySelector('.final-result .result-hero');
  const original=result()?.textContent;
  expect(original).toBeTruthy();
  const field=screen.getByLabelText(label) as HTMLInputElement,originalInput=field.value;
  fireEvent.change(field,{target:{value:''}});
  expect(result()).toBeNull();
  expect(screen.getByRole('alert').textContent).toContain('Enter valid');
  fireEvent.change(field,{target:{value:originalInput}});
  expect(screen.queryByRole('alert')).toBeNull();
  expect(result()?.textContent).toBe(original);
 });
}
