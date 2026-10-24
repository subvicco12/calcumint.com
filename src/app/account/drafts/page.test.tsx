// @vitest-environment jsdom
import {cleanup,render,screen} from '@testing-library/react';
import {afterEach,expect,it,vi} from 'vitest';
const state=vi.hoisted(()=>({load:vi.fn()}));
vi.mock('./actions',()=>({loadDraftWorkspace:state.load}));
vi.mock('@/components/account-session-boundary',()=>({AccountSessionBoundary:({ownerId,children}:{ownerId:string;children:import('react').ReactNode})=><div data-testid="owner-boundary" data-owner={ownerId}>{children}</div>}));
vi.mock('@/components/authenticated-draft-workspace',()=>({AuthenticatedDraftWorkspace:({ownerId,initialRecord}:{ownerId:string;initialRecord?:{id:string}})=><div data-testid="workspace" data-reference={initialRecord?.id}>Authorized workspace for {ownerId}</div>}));
import PrivateDraftPage,{generateMetadata,dynamic} from './page';
afterEach(cleanup);
it('does not render private forms or records when server authorization/data reads fail',async()=>{
 state.load.mockRejectedValue(new Error('synthetic private details not for display'));
 render(await PrivateDraftPage({}));expect(screen.getByRole('alert').textContent).toContain('could not be verified');expect(screen.queryByTestId('owner-boundary')).toBeNull();expect(document.body.textContent).not.toContain('synthetic private details');
});
it('places server-authorized workspace beneath owner verification and disables indexing',async()=>{
 state.load.mockResolvedValue({ownerId:'synthetic-owner',plan:'pro',records:[]});render(await PrivateDraftPage({}));expect(screen.getByTestId('owner-boundary').getAttribute('data-owner')).toBe('synthetic-owner');expect(screen.getByText('Authorized workspace for synthetic-owner')).toBeTruthy();expect(generateMetadata().robots).toEqual({index:false,follow:false});expect(dynamic).toBe('force-dynamic');
});

it('selects only a server-owned matching deep link and does not trust a foreign reference',async()=>{
 state.load.mockResolvedValue({ownerId:'synthetic-owner',plan:'pro',records:[{id:'own-id',masterId:531,source:'history',label:'Own capture',createdAt:'2026-10-20T00:00:00Z'}]});
 render(await PrivateDraftPage({searchParams:Promise.resolve({id:'own-id',source:'history'})}));expect(screen.getByTestId('workspace').getAttribute('data-reference')).toBe('own-id');cleanup();
 render(await PrivateDraftPage({searchParams:Promise.resolve({id:'foreign-id',source:'history'})}));expect(screen.getByTestId('workspace').getAttribute('data-reference')).toBeNull();expect(screen.getByRole('alert').textContent).toContain('owner-scoped');
});
