import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ConsentBanner } from "@/components/ConsentBanner";
import "./globals.css";
import { BrowserCheck } from "@/components/BrowserCheck";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PitchPerfect | AI Pitch Practice",
  description: "Practice your sales pitch with an AI audience that challenges you. Get real-time coaching and instant feedback. No signup required.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  openGraph: {
    title: "PitchPerfect | AI Pitch Practice",
    description: "Practice your sales pitch with an AI audience that challenges you. Get real-time coaching and instant feedback. No signup required.",
    type: "website",
    siteName: "PitchPerfect",
  },
  twitter: {
    card: "summary_large_image",
    title: "PitchPerfect | AI Pitch Practice",
    description: "Practice your sales pitch with an AI audience that challenges you. Get real-time coaching and instant feedback. No signup required.",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#6366F1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <BrowserCheck />
        {children}
        <ConsentBanner />
      </body>
    </html>
  );
}
