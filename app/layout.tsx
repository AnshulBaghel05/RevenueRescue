import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import GeometricBackground from "@/components/three/GeometricBackground";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "RevenueRescue - Shopify Store Audit & Optimization",
  description: "Audit your Shopify store for performance, conversion, and revenue issues. Recover lost revenue with actionable insights.",
  keywords: ["shopify", "audit", "performance", "conversion", "revenue optimization", "store analysis"],
  authors: [{ name: "RevenueRescue" }],
  openGraph: {
    title: "RevenueRescue - Shopify Store Audit & Optimization",
    description: "Audit your Shopify store for performance, conversion, and revenue issues.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "RevenueRescue - Shopify Store Audit",
    description: "Audit your Shopify store for performance, conversion, and revenue issues.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">
        <GeometricBackground />
        {children}
      </body>
    </html>
  );
}
