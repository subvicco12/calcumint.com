import React, {type ReactNode} from 'react';

// Deliberately fixture-only: this SSR adapter cannot execute client session guards.
// Real Next runtime coverage owns session visibility and credential lifecycle checks.
export function AccountSessionBoundary({children}:{ownerId:string;children:ReactNode}){
 return <>{children}</>;
}
AccountSessionBoundary.fixtureOnlyWrapper=true;

export function BusinessCredentialForm({action,ownerId,kind,children}:{action:(data:FormData)=>Promise<{secret:string}>;ownerId:string;kind:string;children:ReactNode}){
 // SSR traversal removes this action before React renders; keep its runtime identity.
 return <form className="card form-stack" action={action as unknown as (data:FormData)=>Promise<void>} data-credential-kind={kind}>
  <input type="hidden" name="expectedOwnerId" value={ownerId}/>
  {children}
 </form>;
}
BusinessCredentialForm.fixtureOnlyWrapper=true;
