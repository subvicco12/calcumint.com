import type {Metadata} from "next";
import {getProductPolicy} from '@/lib/product-mode-server';
import {FeatureUnavailable} from '@/components/feature-unavailable';
import { acceptInvitation } from "../../actions";

type PageProps = { params: Promise<{ token: string }> };

const fullMetadata = { title: "Accept Business Invitation" };
export function generateMetadata(): Metadata {
  return getProductPolicy().mode === 'full' ? fullMetadata : {title:'Feature unavailable',robots:{index:false,follow:false}};
}


export default async function AcceptBusinessInvitationPage({ params }: PageProps) {
  if (!getProductPolicy().capabilities.businessWorkspace) return <FeatureUnavailable/>;

  const { token } = await params;
  return (
    <section className="container page-top">
      <span className="eyebrow">Business invitation</span>
      <h1>Join a CalcuMint Business workspace.</h1>
      <p className="hero-copy">You must be signed in with the same email address that received this invitation. The invitation expires after seven days.</p>
      <form className="card form-stack business-setup-card" action={acceptInvitation}>
        <input type="hidden" name="token" value={token} />
        <button className="button primary" type="submit">Accept invitation</button>
      </form>
    </section>
  );
}
