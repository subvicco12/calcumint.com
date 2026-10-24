import {getProductPolicy} from '@/lib/product-mode-server';
/** Qualifies retained full-product policies without rewriting their terms. */
export function PublicReleaseNotice() {
 if(getProductPolicy().mode === 'full') return null;
 return <aside className="notice" aria-label="Current release scope"><p>This release provides anonymous calculators subject to publication approval. Accounts, saved data, exports, payments, AI and Business tools are unavailable. References below to these features describe the full product and do not indicate availability in this release.</p></aside>;
}
