import type { Metadata } from "next";
import { Inter, Space_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import Notifications from "@/components/Notifications";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SELECT YOUR POISON | Valorant Drinking Game",
  description: "Valorant Drinking Game + Strat Roulette. Cold rules. Chaotic outcomes. No mercy. Create a lobby, invite your squad, and track deaths and drinks in real-time.",
  keywords: ["valorant", "drinking game", "strat roulette", "gaming", "party game", "valorant companion", "multiplayer"],
  authors: [{ name: "SELECT YOUR POISON" }],
  openGraph: {
    title: "SELECT YOUR POISON | Valorant Drinking Game",
    description: "Cold rules. Chaotic outcomes. No mercy. Create a lobby, invite your squad, and track deaths and drinks in real-time.",
    type: "website",
    siteName: "SELECT YOUR POISON",
  },
  twitter: {
    card: "summary_large_image",
    title: "SELECT YOUR POISON | Valorant Drinking Game",
    description: "Cold rules. Chaotic outcomes. No mercy.",
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
    <html lang="en">
      <body className={`${inter.variable} ${spaceMono.variable} antialiased`}>
        <Providers>
          <Notifications />
          {children}
        </Providers>
      </body>
    </html>
  );
}
