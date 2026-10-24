import Link from 'next/link';
export function FeatureUnavailable() {
 return <section className="container page-top"><h1>Feature unavailable in this release</h1><p>This release provides anonymous calculators. Accounts, saved data, exports, payments, AI and Business tools are unavailable.</p><Link className="button secondary" href="/calculators">Browse calculators</Link></section>;
}
