"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

type CompactNavMenuProps = { authenticated: boolean };

export function CompactNavMenu({ authenticated }: CompactNavMenuProps) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (detailsRef.current) detailsRef.current.open = false;
  }, [pathname]);

  const closeMenu = () => {
    if (detailsRef.current) detailsRef.current.open = false;
  };

  return (
    <details ref={detailsRef} className="nav-menu">
      <summary aria-label="Open navigation menu"><span aria-hidden="true">☰</span><span className="menu-label">Menu</span></summary>
      <nav aria-label="Compact navigation">
        <Link href="/calculators" onClick={closeMenu}>Calculators</Link>
        <Link href="/ai" onClick={closeMenu}>AI Finder</Link>
        <Link href="/business-platform" onClick={closeMenu}>Business Tools</Link>
        <Link href="/pricing" onClick={closeMenu}>Pricing</Link>
        {authenticated ? <Link href="/account" onClick={closeMenu}>Account</Link> : <Link href="/login?mode=signup" onClick={closeMenu}>Sign up free</Link>}
      </nav>
    </details>
  );
}
