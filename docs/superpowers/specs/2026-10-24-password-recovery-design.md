# Password recovery scope

Owner authorizes autonomous implementation, isolated provider tests, independent review and stacked draft submission. Baseline PR1469 is frozen at31261745c7871351f7c2d451606d670a43a88ebc.

Use the existing Supabase SSR SDK's PKCE recovery and auth callback. Add `/login/forgot` and `/login/reset`, reached by a visible Forgot password? link. Requests use one account-independent confirmation; only invalid email format or transport/configuration failure receives a safe retry message. Provider account-specific errors are never disclosed.

Completion requires fresh `getUser()` and cryptographically verified `getClaims()` with matching subject, session ID and a timestamped `recovery` AMR no older than ten minutes. Bind submitted forms to that owner and session; rotation within the same session is allowed. A normal password/OAuth session is insufficient. Never trust user metadata, decoded cookie claims or a callback query as recovery authority. GoTrue consumes the PKCE code; invalid/replayed callbacks go to a fixed local unavailable-link state. The recovery destination is fixed and same-origin.

On successful password update, request global sign-out and redirect to a fixed login URL with an application-owned success notice. Next rerenders pages when cookies are removed, so the success notice must not depend on a remaining recovery session. If sign-out cannot be confirmed, say password changed but sign-out remains unconfirmed; never invite repeating the mutation. Request/completion forms have labels, native validation, pending states, focused status/errors and retry navigation. Existing account boundary protects completion visibility.

A client-only recovery event is simpler but cannot establish server authority; custom recovery signing keys/storage add unnecessary infrastructure. Verified provider recovery claims reuse the installed SDK without another secret or migration. Hosted projects with missing/different AMR claims fail closed and require explicit compatibility evidence.

No frozen PR, engine/version, ledger classification, DRAFT lifecycle or production resource changes. RELEASE HOLD.
