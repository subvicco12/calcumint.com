import { acceptInvitation } from "../../actions";

type PageProps = { searchParams: Promise<{ token?: string }> };

export const metadata = { title: "Accept Business Invitation" };

export default async function AcceptBusinessInvitationPage({ searchParams }: PageProps) {
  const { token } = await searchParams;
  return (
    <section className="container page-top">
      <span className="eyebrow">Business invitation</span>
      <h1>Join a CalcuMint workspace.</h1>
      <p className="hero-copy">Sign in with the same email address that received the invitation, then accept it below.</p>
      {token ? (
        <form className="card form-stack business-create-card" action={acceptInvitation}>
          <input type="hidden" name="token" value={token} />
          <button className="button primary" type="submit">Accept invitation</button>
        </form>
      ) : (
        <div className="notice error-notice">This invitation link does not contain a valid token.</div>
      )}
    </section>
  );
}
