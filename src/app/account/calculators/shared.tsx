import Link from 'next/link';
export function ReviewerDenied(){return <section className="container page-top"><h1>Reviewer access required</h1><p role="alert">An active platform owner, admin or reviewer account must be verified before opening calculator previews.</p><Link href="/login">Sign in</Link></section>;}
