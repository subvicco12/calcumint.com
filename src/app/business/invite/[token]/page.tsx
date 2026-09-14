import { acceptInvitation } from "../../actions";

type PageProps = { params: Promise<{ token: string }> };

export const metadata = { title: "Accept Business Invitation" };

export default async function AcceptBusinessInvitationPage({ params }: PageProps) {
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
