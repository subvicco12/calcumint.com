import Link from "next/link";
import { signIn, signInWithGoogle, signUp } from "./actions";

type LoginPageProps = {
  searchParams: Promise<{ error?: string; message?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error, message } = await searchParams;

  return (
    <section className="container page-top auth-page">
      <span className="eyebrow">CalcuMint account</span>
      <h1>Save your calculations and preferences.</h1>
      <p className="hero-copy">Free accounts add cloud history, favorites and synced preferences. Pro and Business entitlements will build on the same secure account foundation.</p>

      {error && <p className="notice error-notice" role="alert">{error}</p>}
      {message && <p className="notice success-notice">{message}</p>}

      <div className="auth-grid">
        <div className="card form-stack">
          <form className="form-stack" action={signIn}>
            <h2>Sign in</h2>
            <label>Email<input name="email" type="email" autoComplete="email" required /></label>
            <label>Password<input name="password" type="password" autoComplete="current-password" required /></label>
            <button className="button primary" type="submit">Sign in</button>
          </form>
          <form action={signInWithGoogle}>
            <button className="button secondary" type="submit">Continue with Google</button>
          </form>
        </div>

        <form className="card form-stack" action={signUp}>
          <h2>Create a free account</h2>
          <label>Name<input name="displayName" type="text" autoComplete="name" /></label>
          <label>Email<input name="email" type="email" autoComplete="email" required /></label>
          <label>Password<input name="password" type="password" minLength={8} autoComplete="new-password" required /></label>
          <button className="button primary" type="submit">Create free account</button>
          <p className="muted-copy">By creating an account, you agree to the <Link href="/terms">terms</Link> and privacy policy.</p>
        </form>
      </div>
    </section>
  );
}
