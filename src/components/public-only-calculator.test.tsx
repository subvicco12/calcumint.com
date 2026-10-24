// @vitest-environment jsdom
import {afterEach,expect,it,vi} from 'vitest';
import {cleanup,render,screen,fireEvent} from '@testing-library/react';
import {ProductCapabilitiesProvider} from './product-capabilities';
import {capabilitiesForMode} from '@/lib/product-mode';
import {CalculatorInteractive} from './calculator-interactive';
const external=vi.hoisted(()=>({client:vi.fn(()=>{throw new Error('Anonymous calculator attempted account access');})}));
vi.mock('@/lib/supabase/browser',()=>({createSupabaseBrowserClient:external.client}));
afterEach(()=>{cleanup();vi.clearAllMocks();});
it.each(['percentage-of-value-calculator','unit-conversion-calculator'])('renders %s without account access or excluded controls',slug=>{
 render(<ProductCapabilitiesProvider capabilities={capabilitiesForMode('public-only')}><CalculatorInteractive slug={slug}/></ProductCapabilitiesProvider>);
 expect(screen.queryByText(/Save calculation/i)).toBeNull();expect(screen.queryByText(/Export (CSV|JSON|PDF)/i)).toBeNull();expect(screen.queryByText(/Explain this result with AI/i)).toBeNull();
 const inputs=screen.getAllByRole('spinbutton');fireEvent.change(inputs[0],{target:{value:'1.79e308'}});expect(screen.getByRole('alert')).toBeTruthy();fireEvent.change(inputs[0],{target:{value:'2'}});
 expect(document.body.textContent).toContain(slug.startsWith('percentage')?'5':'3.22 km');
 expect(external.client).not.toHaveBeenCalled();
});
it('missing capability context does not expose account features',async()=>{
 const {renderToStaticMarkup}=await vi.importActual<typeof import('react-dom/server')>('react-dom/server');
 const {CalculatorAccountActions}=await import('./calculator-account-actions');
 expect(renderToStaticMarkup(<CalculatorAccountActions calculatorSlug="percentage-of-value-calculator" calculatorVersion={1} input={{percentage:20,value:250}} output={{result:50}}/>)).toBe('');
 expect(external.client).not.toHaveBeenCalled();
});
