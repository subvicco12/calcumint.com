import type { Metadata } from "next";
import { AuthPanel } from "@/components/auth-panel";

export const metadata: Metadata = {
  title: "Log in or create an account",
  description: "Sign in to CalcuMint or create a free account to save calculations, favorites and regional preferences.",
  alternates: { canonical: "/login" },
  robots: { index: false, follow: true },
  openGraph: {
    title: "CalcuMint Account",
    description: "Sign in to CalcuMint or create a free account to save calculations, favorites and regional preferences.",
    url: "/login",
    type: "website",
  },
};

type Props={searchParams:Promise<{error?:string;message?:string;mode?:string}>};
export default async function LoginPage({searchParams}:Props){const {error,message,mode}=await searchParams;return <section className="container page-top auth-page"><div className="auth-intro"><span className="eyebrow">Your CalcuMint account</span><h1>Calculate. Save. Pick up anywhere.</h1><p className="hero-copy">Create a free account to save calculations, favorite tools and keep your regional preferences synced across devices.</p></div>{error&&<p className="notice error-notice" role="alert">{error}</p>}{message&&<p className="notice success-notice">{message}</p>}<AuthPanel initialMode={mode==="signup"?"signup":"signin"}/></section>}
