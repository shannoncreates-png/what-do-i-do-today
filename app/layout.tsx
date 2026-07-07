import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ServiceWorkerRegistrar } from "@/components/ServiceWorkerRegistrar";

export const metadata: Metadata = {
  title: {
    default: "What do I do today?",
    template: "%s — What do I do today?",
  },
  description:
    "Swipe through 1,239 activity ideas across 12 categories. The perfect app for when you're bored and need things to do today — date night ideas, things to do with friends, solo adventures, and more.",
  keywords: [
    "things to do today",
    "activity ideas",
    "what to do when bored",
    "date night ideas",
    "things to do with friends",
    "boredom buster",
    "fun activities",
    "weekend ideas",
  ],
  openGraph: {
    title: "What do I do today?",
    description:
      "Swipe through 1,239 activity ideas. Like what sounds good, skip what doesn't — the algorithm learns your vibe.",
    type: "website",
    siteName: "What do I do today?",
  },
  twitter: {
    card: "summary_large_image",
    title: "What do I do today?",
    description: "Tinder-style activity swipe app. 1,239 ideas, 12 categories, one perfect match.",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "What today?",
  },
};

export const viewport: Viewport = {
  themeColor: "#6366f1",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-4STRR37VB7" />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-4STRR37VB7');`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "What do I do today?",
              description:
                "Swipe through 1,239 activity ideas across 12 categories. Find the perfect thing to do today.",
              applicationCategory: "LifestyleApplication",
              operatingSystem: "Any",
              offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
              keywords:
                "things to do today, activity ideas, date night ideas, boredom buster, what to do when bored",
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#f7f5ff] text-[#111827]">
          <ServiceWorkerRegistrar />
          {children}
        </body>
    </html>
  );
}
