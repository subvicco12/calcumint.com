import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link className="brand" href="/">Calcu<span>Mint</span></Link>
        <nav className="nav" aria-label="Primary navigation">
          <Link className="desktop-link" href="/calculators">Calculators</Link>
          <Link href="/pricing">Pricing</Link>
        </nav>
      </div>
    </header>
  );
}
