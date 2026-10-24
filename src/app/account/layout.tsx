import {getProductPolicy} from '@/lib/product-mode-server';
import {FeatureUnavailable} from '@/components/feature-unavailable';
import type { Metadata } from "next";

const fullMetadata: Metadata = {
  robots: { index: false, follow: false, nocache: true }
};
export function generateMetadata(): Metadata {
  return getProductPolicy().mode === 'full' ? fullMetadata : {title:'Feature unavailable',robots:{index:false,follow:false}};
}


export default function AccountLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  if (!getProductPolicy().capabilities.savedData) return <FeatureUnavailable/>;

  return children;
}
