import type { Metadata } from "next";
// Import Syne instead of Syncopate
import { Syne, Space_Mono } from "next/font/google";
import "./globals.css";

// Import Syne font for modern, bold and artistic headings
const syne = Syne({
  subsets: ["latin"],
  variable: "--font-heading",
  // Syne has great variable weights, we load them here
  weight: ["400", "500", "600", "700", "800"], 
});

// Import technical mono font for UI elements
const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-space-mono",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "DSON Studio",
  description: "Futuristic Creative Agency",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Inject Syne variable into the HTML tag
    <html lang="en" className={`${syne.variable} ${spaceMono.variable}`}>
      <body className="font-sans bg-[#050508] text-white">
        {children}
      </body>
    </html>
  );
}