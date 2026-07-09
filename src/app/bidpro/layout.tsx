import type { Metadata } from "next";
import { Space_Grotesk, Inter, IBM_Plex_Mono } from "next/font/google";
import "./bidpro.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "BidPro · Where disaster-recovery contracts are won",
  description:
    "AI bid intelligence that finds, scores, and helps you win disaster-recovery and FEMA contracts across thousands of fragmented government portals, then defends every dollar through closeout.",
  openGraph: {
    title: "BidPro · Where disaster-recovery contracts are won",
    description:
      "AI bid intelligence for disaster-recovery & FEMA contractors. Find, score, and win across thousands of portals. Defend every dollar through closeout.",
    url: "https://shessi.dev/bidpro",
    siteName: "BidPro",
    type: "website",
  },
};

export default function BidProLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={`bidpro-root ${spaceGrotesk.variable} ${inter.variable} ${plexMono.variable} min-h-screen bg-bg font-sans text-text`}
    >
      {children}
    </div>
  );
}
