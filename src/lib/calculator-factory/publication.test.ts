import { beforeEach, expect, it, vi } from 'vitest';
const transport = vi.hoisted(() => ({ rpc: vi.fn() }));
vi.mock('server-only', () => ({}));
vi.mock('@/lib/env', () => ({ publicEnv: { NEXT_PUBLIC_SUPABASE_URL: 'https://example.supabase.co', NEXT_PUBLIC_SUPABASE_ANON_KEY: 'test-public-key' } }));
vi.mock('@supabase/supabase-js', () => ({ createClient: () => ({ rpc: transport.rpc }) }));
import { calculatorRegistry } from '@/calculators/registry';
import { getFactoryContract } from './registry';
import { requireFactoryPublication } from './publication';

beforeEach(() => { vi.restoreAllMocks(); transport.rpc.mockReset(); });
const definition = () => calculatorRegistry.getBySlug('percentage-change-calculator')!;
const approved = () => ({ calculator_key: definition().id, slug: definition().slug, version: definition().version });
function manifest(rows: unknown) { transport.rpc.mockResolvedValue({ data: rows, error: null }); }

it('uses actual registered identity and the hosted manifest reader', async () => {
  expect(getFactoryContract(208)?.registered).toBe(true);
  manifest([approved()]);
  await expect(requireFactoryPublication(208, 1)).resolves.toMatchObject({ catalogId: 208 });
  expect(transport.rpc).toHaveBeenCalledWith('list_published_calculator_manifest');
});
it('fails closed for unknown, unregistered experimental physics and version mismatch', async () => {
  manifest([approved()]);
  expect(getFactoryContract(323)?.registered).not.toBe(true);
  for (const [id, version] of [[-1,1],[208,2],[323,1]])
    await expect(requireFactoryPublication(id, version)).rejects.toMatchObject({ status: 404 });
});
it('fails closed for revoked publication, hosted identity/version mismatch and malformed authority', async () => {
  for (const rows of [[], [{...approved(),version:2}], [{...approved(),calculator_key:'wrong'}], [{...approved(),slug:'different-calculator'}], null]) {
    manifest(rows);
    await expect(requireFactoryPublication(208,1)).rejects.toMatchObject({status:404});
  }
  transport.rpc.mockResolvedValue({data:[approved()],error:{message:'unavailable'}});
  await expect(requireFactoryPublication(208,1)).rejects.toMatchObject({status:404});
});
it('fails closed when actual repository status, sources, identity or version no longer qualify', async () => {
  const engine = definition();
  for (const patch of [{reviewStatus:'reviewed'}, {sources:[]}, {id:'wrong'}, {version:2}]) {
    manifest([approved()]);
    const originals = Object.fromEntries(Object.keys(patch).map(key => [key, engine[key as keyof typeof engine]]));
    try {
      Object.assign(engine,patch);
      await expect(requireFactoryPublication(208,1)).rejects.toMatchObject({status:404});
    } finally { Object.assign(engine,originals); }
  }
});
