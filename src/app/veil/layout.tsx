import type { Metadata } from "next";
import { Space_Grotesk, Inter, IBM_Plex_Mono } from "next/font/google";
import "./veil.css";

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
  title: "Veil · Air-traffic control for space, zero orbits revealed",
  description:
    "Veil is the neutral, privacy-preserving coordination layer for space traffic. Operators avoid collisions together using secure multi-party computation and zero-knowledge proofs, without ever revealing their orbits.",
  openGraph: {
    title: "Veil · Air-traffic control for space, zero orbits revealed",
    description:
      "Avoid every collision. Reveal no orbit. Privacy-preserving, decentralized space traffic coordination built on SMPC, zero-knowledge proofs, and a permissioned ledger.",
    url: "https://shessi.dev/veil",
    siteName: "Veil",
    type: "website",
  },
};

export default function VeilLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={`veil-root ${spaceGrotesk.variable} ${inter.variable} ${plexMono.variable} min-h-screen bg-bg font-sans text-text`}
    >
      {children}
    </div>
  );
}
