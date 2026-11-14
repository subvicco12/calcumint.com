// @vitest-environment jsdom
import {afterEach,expect,it} from 'vitest';
import {cleanup,fireEvent,render,screen,within} from '@testing-library/react';
import {TechnologyBoundedAnalysis} from './technology-bounded-analysis';
afterEach(cleanup);
for(const plan of ['free','pro','business'] as const)it(plan+' retains identical RAID samples with centrally governed controls',()=>{
 render(<TechnologyBoundedAnalysis id='technology.raid-capacity' input={{diskCount:4,diskSizeGb:1000,raidLevel:'10'}} plan={plan}/>);
 const table=screen.getByRole('table',{name:'Relationship samples'});expect(within(table).getByText('4000')).toBeTruthy();expect(screen.getByRole('img')).toBeTruthy();
 if(plan==='free'){expect(screen.queryByRole('form',{name:'Target calculation'})).toBeNull();expect(screen.queryByRole('table',{name:'Relative result changes'})).toBeNull();}else{fireEvent.change(screen.getByLabelText(/Target result/),{target:{value:'4000'}});fireEvent.submit(screen.getByRole('form',{name:'Target calculation'}));expect(screen.getByRole('status').textContent).toContain('2000');expect(screen.getByRole('table',{name:'Relative result changes'})).toBeTruthy();}
 expect(screen.getByText(/Batch delivery is not available/)).toBeTruthy();expect(screen.queryByRole('button',{name:/batch/i})).toBeNull();
});
it('keyboard-form target errors recover and every input-context change clears target and solution',()=>{
 const input={capacityWh:1000,loadWatts:200,efficiencyPercent:90};const view=render(<TechnologyBoundedAnalysis id='technology.battery-runtime' input={input} plan='pro'/>);
 fireEvent.change(screen.getByLabelText(/Target result/),{target:{value:'1junk'}});fireEvent.submit(screen.getByRole('form',{name:'Target calculation'}));expect(screen.getByRole('alert')).toBeTruthy();
 fireEvent.change(screen.getByLabelText(/Target result/),{target:{value:'9'}});fireEvent.submit(screen.getByRole('form',{name:'Target calculation'}));expect(screen.queryByRole('alert')).toBeNull();expect(screen.getByRole('status').textContent).toContain('2000');
 view.rerender(<TechnologyBoundedAnalysis id='technology.battery-runtime' input={{...input,loadWatts:100}} plan='pro'/>);expect(screen.queryByRole('status')).toBeNull();expect((screen.getByLabelText(/Target result/) as HTMLInputElement).value).toBe('');
});
it('discrete password analysis has unconnected points and refuses unattainable target',()=>{
 render(<TechnologyBoundedAnalysis id='technology.password-entropy' input={{length:16,characterPoolSize:2}} plan='business'/>);expect(screen.getByText(/Discrete points are not a continuous interpolation/)).toBeTruthy();expect(screen.getByRole('img').querySelector('polyline')).toBeNull();
 fireEvent.change(screen.getByLabelText(/Target result/),{target:{value:'16.5'}});fireEvent.submit(screen.getByRole('form',{name:'Target calculation'}));expect(screen.getByRole('alert')).toBeTruthy();
});
it('invalid current input renders an accessible refusal without stale analysis or goals',()=>{
 render(<TechnologyBoundedAnalysis id='technology.ups-runtime' input={{batteryWh:600,loadWatts:0,efficiencyPercent:90}} plan='business'/>);expect(screen.getByRole('alert').textContent).toContain('valid current inputs');expect(screen.queryByRole('table')).toBeNull();expect(screen.queryByRole('form')).toBeNull();
});
it('CIDR boundary samples remain discrete and exact supported target solves prefix',()=>{
 render(<TechnologyBoundedAnalysis id='technology.cidr' input={{prefixLength:0}} plan='pro'/>);const table=screen.getByRole('table',{name:'Relationship samples'});expect(within(table).getAllByText('4294967296').length).toBeGreaterThan(0);fireEvent.change(screen.getByLabelText(/Target result/),{target:{value:'256'}});fireEvent.submit(screen.getByRole('form',{name:'Target calculation'}));expect(screen.getByRole('status').textContent).toContain('24');
});
it('UPS projection keeps fixed efficiency/load context and original runtime output',()=>{
 render(<TechnologyBoundedAnalysis id='technology.ups-runtime' input={{batteryWh:600,loadWatts:300,efficiencyPercent:90}} plan='business'/>);expect(within(screen.getByRole('table',{name:'Relationship samples'})).getByText('1.8')).toBeTruthy();const context=screen.getByRole('region',{name:'Projection scenarios'});expect(within(context).getByText('loadWatts')).toBeTruthy();expect(within(context).getByText('90')).toBeTruthy();
});
