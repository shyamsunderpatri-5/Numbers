import type { Metadata } from "next";
import { Inter, DM_Sans, Playfair_Display, Orbitron } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter'
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: '--font-dm-sans'
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: '--font-playfair'
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: '--font-orbitron'
});

export const metadata: Metadata = {
  title: {
    template: "%s | NUMERIQ.AI",
    default: "NUMERIQ.AI — Global Chaldean Numerology Intelligence Platform",
  },
  description: "Advanced numerical intelligence powered by Chaldean mathematics and enterprise RAG AI.",
  metadataBase: new URL('https://numeriq.ai'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${dmSans.variable} ${playfair.variable} ${orbitron.variable} scroll-smooth`}>
      <body className="antialiased selection:bg-amber-500/30 selection:text-white" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
