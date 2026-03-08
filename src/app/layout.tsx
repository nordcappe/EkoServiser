import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: { default: "EkoServiser - Popravi umesto baci", template: "%s | EkoServiser" },
  description:
    "Platforma koja spaja ljude sa pokvarenim predmetima i majstore, hobiste i volontere koji mogu da pomognu. Popravi umesto baci!",
  keywords: ["popravka", "majstor", "serviser", "reciklaza", "eko", "balkan"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sr" className={inter.variable}>
      <body className="bg-gray-50">
        <Providers>
          <Navbar />
          <main className="pt-[64px] min-h-screen">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
