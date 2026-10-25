import {beforeEach, expect, it, vi} from 'vitest';

const state = vi.hoisted(() => ({owner: 'owner-a', authError: false, writes: [] as Record<string, unknown>[]}));
vi.mock('next/cache', () => ({revalidatePath: vi.fn()}));
vi.mock('next/navigation', () => ({redirect: (url: string) => {throw new Error(`redirect ${url}`);}}));
vi.mock('@/lib/supabase/server', () => ({createSupabaseServerClient: async () => ({
  auth: {getUser: async () => ({data: {user: {id: state.owner}}, error: state.authError ? {} : null})},
  from: () => ({upsert: async (value: Record<string, unknown>) => {state.writes.push(value); return {error: null};}}),
})}));
import {updatePreferences} from './actions';

function form(owner?: string) {
  const data = new FormData();
  if (owner !== undefined) data.set('expectedOwnerId', owner);
  data.set('country', 'IN');
  return data;
}
beforeEach(() => {state.owner = 'owner-a'; state.authError = false; state.writes = [];});

it('rejects preferences rendered for another owner before any write', async () => {
  state.owner = 'owner-b';
  await expect(updatePreferences(form('owner-a'))).rejects.toThrow('Account context changed');
  expect(state.writes).toEqual([]);
});
it.each([undefined, ''])('requires a rendered owner binding (%s)', async owner => {
  await expect(updatePreferences(form(owner))).rejects.toThrow('Account context changed');
  expect(state.writes).toEqual([]);
});
it('preserves explicit regional defaults for the verified owner', async () => {
  await updatePreferences(form('owner-a'));
  expect(state.writes).toEqual([expect.objectContaining({user_id: 'owner-a', country_code: 'IN', locale: 'en-IN', currency: 'INR', unit_system: 'metric'})]);
});
it('does not treat the submitted owner as authentication', async () => {
  state.authError = true;
  await expect(updatePreferences(form('owner-a'))).rejects.toThrow('redirect /login');
  expect(state.writes).toEqual([]);
});
