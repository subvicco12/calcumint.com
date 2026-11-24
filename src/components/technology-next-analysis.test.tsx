// @vitest-environment jsdom
import {it,expect,afterEach} from 'vitest';
import {render,screen,within,fireEvent,cleanup} from '@testing-library/react';
import {TechnologyNextAnalysis} from './technology-next-analysis';
afterEach(cleanup);
for(const plan of ['free','pro','business']as const)it(plan+' shares mathematical samples and centrally resolved goal capability',()=>{render(<TechnologyNextAnalysis id='technology.dpi' input={{pixels:3000,lengthInches:10}} plan={plan}/>);expect(screen.getByRole('img',{name:'Relationship: pixels/inch by pixels'})).toBeTruthy();expect(within(screen.getByRole('table',{name:'Relationship samples'})).getByText('600')).toBeTruthy();if(plan==='free')expect(screen.queryByRole('button',{name:'Solve target'})).toBeNull();else{fireEvent.change(screen.getByLabelText('Target result (pixels/inch)'),{target:{value:'600'}});fireEvent.submit(screen.getByRole('form',{name:'Target calculation'}));expect(screen.getByRole('status').textContent).toContain('6000 pixels');}});
it('renders genuine zero sensitivity and reports nonunique zero-price solutions',()=>{render(<TechnologyNextAnalysis id='technology.cloud-storage-cost' input={{storageGb:0,pricePerGbMonth:0}} plan='business'/>);expect(screen.getAllByText('Undefined at zero baseline').length).toBeGreaterThan(0);fireEvent.change(screen.getByLabelText('Target result (currency units/month)'),{target:{value:'0'}});fireEvent.click(screen.getByRole('button',{name:'Solve target'}));expect(screen.getByRole('status').textContent).toContain('0 or 2.2250738585072014e-308–1e+100 GB');});
it('recovers target errors and removes stale solution on context change',()=>{const v=render(<TechnologyNextAnalysis id='technology.dpi' input={{pixels:3000,lengthInches:10}} plan='pro'/>);const field=screen.getByLabelText('Target result (pixels/inch)');fireEvent.change(field,{target:{value:'3junk'}});fireEvent.click(screen.getByRole('button',{name:'Solve target'}));expect(screen.getByRole('alert')).toBeTruthy();fireEvent.change(field,{target:{value:'600'}});fireEvent.click(screen.getByRole('button',{name:'Solve target'}));expect(screen.queryByRole('alert')).toBeNull();expect(screen.getByRole('status')).toBeTruthy();v.rerender(<TechnologyNextAnalysis id='technology.dpi' input={{pixels:6000,lengthInches:10}} plan='pro'/>);expect(screen.queryByRole('status')).toBeNull();});
it('keeps refused batch rows, disables partial exports and verifies repaired replay',()=>{render(<TechnologyNextAnalysis id='technology.aspect-ratio' input={{width:16,height:9}} plan='free'/>);fireEvent.change(screen.getByLabelText('Batch numeric rows'),{target:{value:'16,8\n,8'}});fireEvent.click(screen.getByRole('button',{name:'Evaluate rows'}));expect(screen.getByRole('button',{name:'Download batch JSON'}).hasAttribute('disabled')).toBe(true);expect(screen.getByRole('alert').textContent).toContain('Correct');fireEvent.change(screen.getByLabelText('Batch numeric rows'),{target:{value:'16,8'}});fireEvent.click(screen.getByRole('button',{name:'Evaluate rows'}));expect(screen.queryByRole('alert')).toBeNull();expect(screen.getByRole('button',{name:'Download batch JSON'}).hasAttribute('disabled')).toBe(false);});

it('links refusals and does not resurrect a previous goal when returning to an input',()=>{
 const original={pixels:3000,lengthInches:10};
 const view=render(<TechnologyNextAnalysis id='technology.dpi' input={original} plan='pro'/>);
 const target=screen.getByRole('textbox',{name:'Target result (pixels/inch)'});
 const submit=()=>fireEvent.submit(screen.getByRole('form',{name:'Target calculation'}));
 fireEvent.change(target,{target:{value:'oops'}});
 submit();
 expect(target.getAttribute('aria-invalid')).toBe('true');
 expect(document.getElementById(target.getAttribute('aria-describedby')!)).toBe(screen.getByRole('alert'));
 fireEvent.change(target,{target:{value:'600'}});
 expect(target.hasAttribute('aria-invalid')).toBe(false);
 expect(target.hasAttribute('aria-describedby')).toBe(false);
 submit();
 expect(screen.getByRole('status').textContent).toContain('6000 pixels');
 view.rerender(<TechnologyNextAnalysis id='technology.dpi' input={{...original,lengthInches:20}} plan='pro'/>);
 view.rerender(<TechnologyNextAnalysis id='technology.dpi' input={original} plan='pro'/>);
 expect(screen.queryByRole('status')).toBeNull();
 expect((target as HTMLInputElement).value).toBe('600');
});
