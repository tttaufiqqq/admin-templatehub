import type { Metadata } from "next";
import { JetBrains_Mono, Outfit, Syne } from "next/font/google";
import "./globals.css";

const brandSans = Outfit({
  variable: "--font-brand-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const brandDisplay = Syne({
  variable: "--font-brand-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const brandMono = JetBrains_Mono({
  variable: "--font-brand-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "TemplateHub Admin",
  description: "TemplateHub admin panel — manage products, orders, and payments.",
};

const htmlClassName = `${brandSans.variable} ${brandDisplay.variable} ${brandMono.variable} h-full antialiased`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={htmlClassName} data-scroll-behavior="smooth" lang="en">
      <body className="min-h-full bg-[var(--color-brand-bg)] text-[var(--color-brand-text)]">
        {children}
      </body>
    </html>
  );
}
