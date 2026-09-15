import Image from "next/image";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function SiteHeader() {
  const supabase = await createSupabaseServerClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;
  return <header className="site-header"><div className="container header-inner">
    <Link className="brand" href="/" aria-label="CalcuMint home"><Image className="brand-logo" src="/brand/calcumint-logo.png" alt="CalcuMint" width={600} height={203} priority /></Link>
    <nav className="nav" aria-label="Primary navigation">
      <Link className="desktop-link" href="/calculators">Calculators</Link><Link className="desktop-link" href="/ai">AI Finder</Link><Link className="desktop-link" href="/business">Business</Link><Link href="/pricing">Pricing</Link>
      {user ? <Link className="nav-account" href="/account">Account</Link> : <><Link className="nav-login" href="/login">Log in</Link><Link className="button primary nav-signup" href="/login?mode=signup">Sign up free</Link></>}
    </nav>
  </div></header>;
}
