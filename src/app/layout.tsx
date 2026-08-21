import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Analytics } from "@vercel/analytics/next";

// Simulating Clash Display and Satoshi with similar Google Fonts 
// since we don't have local font files for them in this environment.
// Using "Outfit" for that premium geometric feel and "Space Grotesk" alternative "Syne" or "Chivo"?
// User disliked Space Grotesk. 
// Let's use "Outfit" for headings (Geometric, high-end) and "Plus Jakarta Sans" for body.

import {
  Outfit,
  Plus_Jakarta_Sans,
  Spectral,
  IBM_Plex_Sans,
  IBM_Plex_Mono,
} from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

// Landing page type system: Spectral (display/serif), IBM Plex Sans (body/UI),
// IBM Plex Mono (labels, data, tickers).
const spectral = Spectral({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-spectral",
  display: "swap",
});

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-plex-sans",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "RavenGraph — AI research lab for quantitative finance",
  description: "Markets are networks, not time series. We trade the structure.",
  icons: {
    icon: "/noun-raven-1040402.png",
    shortcut: "/noun-raven-1040402.png",
    apple: "/noun-raven-1040402.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${outfit.variable} ${jakarta.variable} ${spectral.variable} ${plexSans.variable} ${plexMono.variable} antialiased bg-background text-foreground selection:bg-cyan-500/30 selection:text-cyan-100`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
