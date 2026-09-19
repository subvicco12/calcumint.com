import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./account.css";
import "./business.css";
import "./builder.css";
import "./delivery.css";
import "./ai.css";
import "./admin.css";
import "./legal.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: "CalcuMint — Calculate Anything", template: "%s | CalcuMint" },
  description: siteConfig.description,
  applicationName: "CalcuMint",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" }
    ],
    apple: [{ url: "/apple-icon.png", type: "image/png", sizes: "180x180" }]
  },
  openGraph: {
    type: "website",
    siteName: "CalcuMint",
    title: "CalcuMint — Calculate Anything",
    description: siteConfig.description,
    url: siteConfig.url
  },
  robots:{index:true,follow:true},
  twitter: {
    card: "summary_large_image",
    title: "CalcuMint — Calculate Anything",
    description: siteConfig.description
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
  return <html lang="en"><body><div className="site-shell"><SiteHeader/><main>{children}</main><SiteFooter/></div></body></html>;
}
