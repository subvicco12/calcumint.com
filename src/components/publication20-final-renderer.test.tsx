// @vitest-environment jsdom
import {afterEach,describe,expect,it,vi} from 'vitest';
import {cleanup,fireEvent,render,screen} from '@testing-library/react';
import {conversionPublicationDefinitions} from '@/lib/publication20/conversions';
const state=vi.hoisted(()=>({plan:'free',capture:null as null|{input:Record<string,unknown>;output:Record<string,unknown>|null;calculatorSlug:string;calculatorVersion:number}}));
vi.mock('./use-calculator-plan',()=>({useCalculatorPlan:()=>state.plan}));
vi.mock('./calculator-account-actions',()=>({CalculatorAccountActions:(props:NonNullable<typeof state.capture>)=>{state.capture=props;return <button disabled={!props.output}>Account workflow fixture</button>;}}));
import {Publication20Tool} from './publication20-tool';
afterEach(()=>{cleanup();state.capture=null;});
// Retained independent literals: publication20/conversions.independent.test.ts.
const witnesses=[
 [423,-2.5,'yd','mm',-2286],[424,3,'ft2','cm2',2787.0912],[425,2,'qt_us','ml',1892.705892],
 [427,-40,'c','f',-40],[428,3,'knot','m_s',1.5433333333333333],[429,2,'bar','pa',200000],
 [430,10,'cal','j',41.84],[431,0.002,'mw','w',2000],[432,1.5,'week','h',252],
 [433,100,'grad','deg',90],[434,2,'MiB','KB',2097.152],[437,2,'kg_l','kg_m3',2000],
 [438,250000,'dyn','n',2.5],[439,24,'lbf_in','lbf_ft',2],[440,0.125,'mhz','hz',125000],
] as const;
for(const plan of ['free','pro','business'])describe(plan+' actual converter Final presentation',()=>{
 it.each(witnesses)('uses applicable scalar Final UI and retained witness for #%i',(id,value,fromUnit,toUnit,expected)=>{
  state.plan=plan;const entry=conversionPublicationDefinitions.find(e=>e.catalogId===id)!;
  render(<Publication20Tool slug={entry.definition.slug}/>);
  fireEvent.change(screen.getByLabelText('From unit'),{target:{value:fromUnit}});
  fireEvent.change(screen.getByLabelText('To unit'),{target:{value:toUnit}});
  fireEvent.change(screen.getByLabelText('Value'),{target:{value:String(value)}});
  expect(screen.queryByText('Advanced Analysis')).toBeNull();
  for(const absent of ['Advanced charts','Sensitivity analysis','Goal Solver'])expect(screen.queryByText(absent)).toBeNull();
  expect(document.querySelector('.final-calculator-renderer')).not.toBeNull();
  expect(state.capture?.calculatorVersion).toBe(1);expect(state.capture?.calculatorSlug).toBe(entry.definition.slug);
  expect(state.capture?.output?.result).toBeCloseTo(expected,9);
  expect(screen.getByRole('table',{name:'Conversion reconciliation'}).textContent).toContain(String(state.capture!.output!.result));
  expect(screen.getByText('Methodology',{selector:'summary'}).parentElement?.textContent).toContain(entry.definition.formulas[0].expression);
  for(const source of entry.definition.sources)expect(screen.getByRole('link',{name:source.label})).toBeTruthy();
  if(plan==='free')expect(screen.queryByRole('region',{name:'Batch conversion'})).toBeNull();
  else expect(screen.getByRole('region',{name:'Batch conversion'})).toBeTruthy();
  fireEvent.change(screen.getByLabelText('Value'),{target:{value:''}});expect(state.capture?.output).toBeNull();expect(screen.getByRole('alert')).toBeTruthy();
  fireEvent.change(screen.getByLabelText('Value'),{target:{value:String(value)}});expect(state.capture?.output?.result).toBeCloseTo(expected,9);
 });
});
it('preserves OWN-427 algebraic values below physical absolute zero',()=>{
 state.plan='free';render(<Publication20Tool slug="temperature-converter"/>);
 fireEvent.change(screen.getByLabelText('From unit'),{target:{value:'c'}});fireEvent.change(screen.getByLabelText('To unit'),{target:{value:'f'}});
 fireEvent.change(screen.getByLabelText('Value'),{target:{value:'-300'}});expect(state.capture?.output?.result).toBe(-508);
 expect(document.querySelector('[data-temperature-scope=algebraic-value]')).toBeTruthy();
});
