import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { readAllContent } from "@/lib/content";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mahkota Drive | Rental Armada untuk Driver Online",
  description:
    "Sewa mobil harian, mingguan, atau bulanan untuk driver taksi online. Servis ditanggung, dukungan 24 jam, tanpa DP besar.",
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = await readAllContent();

  return (
    <html lang="id" data-scroll-behavior="smooth" className={inter.variable}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,300,0..1,0&display=block"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <Navbar />
        {children}
        <Footer contact={content.contact} />
      </body>
    </html>
  );
}
