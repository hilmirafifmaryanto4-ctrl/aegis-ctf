import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Footer } from "../components/layout/footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aegis CTF 2026 | The Ultimate Cyber Security Challenge",
  description: "Join the battle in the most advanced Capture The Flag competition. Test your skills in Web, Crypto, Pwn, Reverse Engineering, and Forensics.",
  icons: {
    icon: "/aegis.png",
  },
  openGraph: {
    title: "Aegis CTF 2026",
    description: "The Ultimate Cyber Security Challenge. Are you ready to hack?",
    url: "https://ctfsyem.my.id",
    siteName: "Aegis CTF",
    images: [
      {
        url: "https://ctfsyem.my.id/og-image.jpg", // You should add an actual image here
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aegis CTF 2026",
    description: "The Ultimate Cyber Security Challenge.",
    images: ["https://ctfsyem.my.id/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased min-h-screen bg-background text-foreground font-sans flex flex-col">
        <div className="flex-1">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
