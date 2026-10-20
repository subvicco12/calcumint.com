// @vitest-environment jsdom
import {cleanup,fireEvent,render,screen,waitFor} from '@testing-library/react';
import {afterEach,expect,it,vi} from 'vitest';
vi.mock('next/navigation',()=>({unstable_rethrow:()=>{}}));
vi.mock('@/lib/supabase/browser',()=>({createSupabaseBrowserClient:()=>({auth:{getUser:async()=>({data:{user:{id:'owner-a'}},error:null}),onAuthStateChange:()=>({data:{subscription:{unsubscribe:()=>{}}}})}})}));
import {AccountMutationForm} from './account-mutation-form';
afterEach(cleanup);
it('keeps the rendered scenario request identity on uncertain retry and renews it for changed inputs',async()=>{
 const calls:FormData[]=[];let fail=true;const action=async(data:FormData)=>{calls.push(data);if(fail){fail=false;throw Error('uncertain');}};
 render(<AccountMutationForm ownerId="owner-a" requestId="11111111-1111-4111-8111-111111111111" action={action}><label>Name<input name="name" defaultValue="Case A"/></label><button>Save scenario</button></AccountMutationForm>);
 fireEvent.click(screen.getByRole('button'));await screen.findByRole('alert');await waitFor(()=>expect((screen.getByRole('button') as HTMLButtonElement).disabled).toBe(false));fireEvent.click(screen.getByRole('button'));await screen.findByText('Request completed.');expect(calls[0].get('requestId')).toBe(calls[1].get('requestId'));
 fireEvent.change(screen.getByLabelText('Name'),{target:{value:'Case B'}});fireEvent.click(screen.getByRole('button'));await waitFor(()=>expect(calls).toHaveLength(3));expect(calls[2].get('requestId')).not.toBe(calls[0].get('requestId'));expect(calls[2].get('expectedOwnerId')).toBe('owner-a');
});
