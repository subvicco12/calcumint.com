// @vitest-environment jsdom
import {describe,it,expect} from 'vitest';
import {renderToStaticMarkup} from 'react-dom/server';
import {CalculatorInteractive} from '@/components/calculator-interactive';
import {everydayContracts} from '@/lib/worker3-everyday-sports-20261118/cohort';
import {calculatorRegistry} from '@/calculators/registry';
import {resolvePublicCalculatorRoute} from '@/calculators/public-route-readiness';
const ids=[508,513,514,515,519,520,521,523,524];
describe('integrated nine public presentations without publication activation',()=>{
 it.each(ids)('dispatches catalog %i to its real form',id=>{const c=everydayContracts.find(c=>c.catalogId===id)!;const html=renderToStaticMarkup(<CalculatorInteractive slug={c.slug}/>);expect(html).not.toContain('does not yet have a public interface');expect((html.match(/<input/g)||[]).length).toBe(c.fields.length);expect(html).toContain('Calculator inputs');expect(html).toContain('Calculate');});
 it.each(ids)('retains unpublished/unavailable denial for catalog %i',id=>{const c=everydayContracts.find(c=>c.catalogId===id)!;const d=calculatorRegistry.getById(c.engineId)!;expect(d.version).toBe(c.version);for(const state of ['available','unavailable'] as const)expect(resolvePublicCalculatorRoute(d.category,c.slug,{state,slugs:new Set()}).state).toBe('blocked');});
});
