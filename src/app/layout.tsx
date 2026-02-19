import type { Metadata } from "next";
import { Inter, Space_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import CustomCursor from "@/components/CustomCursor";
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
  description: "Valorant Drinking Game + Strat Roulette. Cold rules. Chaotic outcomes. No mercy.",
  keywords: ["valorant", "drinking game", "strat roulette", "gaming", "party game"],
  authors: [{ name: "SELECT YOUR POISON" }],
  manifest: "/manifest.json",
  openGraph: {
    title: "SELECT YOUR POISON | Valorant Drinking Game",
    description: "Cold rules. Chaotic outcomes. No mercy.",
    type: "website",
    url: "https://selectyourpoison.gg",
    siteName: "SELECT YOUR POISON",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SELECT YOUR POISON - Valorant Drinking Game",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SELECT YOUR POISON | Valorant Drinking Game",
    description: "Cold rules. Chaotic outcomes. No mercy.",
    images: ["/og-image.png"],
  },
  other: {
    "theme-color": "#FF0000",
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
          <CustomCursor />
          <Notifications />
          {children}
        </Providers>
      </body>
    </html>
  );
}
