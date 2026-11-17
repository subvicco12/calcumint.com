// @vitest-environment jsdom
import {afterEach,expect,it} from 'vitest';
import {cleanup,render,screen,within} from '@testing-library/react';
import {CalculatorFactoryConversionMethodology} from './calculator-factory-conversion-methodology';
import {conversionCompletionContracts} from '@/lib/calculator-factory/completion/conversion-contracts';
import {runConversionFactoryCalculation} from '@/lib/calculator-factory/cohorts/conversions';
afterEach(cleanup);
it.each(conversionCompletionContracts)('explains the actual immutable example and every source-scoped unit for $catalogId',row=>{
 render(<CalculatorFactoryConversionMethodology catalogId={row.catalogId}/>);
 const table=screen.getByRole('table',{name:'Unit definitions'});
 expect(within(table).getAllByRole('row')).toHaveLength(Object.keys(row.units).length+1);
 for(const [code,unit] of Object.entries(row.units)){
  const cells=within(table).getAllByRole('row').find(tr=>within(tr).queryByRole('rowheader',{name:code}));
  expect(cells?.textContent).toContain(unit.symbol);
  expect(cells?.textContent).toContain(unit.sourceCode);
  expect(cells?.textContent).toContain(unit.exactBase);
 }
 const native=runConversionFactoryCalculation({catalogId:row.catalogId,version:1,input:row.example});
 expect(screen.getByLabelText('Worked example native output').textContent).toBe(JSON.stringify(native.output));
 expect(screen.getByLabelText('Worked example formula').textContent).toContain(row.units[row.example.fromUnit].exactBase);
 expect(screen.getByLabelText('Worked example formula').textContent).toContain(row.units[row.example.toUnit].exactBase);
 expect(screen.getByText(row.applicability)).toBeTruthy();
 expect(screen.getByRole('link',{name:'UCUM 2.2 source release'}).getAttribute('href')).toBe(row.source.url);
 expect(screen.getByText(/Competent applicability review remains pending/)).toBeTruthy();
});
it('omits unsupported calculators without inventing methodology',()=>{
 const {container}=render(<CalculatorFactoryConversionMethodology catalogId={427}/>);
 expect(container.textContent).toBe('');
});
