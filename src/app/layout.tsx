import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, Playfair_Display, Cinzel } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter'
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: '--font-plus-jakarta'
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: '--font-playfair'
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: '--font-cinzel'
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
    <html lang="en" className={`${inter.variable} ${plusJakarta.variable} ${playfair.variable} ${cinzel.variable} scroll-smooth`}>
      <body className="antialiased selection:bg-purple-500/30 selection:text-white" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
