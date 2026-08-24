import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://doctorooms.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Doctorooms — More Patients. Smarter Operations. One Intelligent Platform.",
  description:
    "Doctorooms is a healthcare growth and operating platform that connects patient discovery, booking, physical and video consultation, queue, care workflows, hospital operations, follow-up, and AI-powered workflows in one connected platform.",
  keywords: [
    "Doctorooms",
    "hospital management software",
    "clinic management software",
    "healthcare platform",
    "patient acquisition",
    "OPD IPD software",
    "smart queue",
    "video consultation",
    "healthcare AI",
    "doctor appointment",
  ],
  authors: [{ name: "Doctorooms" }],
  creator: "Doctorooms",
  applicationName: "Doctorooms",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Doctorooms — More Patients. Smarter Operations. One Intelligent Platform.",
    description:
      "Connect patient discovery, booking, consultation, queue, hospital operations and AI-powered workflows in one healthcare platform.",
    url: siteUrl,
    siteName: "Doctorooms",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og.png",
        width: 1344,
        height: 768,
        alt: "Doctorooms — healthcare growth & operating platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Doctorooms — Healthcare Growth & Operating Platform",
    description: "More Patients. Smarter Operations. One Intelligent Platform.",
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
  category: "healthcare",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0f3d3d" },
    { media: "(prefers-color-scheme: dark)", color: "#0a1626" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
        {/* Structured data for richer SERP appearance */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "SoftwareApplication",
                  name: "Doctorooms",
                  applicationCategory: "BusinessApplication",
                  operatingSystem: "Web",
                  description:
                    "Healthcare growth and operating platform that connects patient discovery, booking, physical and video consultation, queue, care workflows, hospital operations, follow-up, and AI-powered workflows in one connected platform.",
                  url: siteUrl,
                  offers: {
                    "@type": "Offer",
                    availability: "https://schema.org/InStock",
                    price: "0",
                    priceCurrency: "INR",
                    description:
                      "Book a private 30-minute walkthrough tailored to your organization.",
                  },
                  featureList: [
                    "Patient discovery & booking",
                    "Physical and video consultation",
                    "Smart queue with live position",
                    "OPD, IPD, lab, pharmacy, billing, inventory, OT, insurance, reports, documents",
                    "Role-aware AI assistance",
                  ],
                },
                {
                  "@type": "Organization",
                  name: "Doctorooms",
                  url: siteUrl,
                  slogan: "More Patients. Smarter Operations. One Intelligent Platform.",
                  description:
                    "Doctorooms is a healthcare growth and operating platform connecting discovery, consultation, operations and AI workflows.",
                },
              ],
            }),
          }}
        />
      </body>
    </html>
  );
}
