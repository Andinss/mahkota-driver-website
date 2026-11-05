import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { readAllContent } from "@/lib/content";
import LayoutWrapper from "@/components/layout/LayoutWrapper";

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
    icon: "/images/logo.png",
    apple: "/images/logo.png",
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
        <LayoutWrapper contact={content.contact}>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
