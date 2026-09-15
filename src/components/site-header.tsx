import Image from "next/image";
import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link className="brand" href="/" aria-label="CalcuMint home">
          <Image
            className="brand-logo"
            src="/brand/calcumint-logo.png"
            alt="CalcuMint"
            width={600}
            height={203}
            priority
          />
        </Link>
        <nav className="nav" aria-label="Primary navigation">
          <Link className="desktop-link" href="/calculators">Calculators</Link>
          <Link className="desktop-link" href="/ai">AI Finder</Link>
          <Link className="desktop-link" href="/business">Business</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/account">Account</Link>
        </nav>
      </div>
    </header>
  );
}
