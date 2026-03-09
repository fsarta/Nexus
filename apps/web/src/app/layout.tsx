import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Nexus — The Career Operating System",
    template: "%s | Nexus",
  },
  description:
    "AI-native professional network. Build your career, find clients, launch your startup — without being the product.",
  keywords: [
    "professional network",
    "career",
    "AI career coach",
    "job matching",
    "startup",
    "B2B lead intelligence",
  ],
  authors: [{ name: "Nexus" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Nexus",
    title: "Nexus — The Career Operating System",
    description:
      "AI-native professional network for modern professionals, companies, and founders.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nexus — The Career Operating System",
    description:
      "AI-native professional network for modern professionals, companies, and founders.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
