export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <span>© {new Date().getFullYear()} CalcuMint</span>
        <span>Deterministic calculations. AI assists, never replaces verified math.</span>
      </div>
    </footer>
  );
}
