import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <span>© {new Date().getFullYear()} CalcuMint</span>
        <span>Deterministic calculations. AI assists, never replaces verified math.</span>
        <nav aria-label="Legal and company information">
          <Link href="/about">About</Link> · <Link href="/privacy">Privacy</Link> · <Link href="/terms">Terms</Link> · <Link href="/refund-policy">Refunds</Link> · <Link href="/cookie-policy">Cookies</Link> · <Link href="/acceptable-use">Acceptable Use</Link> · <Link href="/disclaimer">Disclaimer</Link> · <Link href="/data-deletion">Data Deletion</Link> · <Link href="/contact">Contact</Link>
        </nav>
      </div>
    </footer>
  );
}
