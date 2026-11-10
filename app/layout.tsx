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
  title: {
    default: "Mahkota Drive | Rental Armada untuk Driver Online",
    template: "%s | Mahkota Drive",
  },
  description:
    "Sewa mobil harian, mingguan, atau bulanan untuk driver taksi online. Servis ditanggung, dukungan 24 jam, tanpa DP besar. Mitra terpercaya driver Indonesia.",
  keywords: [
    "rental mobil",
    "sewa mobil driver online",
    "rental mobil depok",
    "rental mobil sawangan",
    "mahkota drive",
    "sewa mobil gojek",
    "sewa mobil grab",
  ],
  authors: [{ name: "PT Mahkota Nusantara Raya" }],
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://mahkotadrive.com", // Ganti dengan domain asli
    siteName: "Mahkota Drive",
    title: "Mahkota Drive | Rental Armada untuk Driver Online",
    description:
      "Mitra perjalanan driver online terpercaya. Sewa armada harian, mingguan, atau bulanan dengan perawatan ditanggung.",
    images: [
      {
        url: "/images/hero-bg.webp",
        width: 1200,
        height: 630,
        alt: "Mahkota Drive - Rental Mobil",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
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

  // JSON-LD Structured Data untuk Local Business
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AutoRental",
    name: "Mahkota Drive",
    legalName: "PT Mahkota Nusantara Raya",
    image: "https://mahkotadrive.com/images/logo.png",
    url: "https://mahkotadrive.com",
    telephone: "+6289531536509",
    priceRange: "Rp 235.000 - Rp 600.000",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Ruko Citra Lake Sawangan, Blok B5 No.03, Kedaung",
      addressLocality: "Kota Depok",
      addressRegion: "Jawa Barat",
      postalCode: "16516",
      addressCountry: "ID",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -6.3986,
      longitude: 106.7498,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "00:00",
      closes: "23:59",
    },
    sameAs: [
      content.contact.socialMedia.instagram,
      content.contact.socialMedia.facebook,
    ],
  };

  return (
    <html lang="id" data-scroll-behavior="smooth" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-body antialiased">
        <LayoutWrapper contact={content.contact}>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
