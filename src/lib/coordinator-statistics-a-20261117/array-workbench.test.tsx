// @vitest-environment jsdom
import {afterEach,expect,it} from 'vitest';
import {cleanup,fireEvent,render,screen} from '@testing-library/react';
import {CalculatorFactoryWorkbench} from '@/components/calculator-factory-workbench';
import {statisticsContract,statisticsWorkflows} from '@/lib/worker1-statistics-a-20261117/cohort';
import {getFactoryWorkflows} from '@/lib/calculator-factory/registry';
afterEach(cleanup);
it('restores verified statistics arrays through the actual shared workbench',()=>{
 const c=statisticsContract(294),flow=getFactoryWorkflows(294),snapshot=statisticsWorkflows(294).execute({values:'0,10,20',weights:'1,2,1'}).snapshot;
 render(<CalculatorFactoryWorkbench workflows={flow} fields={c.fields} title={c.title} plan="business" renderWorkflows={(_packet,restore)=><button onClick={()=>restore(snapshot)}>Restore fixture scenario</button>}/>);
 fireEvent.click(screen.getByRole('button',{name:'Restore fixture scenario'}));
 expect(screen.queryByRole('alert')).toBeNull();expect((screen.getByLabelText(c.fields[0].label) as HTMLInputElement).value).toBe('0, 10, 20');expect(screen.getByLabelText('Exact result').textContent).toContain('"weightedMean": 10');
});
it('shared array restore retains precision refusal rather than recreating a legacy zero capture',()=>{
 const c=statisticsContract(294),flow=getFactoryWorkflows(294),snapshot={calculatorSlug:c.slug,calculatorVersion:1,input:{values:[1e50,1,-1e50],weights:[1,1,1]},output:{weightedMean:0,totalWeight:3,count:3,steps:['Weighted sum = 0','Total weight = 3','Weighted mean = 0']}};
 render(<CalculatorFactoryWorkbench workflows={flow} fields={c.fields} title={c.title} plan="business" renderWorkflows={(_packet,restore)=><button onClick={()=>restore(snapshot)}>Restore legacy record</button>}/>);
 fireEvent.click(screen.getByRole('button',{name:'Restore legacy record'}));expect(screen.getByRole('alert').textContent).toMatch(/precision/);expect(screen.queryByLabelText('Exact result')).toBeNull();
});
