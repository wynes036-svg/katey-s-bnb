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
  title: "Katye's BnB - Your Perfect Sanctuary",
  description:
    "An intimate, self-catering accommodation experience. Choose your vibe and enjoy a personalized stay in our beautifully curated single room at Katye's BnB. Fully equipped kitchen for your convenience.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Katye's BnB - Your Perfect Sanctuary",
    description:
      "An intimate, self-catering accommodation experience. Choose your vibe and enjoy a personalized stay in our beautifully curated single room at Katye's BnB. Fully equipped kitchen for your convenience.",
    type: "website",
    images: ["/logo.png"],
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
