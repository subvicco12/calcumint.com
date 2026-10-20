// @vitest-environment jsdom
import {cleanup,render} from '@testing-library/react';
import {afterEach,expect,it,vi} from 'vitest';
import {calculateDraftPreview} from '@/calculators/final-framework/draft-preview-catalog';
import type {DraftAuthenticatedPersistence} from '@/lib/draft-persistence-contract';
const m=vi.hoisted(()=>({save:vi.fn(),reopen:vi.fn(),loadPage:vi.fn(),props:null as null|{persistence:DraftAuthenticatedPersistence;initialMasterId?:number}}));
vi.mock('@/app/account/drafts/actions',()=>({saveDraftCalculation:m.save,reopenDraftCalculation:m.reopen,loadDraftHistoryPage:m.loadPage}));
vi.mock('./draft-calculator-preview',()=>({DraftCalculatorPreview:(props:NonNullable<typeof m.props>)=>{m.props=props;return null;}}));
import {AuthenticatedDraftWorkspace} from './authenticated-draft-workspace';
afterEach(cleanup);
it('binds all account actions to the rendered server owner and selected private reference',async()=>{
 const record={id:'own',masterId:205,source:'history' as const,label:'Own capture',createdAt:'2026-10-20T00:00:00Z'};
 const view=render(<AuthenticatedDraftWorkspace ownerId="owner-a" plan="pro" records={[record]} initialRecord={record}/>);
 const snapshot=calculateDraftPreview(205,{left:'0.1',right:'0.2',operation:'add'}).snapshot;
 const first=m.props!.persistence;await first.save(205,snapshot,'retry-id');await first.reopen(record);await first.loadPage!('history','next');expect(m.loadPage).toHaveBeenLastCalledWith({expectedOwnerId:'owner-a',source:'history',cursor:'next'});
 expect(m.save).toHaveBeenLastCalledWith({expectedOwnerId:'owner-a',masterId:205,snapshot,requestId:'retry-id'});expect(m.reopen).toHaveBeenLastCalledWith({expectedOwnerId:'owner-a',source:'history',id:'own'});expect(m.props!.initialMasterId).toBe(205);
 view.rerender(<AuthenticatedDraftWorkspace ownerId="owner-b" plan="business" records={[]}/>);await m.props!.persistence.save(205,snapshot,'new-id');expect(m.save).toHaveBeenLastCalledWith({expectedOwnerId:'owner-b',masterId:205,snapshot,requestId:'new-id'});
 expect(m.props!.persistence.records).toEqual([]);
});
