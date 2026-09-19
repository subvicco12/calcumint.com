import Image from "next/image";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { CompactNavMenu } from "@/components/compact-nav-menu";

export async function SiteHeader() {
  const supabase = await createSupabaseServerClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;
  return <header className="site-header"><a className="skip-link" href="#main-content">Skip to main content</a><div className="container header-inner">
    <Link className="brand" href="/" aria-label="CalcuMint home"><Image className="brand-logo" src="/brand/calcumint-logo.png" alt="CalcuMint" width={600} height={203} priority /></Link>
    <nav className="nav nav-desktop" aria-label="Primary navigation">
      <Link href="/calculators">Calculators</Link><Link href="/ai">AI Finder</Link><Link href="/business-platform">Business Tools</Link><Link href="/pricing">Pricing</Link>
      {user ? <Link className="nav-account" href="/account">Account</Link> : <><Link href="/login">Log in</Link><Link className="button primary" href="/login?mode=signup">Sign up free</Link></>}
    </nav>
    <div className="nav-compact">
      {user ? <Link className="compact-account" href="/account">Account</Link> : <Link className="compact-login" href="/login">Log in</Link>}
      <CompactNavMenu authenticated={Boolean(user)} />
    </div>
  </div></header>;
}
