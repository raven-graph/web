import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

// Simulating Clash Display and Satoshi with similar Google Fonts 
// since we don't have local font files for them in this environment.
// Using "Outfit" for that premium geometric feel and "Space Grotesk" alternative "Syne" or "Chivo"?
// User disliked Space Grotesk. 
// Let's use "Outfit" for headings (Geometric, high-end) and "Plus Jakarta Sans" for body.

import { Outfit, Plus_Jakarta_Sans } from "next/font/google";

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

export const metadata: Metadata = {
  title: "RavenGraph",
  description: "Where signals hide in structure.",
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
        className={`${outfit.variable} ${jakarta.variable} antialiased bg-background text-foreground selection:bg-cyan-500/30 selection:text-cyan-100`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
