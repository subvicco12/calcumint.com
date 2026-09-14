import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./account.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "CalcuMint — Calculate Anything",
    template: "%s | CalcuMint"
  },
  description: siteConfig.description,
  applicationName: "CalcuMint",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "CalcuMint",
    title: "CalcuMint — Calculate Anything",
    description: siteConfig.description,
    url: siteConfig.url
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fbfb" },
    { media: "(prefers-color-scheme: dark)", color: "#071413" }
  ]
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <div className="site-shell">
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
