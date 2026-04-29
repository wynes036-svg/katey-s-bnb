import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";
import PersistentCTA from "@/components/PersistentCTA";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Katey's BNB",
  description:
    "A mood-driven, immersive Bed & Breakfast experience. Choose your vibe, explore rooms through 360° tours, and curate your perfect stay at Katey's BNB.",
  openGraph: {
    title: "Katey's BNB",
    description:
      "A mood-driven, immersive Bed & Breakfast experience. Choose your vibe, explore rooms through 360° tours, and curate your perfect stay at Katey's BNB.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfairDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FAF8F5] text-[#1C1917]">
        <SessionProvider>
          {children}
          <PersistentCTA />
        </SessionProvider>
      </body>
    </html>
  );
}
