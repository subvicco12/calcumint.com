// @vitest-environment jsdom
import {cleanup,fireEvent,render,screen} from '@testing-library/react';
import {afterEach,expect,it,vi} from 'vitest';
import {BillingPortalButton} from './billing-portal-button';
afterEach(()=>{cleanup();vi.unstubAllGlobals();});
it.each(['overview','cancel','payment'] as const)('binds %s requests to the rendered owner and retains rejected requests for retry',async action=>{
 const fetcher=vi.fn().mockResolvedValue({ok:false,json:async()=>({error:'Account context changed'})});vi.stubGlobal('fetch',fetcher);
 render(<BillingPortalButton ownerId="owner-a" action={action}>Manage billing</BillingPortalButton>);
 fireEvent.click(screen.getByRole('button',{name:'Manage billing'}));
 expect(await screen.findByRole('alert')).toHaveProperty('textContent','Account context changed');
 expect(fetcher).toHaveBeenCalledWith('/api/billing/portal',expect.objectContaining({body:JSON.stringify({action,expectedOwnerId:'owner-a'})}));
 expect(screen.getByRole('button',{name:'Manage billing'})).toHaveProperty('disabled',false);
});
