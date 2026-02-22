import { JetBrains_Mono, DM_Sans } from "next/font/google";
import type { Metadata } from "next";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "700"],
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "RavenGraph — Graph Intelligence",
  description: "Real-time graph intelligence platform for quantitative trading",
};

export default function GraphLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${jetbrainsMono.variable} ${dmSans.variable}`}>
      {children}
    </div>
  );
}
